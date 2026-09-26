"""LearnHub fraud detection microservice (FastAPI).

Scores enrollment / payment events for fraud risk. The core LearnHub backend
calls this service in a fail-open manner: on timeout, connection error, or HTTP
503 the caller allows the enrollment and records it for asynchronous review
rather than block a paying student.

Run:  uvicorn main:app --port 8100
"""

from __future__ import annotations

import json
import logging
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4

import numpy as np
from fastapi import FastAPI, HTTPException
from joblib import load
from pydantic import BaseModel, Field

from features import (
    FEATURE_NAMES,
    REASON_LABELS,
    RISK_DIRECTION,
    extract_features,
    to_vector,
)

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s"
)
logger = logging.getLogger("fraud")

MODEL_DIR = Path(__file__).resolve().parent / "model"


class _Model:
    loaded: bool = False
    version: str = "uninitialized"
    classifier: Any = None
    anomaly: Any = None
    feature_mean: np.ndarray | None = None
    feature_std: np.ndarray | None = None
    review_threshold: float = 0.5
    block_threshold: float = 0.85
    anomaly_samples: np.ndarray | None = None


MODEL = _Model()


def _load_model() -> None:
    try:
        classifier = load(MODEL_DIR / "classifier.joblib")
        anomaly = load(MODEL_DIR / "anomaly.joblib")
        meta = json.loads((MODEL_DIR / "metadata.json").read_text())
    except FileNotFoundError:
        logger.error("model artifacts missing in %s - run `python train.py` first", MODEL_DIR)
        return

    if list(meta["feature_names"]) != list(FEATURE_NAMES):
        logger.error("feature mismatch between metadata and features.py - retrain required")
        return

    MODEL.classifier = classifier
    MODEL.anomaly = anomaly
    MODEL.version = meta["model_version"]
    MODEL.review_threshold = float(meta["review_threshold"])
    MODEL.block_threshold = float(meta["block_threshold"])
    MODEL.feature_mean = np.asarray(meta["feature_mean"], dtype=float)
    MODEL.feature_std = np.asarray(meta["feature_std"], dtype=float)
    MODEL.anomaly_samples = np.asarray(meta["anomaly_score_samples"], dtype=float)
    MODEL.loaded = True
    logger.info("fraud model %s loaded", MODEL.version)


@asynccontextmanager
async def lifespan(_: FastAPI) -> Any:
    _load_model()
    yield


app = FastAPI(title="LearnHub Fraud Detection", version="1.0.0", lifespan=lifespan)


class ScoreRequest(BaseModel):
    request_id: str | None = None
    account_age_days: float | None = None
    email: str | None = None
    email_verified: bool | None = None
    account_country: str | None = None
    ip_country: str | None = None
    card_bin_country: str | None = None
    payment_method: str | None = None
    amount: float | None = None
    enrollments_last_1h: int | None = None
    enrollments_last_24h: int | None = None
    distinct_cards_last_24h: int | None = None
    failed_payments_last_24h: int | None = None
    password_resets_last_7d: int | None = None
    seconds_since_signup: float | None = None
    device_shared_account_count: int | None = None
    profile_completeness: float | None = Field(default=None, ge=0.0, le=1.0)


class ScoreResponse(BaseModel):
    request_id: str
    fraud_score: float
    anomaly_score: float
    risk_band: str
    decision: str
    reason_codes: list[str]
    model_version: str
    scored_at: str


def _risk_band(score: float) -> str:
    if score < 0.30:
        return "low"
    if score < 0.60:
        return "medium"
    if score < 0.85:
        return "high"
    return "critical"


def _decision(score: float) -> str:
    if score >= MODEL.block_threshold:
        return "block"
    if score >= MODEL.review_threshold:
        return "review"
    return "allow"


def _anomaly_score(raw_score: float) -> float:
    """IsolationForest.score_samples is higher = more normal. Return the
    empirical fraction of training samples that look more normal than this one,
    so 1.0 means more anomalous than anything seen during training."""
    samples = MODEL.anomaly_samples
    if samples is None or samples.size == 0:
        return 0.0
    rank = float(np.searchsorted(samples, raw_score))
    return round(1.0 - rank / samples.size, 4)


def _reason_codes(vector: list[float]) -> list[str]:
    if MODEL.feature_mean is None or MODEL.feature_std is None:
        return []
    std = np.where(MODEL.feature_std < 1e-6, 1e-6, MODEL.feature_std)
    z = (np.asarray(vector) - MODEL.feature_mean) / std
    contributions: list[tuple[float, str]] = []
    for name, zi in zip(FEATURE_NAMES, z):
        directed = float(zi) * RISK_DIRECTION[name]
        if directed > 0.5:
            contributions.append((directed, REASON_LABELS[name]))
    contributions.sort(key=lambda item: item[0], reverse=True)

    ordered: list[str] = []
    for _, label in contributions:
        if label not in ordered:
            ordered.append(label)
        if len(ordered) == 3:
            break
    return ordered


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "status": "ok" if MODEL.loaded else "degraded",
        "model_loaded": MODEL.loaded,
        "model_version": MODEL.version,
    }


@app.post("/score", response_model=ScoreResponse)
def score(request: ScoreRequest) -> ScoreResponse:
    if not MODEL.loaded:
        raise HTTPException(
            status_code=503,
            detail="fraud model not loaded; caller should fail open and allow the enrollment",
        )

    payload = request.model_dump(exclude_none=True)
    request_id = request.request_id or str(uuid4())

    vector = to_vector(extract_features(payload))
    matrix = np.asarray([vector], dtype=float)

    fraud_score = float(MODEL.classifier.predict_proba(matrix)[0, 1])
    anomaly_raw = float(MODEL.anomaly.score_samples(matrix)[0])

    response = ScoreResponse(
        request_id=request_id,
        fraud_score=round(fraud_score, 4),
        anomaly_score=_anomaly_score(anomaly_raw),
        risk_band=_risk_band(fraud_score),
        decision=_decision(fraud_score),
        reason_codes=_reason_codes(vector),
        model_version=MODEL.version,
        scored_at=datetime.now(timezone.utc).isoformat(),
    )
    logger.info(
        "scored request_id=%s score=%.4f decision=%s",
        request_id, fraud_score, response.decision,
    )
    return response
