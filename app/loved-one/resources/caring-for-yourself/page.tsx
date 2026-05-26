import Link from "next/link";

/**
 * /loved-one/resources/caring-for-yourself — CSO burnout literature
 * applied to practical guidance.
 */
export const dynamic = "force-static";

export default function CaringForYourselfPage() {
  return (
    <main className="min-h-screen bg-btf-off-white px-6 py-10 sm:py-14">
      <article className="max-w-2xl mx-auto">
        <Link
          href="/loved-one/result"
          className="text-btf-text-light hover:text-btf-sky-deep text-sm mb-6 inline-flex items-center gap-2 transition-colors"
        >
          <span aria-hidden>&larr;</span> Resources
        </Link>

        <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">
          For you · about 3 minutes
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light leading-tight mb-4">
          Caring for yourself while you wait
        </h1>
        <p className="font-serif italic text-base text-btf-text-mid font-light leading-relaxed mb-8">
          The clinical literature on Concerned Significant Others is consistent: caregivers of people with compulsive or self-destructive behaviors show elevated rates of depression, anxiety, and burnout — at rates comparable to caregivers of patients with chronic medical illness. None of this is weakness. It&rsquo;s information.
        </p>

        <div className="space-y-6 text-btf-text-dark font-light leading-relaxed">
          <section>
            <h2 className="font-serif text-xl text-btf-sky-deep font-medium mb-2">
              You are not their solution
            </h2>
            <p className="text-sm">
              Three decades of CRAFT research shows that the people whose loved ones enter treatment most successfully are the ones who keep their own lives intact while the situation unfolds. The opposite — putting your life on hold, organizing every conversation around them — correlates with worse outcomes, not better. Your wholeness is part of the path, not a distraction from it.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-btf-sky-deep font-medium mb-2">
              The three things that actually help you
            </h2>
            <p className="text-sm">
              When the literature on CSO outcomes is pooled — Roozen et al. (2010), Smedslund Cochrane Review (2017), Orford et al. (2010) — three predictors keep showing up:
            </p>
            <ol className="list-decimal list-outside ml-5 mt-3 space-y-2 text-sm">
              <li>
                <span className="font-medium text-btf-sky-deep">
                  Talking to someone trained in CSO support.
                </span>{" "}
                Not a friend who&rsquo;s sympathetic. Someone — Al-Anon, SMART F&amp;F, a CRAFT-trained therapist, a chaplain experienced with these situations — who knows the patterns. SAMHSA at 1-800-662-4357 can refer.
              </li>
              <li>
                <span className="font-medium text-btf-sky-deep">
                  Maintaining one ordinary structure of your day.
                </span>{" "}
                Sleep, meals, work, prayer if it&rsquo;s yours, exercise. Pick one to defend. The others can drift. The one you defend becomes the platform you stand on.
              </li>
              <li>
                <span className="font-medium text-btf-sky-deep">
                  Naming when it&rsquo;s getting worse for you specifically.
                </span>{" "}
                Symptoms of CSO burnout: persistent dread, intrusive thoughts about their behavior, inability to relax even when they&rsquo;re safe, resentment that surprises you, physical symptoms (headaches, stomach, sleep). If three of those are present for two weeks, you&rsquo;re past the &ldquo;caring&rdquo; stage and into &ldquo;impacted.&rdquo; That&rsquo;s a normal response, not a failure, and it&rsquo;s also the moment to get support of your own.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-xl text-btf-sky-deep font-medium mb-2">
              On the Catholic side
            </h2>
            <p className="text-sm">
              If your faith is alive: bring this to confession. Bring it to adoration. The Examen of St. Ignatius at the end of the day is, among other things, a structured way to lay down what you cannot fix tonight. You are praying for them — that&rsquo;s not nothing. St. Monica prayed for her son for seventeen years before he became St. Augustine. That&rsquo;s a long arc, and it&rsquo;s in the canon.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-btf-sky-deep font-medium mb-2">
              What you don&rsquo;t owe
            </h2>
            <p className="text-sm">
              You don&rsquo;t owe them perfect patience. You don&rsquo;t owe them silence about how this is affecting you. You don&rsquo;t owe them rescue from natural consequences. You don&rsquo;t owe them your sleep, your job, or your other relationships. CRAFT explicitly trains CSOs to step back from <span className="italic">enabling</span> — the well-intentioned behaviors that make the next episode possible. Stepping back is not abandonment; it&rsquo;s love that doesn&rsquo;t feed the thing.
            </p>
          </section>

          <section className="rounded-2xl bg-white border border-btf-sky-pale p-5 mt-8">
            <p className="text-[10px] tracking-[0.2em] uppercase text-btf-sky font-semibold mb-2">
              Sources
            </p>
            <p className="text-xs text-btf-text-mid font-light leading-relaxed">
              Roozen, H. G., et al. (2010). <span className="italic">Drug and Alcohol Dependence</span>, 109. Smedslund, G., et al. (2017). Cochrane Database of Systematic Reviews — Family interventions for substance use. Orford, J., et al. (2010). <span className="italic">Drug and Alcohol Dependence</span>, 109 — &ldquo;The 5-Step Family Intervention.&rdquo; SAMHSA Family Resources (2023).
            </p>
          </section>
        </div>

        <div className="rounded-xl bg-btf-gold-pale/40 border border-btf-gold/30 text-btf-text-mid text-xs font-light p-4 mt-10 leading-relaxed">
          <span className="font-medium text-btf-sky-deep">
            Draft v1 &middot; closed beta:
          </span>{" "}
          pending clinical advisor review before public launch.
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/loved-one/result"
            className="text-btf-text-light hover:text-btf-sky-deep text-sm inline-flex items-center gap-2 transition-colors uppercase tracking-[0.25em]"
          >
            <span aria-hidden>&larr;</span> Back to your code
          </Link>
        </div>
      </article>
    </main>
  );
}
