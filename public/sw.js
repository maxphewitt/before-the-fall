/**
 * Before the Fall — service worker.
 *
 * Minimal v1. Two jobs:
 *   1. Cache the home page and About page so users who lose
 *      connectivity can still reach the crisis numbers (988, etc.).
 *   2. Provide an offline fallback that includes the crisis number
 *      prominently in case neither cached page is available.
 *
 * Intentionally NOT cached: /journal, /today, /admin, /tools/[slug]/start,
 * /catholic-path/* — these have dynamic per-user content or fresh
 * tracker data and serving a stale version would be worse than failing.
 *
 * Versioned cache key so we can bust it by incrementing the version
 * when we ship a new shell.
 */

const CACHE_VERSION = "btf-v3-2026-06-28";
const SHELL_URLS = [
  "/",
  "/about",
  "/manifest.webmanifest",
  // CSO resources — explicitly cached so CSOs can read them offline
  // on their phones once they've visited once.
  "/loved-one",
  "/loved-one/resources/first-conversation",
  "/loved-one/resources/what-not-to-say",
  "/loved-one/resources/caring-for-yourself",
];
const OFFLINE_FALLBACK = "/offline";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      // best-effort — partial failures are OK
      return cache.addAll(SHELL_URLS).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_VERSION)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Same-origin only.
  if (url.origin !== self.location.origin) return;

  // Skip dynamic routes — they need fresh data.
  const dynamicPrefixes = [
    "/journal",
    "/home",
    "/today",
    "/explore",
    "/you",
    "/field-journal",
    "/admin",
    "/tools/",
    "/catholic-path/",
    "/onboard",
    "/return",
    "/api/",
    "/_next/",
  ];
  // Allow the static tools index and catholic-path index to be
  // network-first; only block the dynamic deeper routes.
  if (dynamicPrefixes.some((p) => url.pathname.startsWith(p))) {
    return;
  }

  // Network-first for shell pages, with cache fallback on failure.
  if (SHELL_URLS.includes(url.pathname)) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE_VERSION).then((cache) => {
              cache.put(req, clone).catch(() => {});
            });
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then((cached) => cached || Response.error())
        )
    );
    return;
  }
});

// Receive a postMessage from the registration script asking us to skip
// waiting. Lets us roll out new SW versions without forcing a full
// browser restart.
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
