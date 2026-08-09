-- Task #47 — Monthly teaching-quiz scores + leaderboard (Walk Together)
--
-- One best-score row per (user, period), where period is a month key like
-- "2026-07". Powers the communal leaderboard for the month's teaching quiz.
-- This is a KNOWLEDGE game (learning His Word together) — deliberately NOT tied
-- to prayer or streaks, so the spiritual practice is never made competitive.
--
-- Numbers only. Service-role only (RLS on, no policies). Idempotent.
-- Run in Supabase Studio (Production).

BEGIN;

CREATE TABLE IF NOT EXISTS quiz_scores (
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  period      TEXT NOT NULL,
  score       SMALLINT NOT NULL,
  total       SMALLINT NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, period),
  CONSTRAINT quiz_score_range CHECK (score >= 0 AND score <= total AND total > 0 AND total <= 50)
);

CREATE INDEX IF NOT EXISTS quiz_scores_period_idx ON quiz_scores (period, score DESC);

ALTER TABLE quiz_scores ENABLE ROW LEVEL SECURITY;

COMMIT;
