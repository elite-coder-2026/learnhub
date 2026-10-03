ALTER TABLE nx.courses
  ADD COLUMN price_cents INTEGER NOT NULL DEFAULT 0
    CONSTRAINT courses_price_cents_non_negative CHECK (price_cents >= 0);
