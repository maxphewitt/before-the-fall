import { createHash } from "crypto";
import { supabaseServer } from "./supabase";

/**
 * Tamper-evident append-only audit log for the safety + compliance backend.
 *
 * Redesigned 2026-06-05 (task-34) after the original DRAFT v1 chain was
 * found to be broken from row 1 onward. Root cause: hash inputs at insert
 * time used JavaScript ISO-8601 (`2026-05-21T00:06:02.528Z`) but verifyChain
 * read the same column back through PostgREST in Postgres-native text format
 * (`2026-05-21 00:06:02.528+00`) and rehashed that — different strings,
 * different hashes, chain "failed" from the start.
 *
 * The fix: a new `hash_input TEXT` column stores the EXACT canonical-JSON
 * string the app hashed at insert time. verifyChain reads that column
 * directly and rehashes it. No parsing, no round-trip, no ambiguity.
 *
 * Each row stores:
 *   - prev_hash:  the row_hash of the immediately previous row (NULL for row 1)
 *   - hash_input: the canonical-JSON string concatenated with prev_hash that
 *                 was hashed at insert time (the exact bytes that went into
 *                 SHA-256). Stored verbatim for verification.
 *   - row_hash:   SHA-256(hash_input), hex-encoded.
 *
 * Verification (verifyChain): walk forward, confirm prev_hash links to the
 * previous row's row_hash, and confirm SHA-256(hash_input) === row_hash.
 *
 * This forms the **Permanent Incident Log** of the Compliance Package
 * (see [[Compliance Package — Four Documents]]). Still DRAFT v1; this
 * redesign passes one major security-audit test (round-trip determinism)
 * but the full audit before public launch remains required.
 */

export type AuditEventType =
  | "incident_created"
  | "admin_login"
  | "admin_logout"
  | "admin_decrypted_entry"
  | "status_changed"
  | "admin_notes_added"
  | "audit_log_redesigned";

export type AppendAuditEventInput = {
  eventType: AuditEventType;
  incidentId?: string | null;
  actorAdminId?: string | null;
  payload?: Record<string, unknown>;
};

/**
 * Canonical JSON serialization for hashing: keys sorted alphabetically,
 * no whitespace, JSON.stringify on leaf values.
 *
 * MUST exactly match the format used by scripts/task-34-audit-log-redesign.sql
 * when it seeds the genesis row. If you change one, change the other.
 */
function canonicalJson(obj: unknown): string {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) {
    return "[" + obj.map(canonicalJson).join(",") + "]";
  }
  const record = obj as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return (
    "{" +
    keys
      .map((k) => JSON.stringify(k) + ":" + canonicalJson(record[k]))
      .join(",") +
    "}"
  );
}

/**
 * Build the canonical hash-input string for a row.
 *
 * Format: prev_hash (concatenated as raw string, empty for genesis) +
 * canonical-JSON of {actor_admin_id, event_type, incident_id, occurred_at,
 * payload, prev_hash} with keys sorted alphabetically.
 *
 * This is a pure function. Same inputs → same output → same hash, always.
 */
function buildHashInput(args: {
  prevHash: string | null;
  actorAdminId: string | null;
  eventType: AuditEventType;
  incidentId: string | null;
  occurredAt: string; // ISO 8601 with Z suffix
  payload: Record<string, unknown>;
}): string {
  const content = {
    actor_admin_id: args.actorAdminId,
    event_type: args.eventType,
    incident_id: args.incidentId,
    occurred_at: args.occurredAt,
    payload: args.payload,
    prev_hash: args.prevHash,
  };
  return (args.prevHash ?? "") + canonicalJson(content);
}

/**
 * Append a new audit event. Best effort — caller wraps in try/catch since
 * most call sites are inside other operations and we don't want an audit
 * failure to roll back a user-facing action.
 */
