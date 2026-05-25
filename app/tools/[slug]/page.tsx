import Link from "next/link";
import { notFound } from "next/navigation";
import { EXERCISES, getExerciseBySlug } from "../../lib/tools";

/**
 * Dynamic page that renders one of the six Tier 1 exercises.
 * Static-export friendly via generateStaticParams.
 *
 * In Next 15+, dynamic route `params` is a Promise. Await it.
 */
export function generateStaticParams() {
  return EXERCISES.map((e) => ({ slug: e.slug }));
}

export default async function ExercisePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ex = getExerciseBySlug(slug);
  if (!ex) notFound();

  const relatedExercises = ex.related
    .map((s) => getExerciseBySlug(s))
    .filter((e): e is NonNullable<typeof e> => e !== undefined);

  return (
    <main className="min-h-screen bg-btf-off-white px-6 py-10 sm:py-14">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/tools"
          className="text-btf-text-light hover:text-btf-sky-deep text-sm mb-6 inline-flex items-center gap-2 transition-colors"
        >
          <span aria-hidden>&larr;</span> All tools
        </Link>

        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
          Self-help tool
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light leading-tight mb-3">
          {ex.name}
        </h1>
        <p className="font-serif italic text-lg text-btf-text-mid font-light leading-relaxed mb-8">
          {ex.tagline}
        </p>

        {/* When to use */}
        <section className="rounded-2xl bg-white border border-btf-sky-pale p-6 mb-5">
          <p className="text-[10px] tracking-[0.2em] uppercase text-btf-sky font-semibold mb-2">
            When to use it
          </p>
          <p className="text-btf-text-mid font-light leading-relaxed">
            {ex.whenToUse}
          </p>
          {ex.estimatedTime && (
            <p className="text-xs text-btf-text-light font-light mt-3">
              <span className="uppercase tracking-widest">Time:</span> {ex.estimatedTime}
            </p>
          )}
        </section>

        {/* Instructions */}
        <section className="rounded-2xl bg-white border-2 border-btf-gold/30 p-6 mb-5">
          <p className="text-[10px] tracking-[0.2em] uppercase text-btf-gold font-semibold mb-4">
            {ex.instructionsHeader}
          </p>
          <ol className="space-y-4">
            {ex.instructions.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span
                  aria-hidden
                  className="flex-shrink-0 w-8 h-8 rounded-full bg-btf-gold-pale text-btf-sky-deep font-medium text-sm flex items-center justify-center mt-0.5"
                >
                  {i + 1}
                </span>
                <div>
                  {step.heading && (
                    <p className="font-medium text-btf-sky-deep mb-1">
                      {step.heading}
                    </p>
                  )}
                  <p className="text-sm text-btf-text-mid font-light leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          {ex.instructionsNote && (
            <p className="text-sm text-btf-text-mid font-light leading-relaxed mt-5 pt-5 border-t border-btf-text-light/15 italic">
              {ex.instructionsNote}
            </p>
          )}
        </section>

        {/* Start walker CTA */}
        <div className="mb-5">
          <Link
            href={`/tools/${ex.slug}/start`}
            className="block w-full text-center bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium px-8 py-4 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
          >
            Start walking through it →
          </Link>
          <p className="text-xs text-btf-text-light font-light text-center mt-2">
            We&rsquo;ll guide you step by step and save your notes to your journal.
          </p>
        </div>

        {/* Mechanism */}
        <section className="rounded-2xl bg-white border border-btf-sky-pale p-6 mb-5">
          <p className="text-[10px] tracking-[0.2em] uppercase text-btf-sky font-semibold mb-2">
            Why it works
          </p>
          <p className="text-btf-text-mid font-light leading-relaxed">
            {ex.mechanism}
          </p>
        </section>

        {/* Source */}
        <section className="rounded-2xl bg-btf-off-white border border-btf-text-light/15 p-5 mb-8">
          <p className="text-[10px] tracking-[0.2em] uppercase text-btf-text-light font-semibold mb-2">
            Source
          </p>
          <p className="text-xs text-btf-text-mid font-light leading-relaxed">
            {ex.source}
          </p>
        </section>

        {/* DRAFT v1 disclaimer */}
        <div className="rounded-xl bg-btf-gold-pale/40 border border-btf-gold/30 text-btf-text-mid text-xs font-light p-4 mb-10 leading-relaxed">
          <span className="font-medium text-btf-sky-deep">Draft v1 &middot; closed beta:</span> this description is pending sign-off by our clinical advisor before public launch. It is not a substitute for a clinician. If you&rsquo;re in immediate danger, use the crisis button at the bottom of the screen.
        </div>

        {/* Related */}
        {relatedExercises.length > 0 && (
          <section>
            <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
              Related
            </p>
            <ul className="grid sm:grid-cols-2 gap-3">
              {relatedExercises.map((rel) => (
                <li key={rel.slug}>
                  <Link
                    href={`/tools/${rel.slug}`}
                    className="block rounded-xl bg-white border border-btf-sky-pale/60 hover:border-btf-sky-light hover:shadow-md p-4 transition-all"
                  >
                    <p className="font-medium text-btf-sky-deep">{rel.name}</p>
                    <p className="text-xs text-btf-text-mid font-light mt-1 leading-relaxed">
                      {rel.tagline}
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
