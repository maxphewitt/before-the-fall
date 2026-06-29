/**
 * Validate a `?from=` redirect target before navigating to it.
 *
 * Routing flows in Before the Fall pass a `from` query param so post-save
 * actions can return the user to where they started (e.g., back to
 * /catholic-path after writing a Prayer Intention, or back to
 * /tools/urge-surfing after completing the walker).
 *
 * An unchecked redirect target is an open-redirect vector — an attacker
 * could craft a link like `/journal/new?from=https://evil.example.com`
 * and the post-save flow would happily bounce the user off-platform.
 * This helper enforces:
 *
 *   - Must be a same-origin path that begins with a single `/`
 *   - May not begin with `//` (protocol-relative URL)
 *   - May not contain `\\` (Windows-style relative path that some
 *     browsers normalize into a host)
 *   - Must not be longer than 200 characters (defensive cap)
 *   - Optionally restrict to a known prefix allow-list
 *
 * Returns the cleaned path if valid, or null if not. Callers should
 * fall back to a hard-coded default on null.
 */

const DEFAULT_MAX_LENGTH = 200;

/**
 * The prefixes that the routing flow is allowed to return to today.
 * Add new ones here as new flows learn to pass `?from=`. Keeping this
 * narrow is the simplest way to prevent surprise redirects to admin
 * routes, the test page, or anything else we don't want to bounce into.
 */
export const ALLOWED_FROM_PREFIXES: readonly string[] = [
  "/catholic-path",
  "/tools",
  "/journal", // for re-entry from a journal detail page
  "/who-we-are", // renamed from /about in the 2026-06-15 restructure
  "/home",
  "/today",
];

export function safeRedirectPath(
  raw: string | null | undefined,
  opts?: { allowedPrefixes?: readonly string[]; maxLength?: number }
): string | null {
  if (!raw) return null;
  const value = String(raw);
  const maxLen = opts?.maxLength ?? DEFAULT_MAX_LENGTH;
  if (value.length === 0 || value.length > maxLen) return null;

  // Must start with a single forward slash.
  if (!value.startsWith("/")) return null;
  // Reject protocol-relative ("//evil.com/...") and backslash hostnames.
  if (value.startsWith("//") || value.includes("\\")) return null;
  // Reject anything containing a scheme separator after the slash.
  if (value.toLowerCase().includes("://")) return null;
  // Reject characters that have no business in a path.
  if (/[<>"'`]/.test(value)) return null;

  const allowed = opts?.allowedPrefixes ?? ALLOWED_FROM_PREFIXES;
  const path = value.split("?")[0].split("#")[0];
  const ok = allowed.some(
    (prefix) => path === prefix || path.startsWith(prefix + "/")
  );
  if (!ok) return null;

  return value;
}
