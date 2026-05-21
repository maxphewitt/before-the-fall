import { createHash } from "crypto";
import { supabaseServer } from "./supabase";

/**
 * Tamper-evident append-only audit log for the safety + compliance backend.
 *
 * Each row stores:
 *   - prev_hash: the row_hash of the immediately previous row (NULL for row 1)
 *   - row_hash: SHA-256( prev_hash || canonical_json(content) )
 *
 * Verification (verifyChain): walk forward, recompute each row_hash, compare.
 * If any row was modified, all subsequent row_hashes diverge.
 *
 * This forms the **Permanent Incident Log** of the Compliance Package
 * (see [[Compliance Package — Four Documents]]). DRAFT v1; verify under
 * security audit before public launch.
 */

export type AuditEventType =
  | "incident_created"
  | "admin_login"
  | "admin_logout"
  | "admin_decrypted_entry"
  | "status_changed"
  | "admin_notes_added";

export type AppendAuditEventInput = {
  eventType: AuditEventType;
  incidentId?: string | null;
  actorAdminId?: string | null;
  payload?: Record<string, unknown>;
};

/**
 * Canonical JSON serialization for hashing: keys sorted, no whitespace.
 * Critical that this is stable — any drift between write and verify
 * paths means the chain "looks" broken.
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

function computeRowHash(
  prevHash: string | null,
  content: Record<string, unknown>
): string {
  const input = (prevHash ?? "") + canonicalJson(content);
  return createHash("sha256").update(input).digest("hex");
}

/**
 * Append a new audit event. Best effort — caller wraps in try/catch
 * since most call sites are inside other operations and we don't want
 * an audit failure to roll back a user-facing action. The hash chain's
 * unique row_hash constraint protects against double-writes.
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

    const prevHash = latest?.row_hash ?? null;
    const occurredAt = new Date().toISOString();

    // Content that gets hashed. Includes everything except row_hash itself.
    const content = {
      incident_id: input.incidentId ?? null,
      actor_admin_id: input.actorAdminId ?? null,
      event_type: input.eventType,
      payload: input.payload ?? {},
      occurred_at: occurredAt,
      prev_hash: prevHash,
    };

    const rowHash = computeRowHash(prevHash, content);

    const { data, error: insertError } = await supabase
      .from("incident_audit_log")
      .insert({
        incident_id: input.incidentId ?? null,
        actor_admin_id: input.actorAdminId ?? null,
        event_type: input.eventType,
        payload: input.payload ?? {},
        occurred_at: occurredAt,
        prev_hash: prevHash,
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
 * Walk the chain forward and confirm every row's row_hash matches what
 * a recompute would produce. O(n) — meant for periodic integrity checks,
 * not for hot-path use.
 *
 * Returns the id of the first divergent row, or null if the chain is intact.
 */
export async function verifyChain(): Promise<
  { ok: true } | { ok: false; firstBadRowId: number; expected: string; actual: string }
> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("incident_audit_log")
    .select(
      "id, incident_id, actor_admin_id, event_type, payload, occurred_at, prev_hash, row_hash"
    )
    .order("id", { ascending: true });

  if (error) {
    throw new Error("verifyChain fetch failed: " + JSON.stringify(error));
  }

  let prevHash: string | null = null;
  for (const row of data ?? []) {
    if (row.prev_hash !== prevHash) {
      // Chain break — this row claims a different predecessor than the
      // one we just verified.
      const expected = computeRowHash(prevHash, {
        incident_id: row.incident_id,
        actor_admin_id: row.actor_admin_id,
        event_type: row.event_type,
        payload: row.payload,
        occurred_at: row.occurred_at,
        prev_hash: prevHash,
      });
      return { ok: false, firstBadRowId: row.id as number, expected, actual: row.row_hash as string };
    }

    const expected = computeRowHash(prevHash, {
      incident_id: row.incident_id,
      actor_admin_id: row.actor_admin_id,
      event_type: row.event_type,
      payload: row.payload,
      occurred_at: row.occurred_at,
      prev_hash: prevHash,
    });

    if (expected !== row.row_hash) {
      return {
        ok: false,
        firstBadRowId: row.id as number,
        expected,
        actual: row.row_hash as string,
      };
    }

    prevHash = row.row_hash as string;
  }

  return { ok: true };
}
