"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "../lib/supabase";
import { getCurrentUserId } from "../lib/session";
import {
  encryptJournalText,
  decryptJournalText,
} from "../lib/journalCrypto";
import { scanForTriggers } from "../lib/triggerScan";
import { appendAuditEvent } from "../lib/auditLog";
import {
  JOURNAL_TYPES,
  type JournalType,
  type JournalEntry,
  type JournalActionResult,
  type ToolSessionStep,
  type ToolSessionPayload,
} from "../lib/journalTypes";

/**
 * Journal CRUD — all guarded by the session cookie, all enforce ownership
 * server-side. Returns are plain objects (no class instances) so they
 * cross the server-action boundary cleanly.
 *
 * All mutating actions call revalidatePath('/journal') so the list view
 * picks up the change on next render.
 */

/**
 * Internal: parse a decrypted body. If it's a tool-session JSON envelope,
 * return both the structured payload and a human-readable rollup string;
 * otherwise treat as plain text.
 *
 * Types and constants for this module live in ../lib/journalTypes.ts —
 * Next.js Server Actions modules can only export async functions, so
 * the shared types stay outside this file.
 */
function parseDecryptedBody(plaintext: string): {
  text: string;
  toolSession?: ToolSessionPayload;
} {
  // Cheap probe before JSON.parse — tool-session payloads always start
  // with a {"kind":"tool_session" prefix.
  const looksLikeToolSession =
    plaintext.startsWith("{") && plaintext.includes('"kind":"tool_session"');
  if (!looksLikeToolSession) return { text: plaintext };
  try {
    const parsed = JSON.parse(plaintext) as ToolSessionPayload;
    if (parsed && parsed.kind === "tool_session") {
      const rollup = [
        `${parsed.toolName} — completed ${new Date(parsed.completedAt).toLocaleString()}`,
        ...parsed.steps.map(
          (s) => `${s.heading}: ${s.userAnswer || "(skipped)"}`
        ),
        parsed.summary ? `\nReflection: ${parsed.summary}` : "",
      ]
        .filter(Boolean)
        .join("\n");
      return { text: rollup, toolSession: parsed };
    }
  } catch {
    // Fall through to plain-text path.
  }
  return { text: plaintext };
}

// Single user-facing message for unauthenticated callers. Routes that
// have already redirected on a null cookie shouldn't normally hit this,
// but a server action is callable from anywhere — defense in depth.
const NOT_SIGNED_IN = "You're not signed in. Paste your recovery code to continue.";
const NOT_FOUND = "We can't find that entry.";
const GENERIC = "Something went wrong saving your entry. Please try again.";

/**
 * Create a new entry. Encrypts the text and inserts a row.
 *
 * `journalType` defaults to 'daily'. `'activity'` entries created from
 * the UI should use createToolSession() instead — direct freeform
 * 'activity' entries are not exposed in the type picker because
 * activity is reserved for structured tool-session records.
 */
export async function createEntry(
  text: string,
  journalType: JournalType = "daily"
): Promise<JournalActionResult<{ id: string }>> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };

    if (!JOURNAL_TYPES.includes(journalType)) {
      return { success: false, error: "Invalid journal type." };
    }

    const trimmed = (text ?? "").trim();
    if (trimmed.length === 0) {
      return { success: false, error: "Your entry is empty." };
    }

    const payload = encryptJournalText(trimmed);
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("journal_entries")
      .insert({
        user_id: userId,
        journal_type: journalType,
        ciphertext: payload.ciphertext,
        iv: payload.iv,
        auth_tag: payload.authTag,
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("createEntry DB error:", error);
      return { success: false, error: GENERIC };
    }

    // Best-effort safety scan AFTER successful insert. Never blocks the
    // user's save; never raises out of this function. Logs the scan result
    // to incidents + audit log, but the plaintext stays inside the
    // encrypted entry. See [[Task #14 Dev Note]].
    await runSafetyScan(supabase, trimmed, userId, data.id);

    revalidatePath("/journal");
    return { success: true, data: { id: data.id } };
  } catch (err) {
    console.error("createEntry exception:", err);
    return { success: false, error: GENERIC };
  }
}

/**
 * Internal: scan a just-saved entry's plaintext, and if any triggers
 * fire, open an incident + append an audit event. All failures are
 * swallowed — this must never affect the user-facing save.
 *
 * Plaintext never leaves this function. Only category labels, severity,
 * and counts are persisted.
 */
