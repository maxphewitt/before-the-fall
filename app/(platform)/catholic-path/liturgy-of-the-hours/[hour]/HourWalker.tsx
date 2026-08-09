"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import BackLink from "../../../_nav/BackLink";
import { recordHabitCompletionForCurrentUser } from "../../../../actions/habits";
import { PRAYERS } from "../../../../lib/rosary";

/**
 * One resolved step of an Hour, ready to render — citation-based steps
 * (versicle/psalmody/canticle/reading/some responsories) have already
 * been expanded to real Douay-Rheims text server-side, in page.tsx, via
 * lib/scriptureCitation.ts. This component never fetches Scripture
 * itself.
 */
export type ResolvedStep =
  | { kind: "note"; label?: string; lines: string[] }
  | { kind: "versicle"; text: string }
  | { kind: "doxology" }
  | { kind: "psalmody"; label: string; antiphon: string; verses: { number: string; text: string }[] }
  | { kind: "canticle"; label: string; antiphon: string; verses: { number: string; text: string }[] }
  | { kind: "reading"; label?: string; text: string }
  | { kind: "responsory"; lines: string[] }
  | { kind: "intercessions"; intro: string; petitions: string[] }
  | { kind: "ourFather" }
  | { kind: "hailHolyQueen" }
  | { kind: "signOfTheCross" }
  | { kind: "collect"; text: string }
  | { kind: "dismissal" };

export default function HourWalker({
  hourLabel,
  hourSubtitle,
  steps,
  nextHourHref,
  nextHourLabel,
}: {
  hourLabel: string;
  hourSubtitle: string;
  steps: ResolvedStep[];
  /** The next hour in sequence, offered on the closing screen. */
  nextHourHref: string;
  nextHourLabel: string;
}) {
  const [stepIdx, setStepIdx] = useState(0);
  const isClosing = stepIdx === steps.length;

  const completionFired = useRef(false);
  useEffect(() => {
    if (isClosing && !completionFired.current) {
      completionFired.current = true;
      recordHabitCompletionForCurrentUser("liturgy-of-hours").catch(() => {
        /* swallow — best-effort */
      });
    }
  }, [isClosing]);

  if (isClosing) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-btf-deep-night via-btf-sky-deep to-btf-sky text-white">
        <div className="max-w-xl mx-auto px-6 py-8 sm:py-12 min-h-screen flex flex-col">
          <div className="flex items-center justify-between mb-12">
            <BackLink
              fallbackHref="/catholic-path/liturgy-of-the-hours"
              label="The Hours"
              className="text-white/60 hover:text-white text-xs inline-flex items-center gap-2 transition-colors uppercase tracking-[0.25em]"
            />
            <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold">
              {hourLabel}
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3">
              The Hours
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-4 max-w-md">
              You prayed {hourLabel}.
            </h1>
            <p className="font-serif italic text-base text-white/85 font-light leading-relaxed max-w-md">
              The Church, somewhere, is praying this hour with you right now.
            </p>
          </div>

          <div className="space-y-3 mt-12">
            <Link
              href={nextHourHref}
              className="block w-full text-center rounded-2xl bg-white/10 border border-white/20 hover:border-btf-gold/50 px-5 py-4 transition-colors"
            >
              <span className="block text-[10px] tracking-[0.25em] uppercase text-btf-gold-light font-semibold">
                Continue the Hours
              </span>
              <span className="block text-white/90 font-medium mt-1">
                Pray {nextHourLabel} &rarr;
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setStepIdx(0)}
              className="w-full bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/30 font-medium px-6 py-3.5 rounded-full transition-all"
            >
              Pray it again
            </button>
            <Link
              href="/catholic-path/liturgy-of-the-hours"
              className="block w-full text-center bg-btf-gold hover:bg-btf-gold-light text-btf-sky-deep font-medium px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Back to the Hours
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const step = steps[stepIdx];

  return (
    <main className="min-h-screen bg-gradient-to-b from-btf-deep-night via-btf-sky-deep to-btf-sky text-white">
      <div className="max-w-xl mx-auto px-6 py-8 sm:py-12 min-h-screen flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <BackLink
            fallbackHref="/catholic-path/liturgy-of-the-hours"
            label="Exit"
            className="text-white/60 hover:text-white text-xs inline-flex items-center gap-2 transition-colors uppercase tracking-[0.25em]"
          />
          <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold">
            {hourLabel}
          </p>
        </div>

        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={steps.length}
          aria-valuenow={stepIdx + 1}
          aria-label="Prayer progress"
          className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-10"
        >
          <div
            className="h-full bg-btf-gold transition-all duration-500"
            style={{ width: `${Math.round(((stepIdx + 1) / steps.length) * 100)}%` }}
          />
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-lg w-full">
            {stepIdx === 0 && (
              <p className="text-center font-serif italic text-white/60 text-sm mb-8">
                {hourSubtitle}
              </p>
            )}
            <StepContent step={step} />
          </div>
        </div>

        <div className="mt-12 flex gap-3">
          {stepIdx > 0 && (
            <button
              type="button"
              onClick={() => setStepIdx(stepIdx - 1)}
              className="flex-1 bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/30 font-medium px-6 py-3.5 rounded-full transition-all"
            >
              &larr; Back
            </button>
          )}
          <button
            type="button"
            onClick={() => setStepIdx(stepIdx + 1)}
            className="flex-[2] bg-btf-gold hover:bg-btf-gold-light text-btf-sky-deep font-medium px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 transition-all"
          >
            {stepIdx === steps.length - 1 ? "Finish →" : "Next →"}
          </button>
        </div>
      </div>
    </main>
  );
}

