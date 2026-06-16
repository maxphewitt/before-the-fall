import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPassageById,
  PASSAGES,
  THEME_LABELS,
} from "../../../../lib/scripture";
import { SEASON_LABELS } from "../../../../lib/prayers";

/**
 * /catholic-path/scripture/[id] — single-passage detail.
 *
 * Shows full text (Douay-Rheims), citation, themes, reflection prompt,
 * and a CTA to launch the verse-by-verse walker.
 */
export const dynamic = "force-static";

export function generateStaticParams() {
  return PASSAGES.map((p) => ({ id: p.id }));
}

export default async function ScriptureDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const passage = getPassageById(id);
  if (!passage) notFound();

  const verseCount = passage.verses.length;
  const related = PASSAGES.filter(
    (p) =>
      p.id !== passage.id &&
      p.themes.some((t) => passage.themes.includes(t))
  ).slice(0, 3);

  return (
    <main className="min-h-screen bg-btf-off-white">
      <div className="max-w-2xl mx-auto px-6 py-10 sm:py-14">
        <Link
          href="/catholic-path/scripture"
          className="text-btf-text-light hover:text-btf-sky-deep text-sm mb-6 inline-flex items-center gap-2 transition-colors"
        >
          <span aria-hidden>&larr;</span> Daily Scripture
        </Link>

        <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">
          {passage.themes.map((t) => THEME_LABELS[t]).join(" · ")}
          {passage.season ? ` · ${SEASON_LABELS[passage.season]}` : ""}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light leading-tight mb-2">
          {passage.title}
        </h1>
        <p className="text-xs text-btf-text-light font-light mb-8">
          {passage.citation} &middot; {passage.translation} &middot; {verseCount} {verseCount === 1 ? "verse" : "verses"}
        </p>

        {/* When to read it */}
        <section className="rounded-2xl bg-white border border-btf-sky-pale p-5 mb-5">
          <p className="text-[10px] tracking-[0.2em] uppercase text-btf-sky font-semibold mb-2">
            When to read it
          </p>
          <p className="text-sm text-btf-text-mid font-light leading-relaxed">
            {passage.when_to_use}
          </p>
        </section>

        {/* Why it's on the platform — no preview of the actual verses */}
        <section className="rounded-2xl bg-white border border-btf-sky-pale p-5 mb-8">
          <p className="text-[10px] tracking-[0.2em] uppercase text-btf-sky font-semibold mb-2">
            Why this passage is here
          </p>
          <p className="text-sm text-btf-text-mid font-light leading-relaxed">
            This passage is part of the Daily Scripture library because it speaks directly to the kind of moment described above. In the guided reading you&rsquo;ll see one verse at a time &mdash; read it slowly, the way it was meant to be read. At the end, space to write what rises.
          </p>
        </section>

        {/* Read this slowly CTA */}
        <div className="mb-8">
          <Link
            href={`/catholic-path/scripture/${passage.id}/read`}
            className="block w-full text-center bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium px-8 py-4 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
          >
            Begin reading &rarr;
          </Link>
          <p className="text-xs text-btf-text-light font-light text-center mt-2">
            One verse per screen. Reflection prompt at the end. Optional save to journal.
          </p>
        </div>

        {/* Translation note — small print */}
        <section className="rounded-2xl bg-btf-off-white border border-btf-text-light/15 p-4 mb-8">
          <p className="text-[10px] tracking-[0.2em] uppercase text-btf-text-light font-semibold mb-2">
            About this translation
          </p>
          <p className="text-xs text-btf-text-mid font-light leading-relaxed">
            Douay-Rheims (Challoner revision, 1750s). A complete English Catholic Bible. Public domain &mdash; no licensing required. NABRE (default at US Catholic Masses) and RSV-2CE coming once we resolve translation licensing (Task #16).
          </p>
        </section>

        {/* DRAFT v1 banner */}
        <div className="rounded-xl bg-btf-gold-pale/40 border border-btf-gold/30 text-btf-text-mid text-xs font-light p-4 mb-10 leading-relaxed">
          <span className="font-medium text-btf-sky-deep">
            Draft v1 &middot; closed beta:
          </span>{" "}
          pending Father Murphy review before public launch.
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section>
            <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">
              Related passages
            </p>
            <ul className="grid gap-3">
              {related.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/catholic-path/scripture/${r.id}`}
                    className="block rounded-xl bg-white border border-btf-sky-pale/60 hover:border-btf-sky-light hover:shadow-md p-4 transition-all"
                  >
                    <p className="font-medium text-btf-sky-deep">{r.title}</p>
                    <p className="text-xs text-btf-text-light font-light mt-0.5">
                      {r.citation}
                    </p>
                    <p className="text-xs text-btf-text-mid font-light mt-1 leading-relaxed">
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
