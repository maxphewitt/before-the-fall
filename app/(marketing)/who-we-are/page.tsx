import type { Metadata } from "next";

/**
 * /who-we-are — public marketing page (migrated from the former
 * /about). Header + footer come from app/(marketing)/layout.tsx, so
 * this renders only the page body. The old /about path 301-redirects
 * here (see next.config.ts).
 *
 * FounderNote remains parked (app/components/FounderNote.tsx) per the
 * 2026-05-26 sprint decision; re-add when ready.
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
            Reaching the lost before they become unreachable.
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-5">
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-btf-sky-pale">
          <h2 className="font-serif text-2xl text-btf-sky-deep mb-3 font-light">
            Who we are
          </h2>
          <p className="text-btf-text-mid font-light leading-relaxed">
            Before the Fall is a faith-rooted wellness platform for people
            carrying struggles they never chose &mdash; unwanted urges, anxiety,
            depression, anger that keeps winning, the weight of what someone
            else did to them. Almost every resource in this country activates
            after a fall: after the relapse, the broken relationship, the
            crisis. We exist for the moment before that, when a person still has
            the chance to choose a different day. We believe in reaching people
            early, while hope is cheapest and change is most possible.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-btf-sky-pale">
          <h2 className="font-serif text-2xl text-btf-sky-deep mb-3 font-light">
            Why we&rsquo;re different
          </h2>
          <p className="text-btf-text-mid font-light leading-relaxed">
            Most prevention resources are invisible to the people who need them.
            Their phone numbers don&rsquo;t come up when someone Googles their
            fear at three in the morning. Their websites don&rsquo;t reach the
            search algorithms that decide what a struggling person finds. Before
            the Fall was built by someone who lived this gap &mdash; who searched
            for months and found nothing. The platform exists because that
            search shouldn&rsquo;t have been so hard.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-btf-sky-pale">
          <h2 className="font-serif text-2xl text-btf-sky-deep mb-3 font-light">
            Your privacy
          </h2>
          <p className="text-btf-text-mid font-light leading-relaxed mb-3">
            We do not ask for your name, email, or phone number. Returning users
            access their saved progress through a recovery code only they hold.
            We are not, however, zero-knowledge anonymous. We keep just enough
            records &mdash; hashed IP, timestamps, user agent &mdash; to send
            real help in a crisis (a 988 response if your content suggests you
            are in immediate danger), to honor lawful legal process, and to meet
            our child-safety reporting obligations.
          </p>
          <p className="text-btf-text-mid font-light leading-relaxed">
            We do not sell, trade, or share your data with advertisers, ever. The
            complete privacy policy is published, attorney-reviewed, and linked
            at the bottom of every page once we publicly launch.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-btf-sky-pale">
          <h2 className="font-serif text-2xl text-btf-sky-deep mb-3 font-light">
            Our compliance
          </h2>
          <p className="text-btf-text-mid font-light leading-relaxed mb-4">
            Before the Fall walks with people through the ordinary, human
            struggles that quietly take over a life: unwanted or
            self-destructive urges and compulsions, substance use, anxiety and
            depression, anger that strains the people closest to them, the long
            road of healing after abuse, and the wide range of distress that
            doesn&rsquo;t fit a clean category. Different struggles need
            different care, so the platform&rsquo;s support is calibrated to
            what each person shares.
          </p>
          <p className="text-btf-text-mid font-light leading-relaxed mb-4">
            Part of caring for people well is being ready for the hardest
            moments. If someone tells us they are close to hurting themselves,
            we connect them with the 988 Suicide &amp; Crisis Lifeline and,
            where indicated, trained crisis support &mdash; because a platform
            that only watches is not a platform that cares. If a disclosure
            makes us fear for someone else&rsquo;s immediate safety, we bring in
            the appropriate authorities, as any counselor, teacher, or pastor
            would.
          </p>
          <p className="text-btf-text-mid font-light leading-relaxed mb-4">
            The same is true for the people around our users. Where a child&rsquo;s
            safety is at risk, we honor our legal duty to report (Texas Family
            Code &sect;261.101) and the CyberTipline of the National Center for
            Missing &amp; Exploited Children. When someone tells us home
            doesn&rsquo;t feel safe, we connect them with the National Domestic
            Violence Hotline; substance crises are routed to SAMHSA&rsquo;s
            National Helpline; and anxiety or depression is met first with the
            platform&rsquo;s clinical tools, with the 988 pathway one tap away
            if it ever deepens.
          </p>
          <p className="text-btf-text-mid font-light leading-relaxed">
            All of this is documented in a written escalation protocol, reviewed
            by counsel and kept current as the law evolves. It exists for the
            same reason the rest of the platform does: so that the people who
            trust us &mdash; and the people around them &mdash; are safer
            because we were there.
          </p>
        </section>
      </div>
    </>
  );
}
