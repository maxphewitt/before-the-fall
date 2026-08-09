-- Task #44 — Community enrollments (Walk Together)
--
-- One row per (user, item) where item_id is a community novena id or a
-- seasonal challenge id. Powers the communal "N walking with you" count and
-- "you joined" state. joined_at also serves as the start date for date-dripped
-- seasonal challenges. Communal, never competitive — we only ever show an
-- aggregate count, never who joined.
--
-- Numbers/ids only. Service-role only (RLS on, no policies). Idempotent.
-- Run in Supabase Studio (Production).

BEGIN;

CREATE TABLE IF NOT EXISTS community_enrollments (
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id    TEXT NOT NULL,
  joined_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, item_id)
);

CREATE INDEX IF NOT EXISTS community_enrollments_item_idx
  ON community_enrollments (item_id);

ALTER TABLE community_enrollments ENABLE ROW LEVEL SECURITY;

COMMIT;
