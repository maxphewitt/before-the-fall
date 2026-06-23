-- Task #38 — Shared before/after "charge" state checks
--
-- A single, comparable signal emitted by every self-help tool: an
-- optional 0–10 "how charged do you feel" rating, taken before and/or
-- after a tool session. This is the cross-tool spine for benefit-over-
-- time tracking and the future "what helps you, when" recommendation
-- layer (e.g. "grounding reliably brings you down late at night").
--
-- DESIGN NOTES (read before using this data):
--   * This is a SUDS-style SELF-REPORT. It is a self-monitoring signal,
--     NOT a clinical outcome measure, and aggregate before→after drops
--     are NOT proof a tool "works" (self-report is prone to demand
--     effects). Surface it to users as "notice your own change", never
--     as efficacy data or a clinical claim.
--   * Numbers only — no words. The user's own language lives, encrypted,
--     in journal_entries (via createToolSession). This table holds only
--     the low-sensitivity numeric facts so insights can be computed
--     without decrypting anyone's journal.
--   * time_of_day is a COARSE local bucket computed on-device, not a
--     precise timestamp or location.
--
-- Idempotent + defensive: safe to run whether or not an earlier draft
-- exists. Service-role only (RLS on, no policy). Run in Supabase Studio.

BEGIN;

CREATE TABLE IF NOT EXISTS state_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tool_slug TEXT NOT NULL,
  -- Link back to the journal entry this check belongs to (optional; a
  -- check can exist without a saved entry if the user skipped the words).
  source_journal_id UUID NULL REFERENCES journal_entries(id) ON DELETE SET NULL,
  charge_before SMALLINT NULL,
  charge_after SMALLINT NULL,
  time_of_day TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reconcile any earlier draft schema.
ALTER TABLE state_checks ADD COLUMN IF NOT EXISTS source_journal_id UUID NULL;
ALTER TABLE state_checks ADD COLUMN IF NOT EXISTS charge_before SMALLINT NULL;
ALTER TABLE state_checks ADD COLUMN IF NOT EXISTS charge_after SMALLINT NULL;
ALTER TABLE state_checks ADD COLUMN IF NOT EXISTS time_of_day TEXT NULL;

-- 0–10 range (nullable: either side may be skipped).
ALTER TABLE state_checks DROP CONSTRAINT IF EXISTS state_checks_before_range;
ALTER TABLE state_checks
  ADD CONSTRAINT state_checks_before_range
  CHECK (charge_before IS NULL OR (charge_before >= 0 AND charge_before <= 10));
ALTER TABLE state_checks DROP CONSTRAINT IF EXISTS state_checks_after_range;
ALTER TABLE state_checks
  ADD CONSTRAINT state_checks_after_range
  CHECK (charge_after IS NULL OR (charge_after >= 0 AND charge_after <= 10));

-- Coarse time-of-day vocabulary.
ALTER TABLE state_checks DROP CONSTRAINT IF EXISTS state_checks_time_of_day_check;
ALTER TABLE state_checks
  ADD CONSTRAINT state_checks_time_of_day_check
  CHECK (
    time_of_day IS NULL OR time_of_day IN (
      'early-morning', 'morning', 'afternoon', 'evening', 'night', 'late-night'
    )
  );

CREATE INDEX IF NOT EXISTS idx_state_checks_user_tool_created
  ON state_checks (user_id, tool_slug, created_at DESC);

ALTER TABLE state_checks ENABLE ROW LEVEL SECURITY;
-- No RLS policy: only the service-role server reads/writes this table.

COMMIT;
