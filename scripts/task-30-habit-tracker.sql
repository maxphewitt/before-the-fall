-- Task #30 — Habit Tracker + Analytics
--
-- Three additions:
--   1. `user_habits` — per-user habit list (which habits each user is
--      tracking, in what order). Populated at onboarding from the
--      population→defaults mapping in app/lib/habits.ts, editable
--      thereafter via /today/edit.
--   2. `habit_completions` — append-only log of habit completion events.
--      Inserted by the various walker close screens and by createEntry
--      (for the `journal` habit). The /today page reads from this to
--      decide today's checkmarks and to compute streak metrics.
--   3. `journal_entries.word_count` + `tool_slug` — small denormalization
--      so we don't have to decrypt entries to count words or filter
--      by tool. word_count is computed at write time; tool_slug is
--      populated only for journal_type='activity' from the structured
--      tool-session payload.
--
-- Idempotent within the transaction.
--
-- Run this in Supabase Studio against production BEFORE the next push.

BEGIN;

-- ─── 1. user_habits ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  habit_slug TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- CHECK constraint (drop + recreate so the slug list can evolve).
ALTER TABLE user_habits
  DROP CONSTRAINT IF EXISTS user_habits_slug_check;

ALTER TABLE user_habits
  ADD CONSTRAINT user_habits_slug_check
  CHECK (habit_slug IN (
    'stop',
    'urge-surfing',
    'box-breathing',
    'grounding',
    'tipp',
    'thought-record',
    'journal',
    'prayer',
    'rosary',
    'scripture'
  ));

-- One active habit per slug per user. Soft-delete preserves history.
CREATE UNIQUE INDEX IF NOT EXISTS uniq_user_habits_active
  ON user_habits (user_id, habit_slug)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_user_habits_user
  ON user_habits (user_id)
  WHERE deleted_at IS NULL;

ALTER TABLE user_habits ENABLE ROW LEVEL SECURITY;

-- ─── 2. habit_completions ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS habit_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  habit_slug TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source_journal_id UUID REFERENCES journal_entries(id) ON DELETE SET NULL
);

ALTER TABLE habit_completions
  DROP CONSTRAINT IF EXISTS habit_completions_slug_check;

ALTER TABLE habit_completions
  ADD CONSTRAINT habit_completions_slug_check
  CHECK (habit_slug IN (
    'stop',
    'urge-surfing',
    'box-breathing',
    'grounding',
    'tipp',
    'thought-record',
    'journal',
    'prayer',
    'rosary',
    'scripture'
  ));

-- Hot path: "which completions today for this user, by habit?"
CREATE INDEX IF NOT EXISTS idx_habit_completions_user_date
  ON habit_completions (user_id, completed_at DESC);

CREATE INDEX IF NOT EXISTS idx_habit_completions_user_slug_date
  ON habit_completions (user_id, habit_slug, completed_at DESC);

-- For analytics: aggregate over all users by completion date.
CREATE INDEX IF NOT EXISTS idx_habit_completions_date
  ON habit_completions (completed_at DESC);

ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

-- ─── 3. journal_entries.word_count + tool_slug ─────────────────────

ALTER TABLE journal_entries
  ADD COLUMN IF NOT EXISTS word_count INT NOT NULL DEFAULT 0;

ALTER TABLE journal_entries
  ADD COLUMN IF NOT EXISTS tool_slug TEXT;

-- Optional CHECK on tool_slug so it matches the tool set we ship.
ALTER TABLE journal_entries
  DROP CONSTRAINT IF EXISTS journal_entries_tool_slug_check;

ALTER TABLE journal_entries
  ADD CONSTRAINT journal_entries_tool_slug_check
  CHECK (tool_slug IS NULL OR tool_slug IN (
    'stop',
    'urge-surfing',
    'box-breathing',
    'grounding',
    'tipp',
    'thought-record'
  ));

COMMIT;

-- Verify (run after the transaction):
--   SELECT COUNT(*) FROM user_habits;        -- starts at 0
--   SELECT COUNT(*) FROM habit_completions;  -- starts at 0
--   \d journal_entries
