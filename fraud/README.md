# LearnHub Fraud Detection Service

A Python / FastAPI microservice that scores enrollment and payment events for
fraud risk. The core backend calls `POST /score` during checkout and uses the
result to allow, hold for review, or block an enrollment. The service is
advisory: if it is unreachable the backend fails open.

## Model

- **Classifier** — `GradientBoostingClassifier` on 17 engineered features
  (account age, email reputation, geo/card mismatch, enrollment & card
  velocity, failed-payment and password-reset velocity, rapid post-signup
  purchase, device reuse, profile completeness, payment method).
- **Anomaly detector** — `IsolationForest` fit on legitimate traffic, used as a
  secondary cold-start signal.
- `train.py` synthesises a labelled dataset with realistic class overlap,
  trains both models, prints ROC AUC / PR AUC / Brier / confusion matrix, and
  picks review + block thresholds from the precision–recall curve.

## Run locally

```bash
cd fraud
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python train.py                 # writes model/ artifacts + prints evaluation
uvicorn main:app --port 8100
```

## API

### `GET /health`

```json
{ "status": "ok", "model_loaded": true, "model_version": "20260906-1a2b3c4d5e6f" }
```

### `POST /score`

All fields optional; omit what you do not have.

```bash
curl -s localhost:8100/score -H 'content-type: application/json' -d '{
  "account_age_days": 0.02,
  "email": "burner8837@mailinator.com",
  "email_verified": false,
  "account_country": "US",
  "ip_country": "RU",
  "payment_method": "crypto",
  "amount": 240,
  "enrollments_last_1h": 6,
  "enrollments_last_24h": 19,
  "distinct_cards_last_24h": 5,
  "failed_payments_last_24h": 3,
  "seconds_since_signup": 41,
  "device_shared_account_count": 7,
  "profile_completeness": 0.1
}'
```

```json
{
  "request_id": "0f1e2d3c-...",
  "fraud_score": 0.94,
  "anomaly_score": 0.98,
  "risk_band": "critical",
  "decision": "block",
  "reason_codes": [
    "purchase within minutes of signup",
    "many enrollments in the last 24 hours",
    "disposable email provider"
  ],
  "model_version": "20260906-1a2b3c4d5e6f",
  "scored_at": "2026-09-06T12:00:00+00:00"
}
```

`decision` is one of `allow`, `review`, `block`. `risk_band` is
`low | medium | high | critical`.
