import { cookies } from "next/headers";
import { supabaseServer } from "./supabase";

/**
 * Session management for the pseudonymous identity model.
 *
 * After a user signs up at /onboard OR resumes via /return, we set an
 * httpOnly cookie named `btf_user_id` containing their UUID. Every
 * authenticated route reads this cookie via `getCurrentUserId()`.
 *
 * Notes:
 * - httpOnly so client-side JS (including third-party scripts and XSS)
 *   cannot read the user's ID.
 * - secure in production only, so local `next dev` over http still works.
 * - sameSite: "lax" — sufficient since we don't have cross-origin POST flows.
 * - 30-day max age, refreshed implicitly any time the user signs in again.
 *
 * In Next.js 15+, `cookies()` is async. All helpers below await it.
 *
 * Activity bumping: getCurrentUserId() fires touchUserActivity() in the
 * background on every call so /admin/beta-codes can tell which testers
 * are actually using the platform between recovery-code paste events.
 * See scripts/task-33-user-daily-activity.sql.
 */

const COOKIE_NAME = "btf_user_id";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

// users.last_seen_at is only refreshed if older than this. Cuts DB writes
// for users clicking around quickly; user_daily_activity still captures
// "active today" on every page view via the composite-PK upsert.
const LAST_SEEN_REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Set the session cookie for a freshly authenticated user.
 * Called from createUser (after signup) and resumeSession (after code paste).
 *
 * `persist` controls device-level "remember me" behavior:
 *   - true  (default): a 30-day persistent cookie. Survives browser
 *     restarts. This is the "Keep me logged in on this device" choice.
 *   - false: a SESSION cookie (no maxAge). The browser drops it when the
 *     window/session closes, so a new window has no session and lands
 *     back on the public home to log in again. This is the safer default
 *     for shared or borrowed devices, given the sensitive nature of the
 *     platform.
 */
export async function setSessionCookie(
  userId: string,
  persist: boolean = true
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // Omitting maxAge produces a session cookie (cleared on browser close).
    ...(persist ? { maxAge: COOKIE_MAX_AGE_SECONDS } : {}),
  });
}

/**
 * Read the current user's UUID from the session cookie.
 * Returns null if the cookie is missing (anonymous visitor).
 *
 * Side effect: when a user_id is present, fires touchUserActivity()
 * without awaiting it. Bumps users.last_seen_at (debounced 5 min) and
 * inserts today's row in user_daily_activity. This is how /admin/beta-codes
 * sees a tester is alive between recovery-code paste events.
 *
 * IMPORTANT: This is a presence check only — it does NOT verify the UUID
 * still exists in the users table. Callers that need authoritative auth
 * (e.g. journaling, profile reads) should follow this up with a DB lookup
 * and treat a missing row as "signed out, clear the cookie."
 */
export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(COOKIE_NAME)?.value ?? null;
  if (userId) {
    // Fire-and-forget. Errors are logged but never block the response.
    // At closed-beta volume the write completes before the Vercel
    // function scales down; revisit with waitUntil() if we ever see
    // dropped touches.
    touchUserActivity(userId).catch((err) => {
      console.warn("touchUserActivity failed:", err);
    });
  }
  return userId;
}

/**
 * Bump activity timestamps for the given user.
 *
 * Two writes:
 *   1. UPDATE users SET last_seen_at = now() — only if the existing
 *      value is older than LAST_SEEN_REFRESH_INTERVAL_MS, to keep
 *      write pressure low for users navigating quickly. The WHERE
 *      clause makes this a no-op when already fresh.
 *   2. UPSERT into user_daily_activity — one row per (user, day),
 *      idempotent.
 *
 * Both writes are independent; we don't fail one because the other
 * errors. Exceptions are swallowed by the caller's .catch().
 */
export async function touchUserActivity(userId: string): Promise<void> {
  const supabase = supabaseServer();
  const nowIso = new Date().toISOString();
  const refreshThreshold = new Date(
    Date.now() - LAST_SEEN_REFRESH_INTERVAL_MS
  ).toISOString();

  // Bump last_seen_at if stale, otherwise no-op.
  const lastSeenPromise = supabase
    .from("users")
    .update({ last_seen_at: nowIso })
    .eq("id", userId)
    .or(`last_seen_at.is.null,last_seen_at.lt.${refreshThreshold}`);

  // Record today as an active day. Composite PK + ignoreDuplicates makes
  // this safe to call on every page view; only the first hit each day
  // actually writes.
  const today = nowIso.slice(0, 10); // YYYY-MM-DD
  const dailyPromise = supabase
    .from("user_daily_activity")
    .upsert(
      { user_id: userId, activity_date: today },
      { onConflict: "user_id,activity_date", ignoreDuplicates: true }
    );

  const [lastSeenResult, dailyResult] = await Promise.allSettled([
    lastSeenPromise,
    dailyPromise,
  ]);
  if (lastSeenResult.status === "rejected") {
    console.warn("touchUserActivity last_seen_at error:", lastSeenResult.reason);
  }
  if (dailyResult.status === "rejected") {
    console.warn("touchUserActivity user_daily_activity error:", dailyResult.reason);
  }
}

/**
 * Clear the session cookie. Used by the (future) sign-out flow.
 */
export async function signOut(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
