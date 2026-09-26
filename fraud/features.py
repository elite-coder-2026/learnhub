"""Feature engineering for the LearnHub fraud detection service.

Pure transformation layer: raw enrollment/payment events in, a fixed-order
numeric feature vector out. No model code, no I/O, and no scikit-learn import
so that the training pipeline and the API share the exact same logic.
"""

from __future__ import annotations

import math
from collections.abc import Mapping
from typing import Any

# Canonical feature order. train.py and main.py both rely on this tuple; never
# reorder or change its membership without retraining and bumping model_version.
FEATURE_NAMES: tuple[str, ...] = (
    "log_account_age",
    "disposable_email",
    "free_email",
    "email_unverified",
    "geo_mismatch",
    "card_geo_mismatch",
    "enroll_velocity_1h",
    "enroll_velocity_24h",
    "card_velocity_24h",
    "failed_payment_velocity",
    "password_reset_velocity",
    "rapid_purchase",
    "log_seconds_since_signup",
    "log_amount",
    "device_reuse",
    "profile_incompleteness",
    "nonstandard_payment",
)

# +1 -> a larger value pushes the score toward fraud
# -1 -> a larger value pushes the score toward legitimate
RISK_DIRECTION: dict[str, int] = {
    "log_account_age": -1,
    "disposable_email": 1,
    "free_email": 1,
    "email_unverified": 1,
    "geo_mismatch": 1,
    "card_geo_mismatch": 1,
    "enroll_velocity_1h": 1,
    "enroll_velocity_24h": 1,
    "card_velocity_24h": 1,
    "failed_payment_velocity": 1,
    "password_reset_velocity": 1,
    "rapid_purchase": 1,
    "log_seconds_since_signup": -1,
    "log_amount": 1,
    "device_reuse": 1,
    "profile_incompleteness": 1,
    "nonstandard_payment": 1,
}

# Human-readable explanations surfaced as reason codes by the API.
REASON_LABELS: dict[str, str] = {
    "log_account_age": "account created very recently",
    "disposable_email": "disposable email provider",
    "free_email": "free email provider",
    "email_unverified": "email address not verified",
    "geo_mismatch": "account country differs from IP country",
    "card_geo_mismatch": "card country differs from IP country",
    "enroll_velocity_1h": "many enrollments in the last hour",
    "enroll_velocity_24h": "many enrollments in the last 24 hours",
    "card_velocity_24h": "multiple payment cards used within 24 hours",
    "failed_payment_velocity": "repeated failed payments",
    "password_reset_velocity": "repeated password resets",
    "rapid_purchase": "purchase within minutes of signup",
    "log_seconds_since_signup": "purchase within minutes of signup",
    "log_amount": "unusually high order amount",
    "device_reuse": "device shared across many accounts",
    "profile_incompleteness": "incomplete account profile",
    "nonstandard_payment": "uncommon payment method",
}

DISPOSABLE_EMAIL_DOMAINS: frozenset[str] = frozenset({
    "mailinator.com", "guerrillamail.com", "10minutemail.com", "tempmail.com",
    "trashmail.com", "yopmail.com", "sharklasers.com", "getnada.com",
    "temp-mail.org", "throwawaymail.com", "maildrop.cc", "dispostable.com",
})

FREE_EMAIL_DOMAINS: frozenset[str] = frozenset({
    "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "aol.com",
    "icloud.com", "protonmail.com", "gmx.com", "mail.com", "zoho.com",
})

KNOWN_PAYMENT_METHODS: frozenset[str] = frozenset({
    "card", "paypal", "apple_pay", "google_pay",
})

RAPID_PURCHASE_SECONDS: float = 180.0


def _num(event: Mapping[str, Any], key: str, default: float) -> float:
    value = event.get(key, default)
    if value is None:
        return float(default)
    try:
        return float(value)
    except (TypeError, ValueError):
        return float(default)


def _text(event: Mapping[str, Any], key: str, default: str = "") -> str:
    value = event.get(key, default)
    if value is None:
        return default
    return str(value).strip().lower()


def _email_domain(email: str) -> str:
    _, _, domain = email.partition("@")
    return domain.strip().lower()


def extract_features(event: Mapping[str, Any]) -> dict[str, float]:
    """Turn one raw event into a name -> value mapping.

    Every field is optional; missing fields fall back to the least-suspicious
    value so a sparse payload never fabricates risk.
    """
    domain = _email_domain(_text(event, "email"))
    account_country = _text(event, "account_country")
    ip_country = _text(event, "ip_country")
    card_country = _text(event, "card_bin_country")
    payment_method = _text(event, "payment_method", "card")

    seconds_since_signup = max(_num(event, "seconds_since_signup", 1.0e7), 0.0)
    profile_completeness = min(max(_num(event, "profile_completeness", 1.0), 0.0), 1.0)

    return {
        "log_account_age": math.log1p(max(_num(event, "account_age_days", 0.0), 0.0)),
        "disposable_email": 1.0 if domain in DISPOSABLE_EMAIL_DOMAINS else 0.0,
        "free_email": 1.0 if domain in FREE_EMAIL_DOMAINS else 0.0,
        "email_unverified": 0.0 if bool(event.get("email_verified", False)) else 1.0,
        "geo_mismatch": 1.0 if account_country and ip_country and account_country != ip_country else 0.0,
        "card_geo_mismatch": 1.0 if card_country and ip_country and card_country != ip_country else 0.0,
        "enroll_velocity_1h": max(_num(event, "enrollments_last_1h", 0.0), 0.0),
        "enroll_velocity_24h": max(_num(event, "enrollments_last_24h", 0.0), 0.0),
        "card_velocity_24h": max(_num(event, "distinct_cards_last_24h", 0.0), 0.0),
        "failed_payment_velocity": max(_num(event, "failed_payments_last_24h", 0.0), 0.0),
        "password_reset_velocity": max(_num(event, "password_resets_last_7d", 0.0), 0.0),
        "rapid_purchase": 1.0 if seconds_since_signup < RAPID_PURCHASE_SECONDS else 0.0,
        "log_seconds_since_signup": math.log1p(seconds_since_signup),
        "log_amount": math.log1p(max(_num(event, "amount", 0.0), 0.0)),
        "device_reuse": max(_num(event, "device_shared_account_count", 0.0), 0.0),
        "profile_incompleteness": 1.0 - profile_completeness,
        "nonstandard_payment": 0.0 if payment_method in KNOWN_PAYMENT_METHODS else 1.0,
    }


def to_vector(features: Mapping[str, float]) -> list[float]:
    """Flatten a feature mapping into FEATURE_NAMES order."""
    return [float(features[name]) for name in FEATURE_NAMES]


def event_to_vector(event: Mapping[str, Any]) -> list[float]:
    """Convenience: raw event straight to an ordered feature vector."""
    return to_vector(extract_features(event))
