-- Task #42 — Customizable recommendation topics
--
-- Lets a user add themes they want their daily Scripture/prayer feed to
-- draw from, on top of the defaults inferred from their onboarding
-- struggles. Stored as an array of theme keys (e.g. 'anxiety'→'trust',
-- 'grief'→'comfort'); the app validates keys against the known theme list,
-- so this is a bounded enum-ish array, not free text.
--
-- Idempotent. Service-role only (RLS already on user_profiles).
-- Run in Supabase Studio (Production).

BEGIN;

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS feed_topics TEXT[] NULL;

COMMIT;
