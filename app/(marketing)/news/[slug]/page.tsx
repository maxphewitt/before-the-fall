import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getArticleBySlug,
  getAllArticleSlugs,
} from "../../../lib/articles";
import { PortableText } from "../../../lib/portableText";

/**
 * /news/[slug] — a single published article, sourced from Sanity.
 *
 * SEO: per-article <title>/description/OG from the CMS SEO fields (with
 * sensible fallbacks), plus JSON-LD Article structured data. Body is
 * rendered by the dependency-free Portable Text renderer.
 */
export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Not found — Before the Fall" };

  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt || undefined;
  const image = article.ogImageUrl || article.coverImageUrl;

  return {
    title: `${title} — Before the Fall`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.publishedAt || undefined,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function formatDate(iso: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? null
    : d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const date = formatDate(article.publishedAt);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt || undefined,
    datePublished: article.publishedAt || undefined,
    author: article.author
      ? { "@type": "Person", name: article.author }
      : { "@type": "Organization", name: "Before the Fall" },
    image: article.coverImageUrl || undefined,
    publisher: {
      "@type": "Organization",
      name: "Before the Fall",
    },
  };

  return (
    <article className="bg-btf-off-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="relative bg-btf-sky-deep text-white overflow-hidden btf-grain">
        <div className="btf-aurora" aria-hidden>
          <div className="btf-orb btf-orb--sky-2" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-12 sm:pt-20">
          <Link
            href="/news"
            className="text-white/60 hover:text-white text-xs inline-flex items-center gap-2 transition-colors uppercase tracking-[0.25em] mb-8"
          >
            <span aria-hidden>←</span> News &amp; Articles
          </Link>
          <h1 className="font-serif text-3xl md:text-5xl font-light leading-[1.15] mb-4 btf-fade-up">
            {article.title}
          </h1>
          <p className="text-sm text-white/70 font-light btf-fade-up btf-d-1">
            {[article.author, date].filter(Boolean).join(" · ")}
          </p>
        </div>
      </header>

      {/* Cover */}
      {article.coverImageUrl && (
        <div className="max-w-3xl mx-auto px-6 -mt-8 relative z-10">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-lg bg-btf-sky-pale">
            <Image
              src={article.coverImageUrl}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Body */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        {article.excerpt && (
          <p className="font-serif italic text-xl text-btf-text-mid leading-relaxed mb-8">
            {article.excerpt}
          </p>
        )}
        <PortableText blocks={article.body} />

        <div className="mt-12 pt-8 border-t border-btf-text-light/15">
          <Link
            href="/news"
            className="text-btf-sky font-medium hover:text-btf-sky-deep transition-colors"
          >
            ← Back to all articles
          </Link>
        </div>
      </div>
    </article>
  );
}
