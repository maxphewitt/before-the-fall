-- Task #43 — Novena progress (9-day journeys)
--
-- One row per (user, novena) tracking how far through the 9 days they are and
-- when they last prayed a day. Deliberately forgiving for a mental-health
-- audience: a missed day does NOT reset progress (unlike the traditional
-- "start over" rule) — the app lets them continue. current_day is the next day
-- to pray (1..9); completed_days counts distinct days done.
--
-- Numbers/enums only. Service-role only (RLS on, no policies — matches the
-- other facts tables). Idempotent. Run in Supabase Studio (Production).

BEGIN;

CREATE TABLE IF NOT EXISTS novena_progress (
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  novena_id       TEXT NOT NULL,
  current_day     SMALLINT NOT NULL DEFAULT 1,
  completed_days  SMALLINT NOT NULL DEFAULT 0,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_prayed_at  TIMESTAMPTZ NULL,
  completed_at    TIMESTAMPTZ NULL,
  PRIMARY KEY (user_id, novena_id),
  CONSTRAINT novena_current_day_range CHECK (current_day >= 1 AND current_day <= 10),
  CONSTRAINT novena_completed_days_range CHECK (completed_days >= 0 AND completed_days <= 9)
);

ALTER TABLE novena_progress ENABLE ROW LEVEL SECURITY;

COMMIT;
