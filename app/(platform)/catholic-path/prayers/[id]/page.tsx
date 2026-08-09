import Link from "next/link";
import { notFound } from "next/navigation";
import BackLink from "../../../_nav/BackLink";
import {
  getPrayerById,
  PRAYERS,
  CATEGORY_LABELS,
  SEASON_LABELS,
} from "../../../../lib/prayers";

/**
 * /catholic-path/prayers/[id] — single-prayer detail.
 *
 * Shows full text, metadata, source URL, "when to use," and a CTA to
 * launch the "Pray this" walker. Also surfaces 2-3 related prayers
 * (same category, excluding self).
 */
export const dynamic = "force-static";

export function generateStaticParams() {
  return PRAYERS.map((p) => ({ id: p.id }));
}

export default async function PrayerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prayer = getPrayerById(id);
  if (!prayer) notFound();

  const related = PRAYERS.filter(
    (p) => p.category === prayer.category && p.id !== prayer.id
  ).slice(0, 3);

  return (
    <main className="min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-10 sm:py-14">
        <BackLink
          fallbackHref="/catholic-path/prayers"
          label="Prayer Library"
          className="text-white/70 hover:text-white text-sm mb-6 inline-flex items-center gap-2 transition-colors"
        />

        <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">
          {CATEGORY_LABELS[prayer.category]}
          {prayer.season ? ` · ${SEASON_LABELS[prayer.season]}` : ""}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-[#e9f1f8] font-light leading-tight mb-3">
          {prayer.title}
        </h1>
        <p className="text-xs text-[#9fb6c8] font-light leading-relaxed mb-8">
          {prayer.author}
        </p>

        {/* When to use */}
        <section className="rounded-2xl bg-white/[0.055] border border-white/[0.09] p-5 mb-5">
          <p className="text-[10px] tracking-[0.2em] uppercase text-btf-gold font-semibold mb-2">
            When to use it
          </p>
          <p className="text-sm text-white/85 font-light leading-relaxed">
            {prayer.when_to_use}
          </p>
        </section>

        {/* Pray this CTA */}
        <div className="mb-8">
          <Link
            href={`/catholic-path/prayers/${prayer.id}/pray`}
            className="block w-full text-center bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium px-8 py-4 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
          >
            Begin praying →
          </Link>
          <p className="text-xs text-[#9fb6c8] font-light text-center mt-2">
            One line at a time. Optional intention save to your journal at the end.
          </p>
        </div>

        {/* Source */}
        <section className="rounded-2xl bg-white/[0.04] border border-white/[0.09] p-4 mb-8">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#9fb6c8] font-semibold mb-2">
            Source
          </p>
          <a
            href={prayer.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-btf-gold-light underline underline-offset-4 break-all hover:text-btf-gold"
          >
            {prayer.source_url}
          </a>
          <p className="text-[10px] text-[#9fb6c8] font-light mt-2 leading-relaxed">
            Prayer text is public-domain traditional Catholic prayer. The source URL is provided for verification, not because the platform claims ownership of the text.
          </p>
        </section>

        {/* DRAFT v1 banner */}
        <div className="rounded-xl bg-white/[0.04] border border-btf-gold/25 text-white/70 text-xs font-light p-4 mb-10 leading-relaxed">
          <span className="font-medium text-[#e9f1f8]">
            Draft v1 &middot; closed beta:
          </span>{" "}
          this prayer is pending sign-off by Father Murphy before public launch. It is not a substitute for the sacraments. If you&rsquo;re in immediate danger, use the crisis button at the bottom of the screen.
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section>
            <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">
              More in {CATEGORY_LABELS[prayer.category]}
            </p>
            <ul className="grid gap-3">
              {related.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/catholic-path/prayers/${r.id}`}
                    className="block rounded-xl bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/40 hover:bg-white/[0.08] p-4 transition-all"
                  >
                    <p className="font-medium text-[#e9f1f8]">{r.title}</p>
                    <p className="text-xs text-white/70 font-light mt-1 leading-relaxed">
                      {r.when_to_use}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
