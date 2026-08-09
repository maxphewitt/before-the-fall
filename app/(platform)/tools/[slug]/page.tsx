import Link from "next/link";
import { notFound } from "next/navigation";
import BackLink from "../../_nav/BackLink";
import { EXERCISES, getExerciseBySlug, getResearchForSlug } from "../../../lib/tools";
import { getCurrentUserId } from "../../../lib/session";
import OnboardingRequired from "../../../components/OnboardingRequired";

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

  const research = getResearchForSlug(slug);

  return (
    <main className="px-6 py-10 sm:py-14">
      <div className="max-w-2xl mx-auto">
        <BackLink
          fallbackHref="/tools"
          label="All tools"
          className="text-white/70 hover:text-white text-sm mb-6 inline-flex items-center gap-2 transition-colors"
        />

        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
          Self-help tool
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-3">
          {ex.name}
        </h1>
        <p className="font-serif italic text-lg text-white/70 font-light leading-relaxed mb-8">
          {ex.tagline}
        </p>

        {/* When to use */}
        <section className="rounded-2xl bg-white/[0.055] border border-white/[0.09] p-6 mb-5">
          <p className="text-[10px] tracking-[0.2em] uppercase text-btf-gold-light font-semibold mb-2">
            When to use it
          </p>
          <p className="text-white/70 font-light leading-relaxed">
            {ex.whenToUse}
          </p>
          {ex.estimatedTime && (
            <p className="text-xs text-[#9fb6c8] font-light mt-3">
              <span className="uppercase tracking-widest">Time:</span> {ex.estimatedTime}
            </p>
          )}
        </section>

        {/* Why this is one of the six — pastoral framing of the clinical
            mechanism, no step-by-step content. The walker has the steps. */}
        <section className="rounded-2xl bg-white/[0.055] border border-white/[0.09] p-6 mb-8">
          <p className="text-[10px] tracking-[0.2em] uppercase text-btf-gold-light font-semibold mb-2">
            Why this is one of the six
          </p>
          <p className="text-white/70 font-light leading-relaxed">
            {ex.mechanism}
          </p>
        </section>

        {/* Start walker CTA */}
        <div className="mb-8">
          <Link
            href={`/tools/${ex.slug}/start`}
            className="block w-full text-center bg-gradient-to-b from-btf-gold-light to-btf-gold text-[#2a2008] font-bold px-8 py-4 rounded-full shadow-[0_10px_24px_-10px_rgba(201,168,76,0.8)] hover:-translate-y-0.5 transition-transform"
          >
            Begin →
          </Link>
          <p className="text-xs text-[#9fb6c8] font-light text-center mt-2">
            We&rsquo;ll walk you through it step by step and save your notes to your journal.
          </p>
        </div>

        {/* Research behind this method — verified, linked citations */}
        <section className="rounded-2xl bg-white/[0.055] border border-white/[0.09] p-6 mb-6">
          <p className="text-[10px] tracking-[0.2em] uppercase text-btf-gold-light font-semibold mb-4">
            Research behind this method
          </p>
          {research.length > 0 ? (
            <ul className="space-y-4">
              {research.map((ref) => (
                <li key={ref.citation} className="text-sm">
                  {ref.url ? (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-btf-gold-light font-medium underline underline-offset-2 hover:text-btf-gold inline-flex items-start gap-1"
                    >
                      {ref.citation}
                      <span aria-hidden className="text-white/70">↗</span>
                    </a>
                  ) : (
                    <span className="text-[#e9f1f8] font-medium">{ref.citation}</span>
                  )}
                  <p className="text-white/70 font-light leading-relaxed mt-1">
                    {ref.note}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-white/70 font-light leading-relaxed">
              {ex.source}
            </p>
          )}
        </section>

        {/* DRAFT v1 disclaimer */}
        <div className="rounded-xl bg-btf-gold/[0.14] border border-btf-gold/30 text-white/70 text-xs font-light p-4 mb-10 leading-relaxed">
          <span className="font-medium text-btf-gold-light">Draft v1 &middot; closed beta:</span> this description is pending sign-off by our clinical advisor before public launch. It is not a substitute for a clinician. If you&rsquo;re in immediate danger, use the crisis button at the bottom of the screen.
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
                    className="block rounded-xl bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/40 hover:bg-white/[0.08] p-4 transition-all"
                  >
                    <p className="font-medium text-[#e9f1f8]">{rel.name}</p>
                    <p className="text-xs text-white/70 font-light mt-1 leading-relaxed">
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
