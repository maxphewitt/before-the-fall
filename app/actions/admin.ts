"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "../lib/supabase";
import {
  signOutAdmin,
  getCurrentAdminId,
} from "../lib/adminSession";
import { appendAuditEvent } from "../lib/auditLog";
import { decryptJournalText } from "../lib/journalCrypto";

/**
 * Admin server actions for Task #14 — safety + compliance backend.
 *
 * **DRAFT v1.** Requires security audit (Launch Gate #2) before public
 * launch. All actions audit-log to the tamper-evident chain.
 *
 * Note: there is no `loginAdmin` action and no `/admin/login` route.
 * Admin authentication is magic-link only via `/_a/[token]`. That route
 * mints the admin cookie itself; nothing else does. Logout still lives
 * here so admins can clear their cookie from the /admin/review header.
 */

const NOT_AUTHORIZED = "You're not signed in as an admin.";
const NOT_FOUND = "We can't find that incident.";
const GENERIC = "Something went wrong. Please try again.";

export type SimpleResult = { success: true } | { success: false; error: string };

export async function logoutAdmin(): Promise<SimpleResult> {
  try {
    const adminId = await getCurrentAdminId();
    if (adminId) {
      await appendAuditEvent({
        eventType: "admin_logout",
        actorAdminId: adminId,
      });
    }
    await signOutAdmin();
    revalidatePath("/admin");
    return { success: true };
  } catch (err) {
    console.error("logoutAdmin exception:", err);
    return { success: false, error: GENERIC };
  }
}

/**
 * Form-action wrapper for logoutAdmin. Next.js <form action={...}> requires
 * a function that returns void or Promise<void>. This wrapper swallows the
 * SimpleResult so we can bind directly to a logout form.
 */
export async function logoutAdminForm(): Promise<void> {
  await logoutAdmin();
}

/**
 * Decrypt the journal entry referenced by an incident. Each call appends
 * an `admin_decrypted_entry` event to the audit chain — every read of
 * sensitive plaintext is recorded.
 *
 * Returns the plaintext on success. The plaintext is then rendered in
 * the admin UI but is NEVER persisted anywhere new (no logs, no caches,
 * no other tables) — it lives only in the response to this request.
 */
export async function decryptIncidentEntry(
  incidentId: string
): Promise<{ success: true; text: string } | { success: false; error: string }> {
  try {
    const adminId = await getCurrentAdminId();
    if (!adminId) return { success: false, error: NOT_AUTHORIZED };

    const supabase = supabaseServer();

    const { data: incident, error: incidentError } = await supabase
      .from("incidents")
      .select("id, entry_id, user_id")
      .eq("id", incidentId)
      .maybeSingle();

    if (incidentError || !incident || !incident.entry_id) {
      return { success: false, error: NOT_FOUND };
    }

    const { data: entry, error: entryError } = await supabase
      .from("journal_entries")
      .select("ciphertext, iv, auth_tag")
      .eq("id", incident.entry_id)
      .maybeSingle();

    if (entryError || !entry) {
      return { success: false, error: NOT_FOUND };
    }

    const plaintext = decryptJournalText({
      ciphertext: entry.ciphertext as string,
      iv: entry.iv as string,
      authTag: entry.auth_tag as string,
    });

    // CRITICAL: audit BEFORE returning. Even if the audit insert fails,
    // we still record the attempt via console.error in appendAuditEvent.
    await appendAuditEvent({
      eventType: "admin_decrypted_entry",
      incidentId: incident.id as string,
      actorAdminId: adminId,
      payload: { entry_id: incident.entry_id, user_id: incident.user_id },
    });

    return { success: true, text: plaintext };
  } catch (err) {
    console.error("decryptIncidentEntry exception:", err);
    return { success: false, error: GENERIC };
  }
}

export type IncidentStatus =
  | "false_positive"
  | "dismissed_no_action"
  | "escalated_988"
  | "escalated_ncmec"
  | "escalated_le"
  | "escalated_other";

/**
 * Set the status of an incident. Records the previous and new status in
 * the audit log so the disposition history is fully reconstructible.
 */
export async function setIncidentStatus(
  incidentId: string,
  newStatus: IncidentStatus,
  notes: string | null
): Promise<SimpleResult> {
  try {
    const adminId = await getCurrentAdminId();
    if (!adminId) return { success: false, error: NOT_AUTHORIZED };

    const supabase = supabaseServer();

    const { data: existing, error: lookupError } = await supabase
      .from("incidents")
      .select("id, status")
      .eq("id", incidentId)
      .maybeSingle();

    if (lookupError || !existing) {
      return { success: false, error: NOT_FOUND };
    }

    const prevStatus = existing.status as string;

    const { error: updateError } = await supabase
      .from("incidents")
      .update({
        status: newStatus,
        admin_notes: notes,
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", incidentId);

    if (updateError) {
      console.error("setIncidentStatus update error:", updateError);
      return { success: false, error: GENERIC };
    }

    await appendAuditEvent({
      eventType: "status_changed",
      incidentId,
      actorAdminId: adminId,
      payload: { from: prevStatus, to: newStatus, notes_present: !!notes },
    });

    if (notes && notes.trim().length > 0) {
      await appendAuditEvent({
        eventType: "admin_notes_added",
        incidentId,
        actorAdminId: adminId,
        // We DO store the notes content in the audit payload because
        // notes are an admin's own words about a disposition. Keep them
        // free of user PII per the Compliance Package #2 (Backend Data
        // Policy). Admin training should reinforce this.
        payload: { notes },
      });
    }

    revalidatePath("/admin/review");
    revalidatePath(`/admin/incidents/${incidentId}`);
    return { success: true };
  } catch (err) {
    console.error("setIncidentStatus exception:", err);
    return { success: false, error: GENERIC };
  }
}
