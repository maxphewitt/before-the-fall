-- Task #22 — Journal type organization
--
-- Adds a `journal_type` column to `journal_entries` to support grouping
-- entries by type in the UI (Daily, Reflection, Activity, Note, Intention)
-- and to give a future AI companion a structured handle on which entries
-- are tool-session records vs. freeform writing.
--
-- The encrypted body remains the only place user content lives. For
-- Activity entries created via the Self-Help Tool Walker, the encrypted
-- body holds a JSON payload (steps + user answers + completion metadata),
-- decrypted server-side at read time. journal_type is intentionally
-- plaintext for indexing / filtering.
--
-- Existing rows backfill to 'daily' (the implicit pre-migration type).
--
-- Run this in Supabase Studio against the production project ONCE.
-- Idempotent at the column level (IF NOT EXISTS); the CHECK constraint
-- is dropped + recreated to keep the allowed-values list authoritative.

BEGIN;

ALTER TABLE journal_entries
  ADD COLUMN IF NOT EXISTS journal_type TEXT NOT NULL DEFAULT 'daily';

-- Drop the constraint if it already exists, then recreate with the
-- current allowed-values list. Lets us evolve the enum later without a
-- separate migration.
ALTER TABLE journal_entries
  DROP CONSTRAINT IF EXISTS journal_entries_journal_type_check;

ALTER TABLE journal_entries
  ADD CONSTRAINT journal_entries_journal_type_check
  CHECK (journal_type IN (
    'daily',
    'reflection',
    'activity',
    'note',
    'intention'
  ));

-- Backfill: any pre-existing rows are 'daily' by default already (the
-- column default applies on insert). No backfill UPDATE needed because
-- the column was NOT NULL DEFAULT 'daily' from the start.

-- Index for the grouped journal list view. Filters by user_id + type +
-- created_at desc; the deleted_at predicate keeps the index small.
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_type_created
  ON journal_entries (user_id, journal_type, created_at DESC)
  WHERE deleted_at IS NULL;

COMMIT;

-- Verify (run after the transaction):
--   SELECT journal_type, COUNT(*) FROM journal_entries GROUP BY 1;
--   \d journal_entries
