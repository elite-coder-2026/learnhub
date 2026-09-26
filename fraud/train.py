"""Train the LearnHub fraud detection model.

Generates a labelled synthetic dataset that mirrors real enrollment-fraud
structure (fresh accounts, disposable email, geo mismatch, velocity spikes,
rapid post-signup purchases), fits a gradient-boosted classifier plus an
isolation-forest anomaly detector, prints an evaluation report, and writes the
artifacts consumed by main.py into ./model.

Run:  python train.py
"""

from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import numpy as np
from joblib import dump
from sklearn.ensemble import GradientBoostingClassifier, IsolationForest
from sklearn.metrics import (
    average_precision_score,
    brier_score_loss,
    classification_report,
    confusion_matrix,
    precision_recall_curve,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split

from features import FEATURE_NAMES, event_to_vector

MODEL_DIR = Path(__file__).resolve().parent / "model"

COUNTRIES = ["US", "GB", "CA", "DE", "FR", "IN", "BR", "AU", "NG", "RU"]
COMPANY_DOMAINS = ["acme.com", "globex.com", "initech.com", "umbrella.co", "hooli.com"]
FREE_DOMAINS = ["gmail.com", "yahoo.com", "outlook.com", "icloud.com"]
DISPOSABLE_DOMAINS = ["mailinator.com", "guerrillamail.com", "10minutemail.com", "yopmail.com"]
RARE_PAYMENTS = ["crypto", "wire", "gift_card", "money_order"]


def _legit_event(rng: np.random.Generator) -> dict[str, Any]:
    country = str(rng.choice(COUNTRIES))
    same_ip = rng.random() < 0.95
    domain = str(rng.choice(FREE_DOMAINS + COMPANY_DOMAINS))
    return {
        "account_age_days": float(rng.gamma(3.0, 90.0)),
        "email": f"user{int(rng.integers(1_000_000))}@{domain}",
        "email_verified": bool(rng.random() < 0.93),
        "account_country": country,
        "ip_country": country if same_ip else str(rng.choice(COUNTRIES)),
        "card_bin_country": country if rng.random() < 0.9 else str(rng.choice(COUNTRIES)),
        "payment_method": str(rng.choice(["card", "card", "card", "paypal", "apple_pay", "google_pay"])),
        "amount": float(np.clip(rng.normal(85.0, 40.0), 5.0, 400.0)),
        "enrollments_last_1h": int(rng.poisson(0.2)),
        "enrollments_last_24h": int(rng.poisson(0.8)),
        "distinct_cards_last_24h": int(1 + rng.poisson(0.05)),
        "failed_payments_last_24h": int(rng.poisson(0.08)),
        "password_resets_last_7d": int(rng.poisson(0.05)),
        "seconds_since_signup": float(rng.gamma(2.0, 120_000.0) + 600.0),
        "device_shared_account_count": int(1 + rng.poisson(0.1)),
        "profile_completeness": float(np.clip(rng.beta(6.0, 1.5), 0.0, 1.0)),
    }


def _fraud_event(rng: np.random.Generator) -> dict[str, Any]:
    account_country = str(rng.choice(COUNTRIES))
    ip_country = str(rng.choice(COUNTRIES)) if rng.random() < 0.7 else account_country
    domain = str(rng.choice(DISPOSABLE_DOMAINS)) if rng.random() < 0.6 else str(rng.choice(FREE_DOMAINS))
    rapid = rng.random() < 0.65
    return {
        "account_age_days": float(np.clip(rng.exponential(1.5), 0.0, 30.0)),
        "email": f"x{int(rng.integers(1_000_000))}@{domain}",
        "email_verified": bool(rng.random() < 0.15),
        "account_country": account_country,
        "ip_country": ip_country,
        "card_bin_country": str(rng.choice(COUNTRIES)),
        "payment_method": str(rng.choice(["card", "card", "paypal", *RARE_PAYMENTS])),
        "amount": float(np.clip(rng.normal(180.0, 90.0), 5.0, 600.0)),
        "enrollments_last_1h": int(rng.poisson(4.0)),
        "enrollments_last_24h": int(rng.poisson(14.0)),
        "distinct_cards_last_24h": int(1 + rng.poisson(3.5)),
        "failed_payments_last_24h": int(rng.poisson(2.5)),
        "password_resets_last_7d": int(rng.poisson(1.2)),
        "seconds_since_signup": float(rng.uniform(5.0, 120.0)) if rapid else float(rng.gamma(2.0, 20_000.0)),
        "device_shared_account_count": int(1 + rng.poisson(6.0)),
        "profile_completeness": float(np.clip(rng.beta(1.5, 5.0), 0.0, 1.0)),
    }


def make_dataset(n: int = 20_000, fraud_rate: float = 0.09, seed: int = 42) -> tuple[np.ndarray, np.ndarray]:
    """Build (X, y): X is n x len(FEATURE_NAMES), y is 0/1 fraud labels."""
    rng = np.random.default_rng(seed)
    rows: list[list[float]] = []
    labels: list[int] = []
    for _ in range(n):
        is_fraud = rng.random() < fraud_rate
        if is_fraud:
            event = _fraud_event(rng)
            if rng.random() < 0.20:
                # a fifth of fraud looks almost clean -> forces distribution overlap
                clean = _legit_event(rng)
                clean["email_verified"] = False
                clean["account_age_days"] = event["account_age_days"]
                event = clean
        else:
            event = _legit_event(rng)
            if rng.random() < 0.04:
                # a few genuine users legitimately trip risk signals
                event["enrollments_last_24h"] = int(rng.poisson(9.0))
                event["ip_country"] = str(rng.choice(COUNTRIES))
        rows.append(event_to_vector(event))
        labels.append(1 if is_fraud else 0)
    return np.asarray(rows, dtype=float), np.asarray(labels, dtype=int)


def _choose_threshold(y_true: np.ndarray, y_prob: np.ndarray, target_precision: float) -> float:
    """Lowest-probability threshold that still hits target precision, maximising recall."""
    precision, recall, thresholds = precision_recall_curve(y_true, y_prob)
    best_t, best_recall = 0.5, -1.0
    for p, r, t in zip(precision[:-1], recall[:-1], thresholds):
        if p >= target_precision and r > best_recall:
            best_recall, best_t = float(r), float(t)
    return best_t


def main() -> None:
    X, y = make_dataset()
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    clf = GradientBoostingClassifier(
        n_estimators=300, learning_rate=0.05, max_depth=3, subsample=0.9, random_state=42
    )
    clf.fit(X_train, y_train)

    anomaly = IsolationForest(n_estimators=200, contamination=0.09, random_state=42)
    anomaly.fit(X_train[y_train == 0])

    prob_test = clf.predict_proba(X_test)[:, 1]
    review_threshold = _choose_threshold(y_test, prob_test, target_precision=0.90)
    block_threshold = max(_choose_threshold(y_test, prob_test, target_precision=0.98), review_threshold)
    pred_test = (prob_test >= review_threshold).astype(int)

    roc = float(roc_auc_score(y_test, prob_test))
    ap = float(average_precision_score(y_test, prob_test))
    brier = float(brier_score_loss(y_test, prob_test))

    print("=== LearnHub fraud model - evaluation ===")
    print(f"train rows: {len(X_train):,}   test rows: {len(X_test):,}   fraud rate: {y.mean():.3f}")
    print(f"ROC AUC:           {roc:.4f}")
    print(f"PR AUC (avg prec): {ap:.4f}")
    print(f"Brier score:       {brier:.4f}")
    print(f"review threshold:  {review_threshold:.4f}  (target precision 0.90)")
    print(f"block threshold:   {block_threshold:.4f}  (target precision 0.98)")
    print("confusion matrix @ review threshold  [[TN FP] [FN TP]]:")
    print(confusion_matrix(y_test, pred_test))
    print(classification_report(y_test, pred_test, digits=3, target_names=["legit", "fraud"]))

    train_scores = np.sort(anomaly.score_samples(X_train))
    sample_scores = train_scores[np.linspace(0, len(train_scores) - 1, 512).astype(int)]

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    dump(clf, MODEL_DIR / "classifier.joblib")
    dump(anomaly, MODEL_DIR / "anomaly.joblib")

    fingerprint = hashlib.sha256(
        (",".join(FEATURE_NAMES) + f"|{roc:.4f}|{ap:.4f}").encode()
    ).hexdigest()[:12]
    now = datetime.now(timezone.utc)

    metadata = {
        "model_version": now.strftime("%Y%m%d") + "-" + fingerprint,
        "trained_at": now.isoformat(),
        "feature_names": list(FEATURE_NAMES),
        "review_threshold": review_threshold,
        "block_threshold": block_threshold,
        "metrics": {"roc_auc": roc, "pr_auc": ap, "brier": brier},
        "feature_mean": X_train.mean(axis=0).tolist(),
        "feature_std": X_train.std(axis=0).tolist(),
        "anomaly_score_samples": sample_scores.tolist(),
    }
    (MODEL_DIR / "metadata.json").write_text(json.dumps(metadata, indent=2))
    print(f"\nartifacts written to {MODEL_DIR}")


if __name__ == "__main__":
    main()