async function runSafetyScan(
  supabase: ReturnType<typeof supabaseServer>,
  plaintext: string,
  userId: string,
  entryId: string
): Promise<void> {
  try {
    const scan = scanForTriggers(plaintext);
    if (!scan.hit) return;

    const { data: incident, error: incidentError } = await supabase
      .from("incidents")
      .insert({
        user_id: userId,
        entry_id: entryId,
        trigger_categories: scan.categories,
        severity: scan.severity,
        match_count: scan.matchCount,
        status: "pending",
      })
      .select("id")
      .single();

    if (incidentError || !incident) {
      console.error("runSafetyScan incident insert error:", incidentError);
      return;
    }

    await appendAuditEvent({
      eventType: "incident_created",
      incidentId: incident.id as string,
      payload: {
        categories: scan.categories,
        severity: scan.severity,
        match_count: scan.matchCount,
        source: "journal_save",
      },
    });
  } catch (err) {
    console.error("runSafetyScan exception:", err);
  }
}

/**
 * List the current user's non-deleted entries, decrypted, newest first.
 * Decryption happens server-side; the page receives plaintext over the
 * server-component boundary (not over the network in the clear — the
 * server component renders HTML).
 */
export async function listEntries(): Promise<
  JournalActionResult<JournalEntry[]>
> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };

    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("journal_entries")
      .select("id, journal_type, ciphertext, iv, auth_tag, created_at, updated_at")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("listEntries DB error:", error);
      return { success: false, error: GENERIC };
    }

    const entries: JournalEntry[] = (data ?? []).map((row) => {
      const plaintext = decryptJournalText({
        ciphertext: row.ciphertext as string,
        iv: row.iv as string,
        authTag: row.auth_tag as string,
      });
      const parsed = parseDecryptedBody(plaintext);
      return {
        id: row.id as string,
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
        journalType: (row.journal_type as JournalType) ?? "daily",
        text: parsed.text,
        toolSession: parsed.toolSession,
      };
    });

    return { success: true, data: entries };
  } catch (err) {
    console.error("listEntries exception:", err);
    return { success: false, error: GENERIC };
  }
}

/**
 * Fetch a single entry by id, with ownership check. Returns NOT_FOUND
 * for non-existent OR not-owned rows so we don't leak existence.
 */
export async function getEntry(
  id: string
): Promise<JournalActionResult<JournalEntry>> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };

    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("journal_entries")
      .select(
        "id, user_id, journal_type, ciphertext, iv, auth_tag, created_at, updated_at, deleted_at"
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("getEntry DB error:", error);
      return { success: false, error: GENERIC };
    }

    if (!data || data.user_id !== userId || data.deleted_at !== null) {
      return { success: false, error: NOT_FOUND };
    }

    const plaintext = decryptJournalText({
      ciphertext: data.ciphertext as string,
      iv: data.iv as string,
      authTag: data.auth_tag as string,
    });
    const parsed = parseDecryptedBody(plaintext);

    return {
      success: true,
      data: {
        id: data.id as string,
        createdAt: data.created_at as string,
        updatedAt: data.updated_at as string,
        journalType: (data.journal_type as JournalType) ?? "daily",
        text: parsed.text,
        toolSession: parsed.toolSession,
      },
    };
  } catch (err) {
    console.error("getEntry exception:", err);
    return { success: false, error: GENERIC };
  }
}

/**
 * Replace the text of an entry. Re-encrypts under a fresh IV. The DB
 * trigger bumps updated_at automatically.
 */
export async function updateEntry(
  id: string,
  text: string
): Promise<JournalActionResult> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };

    const trimmed = (text ?? "").trim();
    if (trimmed.length === 0) {
      return { success: false, error: "Your entry is empty." };
    }

    const supabase = supabaseServer();

    // Ownership check before mutating, so we don't leak whether the id
    // exists for another user.
    const { data: existing, error: lookupError } = await supabase
      .from("journal_entries")
      .select("id, user_id, journal_type, deleted_at")
      .eq("id", id)
      .maybeSingle();

    if (lookupError) {
      console.error("updateEntry lookup error:", lookupError);
      return { success: false, error: GENERIC };
    }
    if (!existing || existing.user_id !== userId || existing.deleted_at !== null) {
      return { success: false, error: NOT_FOUND };
    }

    // Activity entries (tool-session records) are read-only after save.
    // Allowing edits would distort the record a future AI companion relies
    // on to track progression. UI should never present an edit affordance
    // for these; this server check is defense-in-depth.
    if (existing.journal_type === "activity") {
      return {
        success: false,
        error: "This activity record is read-only.",
      };
    }

    const payload = encryptJournalText(trimmed);
    const { error } = await supabase
      .from("journal_entries")
      .update({
        ciphertext: payload.ciphertext,
        iv: payload.iv,
        auth_tag: payload.authTag,
      })
      .eq("id", id);

    if (error) {
      console.error("updateEntry DB error:", error);
      return { success: false, error: GENERIC };
    }

    // Same best-effort safety scan on edits. We open a NEW incident if
    // the updated text contains triggers — we don't reuse or close
    // pre-existing incidents for this entry, on purpose: the audit
    // log gets a clean record per scan.
    await runSafetyScan(supabase, trimmed, userId, id);

    revalidatePath("/journal");
    revalidatePath(`/journal/${id}`);
    return { success: true };
  } catch (err) {
    console.error("updateEntry exception:", err);
    return { success: false, error: GENERIC };
  }
}

