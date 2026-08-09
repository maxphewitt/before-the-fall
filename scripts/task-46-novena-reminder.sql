-- Task #46 — Novena reminder time
--
-- Lets a user "add a novena to their day" with a time, after praying Day 1.
-- The in-progress novena then shows in the Home "Daily habits" rail with its
-- time and (later) drives a gentle reminder. Local wall-clock TIME, nullable.
--
-- Idempotent. Service-role only (RLS already on novena_progress).
-- Run in Supabase Studio (Production).

BEGIN;

ALTER TABLE novena_progress
  ADD COLUMN IF NOT EXISTS reminder_time TIME NULL;

COMMIT;
