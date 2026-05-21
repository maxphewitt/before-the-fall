import { cookies } from "next/headers";
import { createHash, randomBytes } from "crypto";

/**
 * Admin auth — separate from end-user auth.
 *
 * Cookie name `btf_admin_id` (distinct from `btf_user_id`) so Max can
 * be both a user (his own journal) and an admin (reviewing incidents)
 * in the same browser without state collision.
 *
 * Shorter max-age than user sessions (12 hours vs. 30 days) — admin
 * privilege should refresh more often.
 *
 * Admin recovery codes are 32 random bytes hex-encoded (64 chars).
 * SHA-256 stored in `admin_users.recovery_code_hash`. Generate fresh
 * codes via the seed script; never embed in source.
 */

const COOKIE_NAME = "btf_admin_id";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

export async function setAdminCookie(adminId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, adminId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

export async function getCurrentAdminId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

export async function signOutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Generate a fresh admin recovery code. 32 random bytes = 256 bits of
 * entropy, hex-encoded for paste-friendliness.
 *
 * Only call from a server context with crypto access. Used by the seed
 * script — should NOT be exposed via any HTTP endpoint.
 */
export function generateAdminCode(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Normalize before hashing — strip whitespace, lowercase. Hex codes
 * are case-insensitive so this gives us forgiving paste behavior.
 */
export function normalizeAdminCode(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, "");
}

/**
 * SHA-256 of the normalized admin code. What we persist in the DB.
 */
export function hashAdminCode(code: string): string {
  return createHash("sha256").update(normalizeAdminCode(code)).digest("hex");
}

/**
 * Validate that a string looks like a 32-byte hex token (64 chars,
 * 0-9 + a-f). Catches paste typos before hitting the DB.
 */
export function isValidAdminCodeShape(input: string): boolean {
  const normalized = normalizeAdminCode(input);
  return /^[0-9a-f]{64}$/.test(normalized);
}
