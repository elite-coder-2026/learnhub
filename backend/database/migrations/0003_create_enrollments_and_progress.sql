CREATE TABLE nx.enrollments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    UUID NOT NULL REFERENCES nx.users(id),
  course_id     UUID NOT NULL REFERENCES nx.courses(id),
  enrolled_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ
);

CREATE UNIQUE INDEX enrollments_student_course_active_idx
  ON nx.enrollments (student_id, course_id)
  WHERE deleted_at IS NULL;

CREATE TABLE nx.lesson_progress (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id  UUID NOT NULL REFERENCES nx.enrollments(id),
  lesson_id      UUID NOT NULL REFERENCES nx.lessons(id),
  completed_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at     TIMESTAMPTZ
);

CREATE UNIQUE INDEX lesson_progress_enrollment_lesson_active_idx
  ON nx.lesson_progress (enrollment_id, lesson_id)
  WHERE deleted_at IS NULL;
