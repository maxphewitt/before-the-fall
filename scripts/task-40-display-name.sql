-- Task #40 — Optional display name / nickname
--
-- Lets a user choose a name or username to be greeted by (Home greeting,
-- You page). This is a CHOSEN nickname, not identity — anonymity is
-- unchanged: we still never ask for a real name, email, or phone. The
-- field is nullable and freely editable.
--
-- Stored on user_profiles alongside the onboarding answers. Length-capped
-- so it can't be abused as a free-text store.
--
-- Idempotent. Service-role only (RLS already on user_profiles).
-- Run in Supabase Studio (Production).

BEGIN;

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS display_name TEXT NULL;

ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_display_name_len;
ALTER TABLE user_profiles
  ADD CONSTRAINT user_profiles_display_name_len
  CHECK (display_name IS NULL OR char_length(display_name) <= 40);

COMMIT;
