CREATE TABLE nx.notifications (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES nx.users(id),
  action_id      UUID,
  type           TEXT NOT NULL,
  title          TEXT NOT NULL,
  message        TEXT,
  content_label  TEXT,
  content_url    TEXT,
  quote          TEXT,
  read_at        TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at     TIMESTAMPTZ
);

CREATE INDEX notifications_user_id_active_idx
  ON nx.notifications (user_id)
  WHERE deleted_at IS NULL;
