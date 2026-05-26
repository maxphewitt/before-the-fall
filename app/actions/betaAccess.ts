"use server";

import { cookies } from "next/headers";
import { supabaseServer } from "../lib/supabase";
import {
  hashBetaAccessCode,
  isWellFormedBetaAccessCode,
} from "../lib/betaAccessCode";
import { getSafetyMetadata } from "../lib/safetyMetadata";

/**
 * Public server action for /beta-access.
 *
 *   redeemBetaAccessCode — validates a code, creates a beta session
 *     row, sets the btf_beta_access cookie, and returns success/error.
 *     On success, the user is allowed through the gate; the cookie
 *     stays valid for 365 days (closed beta cohort is small and
 *     long-lived).
 *
 * Tracks usage on the code row (use_count, last_used_at) so admins
 * can see which testers have actually logged in and how often.
 */

const COOKIE_NAME = "btf_beta_access";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

type Ok = { success: true };
type Err = { success: false; error: string };

export async function redeemBetaAccessCode(rawCode: string): Promise<Ok | Err> {
  try {
    if (!isWellFormedBetaAccessCode(rawCode)) {
      return { success: false, error: "Code format isn't right. Three words, lowercase." };
    }
    const codeHash = hashBetaAccessCode(rawCode);
    const supabase = supabaseServer();

    const { data: codeRow, error: codeError } = await supabase
      .from("beta_access_codes")
      .select("id, deactivated_at, use_count")
      .eq("code_hash", codeHash)
      .maybeSingle();

    if (codeError) {
      console.error("redeemBetaAccessCode DB error:", codeError);
      return { success: false, error: "Server hiccup. Try again." };
    }
    if (!codeRow) {
      return { success: false, error: "Code not recognized." };
    }
    if (codeRow.deactivated_at !== null) {
      return { success: false, error: "This code has been deactivated. Contact Max." };
    }

    // Create a session row + bump the code counters.
    const metadata = await getSafetyMetadata();
    const { data: sessionRow, error: sessionError } = await supabase
      .from("beta_access_sessions")
      .insert({
        beta_code_id: codeRow.id,
        ip_hash: metadata.hashedIp,
        user_agent: metadata.userAgent,
      })
      .select("id")
      .single();

    if (sessionError || !sessionRow) {
      console.error("redeemBetaAccessCode session error:", sessionError);
      return { success: false, error: "Server hiccup. Try again." };
    }

    await supabase
      .from("beta_access_codes")
      .update({
        use_count: (codeRow.use_count as number) + 1,
        last_used_at: new Date().toISOString(),
      })
      .eq("id", codeRow.id);

    // Set the gate cookie. httpOnly so client JS can't read it.
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, sessionRow.id as string, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    return { success: true };
  } catch (err) {
    console.error("redeemBetaAccessCode exception:", err);
    return { success: false, error: "Server error. Try again." };
  }
}

/**
 * Helper for any server-side caller that wants to know the beta
 * session id (e.g., createUser linking signups back to the tester
 * who let them in).
 */
export async function getBetaAccessSessionId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const value = cookieStore.get(COOKIE_NAME)?.value;
    return value ?? null;
  } catch {
    return null;
  }
}

export async function getBetaAccessCodeId(): Promise<string | null> {
  try {
    const sessionId = await getBetaAccessSessionId();
    if (!sessionId) return null;
    const supabase = supabaseServer();
    const { data } = await supabase
      .from("beta_access_sessions")
      .select("beta_code_id")
      .eq("id", sessionId)
      .maybeSingle();
    return (data?.beta_code_id as string | undefined) ?? null;
  } catch (err) {
    console.error("getBetaAccessCodeId exception:", err);
    return null;
  }
}
