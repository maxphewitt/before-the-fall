-- Task #45 — Community intentions wall (Walk Together)
--
-- A shared, ANONYMOUS wall of prayer intentions. Others tap "I'll pray for
-- this" to add a prayer. user_id is stored for moderation/safety only and is
-- NEVER shown to other users. Posts that trip the safety scanner are stored
-- with hidden = true (kept for review, not shown publicly) so a disclosure of
-- self-harm is never broadcast on a public wall.
--
-- community_intention_prayers dedupes the "I'll pray for this" tap per user.
--
-- Service-role only (RLS on, no policies). Idempotent.
-- Run in Supabase Studio (Production).

BEGIN;

CREATE TABLE IF NOT EXISTS community_intentions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body          TEXT NOT NULL,
  prayer_count  INTEGER NOT NULL DEFAULT 0,
  hidden        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT community_intention_len CHECK (char_length(body) BETWEEN 1 AND 280)
);

CREATE INDEX IF NOT EXISTS community_intentions_visible_idx
  ON community_intentions (created_at DESC) WHERE hidden = FALSE;

CREATE TABLE IF NOT EXISTS community_intention_prayers (
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  intention_id  UUID NOT NULL REFERENCES community_intentions(id) ON DELETE CASCADE,
  prayed_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, intention_id)
);

ALTER TABLE community_intentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_intention_prayers ENABLE ROW LEVEL SECURITY;

COMMIT;
