import { createHash } from "crypto";
import { headers } from "next/headers";

/**
 * Forensic-grade metadata captured on every meaningful safety event
 * (signup, signup_elevated, session_resume, future trigger events).
 *
 * Why we keep this at all — see [[Pseudonymous Identity Model]]:
 *  - We are pseudonymous, not zero-knowledge. We keep just enough to
 *    honor lawful subpoenas, dispatch 988, and report NCMEC content
 *    when required, and no more.
 *  - The IP is one-way hashed with a server-held salt, so we can
 *    confirm whether a presented IP matches our record (subpoena
 *    response, repeat-abuser detection) but we can never recover the
 *    original IP from the database alone.
 *  - The user-agent is stored raw. It is not PII, and it helps
 *    operators tell a real visitor from a scraper on review.
 *
 * Both fields degrade gracefully to null:
 *  - If SAFETY_LOG_IP_SALT is unset, we log loudly and store null.
 *    We do NOT block the user — refusing to onboard someone in crisis
 *    over a missing env var would be the wrong tradeoff.
 *  - If a header is absent (e.g. local dev without a proxy), we store
 *    null for that field.
 */
export type SafetyMetadata = {
  hashedIp: string | null;
  userAgent: string | null;
};

/**
 * Read the current request's client IP and user-agent and return them
 * in the form we persist to `safety_logs`.
 *
 * Must be called inside a server action or route handler — `headers()`
 * comes from `next/headers` and requires a server request context.
 */
export async function getSafetyMetadata(): Promise<SafetyMetadata> {
  const salt = process.env.SAFETY_LOG_IP_SALT;
  if (!salt) {
    console.error(
      "SAFETY_LOG_IP_SALT is not set. Safety logs will record null hashed_ip until this is fixed."
    );
  }

  const h = await headers();

  // Vercel and most reverse proxies populate x-forwarded-for with the
  // client IP as the FIRST comma-separated value. We never want the
  // proxy's own IP, so always take the leftmost entry.
  const xff = h.get("x-forwarded-for");
  const ip =
    xff?.split(",")[0]?.trim() ||
    h.get("x-real-ip")?.trim() ||
    null;

  const userAgent = h.get("user-agent") ?? null;

  const hashedIp =
    ip && salt
      ? createHash("sha256").update(ip + salt).digest("hex")
      : null;

  return { hashedIp, userAgent };
}
