"use server";

import { cookies } from "next/headers";
import { supabaseServer } from "../lib/supabase";

/**
 * Beta access cookie helpers.
 *
 * The redemption flow now lives in app/api/verify-code/route.ts —
 * that's the single canonical endpoint the BetaGate component posts
 * to and the only POST middleware lets through without a beta cookie.
 *
 * This module retains the read-only helpers because other server code
 * (createUser, admin analytics) needs to look up the beta session id
 * and the linked beta code id from the cookie.
 *
 * The legacy redeemBetaAccessCode() server action was removed in the
 * 2026-05-26 beta-hardening sprint along with the /beta-access route.
 * If you are tracking down a missing export and landed here: callers
 * should hit POST /api/verify-code instead.
 */

const COOKIE_NAME = "btf_beta_access";

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
