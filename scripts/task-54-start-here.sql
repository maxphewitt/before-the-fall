-- task-54 (2026-08-09): Start Here orientation module progress.
-- One row per completed session per user per track. Sequential unlock is
-- derived (session n playable when n = 1 or n-1 has a row). Idempotent.
--
-- Run in Supabase Studio SQL editor. Small — fits the editor fine.

create table if not exists start_here_progress (
  user_id uuid not null,
  track text not null check (track in ('catholic', 'secular')),
  session_n int not null check (session_n between 1 and 20),
  completed_at timestamptz not null default now(),
  primary key (user_id, track, session_n)
);

-- Service-role access only (same posture as the other fact tables):
-- RLS on, no anon policies.
alter table start_here_progress enable row level security;
