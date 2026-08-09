-- Task #49 — Learning-module resume position + time-on-journey
--
-- devotion_position: where the user left off in this month's module, so they
-- can come back the next day and pick up mid-session (page-level resume).
-- devotion_time: total active seconds a user has spent in the month's module,
-- powering the DURING-THE-MONTH leaderboard (time on the journey). The
-- END-OF-MONTH leaderboard uses quiz scores from devotion_sessions instead.
--
-- Numbers only. Service-role only (RLS on, no policies). Idempotent.
-- Run in Supabase Studio (Production).

BEGIN;

CREATE TABLE IF NOT EXISTS devotion_position (
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  period      TEXT NOT NULL,
  session_n   SMALLINT NOT NULL DEFAULT 1,
  page        SMALLINT NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, period)
);

CREATE TABLE IF NOT EXISTS devotion_time (
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  period      TEXT NOT NULL,
  seconds     INTEGER NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, period),
  CONSTRAINT devotion_time_nonneg CHECK (seconds >= 0)
);

CREATE INDEX IF NOT EXISTS devotion_time_period_idx ON devotion_time (period, seconds DESC);

ALTER TABLE devotion_position ENABLE ROW LEVEL SECURITY;
ALTER TABLE devotion_time ENABLE ROW LEVEL SECURITY;

COMMIT;
