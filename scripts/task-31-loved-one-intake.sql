-- Task #31 — Loved-one (CSO) intake + referral codes
--
-- Adds the `loved_one_intake` table that stores a Concerned Significant
-- Other's quiz answers against a hashed referral code. When the
-- struggling person enters that code at /onboard?code=..., the answers
-- pre-populate their onboarding defaults.
--
-- Privacy posture:
--   - Code is hashed (SHA-256) like recovery codes. Plaintext never persists.
--   - Answers live against the code, NOT against any user_id. If the
--     code is never redeemed, the row is meaningless and self-purges
--     after 90 days via the expires_at column (TTL — caller filters).
--   - On redemption: redeemed_at is set and redeemed_by_user_id links
--     the row to the new user. After redemption, the row is no longer
--     usable (uniqueness on code_hash + redeemed_at check).
--
-- Idempotent within the transaction. Run in Supabase Studio.

BEGIN;

CREATE TABLE IF NOT EXISTS loved_one_intake (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code_hash TEXT NOT NULL UNIQUE,

  -- CSO answers (Q1-Q8 of the quiz).
  relationship TEXT,        -- parent/spouse/sibling/friend/clergy/employer/other
  populations TEXT[],       -- multi-select, same six platform populations
  duration TEXT,            -- recent/months/year_or_two/many_years
  severity_signals TEXT[],  -- multi-select observed signals
  attempted_conversation TEXT,
  faith_context TEXT,       -- catholic_active/catholic_lapsed/other_faith/secular/unsure
  cso_state TEXT,           -- how the CSO themselves is doing
  goal TEXT,                -- learn / encourage / both

  -- Lifecycle.
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '90 days'),
  redeemed_at TIMESTAMPTZ,
  redeemed_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Lookup index — code redemption is the hot path.
CREATE INDEX IF NOT EXISTS idx_loved_one_intake_code_hash
  ON loved_one_intake (code_hash);

-- Index for the admin analytics view: redemption-rate calculations.
CREATE INDEX IF NOT EXISTS idx_loved_one_intake_created_at
  ON loved_one_intake (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_loved_one_intake_redeemed_by
  ON loved_one_intake (redeemed_by_user_id)
  WHERE redeemed_by_user_id IS NOT NULL;

ALTER TABLE loved_one_intake ENABLE ROW LEVEL SECURITY;

COMMIT;

-- Verify (run after the transaction):
--   SELECT COUNT(*) FROM loved_one_intake;        -- starts at 0
--   \d loved_one_intake
