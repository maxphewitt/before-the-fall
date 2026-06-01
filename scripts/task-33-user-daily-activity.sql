-- Task #33 — User daily activity tracking
--
-- Problem this solves: `users.last_seen_at` only bumps when a user
-- enters their recovery code at /return. Any subsequent authenticated
-- page view (reading tools, praying the Rosary, browsing the journal)
-- never updates anything. Result: the /admin/beta-codes activity
-- rollup shows testers as "inactive" even when they're using the
-- platform every day.
--
-- Fix: add a lightweight per-day-per-user activity log so we can
-- compute "days active in last 30" authoritatively, and keep the
-- existing `users.last_seen_at` working as the "most recent touch"
-- field by bumping it on every authenticated page view (handled in
-- app/lib/session.ts via touchUserActivity).
--
-- Schema:
--   user_daily_activity:
--     (user_id, activity_date) — composite PK, dedups per day per user
--     first_touch_at — timestamp of the first hit on that day, for
--                      future "what time do testers log in" analytics
--
-- Idempotent. Run in Supabase Studio (Production project).

BEGIN;

CREATE TABLE IF NOT EXISTS user_daily_activity (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  first_touch_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, activity_date)
);

CREATE INDEX IF NOT EXISTS idx_user_daily_activity_date
  ON user_daily_activity (activity_date DESC);

CREATE INDEX IF NOT EXISTS idx_user_daily_activity_user_date
  ON user_daily_activity (user_id, activity_date DESC);

ALTER TABLE user_daily_activity ENABLE ROW LEVEL SECURITY;

-- No RLS policy added: only the service-role server queries this table.
-- End users never read or write it directly; all writes happen via
-- supabaseServer() in app/lib/session.ts.

COMMIT;
