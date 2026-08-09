-- Task #41 — Daily habit scheduling (time of day)
--
-- Lets a user attach a time of day to a habit ("Rosary at 12:00 PM") so
-- the Daily habits rail can show it, mark it "due now", and (later) send a
-- gentle reminder. One row per (user, habit). Completing a scheduled habit
-- already records a habit_completion (unchanged), so schedules do NOT
-- affect streak/journey math — they're purely a when-to-do-it layer.
--
-- scheduled_time is a local wall-clock TIME (no date, no tz): the user's
-- intended time of day. active lets a user keep a time but pause reminders.
--
-- Numbers/enums only, no free text. Service-role only (RLS on, no
-- policies — matches the other facts tables). Idempotent.
-- Run in Supabase Studio (Production).

BEGIN;

CREATE TABLE IF NOT EXISTS habit_schedules (
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  habit_slug     TEXT NOT NULL,
  scheduled_time TIME NULL,
  active         BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, habit_slug)
);

ALTER TABLE habit_schedules ENABLE ROW LEVEL SECURITY;

COMMIT;
