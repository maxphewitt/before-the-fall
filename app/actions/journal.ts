"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "../lib/supabase";
import { getCurrentUserId } from "../lib/session";
import {
  encryptJournalText,
  decryptJournalText,
} from "../lib/journalCrypto";

/**
 * Journal CRUD — all guarded by the session cookie, all enforce ownership
 * server-side. Returns are plain objects (no class instances) so they
 * cross the server-action boundary cleanly.
 *
 * All mutating actions call revalidatePath('/journal') so the list view
 * picks up the change on next render.
 */

export type JournalEntry = {
  id: string;
  createdAt: string;
  updatedAt: string;
  text: string;
};

export type JournalActionResult<T = void> =
  | (T extends void ? { success: true } : { success: true; data: T })
  | { success: false; error: string };

// Single user-facing message for unauthenticated callers. Routes that
// have already redirected on a null cookie shouldn't normally hit this,
// but a server action is callable from anywhere — defense in depth.
const NOT_SIGNED_IN = "You're not signed in. Paste your recovery code to continue.";
const NOT_FOUND = "We can't find that entry.";
const GENERIC = "Something went wrong saving your entry. Please try again.";

/**
 * Create a new entry. Encrypts the text and inserts a row.
 */
export async function createEntry(
  text: string
): Promise<JournalActionResult<{ id: string }>> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };

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

    revalidatePath("/journal");
    return { success: true, data: { id: data.id } };
  } catch (err) {
    console.error("createEntry exception:", err);
    return { success: false, error: GENERIC };
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
      .select("id, ciphertext, iv, auth_tag, created_at, updated_at")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("listEntries DB error:", error);
      return { success: false, error: GENERIC };
    }

    const entries: JournalEntry[] = (data ?? []).map((row) => ({
      id: row.id as string,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
      text: decryptJournalText({
        ciphertext: row.ciphertext as string,
        iv: row.iv as string,
        authTag: row.auth_tag as string,
      }),
    }));

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
      .select("id, user_id, ciphertext, iv, auth_tag, created_at, updated_at, deleted_at")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("getEntry DB error:", error);
      return { success: false, error: GENERIC };
    }

    if (!data || data.user_id !== userId || data.deleted_at !== null) {
      return { success: false, error: NOT_FOUND };
    }

    return {
      success: true,
      data: {
        id: data.id as string,
        createdAt: data.created_at as string,
        updatedAt: data.updated_at as string,
        text: decryptJournalText({
          ciphertext: data.ciphertext as string,
          iv: data.iv as string,
          authTag: data.auth_tag as string,
        }),
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
      .select("id, user_id, deleted_at")
      .eq("id", id)
      .maybeSingle();

    if (lookupError) {
      console.error("updateEntry lookup error:", lookupError);
      return { success: false, error: GENERIC };
    }
    if (!existing || existing.user_id !== userId || existing.deleted_at !== null) {
      return { success: false, error: NOT_FOUND };
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
