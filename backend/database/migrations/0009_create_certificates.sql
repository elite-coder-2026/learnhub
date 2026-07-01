CREATE TABLE nx.certificates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID NOT NULL REFERENCES nx.users(id),
  course_id   UUID NOT NULL REFERENCES nx.courses(id),
  file_path   TEXT NOT NULL,
  issued_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ
);

CREATE UNIQUE INDEX certificates_student_course_active_idx
  ON nx.certificates (student_id, course_id)
  WHERE deleted_at IS NULL;