/**
 * Soft delete: set deleted_at on the row. The row stays in the table
 * so audit / mandatory-reporting forensics can still see it. The list
 * view filters on deleted_at IS NULL so the user no longer sees it.
 */
export async function softDeleteEntry(
  id: string
): Promise<JournalActionResult> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };

    const supabase = supabaseServer();

    const { data: existing, error: lookupError } = await supabase
      .from("journal_entries")
      .select("id, user_id, deleted_at")
      .eq("id", id)
      .maybeSingle();

    if (lookupError) {
      console.error("softDeleteEntry lookup error:", lookupError);
      return { success: false, error: GENERIC };
    }
    if (!existing || existing.user_id !== userId || existing.deleted_at !== null) {
      return { success: false, error: NOT_FOUND };
    }

    const { error } = await supabase
      .from("journal_entries")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("softDeleteEntry DB error:", error);
      return { success: false, error: GENERIC };
    }

    revalidatePath("/journal");
    return { success: true };
  } catch (err) {
    console.error("softDeleteEntry exception:", err);
    return { success: false, error: GENERIC };
  }
}

/**
 * Persist a completed tool-session walkthrough as an Activity journal
 * entry. Builds a structured JSON payload (steps + user answers + metadata),
 * encrypts it identically to a free-text entry, and stores it with
 * journal_type='activity'. The payload format is documented in
 * ToolSessionPayload and is intentionally machine-readable so a future
 * AI companion can decrypt + parse to track progression across sessions.
 *
 * Activity entries are read-only after save (see updateEntry guard).
 */
export async function createToolSession(input: {
  toolSlug: string;
  toolName: string;
  steps: ToolSessionStep[];
  summary?: string;
}): Promise<JournalActionResult<{ id: string }>> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };

    if (!input.toolSlug || !input.toolName || !Array.isArray(input.steps)) {
      return { success: false, error: "Invalid tool session." };
    }
    if (input.steps.length === 0) {
      return { success: false, error: "Tool session had no steps." };
    }

    // Normalize answers — empty answers become empty strings, not undefined.
    const normalizedSteps: ToolSessionStep[] = input.steps.map((s) => ({
      heading: String(s.heading ?? "").slice(0, 200),
      prompt: String(s.prompt ?? "").slice(0, 1000),
      userAnswer: String(s.userAnswer ?? "").trim(),
    }));

    // We require at least one non-empty answer so we don't fill the
    // journal with completion-without-engagement rows. If you wanted to
    // log mere completions, lift this.
    const anyAnswer = normalizedSteps.some((s) => s.userAnswer.length > 0);
    if (!anyAnswer) {
      return {
        success: false,
        error: "Add a note to at least one step before saving.",
      };
    }

    const payload: ToolSessionPayload = {
      kind: "tool_session",
      version: "v1",
      toolSlug: input.toolSlug,
      toolName: input.toolName,
      completedAt: new Date().toISOString(),
      steps: normalizedSteps,
      summary: input.summary?.trim() || undefined,
    };

    const encrypted = encryptJournalText(JSON.stringify(payload));
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("journal_entries")
      .insert({
        user_id: userId,
        journal_type: "activity",
        ciphertext: encrypted.ciphertext,
        iv: encrypted.iv,
        auth_tag: encrypted.authTag,
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("createToolSession DB error:", error);
      return { success: false, error: GENERIC };
    }

    // Run the same best-effort trigger scan as on a manual entry. We
    // pass the rolled-up text (step answers concatenated) so phrases
    // spanning multiple step answers are scanned together.
    const scanText = normalizedSteps
      .map((s) => `${s.heading}: ${s.userAnswer}`)
      .concat(payload.summary ? [`Summary: ${payload.summary}`] : [])
      .join("\n");
    await runSafetyScan(supabase, scanText, userId, data.id as string);

    revalidatePath("/journal");
    return { success: true, data: { id: data.id as string } };
  } catch (err) {
    console.error("createToolSession exception:", err);
    return { success: false, error: GENERIC };
  }
}
