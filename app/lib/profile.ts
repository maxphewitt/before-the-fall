import { supabaseServer } from "./supabase";
import { getCurrentUserId } from "./session";

/**
 * Faith role captured at onboarding (Q4 of /onboard). Drives Catholic
 * Path visibility throughout the app, per [[Catholic Path — Faith Layer
 * Details]] and the Tier 5 opt-in posture.
 */
export type FaithRole = "growing_closer" | "open" | "secular";

/**
 * Fetch the signed-in user's faith_role from user_profiles. Returns
 * null if the user isn't signed in, doesn't have a profile row yet, or
 * a DB error happened. Never throws — callers default to "show" on null.
 */
export async function getCurrentUserFaithRole(): Promise<FaithRole | null> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("user_profiles")
      .select("faith_role")
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data) return null;
    const role = data.faith_role as string | null;
    if (role === "growing_closer" || role === "open" || role === "secular") {
      return role;
    }
    return null;
  } catch (err) {
    console.error("getCurrentUserFaithRole exception:", err);
    return null;
  }
}

/**
 * Should the Catholic Path entry be visible to this user?
 *
 * Rule (locked 2026-05-07):
 *  - Signed-out visitors: SHOW (seekers should be able to find it).
 *  - faith_role = growing_closer: SHOW.
 *  - faith_role = open: SHOW.
 *  - faith_role = secular: HIDE (they explicitly opted out at signup).
 *  - Any other state (null / unknown): SHOW. Safer to err on visible —
 *    users can always ignore the link.
 */
export async function shouldShowCatholicPath(): Promise<boolean> {
  const role = await getCurrentUserFaithRole();
  if (role === "secular") return false;
  return true;
}
