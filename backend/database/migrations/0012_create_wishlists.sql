CREATE TABLE nx.wishlists (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    UUID NOT NULL REFERENCES nx.users(id),
  course_id     UUID NOT NULL REFERENCES nx.courses(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ
);

CREATE UNIQUE INDEX wishlists_student_course_active_idx
  ON nx.wishlists (student_id, course_id)
  WHERE deleted_at IS NULL;
