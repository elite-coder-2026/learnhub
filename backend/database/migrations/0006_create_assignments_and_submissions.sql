CREATE TYPE submission_status AS ENUM ('submitted', 'graded');

CREATE TABLE nx.assignments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   UUID NOT NULL REFERENCES nx.courses(id),
  title       TEXT NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ
);

CREATE TABLE nx.submissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id   UUID NOT NULL REFERENCES nx.assignments(id),
  student_id      UUID NOT NULL REFERENCES nx.users(id),
  submission_text TEXT,
  file_url        TEXT,
  status          submission_status NOT NULL DEFAULT 'submitted',
  grade           INTEGER,
  feedback        TEXT,
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  graded_at       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ,
  CONSTRAINT submissions_content_check CHECK (submission_text IS NOT NULL OR file_url IS NOT NULL),
  CONSTRAINT submissions_grade_range CHECK (grade IS NULL OR (grade >= 0 AND grade <= 100))
);

CREATE UNIQUE INDEX submissions_assignment_student_active_idx
  ON nx.submissions (assignment_id, student_id)
  WHERE deleted_at IS NULL;
