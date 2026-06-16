/**
 * Article data — sourced from Sanity (see app/lib/sanity.ts).
 *
 * The homepage carousel and the /news pages both read through these
 * functions, so the rest of the app never talks to the CMS directly.
 * When Sanity isn't configured yet, every function returns empty and
 * the site shows its "coming soon" fallbacks.
 */
import { sanityFetch, urlForImage, sanityConfigured } from "./sanity";

/** A Portable Text block (loose — the renderer narrows as needed). */
export type PortableBlock = {
  _type: string;
  _key?: string;
  style?: string;
  listItem?: string;
  level?: number;
  children?: { _key?: string; text?: string; marks?: string[] }[];
  markDefs?: { _key: string; _type: string; href?: string }[];
  asset?: { _ref?: string };
  alt?: string;
};

/** Card-level article (carousel slide, /news list). */
export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  source?: string;
  url?: string;
  imageUrl?: string;
  publishedAt: string;
};

/** Full article for /news/[slug]. */
export type ArticleDetail = {
  slug: string;
  title: string;
  excerpt: string;
  body: PortableBlock[];
  publishedAt: string;
  author?: string;
  coverImageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImageUrl?: string;
};

type ListRow = {
  title: string;
  slug: string;
  excerpt?: string;
  source?: string;
  publishedAt?: string;
  imageRef?: string;
};

const LIST_PROJECTION = `{
  title,
  "slug": slug.current,
  excerpt,
  "source": coalesce(category->title, "Article"),
  publishedAt,
  "imageRef": coverImage.asset._ref
}`;

/** Newest published posts, mapped to carousel/list cards. */
export async function getLatestArticles(limit = 5): Promise<Article[]> {
  if (!sanityConfigured) return [];
  const query = `*[_type == "post" && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc)[0...$limit] ${LIST_PROJECTION}`;
  const rows = await sanityFetch<ListRow[]>(query, { limit });
  if (!rows) return [];
  return rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? "",
    source: r.source,
    url: `/news/${r.slug}`,
    imageUrl: urlForImage(r.imageRef, 1200) ?? undefined,
    publishedAt: r.publishedAt ?? "",
  }));
}

/** All posts for the /news index (larger cap). */
export async function getAllArticles(limit = 50): Promise<Article[]> {
  return getLatestArticles(limit);
}

/** Slugs for sitemap + static params. */
export async function getAllArticleSlugs(): Promise<string[]> {
  if (!sanityConfigured) return [];
  const slugs = await sanityFetch<string[]>(
    `*[_type == "post" && defined(slug.current)].slug.current`
  );
  return slugs ?? [];
}

type DetailRow = {
  title: string;
  slug: string;
  excerpt?: string;
  body?: PortableBlock[];
  publishedAt?: string;
  author?: string;
  coverRef?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoImageRef?: string;
};

/** One published post by slug, or null. */
export async function getArticleBySlug(
  slug: string
): Promise<ArticleDetail | null> {
  if (!sanityConfigured) return null;
  const query = `*[_type == "post" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    excerpt,
    body,
    publishedAt,
    "author": author->name,
    "coverRef": coverImage.asset._ref,
    "seoTitle": seo.metaTitle,
    "seoDescription": seo.metaDescription,
    "seoImageRef": seo.ogImage.asset._ref
  }`;
  const row = await sanityFetch<DetailRow | null>(query, { slug });
  if (!row) return null;
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    body: row.body ?? [],
    publishedAt: row.publishedAt ?? "",
    author: row.author,
    coverImageUrl: urlForImage(row.coverRef, 1600) ?? undefined,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    ogImageUrl: urlForImage(row.seoImageRef, 1200) ?? undefined,
  };
}