function StepContent({ step }: { step: ResolvedStep }) {
  switch (step.kind) {
    case "note":
      return (
        <div className="rounded-2xl bg-white/10 border border-white/20 p-6">
          {step.label && (
            <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light font-semibold mb-3">
              {step.label}
            </p>
          )}
          {step.lines.map((line, i) => (
            <p key={i} className="text-[15px] text-white/90 font-light leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      );

    case "versicle":
      return (
        <p className="font-serif text-xl sm:text-2xl text-white font-light leading-relaxed text-center">
          {step.text}
        </p>
      );

    case "doxology":
      return (
        <div className="text-center">
          <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/80 font-semibold mb-3">
            Glory Be
          </p>
          <p className="font-serif text-lg text-white/90 font-light leading-relaxed italic">
            {PRAYERS.gloryBe}
          </p>
        </div>
      );

    case "psalmody":
    case "canticle":
      return (
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light font-semibold mb-3 text-center">
            {step.label}
          </p>
          <p className="font-serif italic text-[15px] text-btf-gold-light/90 leading-relaxed text-center mb-5">
            {step.antiphon}
          </p>
          <div className="space-y-2">
            {step.verses.map((v) => (
              <p key={v.number} className="font-serif text-[17px] text-white font-light leading-relaxed">
                <span className="text-btf-gold-light/70 text-xs align-top mr-1.5">{v.number}</span>
                {v.text}
              </p>
            ))}
          </div>
          <p className="font-serif italic text-[15px] text-btf-gold-light/90 leading-relaxed text-center mt-5">
            {step.antiphon}
          </p>
        </div>
      );

    case "reading":
      return (
        <div>
          {step.label && (
            <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light font-semibold mb-4 text-center">
              {step.label}
            </p>
          )}
          <p className="font-serif text-lg text-white font-light leading-relaxed">{step.text}</p>
        </div>
      );

    case "responsory":
      return (
        <div className="text-center space-y-3">
          {step.lines.map((line, i) => (
            <p key={i} className="font-serif text-lg text-white/90 font-light leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      );

    case "intercessions":
      return (
        <div>
          <p className="font-serif italic text-base text-white/85 font-light leading-relaxed mb-5 text-center">
            {step.intro}
          </p>
          <ul className="space-y-3">
            {step.petitions.map((p, i) => (
              <li
                key={i}
                className="rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-[15px] text-white/90 font-light leading-relaxed"
              >
                {p}
              </li>
            ))}
          </ul>
        </div>
      );

    case "ourFather":
      return (
        <div className="text-center">
          <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/80 font-semibold mb-3">
            Our Father
          </p>
          <p className="font-serif text-lg text-white/90 font-light leading-relaxed">
            {PRAYERS.ourFather}
          </p>
        </div>
      );

    case "hailHolyQueen":
      return (
        <div className="text-center">
          <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/80 font-semibold mb-3">
            Hail, Holy Queen
          </p>
          <p className="font-serif text-lg text-white/90 font-light leading-relaxed">
            {PRAYERS.hailHolyQueen}
          </p>
        </div>
      );

    case "signOfTheCross":
      return (
        <div className="text-center">
          <p className="font-serif text-lg text-white/90 font-light leading-relaxed">
            {PRAYERS.signOfTheCross}
          </p>
        </div>
      );

    case "collect":
      return (
        <div className="text-center">
          <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/80 font-semibold mb-3">
            Let Us Pray
          </p>
          <p className="font-serif text-lg text-white/90 font-light leading-relaxed italic">
            {step.text}
          </p>
        </div>
      );

    case "dismissal":
      return (
        <div className="text-center space-y-2">
          <p className="font-serif text-lg text-white/90 font-light leading-relaxed">
            Let us bless the Lord.
          </p>
          <p className="font-serif text-lg text-white/90 font-light leading-relaxed">
            Thanks be to God.
          </p>
        </div>
      );

    default:
      return null;
  }
}
