-- Task #32 — Beta access gate
--
-- Closed-beta-only. The site is fully locked behind a per-tester code
-- until BETA_GATE_ENABLED is flipped off on Vercel (public launch).
-- Code generation, redemption, and per-session tracking all happen
-- against the tables below.
--
--   beta_access_codes:    one row per tester. label is a human note so
--                         Max knows who has which code ("John D - parish").
--   beta_access_sessions: one row per (code, browser-session). Tracks
--                         IP hash + user agent so Max can see how
--                         testers are using the site without storing
--                         PII. Anonymous-by-design.
--   users.beta_access_code_id: nullable column linking a signup back
--                         to the beta tester who let them in. Powers
--                         the future "did this tester actually bring
--                         someone through?" report.
--
-- Idempotent within the transaction. Run in Supabase Studio.

BEGIN;

CREATE TABLE IF NOT EXISTS beta_access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code_hash TEXT NOT NULL UNIQUE,
  label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deactivated_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  use_count INT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_beta_access_codes_code_hash
  ON beta_access_codes (code_hash);

CREATE INDEX IF NOT EXISTS idx_beta_access_codes_active
  ON beta_access_codes (created_at DESC)
  WHERE deactivated_at IS NULL;

ALTER TABLE beta_access_codes ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS beta_access_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beta_code_id UUID NOT NULL REFERENCES beta_access_codes(id) ON DELETE CASCADE,
  ip_hash TEXT,
  user_agent TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_beta_access_sessions_code
  ON beta_access_sessions (beta_code_id, last_seen_at DESC);

CREATE INDEX IF NOT EXISTS idx_beta_access_sessions_recent
  ON beta_access_sessions (last_seen_at DESC);

ALTER TABLE beta_access_sessions ENABLE ROW LEVEL SECURITY;

-- Link signups back to the beta code that let the tester in.
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS beta_access_code_id UUID
  REFERENCES beta_access_codes(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_users_beta_access_code
  ON users (beta_access_code_id)
  WHERE beta_access_code_id IS NOT NULL;

COMMIT;
