-- Task #37 — Field Journal becomes a mandatory habit; retire 'journal'
--
-- The standalone "Journal" habit (→ /journal/new) is redundant now that
-- freeform journaling lives INSIDE the Field Journal (/field-journal/daily).
-- This:
--   1. Allows 'field-journal' in the habit CHECK constraints (keeps
--      'journal' allowed so historical rows stay valid).
--   2. Backfills 'field-journal' as a mandatory habit for every existing
--      user (display_order -1 so it sorts first). New users get it from
--      defaultHabitsForUser().
--   3. Soft-deletes any existing 'journal' habit rows.
--
-- Idempotent. Run in Supabase Studio (Production).

BEGIN;

-- 1. CHECK constraints — add 'field-journal' (keep the rest).
ALTER TABLE user_habits DROP CONSTRAINT IF EXISTS user_habits_slug_check;
ALTER TABLE user_habits ADD CONSTRAINT user_habits_slug_check CHECK (habit_slug IN (
  'stop','urge-surfing','box-breathing','grounding','tipp','thought-record',
  'journal','field-journal','prayer','rosary','scripture'
));

ALTER TABLE habit_completions DROP CONSTRAINT IF EXISTS habit_completions_slug_check;
ALTER TABLE habit_completions ADD CONSTRAINT habit_completions_slug_check CHECK (habit_slug IN (
  'stop','urge-surfing','box-breathing','grounding','tipp','thought-record',
  'journal','field-journal','prayer','rosary','scripture'
));

-- 2. Backfill the mandatory Field Journal habit for every user.
INSERT INTO user_habits (user_id, habit_slug, display_order)
SELECT u.id, 'field-journal', -1
FROM users u
WHERE NOT EXISTS (
  SELECT 1 FROM user_habits h
  WHERE h.user_id = u.id AND h.habit_slug = 'field-journal' AND h.deleted_at IS NULL
);

-- 3. Retire the redundant standalone 'journal' habit.
UPDATE user_habits
SET deleted_at = now()
WHERE habit_slug = 'journal' AND deleted_at IS NULL;

COMMIT;
