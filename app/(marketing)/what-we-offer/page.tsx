import type { Metadata } from "next";
import Link from "next/link";
import { EXERCISES } from "../../lib/tools";

/**
 * /what-we-offer — the public "what's inside and why" page.
 *
 * REPOSITIONED 2026-09-21 (vault: 07 - Content / 2026-09-21 The Great
 * Repositioning — Spec v1): the faith library leads, the practical
 * tools support, and the four-tier taxonomy is retired from public
 * marketing. Public + informational; CTAs route into /onboard since
 * the platform itself is gated. Brand: solid sky / gold / cross,
 * crafted SVG icons (no emoji), gentle staggered entrances.
 */
export const metadata: Metadata = {
  title: "What We Offer — Before the Fall",
};

/** The faith library — the platform's center, listed from what's
 *  actually shipped. Keep in sync with the Catholic Path modules. */
const LIBRARY: { title: string; body: string }[] = [
  {
    title: "Daily Scripture & the whole Bible",
    body: "A short daily passage chosen for where you are, and the complete Catholic Bible — readable, searchable, highlightable — when you want to go further.",
  },
  {
    title: "The Rosary, guided",
    body: "Every mystery walked bead by bead, with the prayers written out and the scenes explained. No experience assumed — plus the Seven Sorrows chaplet.",
  },
  {
    title: "Prayers & novenas",
    body: "A library of the prayers Catholics actually pray, each one walked line by line, and nine-day novenas you can carry an intention through.",
  },
  {
    title: "The Liturgy of the Hours",
    body: "The Church's ancient rhythm of praying through the day — morning, evening, night — in a version built for beginners.",
  },
  {
    title: "Learning modules",
    body: "Start Here orientation and monthly deep-dives that explain what Catholics believe and why — written for the skeptical and the brand-new, never assuming you already agree.",
  },
  {
    title: "Fasting seasons & challenges",
    body: "Walk Lent, St. Michael's Lent, or a season you design — one honest day at a time, with a journey that never resets when you stumble.",
  },
  {
    title: "A community praying with you",
    body: "Anonymous intentions lifted by people walking the same road, seasonal challenges, and monthly devotions prayed together across the whole platform.",
  },
  {
    title: "Private journaling",
    body: "Encrypted writing that stays yours — reflections, intentions, and an honest daily log if you're working on something hard.",
  },
];

