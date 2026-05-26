import type { MetadataRoute } from "next";

/**
 * Progressive Web App manifest.
 *
 * Lets users install Before the Fall as a home-screen app on iOS,
 * Android, and desktop Chrome. Standalone display so the browser
 * chrome disappears — critical for the during-crisis UX where extra
 * URL bars and tab switchers are friction.
 *
 * Brand palette per Brand Identity v2:
 *   theme_color       = btf-sky-deep   (#0e2a47)
 *   background_color  = btf-sky-deep   (matches the splash screen so
 *                       there's no flash of white on launch)
 *
 * The icons array references Next.js-generated assets. apple-icon.tsx,
 * icon-512.tsx, and opengraph-image.tsx live alongside this file and
 * are auto-resolved at /apple-icon, /icon-512, etc.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Before the Fall",
    short_name: "Before the Fall",
    description:
      "A faith-rooted, anonymous prevention platform for people standing in the moment before harm.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    theme_color: "#0e2a47",
    background_color: "#0e2a47",
    categories: ["health", "lifestyle", "medical"],
    icons: [
      {
        src: "/icon-192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