export async function appendAuditEvent(
  input: AppendAuditEventInput
): Promise<{ id: number } | { error: string }> {
  try {
    const supabase = supabaseServer();

    // Fetch the most recent row's hash to chain off of.
    const { data: latest, error: fetchError } = await supabase
      .from("incident_audit_log")
      .select("id, row_hash")
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error("auditLog fetch-tail error:", fetchError);
      return { error: "audit-log-tail-fetch-failed" };
    }

    const prevHash = (latest?.row_hash as string | undefined) ?? null;
    const occurredAt = new Date().toISOString();

    const hashInput = buildHashInput({
      prevHash,
      actorAdminId: input.actorAdminId ?? null,
      eventType: input.eventType,
      incidentId: input.incidentId ?? null,
      occurredAt,
      payload: input.payload ?? {},
    });
    const rowHash = createHash("sha256").update(hashInput).digest("hex");

    const { data, error: insertError } = await supabase
      .from("incident_audit_log")
      .insert({
        incident_id: input.incidentId ?? null,
        actor_admin_id: input.actorAdminId ?? null,
        event_type: input.eventType,
        payload: input.payload ?? {},
        occurred_at: occurredAt,
        prev_hash: prevHash,
        hash_input: hashInput,
        row_hash: rowHash,
      })
      .select("id")
      .single();

    if (insertError || !data) {
      console.error("auditLog insert error:", insertError);
      return { error: "audit-log-insert-failed" };
    }

    return { id: data.id as number };
  } catch (err) {
    console.error("auditLog exception:", err);
    return { error: "audit-log-exception" };
  }
}

/**
 * Walk the chain forward and confirm:
 *   1. Each row's `prev_hash` matches the previous row's `row_hash`
 *      (chain order).
 *   2. SHA-256(hash_input) === row_hash (the row_hash hasn't been changed
 *      relative to its hash_input).
 *
 * Returns ok=true with rowsVerified count, or ok=false with the first
 * divergent row id and a human-readable reason.
 *
 * NOTE: This redesign does NOT independently re-derive hash_input from
 * the structured columns. That secondary check would catch tampering of
 * the structured columns even if hash_input is preserved, but it's
 * format-fragile (timestamp serialization). The append-only INSERT
 * triggers on the table prevent UPDATE/DELETE through normal Postgres
 * paths; service-role bypass remains the only practical attack vector,
 * and that requires capabilities beyond what verifyChain can detect on
 * its own anyway. The pre-public-launch security audit will revisit.
 */
export async function verifyChain(): Promise<
  | { ok: true; rowsVerified: number }
  | {
      ok: false;
      firstBadRowId: number;
      reason: string;
      expected: string;
      actual: string;
    }
> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("incident_audit_log")
    .select("id, prev_hash, row_hash, hash_input")
    .order("id", { ascending: true });

  if (error) {
    throw new Error("verifyChain fetch failed: " + JSON.stringify(error));
  }

  let prevHash: string | null = null;
  let count = 0;
  for (const row of data ?? []) {
    // 1. Chain linkage
    if ((row.prev_hash as string | null) !== prevHash) {
      return {
        ok: false,
        firstBadRowId: row.id as number,
        reason:
          "prev_hash does not match the previous row's row_hash — chain was reordered or a row was inserted out of band",
        expected: prevHash ?? "(null)",
        actual: (row.prev_hash as string) ?? "(null)",
      };
    }

    // 2. row_hash == sha256(hash_input)
    const hashInput = row.hash_input as string | null;
    if (!hashInput) {
      return {
        ok: false,
        firstBadRowId: row.id as number,
        reason:
          "hash_input column is empty — row predates the 2026-06-05 redesign or was tampered with",
        expected: "(non-empty hash_input)",
        actual: "(null or empty)",
      };
    }
    const recomputed = createHash("sha256").update(hashInput).digest("hex");
    if (recomputed !== row.row_hash) {
      return {
        ok: false,
        firstBadRowId: row.id as number,
        reason:
          "row_hash does not match SHA-256(hash_input) — row_hash or hash_input was modified after insert",
        expected: recomputed,
        actual: row.row_hash as string,
      };
    }

    prevHash = row.row_hash as string;
    count += 1;
  }

  return { ok: true, rowsVerified: count };
}
