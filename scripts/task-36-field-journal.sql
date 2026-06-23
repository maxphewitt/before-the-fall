-- Task #36 — Field Journal (self-monitoring urge log + honesty XP ledger)
--
-- Adapted from the uploaded field_journal_schema.sql to THIS app's model:
--   * References `users(id)` (pseudonymous), NOT Supabase `auth.users`.
--   * RLS enabled with NO policy — service-role only, all access via
--     supabaseServer() + getCurrentUserId(), matching urge_surf_sessions /
--     user_daily_activity / safety_logs.
--   * No streak/XP trigger and no auth.uid() SQL functions — XP, the
--     forgiving streak, and the weekly debrief are computed in TypeScript
--     (app/actions/fieldJournal.ts), the same way habits/streaks already are.
--   * Freeform Daily Journal reuses the EXISTING journal_entries table
--     (task-22), so it is NOT recreated here.
--
-- Principles (do not "optimize" away): XP is constant across outcomes
-- (honesty over outcome); the streak counts days you showed up; context
-- has no CHECK so custom situations work.
--
-- Idempotent. Run in Supabase Studio (Production).

BEGIN;

-- 1. The <10s capture + optional enrichment + safety columns.
CREATE TABLE IF NOT EXISTS urge_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  logged_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  context         TEXT NOT NULL,                       -- built-in key OR custom label
  intensity       SMALLINT NOT NULL CHECK (intensity BETWEEN 1 AND 10),
  outcome         TEXT NOT NULL CHECK (outcome IN ('surfed','gave_in','left_scene')),
  local_hour      SMALLINT NOT NULL CHECK (local_hour BETWEEN 0 AND 23),
  local_dow       SMALLINT NOT NULL CHECK (local_dow BETWEEN 0 AND 6),  -- 0 = Sunday
  halt_state      TEXT,
  detail          TEXT,                                -- "what exactly, and how"
  coping_skill    TEXT,
  note            TEXT,
  severity_flag   BOOLEAN NOT NULL DEFAULT false,
  needs_review    BOOLEAN NOT NULL DEFAULT false,      -- care-team queue
  xp_awarded      SMALLINT NOT NULL DEFAULT 10,        -- constant across outcomes
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_urge_logs_user_time ON urge_logs (user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_urge_logs_user_hour ON urge_logs (user_id, local_hour);
CREATE INDEX IF NOT EXISTS idx_urge_logs_user_ctx  ON urge_logs (user_id, context);
CREATE INDEX IF NOT EXISTS idx_urge_logs_review     ON urge_logs (needs_review) WHERE needs_review = true;
ALTER TABLE urge_logs ENABLE ROW LEVEL SECURITY;

-- 2. Per-user gamification state (one row per user).
CREATE TABLE IF NOT EXISTS field_profile (
  user_id        UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_xp       INTEGER NOT NULL DEFAULT 30,          -- endowed-progress head start
  current_streak INTEGER NOT NULL DEFAULT 0,           -- consecutive days with >=1 log
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_log_date  DATE,                                 -- user-local date of last log
  streak_freezes SMALLINT NOT NULL DEFAULT 2,          -- forgiveness budget
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE field_profile ENABLE ROW LEVEL SECURITY;

-- 3. Per-user custom situations (the "+ Add your own" chips).
CREATE TABLE IF NOT EXISTS user_situations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label      TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, label)
);
ALTER TABLE user_situations ENABLE ROW LEVEL SECURITY;

-- 4. Carry-into-tomorrow intentions (no calendar system exists yet; this is
--    the fallback — surfaced on the next day's home screen).
CREATE TABLE IF NOT EXISTS intentions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body            TEXT NOT NULL,
  due_date        DATE NOT NULL,
  source_entry_id UUID,
  done            BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_intentions_user_due ON intentions (user_id, due_date);
ALTER TABLE intentions ENABLE ROW LEVEL SECURITY;

-- No RLS policies: service-role server only.

COMMIT;
