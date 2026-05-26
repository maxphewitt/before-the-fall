import { NextResponse, type NextRequest } from "next/server";

/**
 * Beta access gate — closed-beta only.
 *
 * When BETA_GATE_ENABLED=true on the deploy, every request that
 * isn't on the allowlist gets redirected to /beta-access unless the
 * client carries a btf_beta_access cookie (set when the user
 * successfully redeems a code).
 *
 * Allowlist (always reachable, code or not):
 *   - /beta-access            the gate itself
 *   - /offline                crisis-line fallback
 *   - /admin/*                admin login / management
 *   - /_next/*                framework assets
 *   - /sw.js                  service worker
 *   - /manifest.webmanifest
 *   - /favicon.ico
 *   - /icon-* /apple-icon /opengraph-image
 *
 * For public launch: set BETA_GATE_ENABLED=false (or unset it) in
 * Vercel. Middleware short-circuits and the site is open.
 *
 * The cookie is a presence check at the edge. Deep validation (the
 * session row + beta_access_codes link) happens server-side in
 * subsequent actions. The gate is a friendly closure, not a hard
 * security boundary — recovery codes and admin auth still gate the
 * sensitive surfaces independently.
 */
const ALLOW_PREFIXES = [
  "/beta-access",
  "/offline",
  "/admin",
  "/_next",
  "/api",
];

const ALLOW_EXACT = new Set([
  "/sw.js",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/apple-icon",
  "/opengraph-image",
  "/icon-192",
  "/icon-512",
]);

const BETA_COOKIE = "btf_beta_access";

export function middleware(request: NextRequest) {
  const enabled = process.env.BETA_GATE_ENABLED === "true";
  if (!enabled) return NextResponse.next();

  const pathname = request.nextUrl.pathname;

  // Static file extensions that should always pass through.
  if (/\.(png|jpg|jpeg|svg|gif|webp|ico|woff2?|ttf|css|js|map|txt|xml)$/i.test(pathname)) {
    return NextResponse.next();
  }

  if (ALLOW_EXACT.has(pathname)) return NextResponse.next();
  if (ALLOW_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  // If the cookie exists, allow through (server actions deep-validate
  // on demand).
  if (request.cookies.get(BETA_COOKIE)) {
    return NextResponse.next();
  }

  // Otherwise redirect to the gate, preserving the destination so we
  // can route them back after redemption.
  const url = request.nextUrl.clone();
  url.pathname = "/beta-access";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  // Run on all paths except internal Next.js routes the matcher
  // shouldn't touch.
  matcher: ["/((?!_next/static|_next/image).*)"],
};
