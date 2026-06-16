import type { MetadataRoute } from "next";
import { getAllArticleSlugs } from "./lib/articles";

/**
 * Sitemap for the public marketing site + published articles.
 * (Gated platform routes are intentionally excluded.)
 */
const BASE = "https://beforethefall.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = ["", "/what-we-offer", "/who-we-are", "/loved-one", "/news"].map(
    (path) => ({ url: `${BASE}${path}`, lastModified: now })
  );

  const slugs = await getAllArticleSlugs();
  const articleRoutes = slugs.map((slug) => ({
    url: `${BASE}/news/${slug}`,
    lastModified: now,
  }));

  return [...staticRoutes, ...articleRoutes];
}
