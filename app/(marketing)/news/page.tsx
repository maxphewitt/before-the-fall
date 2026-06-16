import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllArticles } from "../../lib/articles";

/**
 * /news — public News & Articles index, sourced from Sanity.
 *
 * Shows newest posts as cards. When there's no content yet (or Sanity
 * isn't configured), it renders a calm empty state rather than a broken
 * page. Header + footer come from the marketing layout.
 */
export const revalidate = 60;

export const metadata: Metadata = {
  title: "News & Articles — Before the Fall",
  description:
    "The newest writing, news, and insight from Before the Fall.",
};

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

export default async function NewsIndex() {
  const articles = await getAllArticles(50);

  return (
    <>
      <header className="relative bg-btf-sky-deep text-white overflow-hidden btf-grain">
        <div className="btf-aurora" aria-hidden>
          <div className="btf-orb btf-orb--gold" />
          <div className="btf-orb btf-orb--sky" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 py-20 sm:py-24 text-center">
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3 btf-fade-up">
            News &amp; Articles
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light leading-tight btf-fade-up btf-d-1">
            Stories from the work.
          </h1>
        </div>
      </header>

      <section className="py-16 px-6 bg-btf-off-white min-h-[40vh]">
        <div className="max-w-5xl mx-auto">
          {articles.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-16">
              <div className="relative w-9 h-9 mx-auto mb-6" aria-hidden>
                <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1.5 h-9 bg-btf-gold/70 rounded-sm" />
                <div className="absolute left-1/2 top-2 -translate-x-1/2 w-6 h-1.5 bg-btf-gold/70 rounded-sm" />
              </div>
              <h2 className="font-serif text-2xl text-btf-sky-deep font-light mb-3">
                Nothing published yet.
              </h2>
              <p className="text-btf-text-mid font-light leading-relaxed">
                The first articles and news are on the way. In the meantime,
                learn{" "}
                <Link
                  href="/what-we-offer"
                  className="text-btf-sky underline underline-offset-2 hover:text-btf-sky-deep"
                >
                  what we offer
                </Link>{" "}
                or{" "}
                <Link
                  href="/who-we-are"
                  className="text-btf-sky underline underline-offset-2 hover:text-btf-sky-deep"
                >
                  who we are
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((a) => {
                const date = formatDate(a.publishedAt);
                return (
                  <Link
                    key={a.slug}
                    href={`/news/${a.slug}`}
                    className="btf-rise group rounded-2xl bg-white border border-btf-sky-pale overflow-hidden flex flex-col cursor-pointer"
                  >
                    {a.imageUrl ? (
                      <div className="relative aspect-[16/9] bg-btf-sky-pale/50 overflow-hidden">
                        <Image
                          src={a.imageUrl}
                          alt=""
                          fill
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/9] bg-gradient-to-br from-btf-sky-deep to-btf-sky" />
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-btf-gold font-semibold mb-2">
                        {a.source ?? "Article"}
                      </p>
                      <h3 className="font-serif text-xl text-btf-sky-deep leading-snug mb-2 group-hover:text-btf-sky transition-colors">
                        {a.title}
                      </h3>
                      {a.excerpt && (
                        <p className="text-sm text-btf-text-mid font-light leading-relaxed flex-1">
                          {a.excerpt}
                        </p>
                      )}
                      {date && (
                        <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-btf-text-light font-medium">
                          {date}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
