# How LearnHub Fraud Detection Works

The `fraud/` directory is a **standalone Python / FastAPI microservice**. It is
not part of the backend four-layer architecture and never touches the
application database. The core backend calls it over HTTP during checkout and
owns all persistence and decisions.

---

## 1. High-level flow

```
student checks out
      │
      ▼
backend gathers signals about the account/event
      │  POST /score  (JSON, all fields optional)
      ▼
fraud service                     ── features.py ──▶ 17-value numeric vector
      │                                 │
      │                                 ├─▶ GradientBoostingClassifier ─▶ fraud_score (0–1)
      │                                 └─▶ IsolationForest            ─▶ anomaly_score (0–1)
      │
      │  derive risk_band + decision from thresholds
      │  derive reason_codes from per-feature z-scores
      ▼
{ fraud_score, anomaly_score, risk_band, decision, reason_codes, ... }
      │
      ▼
backend acts: allow / hold for review / block
```

**Fail-open contract:** if the service times out, refuses the connection, or
returns HTTP 503 (model not loaded), the backend **allows** the enrollment and
records it for asynchronous review. A fraud-service outage never blocks a
paying student.

---

## 2. Feature engineering — `features.py`

Pure transformation layer: raw event in, fixed-order numeric vector out. No
model code, no I/O, no scikit-learn import — so `train.py` and `main.py` share
the exact same logic. `FEATURE_NAMES` is the canonical order; changing its
membership or order requires a full retrain and a new `model_version`.

Every input field is optional. Missing fields fall back to the
**least-suspicious** value, so a sparse payload never fabricates risk.

The 17 features:

| Feature | Derivation | Direction |
|---|---|---|
| `log_account_age` | `log1p(account_age_days)` | older = safer |
| `disposable_email` | email domain in disposable list (mailinator, yopmail, …) | fraud |
| `free_email` | email domain in free-provider list (gmail, yahoo, …) | fraud |
| `email_unverified` | `email_verified` is not true | fraud |
| `geo_mismatch` | `account_country` ≠ `ip_country` (both present) | fraud |
| `card_geo_mismatch` | `card_bin_country` ≠ `ip_country` (both present) | fraud |
| `enroll_velocity_1h` | `enrollments_last_1h` | fraud |
| `enroll_velocity_24h` | `enrollments_last_24h` | fraud |
| `card_velocity_24h` | `distinct_cards_last_24h` | fraud |
| `failed_payment_velocity` | `failed_payments_last_24h` | fraud |
| `password_reset_velocity` | `password_resets_last_7d` | fraud |
| `rapid_purchase` | `seconds_since_signup` < 180 | fraud |
| `log_seconds_since_signup` | `log1p(seconds_since_signup)` | longer = safer |
| `log_amount` | `log1p(amount)` | higher = riskier |
| `device_reuse` | `device_shared_account_count` | fraud |
| `profile_incompleteness` | `1 - profile_completeness` | fraud |
| `nonstandard_payment` | `payment_method` not in {card, paypal, apple_pay, google_pay} | fraud |

`RISK_DIRECTION` (+1 / −1) and `REASON_LABELS` (human text) accompany each
feature and are used only for explanation, not scoring.

---

## 3. Training — `train.py`

Run with `python train.py`. Steps:

1. **Synthesise a labelled dataset** (`make_dataset`, 20,000 rows, ~9% fraud):
   - `_legit_event` — aged accounts, mostly verified email, IP usually matches
     account country, low velocity, normal amounts, high profile completeness.
   - `_fraud_event` — brand-new accounts, disposable email, geo mismatch,
     enrollment/card/failed-payment velocity spikes, rapid post-signup
     purchase, shared devices, rare payment methods (crypto, wire, gift_card).
   - Deliberate **class overlap**: ~20% of fraud rows are made to look almost
     clean, and ~4% of legit rows trip a risk signal. This stops the model
     from learning a trivially separable boundary.
2. **Train two models** on a 75/25 stratified split:
   - `GradientBoostingClassifier` (300 trees, lr 0.05, depth 3) → the primary
     fraud probability.
   - `IsolationForest` (200 trees, contamination 0.09) fit on **legit rows
     only** → a secondary anomaly / cold-start signal.
3. **Pick thresholds from the precision–recall curve** (`_choose_threshold`):
   - `review_threshold` = lowest score still hitting **0.90 precision**, max recall.
   - `block_threshold` = lowest score still hitting **0.98 precision** (never
     below the review threshold).
4. **Print an evaluation report**: ROC AUC, PR AUC, Brier score, confusion
   matrix and classification report at the review threshold.
5. **Write artifacts** to `fraud/model/` (git-ignored — ship a training run, not
   a checked-in binary):
   - `classifier.joblib`, `anomaly.joblib`
   - `metadata.json` — `model_version` (`YYYYMMDD-<feature+metric hash>`),
     `feature_names`, both thresholds, metrics, per-feature `feature_mean` /
     `feature_std` (for reason codes), and 512 sampled `anomaly_score_samples`
     (for anomaly normalisation).

---

## 4. Serving — `main.py`

FastAPI app, run with `uvicorn main:app --port 8100`.

**On startup** (`lifespan`): loads the three artifacts. Guards:
- missing files → logs an error, stays in "degraded" state.
- `metadata.feature_names` ≠ `features.py` `FEATURE_NAMES` → refuses to load
  (retrain required).

### `GET /health`
Returns `{ status: ok | degraded, model_loaded, model_version }`.

### `POST /score`
Request: `ScoreRequest` — all fields optional, `profile_completeness` bounded
0–1. If the model is not loaded, returns **HTTP 503** so the caller fails open.

Processing:
1. `extract_features` → `to_vector` → a `1 x 17` matrix.
2. `fraud_score = classifier.predict_proba(...)[0, 1]` — calibrated-ish
   probability of fraud.
3. `anomaly_raw = anomaly.score_samples(...)[0]`, then `_anomaly_score`
   converts it to the **empirical fraction of training samples that look more
   normal** — `1.0` means more anomalous than anything seen in training.
4. `risk_band` from fixed cutoffs on `fraud_score`:
   `<0.30 low · <0.60 medium · <0.85 high · ≥0.85 critical`.
5. `decision` from the learned thresholds:
   `≥ block_threshold → block · ≥ review_threshold → review · else allow`.
6. `reason_codes` (`_reason_codes`): z-score each feature against the stored
   train mean/std, multiply by `RISK_DIRECTION` so only *risk-increasing*
   deviations count, keep those with directed z > 0.5, and return the top 3
   distinct `REASON_LABELS`. Pure post-hoc explanation — it does not affect the
   score.

Response (`ScoreResponse`):

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

---

## 5. Key design points

- **`features.py` is the single source of truth** for the feature vector; both
  training and serving import it, and a feature-name mismatch hard-blocks model
  load.
- **Two models, one primary**: the gradient-boosted classifier drives the
  decision; the isolation forest is an advisory anomaly signal (useful when the
  classifier is uncertain or for novel attack shapes).
- **Thresholds are learned, not guessed** — anchored to precision targets (0.90
  for review, 0.98 for block) so the block action stays high-confidence.
- **Advisory only** — the backend makes the final call and always fails open.
- **Stateless** — no database client in this service; the caller owns
  persistence and review queues.

## 6. Running it locally

```bash
cd fraud
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python train.py                 # writes model/ + prints evaluation
uvicorn main:app --port 8100
```
