CREATE TABLE nx.discussion_posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id   UUID NOT NULL REFERENCES nx.lessons(id),
  author_id   UUID NOT NULL REFERENCES nx.users(id),
  body        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ
);

CREATE INDEX discussion_posts_lesson_id_idx
  ON nx.discussion_posts (lesson_id)
  WHERE deleted_at IS NULL;
