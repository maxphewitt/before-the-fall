import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sanity image CDN (blog/article media managed by the agency).
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async redirects() {
    return [
      // /about was renamed to /who-we-are in the 2026-06-15 restructure.
      // Permanent redirect preserves any existing links/bookmarks.
      { source: "/about", destination: "/who-we-are", permanent: true },
    ];
  },
};

export default nextConfig;
