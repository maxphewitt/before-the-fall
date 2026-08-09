-- Task #53 — Bible reader upgrade (resume position + highlights)
--
-- Two tables backing the upgraded Douay-Rheims reader:
--
--   bible_positions   — one row per user: exactly where they left off.
--                       Opening /catholic-path/bible/read redirects here
--                       (or to Genesis 1 for first-timers).
--
--   bible_highlights  — per-verse character-range highlights. A selection
--                       spanning multiple verses is stored as one row per
--                       verse. Offsets (start_off/end_off) are plain-text
--                       character offsets WITHIN the verse text (verse
--                       numbers excluded), computed client-side with the
--                       cloneRange/selectNodeContents technique so nested
--                       <mark> nodes never corrupt them. 'bold' is a
--                       style, not a background color — it renders as
--                       font-bold text.
--
-- PRIVACY: no scripture text is stored — only (book, chapter, verse,
-- offsets). Notes a user writes about a passage go through the encrypted
-- journal (journal_entries via createEntry), never these tables.
--
-- Service-role only (RLS on, no policies). Idempotent.
-- Run in Supabase Studio (Production).

BEGIN;

CREATE TABLE IF NOT EXISTS bible_positions (
  user_id     UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  book_slug   TEXT NOT NULL,
  chapter     INTEGER NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE bible_positions ENABLE ROW LEVEL SECURITY;

-- No RLS policy added: only the service-role server reads/writes this
-- table (app/actions/bibleReader.ts via supabaseServer()). End users
-- never touch it directly.

CREATE TABLE IF NOT EXISTS bible_highlights (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book_slug   TEXT NOT NULL,
  chapter     INTEGER NOT NULL,
  verse       INTEGER NOT NULL,
  start_off   INTEGER NOT NULL,
  end_off     INTEGER NOT NULL,
  color       TEXT NOT NULL CHECK (color IN ('gold', 'sky', 'rose', 'green', 'bold')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- The reader loads one chapter's highlights at a time.
CREATE INDEX IF NOT EXISTS idx_bible_highlights_user_book_chapter
  ON bible_highlights (user_id, book_slug, chapter);

ALTER TABLE bible_highlights ENABLE ROW LEVEL SECURITY;

-- No RLS policy added (same service-role-only pattern as above).

COMMIT;
