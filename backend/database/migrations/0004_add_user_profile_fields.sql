ALTER TABLE nx.users
  ADD COLUMN password           TEXT NOT NULL,
  ADD COLUMN first_name         TEXT NOT NULL,
  ADD COLUMN last_name          TEXT NOT NULL,
  ADD COLUMN avatar_url         TEXT,
  ADD COLUMN is_active          BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN is_email_verified  BOOLEAN NOT NULL DEFAULT false;
