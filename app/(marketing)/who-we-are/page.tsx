import type { Metadata } from "next";

/**
 * /who-we-are — public marketing page (migrated from the former
 * /about). Header + footer come from app/(marketing)/layout.tsx, so
 * this renders only the page body. The old /about path 301-redirects
 * here (see next.config.ts).
 *
 * REPOSITIONED 2026-09-21 (see vault: 07 - Content / 2026-09-21 The
 * Great Repositioning — Spec v1): Before the Fall is presented as a
 * free, anonymous on-ramp to the faith for the skeptical, the
 * on-the-fence, and the returning — not a mental-health platform.
 * The safety commitments in "How we keep people safe" are kept
 * because they attach to the FEATURES (journals, scanning, anonymous
 * accounts), not the marketing. HAP MUST RE-REVIEW this page before
 * public launch — it is now two rounds of changes past his sign-off.
 *
 * FounderNote remains parked (app/components/FounderNote.tsx);
 * re-add when ready.
 */
export const metadata: Metadata = {
  title: "Who We Are — Before the Fall",
};

export default function WhoWeAre() {
  return (
    <>
      <header className="bg-gradient-to-b from-btf-sky-deep to-btf-sky text-white px-6 py-14 sm:py-20 relative overflow-hidden">
        <div
          className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[400px] h-[300px] rounded-full bg-btf-gold/15 blur-3xl pointer-events-none"
          aria-hidden
        />
        <div className="max-w-3xl mx-auto relative text-center">
          <div className="w-10 h-10 relative mb-5 mx-auto" aria-hidden>
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1.5 h-10 bg-btf-gold rounded-sm" />
            <div className="absolute left-1/2 top-2.5 -translate-x-1/2 w-7 h-1.5 bg-btf-gold rounded-sm" />
          </div>
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3">
            Who We Are
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-light">
            Before the Fall
          </h1>
          <p className="font-serif italic text-lg text-white/85 mt-3 font-light">
            For the skeptical, the seeking, and everyone finding the way back.
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-5">
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-btf-sky-pale">
          <h2 className="font-serif text-2xl text-btf-sky-deep mb-3 font-light">
            Who we are
          </h2>
          <p className="text-btf-text-mid font-light leading-relaxed mb-3">
            Before the Fall is a free, anonymous Catholic platform for people
            who are skeptical of faith, on the fence about it, new to it, or
            finding their way back after years away. It was built by one
            person after God changed his life &mdash; built so that the next
            person searching at three in the morning finds a door that&rsquo;s
            already open. There is no cost, there are no ads, and there is no
            profit motive: this platform exists to lead people to Christ, and
            for no other reason.
          </p>
          <p className="text-btf-text-mid font-light leading-relaxed mb-3">
            &ldquo;For the Son of Man has come to seek and to save what was
            lost.&rdquo; &mdash; Luke 19:10. That is the whole mission
            statement. Everything here &mdash; the Scripture, the guided
            prayer, the learning modules, the quiet practical tools &mdash;
            exists to make one more meeting between that seeking God and one
            more person possible.
          </p>
          <p className="text-btf-text-mid font-light leading-relaxed">
            The name remembers Eden &mdash; and everyone since who has stood
            at the edge of a fall. This exists for the moment before, and for
            every road back after.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-btf-sky-pale">
          <h2 className="font-serif text-2xl text-btf-sky-deep mb-3 font-light">
            Why we&rsquo;re different
          </h2>
          <p className="text-btf-text-mid font-light leading-relaxed mb-3">
            Walking into a parish office is a bigger first step than most
            skeptics will take. Even sitting in a back pew can feel like a
            commitment. Programs like OCIA are beautiful &mdash; and they ask
            for a yes that many people aren&rsquo;t ready to give on day one.
            Before the Fall is the anonymous step before that step: a place
            to read, pray badly, ask the honest questions, and change your
            mind as many times as you need to, with nobody taking attendance.
          </p>
          <p className="text-btf-text-mid font-light leading-relaxed">
            Apps like Hallow serve the faithful magnificently. This one is
            aimed one step earlier &mdash; at the person who isn&rsquo;t sure
            they belong there yet. It was built by someone who lived that
            gap, who searched for a door like this and couldn&rsquo;t find
            one. The platform exists because that search shouldn&rsquo;t have
            been so hard.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-btf-sky-pale">
          <h2 className="font-serif text-2xl text-btf-sky-deep mb-3 font-light">
            Your privacy
          </h2>
          <p className="text-btf-text-mid font-light leading-relaxed mb-3">
            We do not ask for your name, email, or phone number. Returning
            users access their saved progress through a recovery code only
            they hold. We are not, however, zero-knowledge anonymous. We keep
            just enough records &mdash; hashed IP, timestamps, user agent
            &mdash; to send real help in a crisis (a 988 response if your
            content suggests you are in immediate danger), to honor lawful
            legal process, and to meet our child-safety reporting
            obligations.
          </p>
          <p className="text-btf-text-mid font-light leading-relaxed">
            This platform is free, carries no ads, and will never profit from
            you. We do not sell, trade, or share your data with anyone, ever.
            The complete privacy policy is published, attorney-reviewed, and
            linked at the bottom of every page once we publicly launch.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-btf-sky-pale">
          <h2 className="font-serif text-2xl text-btf-sky-deep mb-3 font-light">
            How we keep people safe
          </h2>
          <p className="text-btf-text-mid font-light leading-relaxed mb-4">
            This is a platform where people write honestly about their lives
            &mdash; and some of what people carry is heavy. Part of caring
            for people well is being ready for the hardest moments, the way
            any parish, school, or counselor is ready for them.
          </p>
          <p className="text-btf-text-mid font-light leading-relaxed mb-4">
            If someone tells us they are close to hurting themselves, we
            connect them with the 988 Suicide &amp; Crisis Lifeline and,
            where indicated, trained crisis support. If a disclosure makes us
            fear for someone else&rsquo;s immediate safety, we bring in the
            appropriate authorities. Where a child&rsquo;s safety is at risk,
            we honor our legal duty to report (Texas Family Code
            &sect;261.101) and the CyberTipline of the National Center for
            Missing &amp; Exploited Children. When someone tells us home
            doesn&rsquo;t feel safe, we connect them with the National
            Domestic Violence Hotline; substance crises are routed to
            SAMHSA&rsquo;s National Helpline.
          </p>
          <p className="text-btf-text-mid font-light leading-relaxed">
            All of this is documented in a written escalation protocol,
            reviewed by counsel and kept current as the law evolves. It
            exists for the same reason the rest of the platform does: so that
            the people who trust us &mdash; and the people around them
            &mdash; are safer because we were there.
          </p>
        </section>
      </div>
    </>
  );
}
