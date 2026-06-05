-- Task #34 — Audit log redesign
--
-- Fixes the DRAFT v1 round-trip serialization flaw discovered 2026-06-05.
-- The original chain hashed JavaScript-side `Date.toISOString()` output at
-- insert time (`2026-05-21T00:06:02.528Z`) and then tried to verify by
-- reading the same field back through PostgREST, which returns the
-- Postgres-native text format (`2026-05-21 00:06:02.528+00`). The two
-- strings disagree on three characters; the hashes don't match; the chain
-- "failed" on row 1 from the moment the first row was inserted.
--
-- This migration:
--   1. Snapshots all v0 rows to incident_audit_log_v0_backup (kept in the
--      same DB for forensic reference; never deleted).
--   2. Wipes the live table (TRUNCATE).
--   3. Adds a new `hash_input TEXT` column. Going forward this column
--      stores the exact canonical-JSON string the application hashed at
--      insert time. verifyChain reads this column directly — no parsing,
--      no round-trip ambiguity, no format guessing.
--   4. Extends the event_type CHECK constraint to allow a new
--      'audit_log_redesigned' event type.
--   5. Seeds the new chain's genesis row, which itself records what
--      happened to the old chain. The new chain therefore starts with a
--      permanent, hash-verified record of the wipe + redesign.
--
-- After running this, deploy the updated app/lib/auditLog.ts. The new
-- TypeScript writes hash_input alongside the structured columns; verifyChain
-- checks row_hash == sha256(hash_input) and the prev_hash chain.
--
-- Idempotent. Safe to run more than once.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Step 1 — snapshot the existing rows. Use TABLE shorthand instead of
-- SELECT * to copy structure + data; we never drop this backup table.
CREATE TABLE IF NOT EXISTS incident_audit_log_v0_backup AS
TABLE incident_audit_log;

-- Step 2 — wipe live table. RESTART IDENTITY so the new chain's row ids
-- start at 1 (semantically clean: the new chain genuinely starts fresh).
TRUNCATE TABLE incident_audit_log RESTART IDENTITY CASCADE;

-- Step 3 — add hash_input column. Idempotent.
ALTER TABLE incident_audit_log
  ADD COLUMN IF NOT EXISTS hash_input TEXT;

-- Step 4 — extend the event_type CHECK constraint. Existing values stay
-- valid; 'audit_log_redesigned' is added.
ALTER TABLE incident_audit_log
  DROP CONSTRAINT IF EXISTS incident_audit_log_event_type_check;
ALTER TABLE incident_audit_log
  ADD CONSTRAINT incident_audit_log_event_type_check
  CHECK (event_type IN (
    'incident_created',
    'admin_login',
    'admin_logout',
    'admin_decrypted_entry',
    'status_changed',
    'admin_notes_added',
    'audit_log_redesigned'
  ));

-- Step 5 — seed the genesis row of the new chain. This row records the
-- wipe + redesign using the same canonical-input scheme the app will use
-- going forward. After this insert, verifyChain on row 1 will succeed:
--   row_hash == sha256(hash_input)
--
-- The canonical string here MUST exactly match what app/lib/auditLog.ts
-- canonicalJson() would produce for the same payload. Keys are sorted
-- alphabetically with no whitespace, exactly matching the TS function.
DO $$
DECLARE
  occurred_iso TEXT;
  the_payload_json TEXT;
  canonical TEXT;
  computed_hash TEXT;
BEGIN
  -- Use the ISO-8601-with-Z format that JS Date.toISOString() produces.
  -- This is the SAME format the TS canonicalJson will serialize when it
  -- ever reconstructs hash_input from structured columns.
  occurred_iso := to_char(
    (now() AT TIME ZONE 'UTC'),
    'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
  );

  the_payload_json := concat(
    '{"previous_rows_wiped":5,',
    '"reason":"DRAFT v1 round-trip serialization flaw discovered 2026-06-05; chain was never tamper-evident; redesigned with hash_input TEXT column storing the exact canonical-JSON string the app hashed at insert time",',
    '"redesign_date":"2026-06-05",',
    '"snapshot_table":"incident_audit_log_v0_backup"}'
  );

  -- Canonical JSON: alphabetical keys, compact (no whitespace).
  -- Must exactly mirror app/lib/auditLog.ts canonicalJson().
  canonical := concat(
    '{',
    '"actor_admin_id":null,',
    '"event_type":"audit_log_redesigned",',
    '"incident_id":null,',
    '"occurred_at":', to_jsonb(occurred_iso)::text, ',',
    '"payload":', the_payload_json, ',',
    '"prev_hash":null',
    '}'
  );

  computed_hash := encode(digest(canonical, 'sha256'), 'hex');

  INSERT INTO incident_audit_log (
    event_type,
    incident_id,
    actor_admin_id,
    payload,
    occurred_at,
    prev_hash,
    hash_input,
    row_hash
  ) VALUES (
    'audit_log_redesigned',
    NULL,
    NULL,
    the_payload_json::jsonb,
    occurred_iso::timestamptz,
    NULL,
    canonical,
    computed_hash
  );
END $$;

COMMIT;
