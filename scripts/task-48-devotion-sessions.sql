-- Task #48 — Monthly learning-module session results + leaderboard
--
-- One best-result row per (user, period, session). period is a month key like
-- "2026-07"; session_n is the module session (1..N). Powers per-session
-- completion tracking and the communal monthly leaderboard, which SUMS a user's
-- correct answers across the month's sessions. Knowledge game only — never tied
-- to prayer or streaks.
--
-- Numbers only. Service-role only (RLS on, no policies). Idempotent.
-- Run in Supabase Studio (Production).

BEGIN;

CREATE TABLE IF NOT EXISTS devotion_sessions (
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  period      TEXT NOT NULL,
  session_n   SMALLINT NOT NULL,
  correct     SMALLINT NOT NULL,
  total       SMALLINT NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, period, session_n),
  CONSTRAINT devotion_session_range CHECK (correct >= 0 AND correct <= total AND total > 0 AND total <= 20)
);

CREATE INDEX IF NOT EXISTS devotion_sessions_period_idx ON devotion_sessions (period);

ALTER TABLE devotion_sessions ENABLE ROW LEVEL SECURITY;

COMMIT;
