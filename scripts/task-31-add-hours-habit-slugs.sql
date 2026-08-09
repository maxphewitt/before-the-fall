-- Task #31 — add missing habit_slug values to the CHECK constraints.
--
-- task-30's CHECK constraints on user_habits / habit_completions never
-- got updated after 'seven-sorrows' and now 'liturgy-of-hours' were
-- added to app/lib/habits.ts. Without this, any insert with
-- habit_slug = 'liturgy-of-hours' or 'seven-sorrows' is rejected by
-- Postgres. recordHabitCompletion() swallows that error (try/catch,
-- console.error only) so it does NOT block the Hour walker itself —
-- it just silently fails to log the completion on the closing screen.
--
-- Run this in Supabase Studio against production.

BEGIN;

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
    'seven-sorrows',
    'scripture',
    'liturgy-of-hours'
  ));

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
    'seven-sorrows',
    'scripture',
    'liturgy-of-hours'
  ));

COMMIT;

-- Note: task-30's constraints use the slug 'journal', but app/lib/habits.ts
-- uses 'field-journal' for that same habit. That mismatch predates this
-- change and isn't touched here — flagging in case it's also silently
-- failing to log. Worth a separate look.