export default function WhatWeOffer() {
  return (
    <>
      {/* ── Hero (solid, with drifting light) ── */}
      <header className="relative bg-btf-sky-deep text-white overflow-hidden btf-grain">
        <div className="btf-aurora" aria-hidden>
          <div className="btf-orb btf-orb--gold" />
          <div className="btf-orb btf-orb--sky" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 py-20 sm:py-24 text-center">
          <div className="relative w-10 h-10 mx-auto mb-6 btf-fade-up" aria-hidden>
            <div className="btf-breathe absolute inset-0">
              <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1.5 h-10 bg-btf-gold rounded-sm" />
              <div className="absolute left-1/2 top-2.5 -translate-x-1/2 w-7 h-1.5 bg-btf-gold rounded-sm" />
            </div>
          </div>
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3 btf-fade-up btf-d-1">
            What we offer
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light leading-[1.15] mb-5 btf-fade-up btf-d-2">
            A place to come and see.
          </h1>
          <p className="font-serif italic text-lg text-white/85 font-light max-w-xl mx-auto btf-fade-up btf-d-3">
            Free, anonymous, and built for people who aren&rsquo;t sure yet.
            Here&rsquo;s what&rsquo;s inside.
          </p>
        </div>
      </header>

      {/* ── Why this exists ── */}
      <section className="py-16 px-6 bg-btf-off-white">
        <div className="max-w-2xl mx-auto">
          <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-4">
            Why this exists
          </p>
          <p className="text-btf-text-mid text-base md:text-lg leading-relaxed font-light">
            For a lot of people, the distance between &ldquo;maybe there&rsquo;s
            something to this&rdquo; and walking into a parish is a canyon.
            Before the Fall is the bridge: a place to read Scripture, learn to
            pray, ask the honest questions, and take exactly one step at a time
            &mdash; anonymously, at no cost, with nobody taking attendance. If
            all you ever do here is look, you were still welcome.
          </p>
        </div>
      </section>

      {/* ── The faith library ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-[11px] tracking-[0.25em] text-btf-gold uppercase font-medium mb-3">
            The heart of it
          </p>
          <h2 className="text-center font-serif text-3xl md:text-4xl text-btf-sky-deep font-light mb-4">
            Everything you need to explore the faith.
          </h2>
          <p className="text-center text-btf-text-mid font-light text-sm max-w-xl mx-auto mb-12">
            All of it assumes no background, all of it is free, and all of it
            opens inside an anonymous account.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {LIBRARY.map((item, i) => (
              <div
                key={item.title}
                className="btf-rise rounded-2xl bg-btf-off-white border border-btf-sky-pale p-5 flex flex-col"
              >
                <span className="flex-shrink-0 w-9 h-9 rounded-full border-2 border-btf-gold/50 text-btf-sky-deep font-serif text-sm flex items-center justify-center mb-3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-lg text-btf-sky-deep leading-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-btf-text-mid font-light leading-relaxed flex-1">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The practical tools ── */}
      <section className="py-16 px-6 bg-btf-off-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-[11px] tracking-[0.25em] text-btf-gold uppercase font-medium mb-3">
            For the hard days
          </p>
          <h2 className="text-center font-serif text-3xl md:text-4xl text-btf-sky-deep font-light mb-4">
            Quiet, practical tools &mdash; whatever you carry.
          </h2>
          <p className="text-center text-btf-text-mid font-light text-sm max-w-xl mx-auto mb-12">
            Skeptical of the faith content? Start here instead. Six short,
            guided exercises for stress, spirals, and urges &mdash; each one
            adapted from established, peer-reviewed methods. They work for
            anyone, and they open inside a free account.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {EXERCISES.map((ex, i) => (
              <div
                key={ex.slug}
                className="btf-rise rounded-2xl bg-white border border-btf-sky-pale p-5 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex-shrink-0 w-9 h-9 rounded-full border-2 border-btf-gold/50 text-btf-sky-deep font-serif text-sm flex items-center justify-center">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-serif text-lg text-btf-sky-deep leading-tight">
                    {ex.name}
                  </h3>
                </div>
                <p className="text-sm text-btf-text-mid font-light leading-relaxed flex-1">
                  {ex.tagline}
                </p>
                {ex.estimatedTime && (
                  <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-btf-text-light font-medium">
                    {ex.estimatedTime}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The road ahead ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-medium mb-3">
            The road ahead
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light mb-4">
            Growing as the community grows.
          </h2>
          <p className="text-btf-text-mid font-light text-base max-w-xl mx-auto mb-8">
            Coming as they&rsquo;re ready, never before: moderated support
            groups organized by what people carry, live group sessions with
            licensed hosts, teaching videos from priests and special guests on
            turning back to God and learning the Church from the inside, and a
            parish finder that turns an anonymous beginning into a real pew
            near you.
          </p>
          <Link
            href="/onboard"
            className="inline-flex items-center justify-center text-[10px] uppercase tracking-[0.25em] text-btf-sky-deep bg-btf-gold hover:bg-btf-gold-light font-semibold px-6 py-3 rounded-full transition-colors cursor-pointer"
          >
            Create a free account to begin →
          </Link>
        </div>
      </section>

      {/* ── The research behind the tools (solid sky band) ── */}
      <section className="relative py-16 px-6 bg-btf-sky-deep text-white overflow-hidden btf-grain">
        <div className="btf-aurora" aria-hidden>
          <div className="btf-orb btf-orb--sky-2" />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <p className="text-[11px] tracking-[0.25em] text-btf-gold-light/90 uppercase font-semibold mb-3">
            The research behind the tools
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-light mb-5">
            Drawn from established methods.
          </h2>
          <p className="text-white/85 font-light leading-relaxed mb-8">
            The practical exercises aren&rsquo;t invented here. Each is adapted
            from a recognized, peer-reviewed method, then written for the
            moment a person is actually in. The loved-one program follows the
            same principle on the family side.
          </p>
          <ul className="space-y-4">
            {[
              {
                k: "Dialectical Behavior Therapy (DBT)",
                v: "STOP and TIPP are distress-tolerance skills from Marsha Linehan's DBT Skills Training Manual (Guilford Press).",
              },
              {
                k: "Cognitive Behavioral Therapy (CBT)",
                v: "The seven-column Thought Record follows the clinical standard from Aaron Beck and David Burns.",
              },
              {
                k: "Relapse Prevention",
                v: "Urge Surfing is grounded in Marlatt & Gordon's rise-and-fall model of cravings.",
              },
              {
                k: "Grounding & paced breathing",
                v: "5-4-3-2-1 grounding and box breathing are drawn from trauma-informed practice (VA / SAMHSA guidance) and vagal-tone research.",
              },
              {
                k: "CRAFT, for loved ones",
                v: "The loved-one flow follows Community Reinforcement and Family Training (Meyers et al.), shown to roughly double the chance a struggling person engages help.",
              },
            ].map((r) => (
              <li
                key={r.k}
                className="rounded-2xl bg-white/5 border border-white/10 p-5"
              >
                <p className="font-medium text-btf-gold-light mb-1">{r.k}</p>
                <p className="text-sm text-white/80 font-light leading-relaxed">
                  {r.v}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-xs text-white/55 font-light leading-relaxed">
            All content is draft and under review before public launch. Before
            the Fall is not therapy and not a replacement for a clinician or a
            priest.
          </p>
        </div>
      </section>

      {/* ── What this is / isn't ── */}
      <section className="py-16 px-6 bg-btf-off-white">
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-medium mb-4">
              What this is
            </p>
            <ul className="space-y-3 text-btf-text-mid font-light text-sm leading-relaxed">
              <li>Anonymous &mdash; we don&rsquo;t ask for your name.</li>
              <li>Free, always. No ads, no subscriptions, no profit motive.</li>
              <li>A place to explore at your own pace &mdash; skeptics welcome, questions welcome, doubt welcome.</li>
              <li>Built to point past itself: toward a real parish, a real pew, real people.</li>
            </ul>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.25em] text-btf-text-light uppercase font-medium mb-4">
              What this isn&rsquo;t
            </p>
            <ul className="space-y-3 text-btf-text-mid font-light text-sm leading-relaxed">
              <li>Not a commitment. Nothing here signs you up for anything.</li>
              <li>Not the confessional. Not a replacement for a priest.</li>
              <li>Not therapy, and not an emergency room. If you&rsquo;re in immediate danger, call 911 or 988.</li>
              <li>Not zero-knowledge anonymous. We keep enough records to honor the law and protect lives.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-serif text-3xl text-btf-sky-deep font-light mb-4">
            Come and see.
          </h2>
          <p className="text-btf-text-mid font-light mb-8">
            A free, anonymous account takes about two minutes and never asks
            your name.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/onboard"
              className="inline-flex items-center justify-center bg-btf-gold hover:bg-btf-gold-light text-btf-sky-deep font-medium px-8 py-3.5 rounded-full shadow-lg shadow-btf-gold/20 transition-all hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
            >
              Create your account
            </Link>
            <Link
              href="/return"
              className="inline-flex items-center justify-center bg-white border-2 border-btf-sky-pale text-btf-sky-deep font-medium px-8 py-3.5 rounded-full hover:border-btf-sky transition-colors cursor-pointer"
            >
              I already have a code
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
