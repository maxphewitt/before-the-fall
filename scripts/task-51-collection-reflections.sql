-- Task #51 — Collection reflection space ("For where you are")
--
-- A shared, ANONYMOUS reflection space at the bottom of each collection
-- page (anxiety, grief, stillness, sleep). Others tap a small heart
-- ("With you") on a reflection. user_id is stored for moderation/safety
-- and dedupe only and is NEVER shown to other users.
--
-- Reflections FADE AFTER 7 DAYS. Two layers enforce this:
--   1. A pg_cron job (scheduled below, if the extension is available)
--      hard-deletes rows older than 7 days every day at 04:00.
--   2. The server action ALWAYS filters created_at > now() - interval
--      '7 days' on read, so even if pg_cron is unavailable the old rows
--      are never surfaced (belt and braces).
--
-- collection_reflection_hearts dedupes the heart tap per user.
--
-- Service-role only (RLS on, no policies). Idempotent.
-- Run in Supabase Studio (Production).

BEGIN;

CREATE TABLE IF NOT EXISTS collection_reflections (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  collection_slug  TEXT NOT NULL,
  body             TEXT NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT collection_reflection_len CHECK (char_length(body) BETWEEN 1 AND 500)
);

CREATE INDEX IF NOT EXISTS collection_reflections_slug_created_idx
  ON collection_reflections (collection_slug, created_at DESC);

CREATE TABLE IF NOT EXISTS collection_reflection_hearts (
  reflection_id  UUID NOT NULL REFERENCES collection_reflections(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hearted_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (reflection_id, user_id)
);

ALTER TABLE collection_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_reflection_hearts ENABLE ROW LEVEL SECURITY;

COMMIT;

-- 7-day sweep via pg_cron, OUTSIDE the transaction and inside a DO block
-- so the migration still succeeds on databases where pg_cron isn't
-- installed/allowed (e.g. local dev). Reads are filtered to the last 7
-- days in the server action regardless, so this job is cleanup, not the
-- only line of defense. cron.schedule() with a job name is idempotent —
-- rescheduling the same name replaces the job.
DO $$
BEGIN
  BEGIN
    CREATE EXTENSION IF NOT EXISTS pg_cron;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'pg_cron extension unavailable — skipping scheduled sweep (reads are 7-day filtered in the app).';
  END;

  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule(
      'collection-reflections-7day-sweep',
      '0 4 * * *',
      $job$ DELETE FROM collection_reflections WHERE created_at < now() - interval '7 days' $job$
    );
  END IF;
END
$$;
