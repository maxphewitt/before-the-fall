-- Task #39 — Urge surfing: acceptance-based tracking (no intensity)
--
-- Enriches urge_surf_sessions with two NON-intensity signals, chosen
-- specifically because they fit an acceptance-based technique (urge
-- surfing changes your relationship to an urge; it does NOT try to shrink
-- it). See the vault note "Urge-surfing tracking" for the evidence.
--
--   * coping_confidence (0–100): situational self-efficacy — "how able do
--     you feel to handle urges like this?" A rising-is-good signal (the
--     opposite of an intensity score). Validated lineage: BSCQ / DTCQ /
--     abstinence self-efficacy scales.
--   * outcome: a neutral, EQUAL-WEIGHT category — rode_it_out / stepped_away
--     / acted_on_it. Per the Abstinence Violation Effect literature, a slip
--     must be a logged act of showing up, never a failure or streak-break.
--     (An intensity-era `outcome` column was dropped in task-35; this one is
--     a clean, shame-free three-way.)
--
-- We deliberately do NOT add any urge-intensity column. Do not add one.
--
-- Idempotent + defensive. Service-role only (RLS already on from task-35).
-- Run in Supabase Studio (Production).

BEGIN;

ALTER TABLE urge_surf_sessions
  ADD COLUMN IF NOT EXISTS coping_confidence SMALLINT NULL;
ALTER TABLE urge_surf_sessions
  ADD COLUMN IF NOT EXISTS outcome TEXT NULL;

-- 0–100 confidence (nullable: always skippable).
ALTER TABLE urge_surf_sessions DROP CONSTRAINT IF EXISTS urge_surf_confidence_range;
ALTER TABLE urge_surf_sessions
  ADD CONSTRAINT urge_surf_confidence_range
  CHECK (coping_confidence IS NULL OR (coping_confidence >= 0 AND coping_confidence <= 100));

-- Neutral, equal-weight outcome vocabulary (nullable: always skippable).
ALTER TABLE urge_surf_sessions DROP CONSTRAINT IF EXISTS urge_surf_outcome_check;
ALTER TABLE urge_surf_sessions
  ADD CONSTRAINT urge_surf_outcome_check
  CHECK (outcome IS NULL OR outcome IN ('rode_it_out', 'stepped_away', 'acted_on_it'));

COMMIT;
