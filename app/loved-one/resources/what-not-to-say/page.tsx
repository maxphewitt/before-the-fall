import Link from "next/link";
import PrintButton from "../../../components/PrintButton";

/**
 * /loved-one/resources/what-not-to-say — common harmful patterns and
 * what to say instead. CRAFT + Motivational Interviewing.
 */
export const dynamic = "force-static";

const PAIRS: { dont: string; do: string; why: string }[] = [
  {
    dont: "If you really loved me, you&rsquo;d stop.",
    do: "I love you, and I&rsquo;m worried.",
    why: "Conditional-love framing weaponizes the relationship. CRAFT consistently shows that ultimatums increase the struggling person&rsquo;s defensiveness and decrease their willingness to engage.",
  },
  {
    dont: "I&rsquo;m done. I can&rsquo;t do this anymore.",
    do: "I&rsquo;m tired. I need a break. I&rsquo;ll come back to this with you.",
    why: "&ldquo;I&rsquo;m done&rdquo; closes the door. &ldquo;I need a break&rdquo; signals limits without abandonment, which CRAFT calls &ldquo;clear boundary&rdquo; communication.",
  },
  {
    dont: "You&rsquo;re destroying our family.",
    do: "What&rsquo;s happening is hard for all of us.",
    why: "&ldquo;You&rsquo;re destroying&rdquo; centers blame and triggers shame, which research shows correlates with relapse, not recovery. The reframed version names the shared reality without assigning singular cause.",
  },
  {
    dont: "Just stop. You&rsquo;re not even trying.",
    do: "I know this is harder than I can see from the outside.",
    why: "&ldquo;Just stop&rdquo; demonstrates a misunderstanding of how compulsion works clinically — addictions and compulsions are not failures of willpower. The reframe creates the &ldquo;accurate empathy&rdquo; that Motivational Interviewing identifies as a predictor of engagement.",
  },
  {
    dont: "Everyone is talking about you.",
    do: "This is between us right now.",
    why: "Triangulation (&ldquo;everyone says&rdquo;) increases isolation, which is itself a risk factor for compulsion. Dyadic framing preserves dignity.",
  },
  {
    dont: "You should be ashamed.",
    do: "I&rsquo;m not angry. I&rsquo;m here.",
    why: "Shame is the strongest single predictor of continued compulsive behavior in the addictions literature. Inducing shame is iatrogenic — it makes the thing worse.",
  },
];

export default function WhatNotToSayPage() {
  return (
    <main className="min-h-screen bg-btf-off-white px-6 py-10 sm:py-14">
      <article className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/loved-one/result"
            className="text-btf-text-light hover:text-btf-sky-deep text-sm inline-flex items-center gap-2 transition-colors"
          >
            <span aria-hidden>&larr;</span> Resources
          </Link>
          <PrintButton />
        </div>

        <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">
          For you · about 2 minutes
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light leading-tight mb-4">
          What not to say
        </h1>
        <p className="font-serif italic text-base text-btf-text-mid font-light leading-relaxed mb-8">
          Most of these are things loving people say in good faith. The research shows they reliably close the conversation instead of opening it. Each pair below has the phrase, what to say instead, and why.
        </p>

        <ul className="space-y-5">
          {PAIRS.map((p, i) => (
            <li
              key={i}
              className="rounded-2xl bg-white border-2 border-btf-sky-pale/60 p-5"
            >
              <p className="text-[10px] tracking-[0.2em] uppercase text-red-700 font-semibold mb-2">
                Don&rsquo;t
              </p>
              <p
                className="font-serif italic text-base text-btf-text-dark mb-4"
                dangerouslySetInnerHTML={{ __html: `&ldquo;${p.dont}&rdquo;` }}
              />
              <p className="text-[10px] tracking-[0.2em] uppercase text-btf-sky-deep font-semibold mb-2">
                Try instead
              </p>
              <p
                className="font-serif italic text-base text-btf-sky-deep mb-4"
                dangerouslySetInnerHTML={{ __html: `&ldquo;${p.do}&rdquo;` }}
              />
              <p className="text-[10px] tracking-[0.2em] uppercase text-btf-text-light font-semibold mb-1">
                Why
              </p>
              <p
                className="text-xs text-btf-text-mid font-light leading-relaxed"
                dangerouslySetInnerHTML={{ __html: p.why }}
              />
            </li>
          ))}
        </ul>

        <section className="rounded-2xl bg-white border border-btf-sky-pale p-5 mt-8">
          <p className="text-[10px] tracking-[0.2em] uppercase text-btf-sky font-semibold mb-2">
            Sources
          </p>
          <p className="text-xs text-btf-text-mid font-light leading-relaxed">
            Meyers, R. J., &amp; Smith, J. E. (1995, 2004) — CRAFT. Miller, W. R., &amp; Rollnick, S. (2013). Motivational Interviewing, 3rd ed. Brown, B. (2012) on shame and behavior change. Sources align with the Cochrane Review on family-based interventions for substance use (Smedslund et al., 2017).
          </p>
        </section>

        <div className="rounded-xl bg-btf-gold-pale/40 border border-btf-gold/30 text-btf-text-mid text-xs font-light p-4 mt-10 leading-relaxed">
          <span className="font-medium text-btf-sky-deep">
            Draft v1 &middot; closed beta:
          </span>{" "}
          pending clinical advisor review before public launch.
        </div>

        <div className="mt-10">
          <Link
            href="/loved-one/resources/caring-for-yourself"
            className="block rounded-2xl bg-white border-2 border-btf-sky-pale/60 hover:border-btf-sky-light p-4 transition-all"
          >
            <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-1">
              Next
            </p>
            <p className="font-medium text-btf-sky-deep">
              Caring for yourself while you wait &rarr;
            </p>
          </Link>
        </div>
      </article>
    </main>
  );
}
