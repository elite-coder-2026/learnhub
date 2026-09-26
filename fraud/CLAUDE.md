## Fraud Detection Microservice

Standalone Python / FastAPI service that scores LearnHub enrollment and payment
events for fraud risk. It is **not** part of the backend four-layer
architecture and never touches the application database directly — the core
backend calls it over HTTP and owns all persistence.

### Conventions

- Python 3.11+, `from __future__ import annotations`, type hints on every function
- FastAPI + scikit-learn only; no ORM, no DB client in this service
- `features.py` is the single source of truth for the feature vector. Both
  `train.py` and `main.py` import it — never compute features inline anywhere else.
- Changing `FEATURE_NAMES` (order or membership) requires a full retrain and a
  new `model_version`.
- Model artifacts live in `fraud/model/` and are git-ignored. Ship a training
  run, not a checked-in binary.

### Fail-open contract

The backend MUST treat this service as advisory. On timeout, connection error,
or HTTP 503 the caller allows the enrollment and records it for asynchronous
review. A fraud-service outage never blocks a paying student.

### Files

| File | Job |
|------|-----|
| `features.py` | raw event → fixed-order numeric feature vector |
| `train.py` | build synthetic labelled data, fit models, write `model/` |
| `main.py` | FastAPI app: `GET /health`, `POST /score` |

### Local run

```
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python train.py
uvicorn main:app --port 8100
```
