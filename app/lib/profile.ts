import { cache } from "react";
import { supabaseServer } from "./supabase";
import { getCurrentUserId } from "./session";

/**
 * Faith role captured at onboarding (Q4 of /onboard). Drives Catholic
 * Path visibility throughout the app, per [[Catholic Path — Faith Layer
 * Details]] and the Tier 5 opt-in posture.
 */
export type FaithRole = "growing_closer" | "open" | "secular";

type ProfileFields = {
  display_name: string | null;
  faith_role: string | null;
  populations: string[] | null;
  feed_topics: string[] | null;
};

/**
 * Single request-memoized fetch of the user_profiles columns the four
 * getCurrentUser* helpers below need.
 *
 * Before 2026-08-09 each helper (display name, faith role, populations,
 * feed topics) ran its own SELECT against the same row. On a page like
 * Home — which awaits three of them in one Promise.all — that's three
 * round trips for one row, on top of whatever the (platform) layout
 * already fetched (faith role, for the nav mark) a moment earlier for
 * the same request. Wrapped in cache() so every caller in one request's
 * render tree (layout + page + nested components) shares a single query.
 * Per-request only, never persisted — carries none of unstable_cache's
 * cross-user risk. See 06 - Operations/2026-06-28 Next.js Performance —
 * Findings & Plan (item 6, and the security section's cache() guidance).
 */
const getCurrentUserProfileFields = cache(
  async (): Promise<ProfileFields | null> => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return null;
      const supabase = supabaseServer();
      const { data, error } = await supabase
        .from("user_profiles")
        .select("display_name, faith_role, populations, feed_topics")
        .eq("user_id", userId)
        .maybeSingle();
      if (error || !data) return null;
      return data as ProfileFields;
    } catch (err) {
      console.error("getCurrentUserProfileFields exception:", err);
      return null;
    }
  }
);

/**
 * The user's chosen display name / nickname (optional). Used for the Home
 * greeting and the You page. Never identity — freely set by the user. Returns
 * null if signed out, unset, or on error (callers fall back to a generic
 * greeting).
 */
export async function getCurrentUserDisplayName(): Promise<string | null> {
  const fields = await getCurrentUserProfileFields();
  const name = fields?.display_name?.trim();
  return name ? name : null;
}

/**
 * Fetch the signed-in user's faith_role from user_profiles. Returns
 * null if the user isn't signed in, doesn't have a profile row yet, or
 * a DB error happened. Never throws — callers default to "show" on null.
 */
export async function getCurrentUserFaithRole(): Promise<FaithRole | null> {
  const fields = await getCurrentUserProfileFields();
  const role = fields?.faith_role ?? null;
  if (role === "growing_closer" || role === "open" || role === "secular") {
    return role;
  }
  return null;
}

/**
 * The raw onboarding population strings for the signed-in user (e.g.
 * "depression_anxiety", "porn"). Drives the daily recommendation engine.
 * Returns [] if signed out / none / error.
 */
export async function getCurrentUserPopulations(): Promise<string[]> {
  const fields = await getCurrentUserProfileFields();
  const pops = fields?.populations;
  return Array.isArray(pops) ? pops : [];
}

/**
 * The user's chosen feed topics (theme keys) that customize their daily
 * Scripture/prayer recommendations, on top of onboarding defaults. Returns
 * [] if signed out / unset / error.
 */
export async function getCurrentUserFeedTopics(): Promise<string[]> {
  const fields = await getCurrentUserProfileFields();
  const t = fields?.feed_topics;
  return Array.isArray(t) ? t : [];
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
