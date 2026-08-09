-- Task #52 — Check-ins (the returning-user welfare check)
--
-- One row per completed check-in at /check-in. This is a WELFARE CHECK,
-- never an attendance record: days_away is stored as a structured signal
-- for the future AI progress companion (Max's 2026-07-28 vision), and is
-- NEVER surfaced back to the user as a count ("you've been gone N days"
-- framing is banned by the 2026-07-28 Platform Audit).
--
-- PRIVACY RULE: raw journal text NEVER lands in this table. Anything the
-- user writes during a check-in flows through the encrypted journal
-- (journal_entries via createEntry). Only structured, non-textual signals
-- live here:
--   days_away  — full days since the last active day before this return
--   mood       — the answer to "How are you, really?"
--   branch     — which branch of the flow they walked (e.g. 'fell:faith')
--   next_step  — the small next step they chose ('tool-now'|'keep-habit'|'rest')
--
-- Service-role only (RLS on, no policies). Idempotent.
-- Run in Supabase Studio (Production).

BEGIN;

CREATE TABLE IF NOT EXISTS check_ins (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  days_away   INTEGER NOT NULL,
  mood        TEXT NOT NULL CHECK (mood IN ('steady', 'wobbly', 'struggling', 'fell')),
  branch      TEXT,
  next_step   TEXT
);

CREATE INDEX IF NOT EXISTS idx_check_ins_user_created
  ON check_ins (user_id, created_at DESC);

ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

-- No RLS policy added: only the service-role server reads/writes this
-- table (app/actions/checkIns.ts via supabaseServer()). End users never
-- touch it directly.

COMMIT;
