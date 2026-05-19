import { cookies } from "next/headers";

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
 */

const COOKIE_NAME = "btf_user_id";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

/**
 * Set the session cookie for a freshly authenticated user.
 * Called from createUser (after signup) and resumeSession (after code paste).
 */
export async function setSessionCookie(userId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

/**
 * Read the current user's UUID from the session cookie.
 * Returns null if the cookie is missing (anonymous visitor).
 *
 * IMPORTANT: This is a presence check only — it does NOT verify the UUID
 * still exists in the users table. Callers that need authoritative auth
 * (e.g. journaling, profile reads) should follow this up with a DB lookup
 * and treat a missing row as "signed out, clear the cookie."
 */
export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

/**
 * Clear the session cookie. Used by the (future) sign-out flow.
 */
export async function signOut(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
