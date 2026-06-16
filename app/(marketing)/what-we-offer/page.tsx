import type { Metadata } from "next";
import Link from "next/link";
import { EXERCISES } from "../../lib/tools";

/**
 * /what-we-offer — the public "what's inside, why, and the research"
 * page. This is where everything that used to sit below the homepage
 * fold now lives: the four tiers, the Tier 1 tool set, the Catholic
 * Path, the evidence base, and the what-this-is / isn't framing.
 *
 * Public + informational. CTAs route into account creation (/onboard)
 * since the tools themselves are gated. Brand: solid sky / gold / cross,
 * crafted SVG icons (no emoji), gentle staggered entrances.
 */
export const metadata: Metadata = {
  title: "What We Offer — Before the Fall",
};

type IconName = "self" | "community" | "clinician" | "crisis";

function TierIcon({ name }: { name: IconName }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "self":
      return (
        <svg {...common}>
          <path d="M12 20s-6.5-4.2-9-8C1.2 9 3 5.5 6.3 5.5c2 0 3.4 1.3 5.7 3.3 2.3-2 3.7-3.3 5.7-3.3C21 5.5 22.8 9 21 12c-2.5 3.8-9 8-9 8z" />
        </svg>
      );
    case "community":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <path d="M15.5 11a3 3 0 1 0-2.5-4.6" />
          <path d="M3.5 20v-1.5A4.5 4.5 0 0 1 8 14h2a4.5 4.5 0 0 1 4.5 4.5V20" />
          <path d="M16 14h.5a4.5 4.5 0 0 1 4.5 4.5V20" />
        </svg>
      );
    case "clinician":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
    case "crisis":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 2.5v6M12 15.5v6M2.5 12h6M15.5 12h6" />
        </svg>
      );
  }
}

