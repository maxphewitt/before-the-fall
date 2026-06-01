import Link from "next/link";
import { notFound } from "next/navigation";
import { EXERCISES, getExerciseBySlug } from "../../lib/tools";
import { getCurrentUserId } from "../../lib/session";
import OnboardingRequired from "../../components/OnboardingRequired";

// Beta posture: per-tester gate. Renders dynamically so the cookie
// check happens per request. generateStaticParams stays for routing
// hints.
export const dynamic = "force-dynamic";

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

  const userId = await getCurrentUserId();
  if (!userId) return <OnboardingRequired returnTo={`/tools/${slug}`} />;

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

        {/* Why this is one of the six — pastoral framing of the clinical
            mechanism, no step-by-step content. The walker has the steps. */}
        <section className="rounded-2xl bg-white border border-btf-sky-pale p-6 mb-8">
          <p className="text-[10px] tracking-[0.2em] uppercase text-btf-sky font-semibold mb-2">
            Why this is one of the six
          </p>
          <p className="text-btf-text-mid font-light leading-relaxed">
            {ex.mechanism}
          </p>
        </section>

        {/* Start walker CTA */}
        <div className="mb-8">
          <Link
            href={`/tools/${ex.slug}/start`}
            className="block w-full text-center bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium px-8 py-4 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
          >
            Begin →
          </Link>
          <p className="text-xs text-btf-text-light font-light text-center mt-2">
            We&rsquo;ll walk you through it step by step and save your notes to your journal.
          </p>
        </div>

        {/* Source — small print at bottom */}
        <section className="rounded-2xl bg-btf-off-white border border-btf-text-light/15 p-5 mb-6">
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
