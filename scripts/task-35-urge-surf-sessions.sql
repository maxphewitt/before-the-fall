-- Task #35 — Urge Surfing ("Ride It Out") sessions
--
-- The narrator-guided urge-surfing tool is open-ended: the user stays
-- with the wave and decides when it's passed. The rich content they
-- enter — what was pulling at them, their reflections, their own notes —
-- is composed into a JOURNAL entry (journal_entries, via createToolSession).
--
-- This table stores the lightweight per-session facts that power
-- cross-session CONFIDENCE ("you've ridden out N urges; you've stayed a
-- total of X"): how long they stayed, which path, and how much they
-- engaged. No numeric "intensity" — the wave's arc is automatic, not a
-- score, and we never keep a shame-style counter.
--
-- Idempotent + defensive: safe to run whether or not an earlier draft of
-- this table exists. Service-role only (RLS on, no policy).
-- Run in Supabase Studio (Production).

BEGIN;

CREATE TABLE IF NOT EXISTS urge_surf_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  duration_seconds INT NOT NULL DEFAULT 0,
  path TEXT NOT NULL DEFAULT 'secular',
  trigger_count INT NOT NULL DEFAULT 0,
  reflection_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reconcile any earlier draft schema (intensity model) to this one.
ALTER TABLE urge_surf_sessions ADD COLUMN IF NOT EXISTS path TEXT NOT NULL DEFAULT 'secular';
ALTER TABLE urge_surf_sessions ADD COLUMN IF NOT EXISTS trigger_count INT NOT NULL DEFAULT 0;
ALTER TABLE urge_surf_sessions ADD COLUMN IF NOT EXISTS reflection_count INT NOT NULL DEFAULT 0;
ALTER TABLE urge_surf_sessions DROP COLUMN IF EXISTS start_intensity;
ALTER TABLE urge_surf_sessions DROP COLUMN IF EXISTS peak_intensity;
ALTER TABLE urge_surf_sessions DROP COLUMN IF EXISTS end_intensity;
ALTER TABLE urge_surf_sessions DROP COLUMN IF EXISTS samples;
ALTER TABLE urge_surf_sessions DROP COLUMN IF EXISTS outcome;

-- Path vocabulary.
ALTER TABLE urge_surf_sessions DROP CONSTRAINT IF EXISTS urge_surf_path_check;
ALTER TABLE urge_surf_sessions
  ADD CONSTRAINT urge_surf_path_check CHECK (path IN ('catholic', 'secular'));

CREATE INDEX IF NOT EXISTS idx_urge_surf_user_started
  ON urge_surf_sessions (user_id, started_at DESC);

ALTER TABLE urge_surf_sessions ENABLE ROW LEVEL SECURITY;
-- No RLS policy: only the service-role server reads/writes this table.

COMMIT;