const TIERS: {
  n: number;
  icon: IconName;
  title: string;
  status: "now" | "soon";
  body: string;
}[] = [
  {
    n: 1,
    icon: "self",
    title: "Self-help",
    status: "now",
    body: "Tools you can use the moment you sign in — urge control, grounding, journaling, and optional Catholic prayer. Used by you, for you, on your own.",
  },
  {
    n: 2,
    icon: "community",
    title: "Peer community",
    status: "soon",
    body: "An anonymous, moderated community of others walking the same road. Launches once trained moderators are in place.",
  },
  {
    n: 3,
    icon: "clinician",
    title: "Clinician referrals",
    status: "soon",
    body: "Vetted, faith-aware therapists for when self-help isn't enough. Our credentialing standards, your choice.",
  },
  {
    n: 4,
    icon: "crisis",
    title: "Crisis routing",
    status: "soon",
    body: "Documented routing to 988, NCMEC, and the Domestic Violence Hotline. The crisis exit ramp at the bottom of every page is live today.",
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
            A door for the moment before the fall.
          </h1>
          <p className="font-serif italic text-lg text-white/85 font-light max-w-xl mx-auto btf-fade-up btf-d-3">
            Here&rsquo;s what&rsquo;s inside, why we built it, and the research it
            stands on.
          </p>
        </div>
      </header>

      {/* ── Why we built these ── */}
      <section className="py-16 px-6 bg-btf-off-white">
        <div className="max-w-2xl mx-auto">
          <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-4">
            Why this exists
          </p>
          <p className="text-btf-text-mid text-base md:text-lg leading-relaxed font-light">
            Almost every tool in this country activates after harm has already
            happened &mdash; after the crime, the relapse, the crisis. Before the
            Fall is built for the window before that: the shame, the urge, the
            escalation, the spiral, the space where someone is still reachable if
            anyone shows up. Each module below is here to meet a person in that
            window with something concrete to do, not just something to read.
          </p>
        </div>
      </section>

      {/* ── Four tiers ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-[11px] tracking-[0.25em] text-btf-gold uppercase font-medium mb-3">
            How we help
          </p>
          <h2 className="text-center font-serif text-3xl md:text-4xl text-btf-sky-deep font-light mb-12">
            Four tiers. One door.
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {TIERS.map((tier) => {
              const active = tier.status === "now";
              return (
                <div
                  key={tier.n}
                  className={
                    "btf-rise relative rounded-2xl p-6 flex flex-col " +
                    (active
                      ? "bg-btf-sky-pale/40 border-2 border-btf-sky/30 hover:border-btf-sky hover:shadow-lg"
                      : "bg-white border border-btf-text-light/20 hover:shadow-md")
                  }
                >
                  <span
                    className={
                      "absolute top-4 right-4 text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full font-medium " +
                      (active
                        ? "text-btf-sky bg-white"
                        : "text-btf-text-light bg-btf-off-white")
                    }
                  >
                    {active ? "Available now" : "Coming soon"}
                  </span>
                  <div className="flex items-start gap-4 mb-3">
                    <div
                      className={
                        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 " +
                        (active
                          ? "bg-btf-sky text-white"
                          : "bg-btf-off-white text-btf-text-light")
                      }
                    >
                      <TierIcon name={tier.icon} />
                    </div>
                    <div>
                      <p
                        className={
                          "text-[10px] uppercase tracking-[0.2em] font-semibold " +
                          (active ? "text-btf-sky" : "text-btf-text-light")
                        }
                      >
                        Tier {tier.n}
                      </p>
                      <h3
                        className={
                          "font-serif text-xl mt-1 " +
                          (active
                            ? "text-btf-sky-deep"
                            : "text-btf-sky-deep/70")
                        }
                      >
                        {tier.title}
                      </h3>
                    </div>
                  </div>
                  <p
                    className={
                      "text-sm font-light leading-relaxed flex-1 " +
                      (active ? "text-btf-text-mid" : "text-btf-text-mid/80")
                    }
                  >
                    {tier.body}
                  </p>
                  {active && (
                    <Link
                      href="/onboard"
                      className="mt-4 inline-block text-[10px] uppercase tracking-[0.25em] text-btf-sky font-semibold hover:translate-x-1 transition-transform cursor-pointer"
                    >
                      Create your account to begin →
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── What's inside Tier 1 ── */}
      <section className="py-16 px-6 bg-btf-off-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-[11px] tracking-[0.25em] text-btf-gold uppercase font-medium mb-3">
            Inside Tier 1
          </p>
          <h2 className="text-center font-serif text-3xl md:text-4xl text-btf-sky-deep font-light mb-4">
            Six exercises for the hardest minutes.
          </h2>
          <p className="text-center text-btf-text-mid font-light text-sm max-w-xl mx-auto mb-12">
            Each one is short, guided, and built for a specific kind of moment.
            This is a preview &mdash; they open up inside a free account.
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

      {/* ── Catholic Path ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-medium mb-3">
            The faith-based pathway
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light mb-4">
            Catholic Path
          </h2>
          <p className="text-btf-text-mid font-light text-base max-w-xl mx-auto mb-8">
            An optional parallel walk in scripture and Catholic teaching alongside
            whichever tier you&rsquo;re in: daily scripture from a Catholic
            translation, guided reflection, weekly teaching videos, a parish
            finder, and a Rosary &amp; prayer library. The rest of the platform
            works for anyone; this opens only if you want it.
          </p>
          <Link
            href="/onboard"
            className="inline-flex items-center justify-center text-[10px] uppercase tracking-[0.25em] text-btf-sky-deep bg-btf-gold hover:bg-btf-gold-light font-semibold px-6 py-3 rounded-full transition-colors cursor-pointer"
          >
            Create an account to open it →
          </Link>
        </div>
      </section>

      {/* ── The research behind it (solid sky band) ── */}
      <section className="relative py-16 px-6 bg-btf-sky-deep text-white overflow-hidden btf-grain">
        <div className="btf-aurora" aria-hidden>
          <div className="btf-orb btf-orb--sky-2" />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <p className="text-[11px] tracking-[0.25em] text-btf-gold-light/90 uppercase font-semibold mb-3">
            The research behind it
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-light mb-5">
            Drawn from established clinical methods.
          </h2>
          <p className="text-white/85 font-light leading-relaxed mb-8">
            The Tier 1 exercises aren&rsquo;t invented here. Each is adapted from
            a recognized, peer-reviewed method, then written for the moment a
            person is actually in. The loved-one program follows the same
            principle on the family side.
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
            All clinical content is draft and under review with our clinical
            advisor before public launch. Before the Fall is not therapy and not
            a replacement for a clinician or a priest.
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
              <li>Pseudonymous &mdash; we don&rsquo;t ask for your name.</li>
              <li>Free, always. We are a Texas-based nonprofit initiative.</li>
              <li>Catholic faith content is opt-in. The rest works for anyone.</li>
              <li>Every clinical exercise is sourced from peer-reviewed literature.</li>
            </ul>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.25em] text-btf-text-light uppercase font-medium mb-4">
              What this isn&rsquo;t
            </p>
            <ul className="space-y-3 text-btf-text-mid font-light text-sm leading-relaxed">
              <li>Not therapy. Not a replacement for a clinician.</li>
              <li>Not the confessional. Not a replacement for a priest.</li>
              <li>Not an emergency room. If you&rsquo;re in immediate danger, call 911 or 988.</li>
              <li>Not zero-knowledge anonymous. We keep enough records to honor the law and protect lives.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-serif text-3xl text-btf-sky-deep font-light mb-4">
            Whenever you&rsquo;re ready.
          </h2>
          <p className="text-btf-text-mid font-light mb-8">
            A free, pseudonymous account takes about two minutes and never asks
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
