CREATE TABLE nx.fraud_flags (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id     UUID NOT NULL REFERENCES nx.users(id),
  course_id      UUID NOT NULL REFERENCES nx.courses(id),
  enrollment_id  UUID NOT NULL REFERENCES nx.enrollments(id),
  risk_score     NUMERIC(4, 3) NOT NULL,
  reason         TEXT,
  status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  reviewed_by    UUID REFERENCES nx.users(id),
  reviewed_at    TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at     TIMESTAMPTZ
);

CREATE INDEX fraud_flags_status_idx ON nx.fraud_flags (status) WHERE deleted_at IS NULL;
CREATE INDEX fraud_flags_enrollment_idx ON nx.fraud_flags (enrollment_id) WHERE deleted_at IS NULL;
