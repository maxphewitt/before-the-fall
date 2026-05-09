import Link from "next/link";
import FounderNote from "../components/FounderNote";

export default function About() {
  return (
    <main className="min-h-screen bg-btf-off-white">
      <header className="bg-gradient-to-b from-btf-sky-deep to-btf-sky text-white px-6 py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[400px] h-[300px] rounded-full bg-btf-gold/15 blur-3xl pointer-events-none" aria-hidden />
        <div className="max-w-3xl mx-auto relative">
          <Link href="/" className="text-white/70 hover:text-white text-sm mb-6 inline-flex items-center gap-2 transition-colors">
            <span aria-hidden>&larr;</span> Back home
          </Link>
          <div className="w-10 h-10 relative mb-5 mt-2" aria-hidden>
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1.5 h-10 bg-btf-gold rounded-sm" />
            <div className="absolute left-1/2 top-2.5 -translate-x-1/2 w-7 h-1.5 bg-btf-gold rounded-sm" />
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-light">About Before the Fall</h1>
          <p className="font-serif italic text-lg text-white/85 mt-3 font-light">
            Reaching the lost before they become unreachable.
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-5">
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-btf-sky-pale">
          <h2 className="font-serif text-2xl text-btf-sky-deep mb-3 font-light">Who we are</h2>
          <p className="text-btf-text-mid font-light leading-relaxed">
            Before the Fall is a faith-rooted prevention platform built to reach people before harm is done &mdash; not after. Almost every system in this country activates after a crime, a relapse, or a tragedy. We exist for the moment before that. We believe every person is redeemable, and that the most powerful intervention happens before an irreversible line is crossed.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-btf-sky-pale">
          <h2 className="font-serif text-2xl text-btf-sky-deep mb-3 font-light">Why we&rsquo;re different</h2>
          <p className="text-btf-text-mid font-light leading-relaxed">
            Most prevention resources are invisible to the people who need them. Their phone numbers don&rsquo;t come up when someone Googles their fear at three in the morning. Their websites don&rsquo;t reach the search algorithms that decide what a struggling person finds. Before the Fall was built by someone who lived this gap &mdash; who searched for months and found nothing. The platform exists because that search shouldn&rsquo;t have been so hard.
          </p>
        </section>

        <FounderNote />

        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-btf-sky-pale">
          <h2 className="font-serif text-2xl text-btf-sky-deep mb-3 font-light">Your privacy</h2>
          <p className="text-btf-text-mid font-light leading-relaxed mb-3">
            We do not ask for your name, email, or phone number. Returning users access their saved progress through a recovery code only they hold. We are not, however, zero-knowledge anonymous. We keep just enough records &mdash; hashed IP, timestamps, user agent &mdash; to honor lawful subpoenas, dispatch a 988 response if your content suggests imminent self-harm, and report content covered by the National Center for Missing &amp; Exploited Children.
          </p>
          <p className="text-btf-text-mid font-light leading-relaxed">
            We do not sell, trade, or share your data with advertisers, ever. The complete privacy policy is published, attorney-reviewed, and linked at the bottom of every page once we publicly launch.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-btf-sky-pale">
          <h2 className="font-serif text-2xl text-btf-sky-deep mb-3 font-light">Our compliance</h2>
          <p className="text-btf-text-mid font-light leading-relaxed">
            Before the Fall operates in alignment with NCMEC reporting standards and state and federal mandatory reporting laws. Disclosed active abuse, imminent self-harm, threats to specific persons, and content covered by the CyberTipline are escalated to the appropriate authorities under our documented protocols. We take child safety with absolute seriousness.
          </p>
        </section>
      </div>
    </main>
  );
}