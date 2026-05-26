import Link from "next/link";
import PrintButton from "../../../components/PrintButton";

/**
 * /loved-one/resources/first-conversation — CRAFT-informed guidance on
 * approaching the struggling person for the first time.
 *
 * Sources cited per the platform Evidence Rule:
 *   - Meyers, R. J., & Smith, J. E. (1995, 2004). Clinical Guide to
 *     Alcohol Treatment: The Community Reinforcement Approach &
 *     Motivating Substance Abusers to Enter Treatment (CRAFT).
 *   - Roozen, H. G., et al. (2010). Meta-analysis of the effectiveness
 *     of CRAFT in engaging substance-using individuals in treatment.
 *     Drug and Alcohol Dependence, 109(1-3), 1–10.
 *   - SAMHSA. (2023). Resources for Families of People with
 *     Substance Use and Mental Health Disorders.
 */
export const dynamic = "force-static";

export default function FirstConversationPage() {
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
          For you · about 3 minutes
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light leading-tight mb-4">
          How to have the first conversation
        </h1>
        <p className="font-serif italic text-base text-btf-text-mid font-light leading-relaxed mb-8">
          The single biggest predictor of whether someone enters treatment is whether the people closest to them respond well when the topic comes up. This isn&rsquo;t about staging an intervention.
        </p>

        <div className="space-y-6 text-btf-text-dark font-light leading-relaxed">
          <section>
            <h2 className="font-serif text-xl text-btf-sky-deep font-medium mb-2">
              The timing matters more than the words
            </h2>
            <p className="text-sm">
              Pick a moment when they&rsquo;re sober (if substance) or calm (if mood/compulsion), well-fed, and there&rsquo;s no immediate exit pressure. CRAFT-trained clinicians describe this as the &ldquo;available moment&rdquo; — most failed first conversations happen because the timing was wrong, not because the words were.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-btf-sky-deep font-medium mb-2">
              Lead with what you&rsquo;ve noticed, not what they&rsquo;re doing wrong
            </h2>
            <p className="text-sm">
              The CRAFT communication framework uses a structure called <span className="italic">positive communication</span>: describe a specific recent observation, name the feeling it gave you, share a brief reason, take partial responsibility, and offer something concrete you can help with. In practice that sounds like:
            </p>
            <blockquote className="border-l-4 border-btf-gold pl-4 my-4 text-sm italic text-btf-text-mid">
              &ldquo;I noticed you haven&rsquo;t been sleeping the last few weeks. It&rsquo;s been making me worried — because I love you and I don&rsquo;t want to lose you. I know I&rsquo;ve been busy and probably hard to talk to. Is there anything I could do to make it easier?&rdquo;
            </blockquote>
            <p className="text-sm">
              Notice what&rsquo;s missing: no diagnosis, no accusation, no &ldquo;you need to.&rdquo; The whole point is to keep the conversation open.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-btf-sky-deep font-medium mb-2">
              Listen for what they&rsquo;re actually saying
            </h2>
            <p className="text-sm">
              People in trouble rarely lead with the truth in the first conversation. Listen for the seam — the moment they soften, or admit something smaller than the real thing. That&rsquo;s the entry point. CRAFT calls this <span className="italic">change talk</span>: any statement, however small, that signals readiness for something different.
            </p>
            <p className="text-sm mt-3">
              Examples of change talk: &ldquo;I&rsquo;ve been thinking about cutting back.&rdquo; &ldquo;I know it&rsquo;s not great.&rdquo; &ldquo;Maybe.&rdquo; When you hear one, respond with curiosity, not pressure. Ask what cutting back would look like to them. Then stop talking.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-btf-sky-deep font-medium mb-2">
              End with an offer, not a demand
            </h2>
            <p className="text-sm">
              Don&rsquo;t close the first conversation with &ldquo;so will you get help?&rdquo; That&rsquo;s an ultimatum and most struggling people will say no just to keep control. Close instead with: &ldquo;If you ever want to look at something together, there&rsquo;s a tool I came across.&rdquo;
            </p>
            <p className="text-sm mt-3">
              When the moment comes — days or weeks later — hand them the referral code. The platform takes them from there. Your job ends at the offer.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-btf-sky-deep font-medium mb-2">
              The most common mistake
            </h2>
            <p className="text-sm">
              Trying to make the first conversation be the last conversation. It almost never is. Plan for several over weeks or months. CRAFT data shows engagement happens after an average of 4–8 of these interactions, not 1.
            </p>
          </section>

          <section className="rounded-2xl bg-white border border-btf-sky-pale p-5 mt-8">
            <p className="text-[10px] tracking-[0.2em] uppercase text-btf-sky font-semibold mb-2">
              Sources
            </p>
            <p className="text-xs text-btf-text-mid font-light leading-relaxed">
              Meyers, R. J., &amp; Smith, J. E. (1995, 2004). Community Reinforcement Approach &amp; Family Training (CRAFT). Roozen, H. G., et al. (2010). <span className="italic">Drug and Alcohol Dependence</span>, 109. SAMHSA Family Resources (2023).
            </p>
          </section>
        </div>

        <div className="rounded-xl bg-btf-gold-pale/40 border border-btf-gold/30 text-btf-text-mid text-xs font-light p-4 mt-10 leading-relaxed">
          <span className="font-medium text-btf-sky-deep">
            Draft v1 &middot; closed beta:
          </span>{" "}
          pending clinical advisor review before public launch.
        </div>

        {/* Next */}
        <div className="mt-10">
          <Link
            href="/loved-one/resources/what-not-to-say"
            className="block rounded-2xl bg-white border-2 border-btf-sky-pale/60 hover:border-btf-sky-light p-4 transition-all"
          >
            <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-1">
              Next
            </p>
            <p className="font-medium text-btf-sky-deep">
              What not to say &rarr;
            </p>
          </Link>
        </div>
      </article>
    </main>
  );
}
