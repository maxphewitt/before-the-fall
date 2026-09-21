-- task-55 (2026-08-11): Fasting Seasons — the day-X-of-Y fasting/abstinence
-- tracker (Lent, St. Michael's Lent, Advent, custom seasons; secular
-- discipline challenges reuse kind='custom').
--
-- Mercy rules (Max, 2026-08-11): the season NEVER resets — fallen days are
-- marked, the journey keeps going. "Strict" (display-only current-run reset)
-- exists ONLY for custom seasons, by explicit user election. What the user
-- is fasting from is SENSITIVE and stored encrypted (same AES-256-GCM key
-- as the journal) — never plaintext.
--
-- Idempotent. Run in Supabase Studio SQL editor.

create table if not exists fasting_seasons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  kind text not null check (kind in ('lent', 'st-michaels-lent', 'advent', 'custom')),
  -- Encrypted "what I'm offering / fasting from" (journalCrypto payload).
  title_ciphertext text not null,
  title_iv text not null,
  title_auth_tag text not null,
  start_date date not null,
  end_date date not null,
  -- Strict mode: user elected (custom seasons only) to have the visible
  -- "current run" counter restart after a stumble. Derived at display
  -- time — nothing in the data ever resets.
  strict boolean not null default false,
  created_at timestamptz not null default now(),
  -- Set when the user ends/abandons the season early. Null = live.
  ended_at timestamptz
);

create index if not exists fasting_seasons_user_idx
  on fasting_seasons (user_id, end_date);

create table if not exists fasting_season_days (
  season_id uuid not null references fasting_seasons(id) on delete cascade,
  day date not null,
  status text not null check (status in ('kept', 'stumbled')),
  marked_at timestamptz not null default now(),
  primary key (season_id, day)
);

-- Service-role access only (same posture as the other fact tables).
alter table fasting_seasons enable row level security;
alter table fasting_season_days enable row level security;
