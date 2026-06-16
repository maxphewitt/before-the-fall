"use server";

import { supabaseServer } from "../lib/supabase";
import {
  normalizeRecoveryCode,
  isValidRecoveryCode,
  hashRecoveryCode,
} from "../lib/recoveryCode";
import { setSessionCookie } from "../lib/session";
import { getSafetyMetadata } from "../lib/safetyMetadata";

export type ResumeSessionResult =
  | { success: true; userId: string }
  | { success: false; error: string };

/**
 * Single, generic error message used for every failure path on /return:
 *  - malformed input
 *  - failed BIP39 checksum
 *  - hash not in the users table
 *  - DB error
 *
 * Returning the SAME message in every case prevents an attacker from
 * distinguishing "valid BIP39 phrase that doesn't exist" from "valid
 * BIP39 phrase that does exist but was mistyped" — both look identical.
 */
const GENERIC_ERROR =
  "We don't recognize this code. Double-check that you have all twelve words, in the right order, separated by spaces.";

/**
 * Resume a session from a pasted 12-word recovery code.
 *
 * Flow:
 *   1. Normalize whitespace and case.
 *   2. Validate the BIP39 checksum to reject typos cheaply, before hitting the DB.
 *   3. Hash the normalized code (SHA-256) and look up the row in `users`.
 *   4. On match: update `users.last_seen_at`, log a `session_resume` safety event,
 *      and set the httpOnly `btf_user_id` cookie.
 *   5. On any failure: return the generic error. We never reveal which step failed.
 */
export async function resumeSession(
  pastedCode: string,
  persist: boolean = true
): Promise<ResumeSessionResult> {
  try {
    if (typeof pastedCode !== "string" || pastedCode.trim().length === 0) {
      return { success: false, error: GENERIC_ERROR };
    }

    const normalized = normalizeRecoveryCode(pastedCode);

    if (!isValidRecoveryCode(normalized)) {
      return { success: false, error: GENERIC_ERROR };
    }

    const hash = hashRecoveryCode(normalized);
    const supabase = supabaseServer();

    const { data: user, error: lookupError } = await supabase
      .from("users")
      .select("id")
      .eq("recovery_code_hash", hash)
      .maybeSingle();

    if (lookupError) {
      console.error("resumeSession lookup error:", lookupError);
      return { success: false, error: GENERIC_ERROR };
    }

    if (!user) {
      // Hash didn't match any row — same generic message.
      return { success: false, error: GENERIC_ERROR };
    }

    // Touch last_seen_at. Best-effort: if this fails we still log the user in,
    // we just lose the analytics signal for this resume.
    const { error: touchError } = await supabase
      .from("users")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("id", user.id);

    if (touchError) {
      console.error("resumeSession last_seen_at update error:", touchError);
    }

    // Safety log for compliance — same pattern as createUser. Hashed IP +
    // user-agent let us tie a resume back to a real source on subpoena or
    // 988 dispatch, without ever storing the plaintext IP.
    const metadata = await getSafetyMetadata();
    const { error: logError } = await supabase.from("safety_logs").insert({
      user_id: user.id,
      event_type: "session_resume",
      ip_hash: metadata.hashedIp,
      user_agent: metadata.userAgent,
    });

    if (logError) {
      console.error("resumeSession safety_logs insert error:", logError);
    }

    // Set the cookie LAST, so we don't authenticate a session whose
    // bookkeeping silently failed in a way we'd want to retry. `persist`
    // honors the "Keep me logged in on this device" choice on /return
    // (defaults to true).
    await setSessionCookie(user.id, persist);

    return { success: true, userId: user.id };
  } catch (err) {
    console.error("resumeSession exception:", err);
    return { success: false, error: GENERIC_ERROR };
  }
}
