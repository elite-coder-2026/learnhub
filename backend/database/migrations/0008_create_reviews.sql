CREATE TABLE nx.reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   UUID NOT NULL REFERENCES nx.courses(id),
  student_id  UUID NOT NULL REFERENCES nx.users(id),
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ
);

CREATE UNIQUE INDEX reviews_course_student_active_idx
  ON nx.reviews (course_id, student_id)
  WHERE deleted_at IS NULL;
