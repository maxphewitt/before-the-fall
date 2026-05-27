import { NextResponse, type NextRequest } from "next/server";

/**
 * Beta access gate + admin route guard.
 *
 * Behavior is fully toggled by BETA_GATE_ENABLED. When unset or
 * anything other than "true", middleware is a no-op and the site is
 * open — this is the public-launch posture.
 *
 * When BETA_GATE_ENABLED=true:
 *
 *   - The home `/` is always reachable (it renders the gate UI when
 *     no cookie is present, full home content when present). The
 *     home decides what to show based on the same cookie.
 *
 *   - `/api/verify-code` is the only API path that can be hit without
 *     a cookie (it's the POST endpoint that issues the cookie).
 *
 *   - `/offline` stays reachable so the crisis-line fallback works
 *     for anyone in a crisis, code or no.
 *
 *   - Static assets pass through unconditionally.
 *
 *   - Everything else requires a `btf_beta_access` cookie. Missing or
 *     malformed cookie → 302 to `/`. The middleware does a presence
 *     check; deep validation (the session row + code) happens in the
 *     API route and in server actions when the user does something.
 *
 *   - `/_a/*` is the magic-link admin auth path. It is reachable
 *     WITHOUT a beta cookie, because the admin is not a beta tester
 *     and shouldn't have to redeem a beta code before claiming admin.
 *     The route handler itself is the security boundary: it returns
 *     404 unless the URL token matches ADMIN_MAGIC_PATH exactly. The
 *     token (32 bytes of entropy) is the gate. Adding a beta-cookie
 *     requirement created a chicken-and-egg lockout — fixed
 *     2026-05-26 in the beta-hardening sprint.
 *
 *   - Admin routes (`/admin/*`) require BOTH the beta cookie AND the
 *     admin cookie (`btf_admin_id`). Any admin route hit without an
 *     admin cookie redirects to `/` — never to a login form. The
 *     admin auth path lives at `/_a/[token]` (magic link, see
 *     route handler). There is no public admin login form.
 *
 * Defense-in-depth: middleware does perimeter checks at the edge;
 * server components and actions do deep validation. Both must pass
 * for sensitive operations.
 */

// Cookie name matches what app/actions/betaAccess.ts and the
// /api/verify-code route set. Renamed from `beta_authorized` in the
// 2026-05-26 beta-hardening sprint to align with the existing
// btf_*-prefixed naming convention (btf_user_id, btf_admin_id).
const BETA_COOKIE = "btf_beta_access";
const ADMIN_COOKIE = "btf_admin_id";

/** Paths that never require a beta cookie. */
const PUBLIC_PATHS = new Set([
  "/",
  "/api/verify-code",
  "/offline",
  "/sw.js",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/apple-icon",
  "/opengraph-image",
  "/icon-192",
  "/icon-512",
]);

/** Static asset extensions that always pass through. */
const STATIC_EXT = /\.(png|jpg|jpeg|svg|gif|webp|ico|woff2?|ttf|css|js|map|txt|xml)$/i;

export function proxy(request: NextRequest) {
  const enabled = process.env.BETA_GATE_ENABLED === "true";
  if (!enabled) return NextResponse.next();

  const pathname = request.nextUrl.pathname;

  // Static asset shortcut.
  if (STATIC_EXT.test(pathname)) return NextResponse.next();
  if (pathname.startsWith("/_next/")) return NextResponse.next();

  // Magic-link admin auth path. The token in the URL is the gate
  // (handler returns 404 unless it matches ADMIN_MAGIC_PATH). Letting
  // it through here means the admin can claim their cookie without
  // first having to redeem a beta code.
  if (pathname.startsWith("/_a/")) return NextResponse.next();

  // Public paths always allowed.
  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next();

  // Everything else needs a beta cookie.
  const hasBeta = !!request.cookies.get(BETA_COOKIE);
  if (!hasBeta) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = ""; // strip any sensitive query params before redirect
    return NextResponse.redirect(url);
  }

  // Admin routes additionally require the admin cookie. We do NOT
  // redirect to a login form — that would advertise the route. We send
  // them to `/` with no indication that anything else exists here.
  if (pathname.startsWith("/admin")) {
    const hasAdmin = !!request.cookies.get(ADMIN_COOKIE);
    if (!hasAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run on every request except framework asset paths the matcher
  // shouldn't touch. The static-extension shortcut inside the function
  // is the second line of defense.
  matcher: ["/((?!_next/static|_next/image).*)"],
};
