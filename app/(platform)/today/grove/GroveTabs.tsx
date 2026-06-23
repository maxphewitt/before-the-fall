"use client";

import { useState } from "react";
import Link from "next/link";
import type { ToolMoment, UrgeOutcome } from "../../../lib/journalTypes";
import GroveConstellation from "./GroveConstellation";

/**
 * The one progress hub. Three calm sections behind tabs so the page never
 * feels like "too much going on":
 *   - Journey  — the 90-day completion heatmap.
 *   - Grove    — the grounding moments constellation (+ insight).
 *   - Waves    — the urge-surfing archive (acceptance-based; no intensity).
 *
 * All strengths-based and explicitly non-clinical. No streaks/scores here
 * (the single streak lives in the page header above this).
 */

type Tab = "journey" | "grove" | "waves";

const OUTCOME_LABEL: Record<UrgeOutcome, string> = {
  rode_it_out: "Rode it out",
  stepped_away: "Stepped away",
  acted_on_it: "Logged honestly",
};

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function GroveTabs({
  journeyDays,
  groundingMoments,
  groundingInsight,
  waves,
  wavesCount,
  wavesMinutes,
  confidenceFirst,
  confidenceLatest,
  confidencePoints,
}: {
  journeyDays: { date: string; completions: number }[];
  groundingMoments: ToolMoment[];
  groundingInsight: string[];
  waves: ToolMoment[];
  wavesCount: number;
  wavesMinutes: number;
  confidenceFirst: number | null;
  confidenceLatest: number | null;
  confidencePoints: number;
}) {
  const [tab, setTab] = useState<Tab>("journey");

  const tabs: { id: Tab; label: string }[] = [
    { id: "journey", label: "Journey" },
    { id: "grove", label: "Grove" },
    { id: "waves", label: "Waves" },
  ];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Your progress"
        className="flex gap-2 mb-6 border-b border-btf-sky-deep/10"
      >
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={
                "px-4 py-2.5 text-sm font-medium -mb-px border-b-2 transition-colors " +
                (active
                  ? "border-btf-gold text-btf-sky-deep"
                  : "border-transparent text-btf-text-light hover:text-btf-sky-deep")
              }
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "journey" && <JourneyPanel days={journeyDays} />}
      {tab === "grove" && (
        <GrovePanel moments={groundingMoments} insight={groundingInsight} />
      )}
      {tab === "waves" && (
        <WavesPanel
          waves={waves}
          count={wavesCount}
          minutes={wavesMinutes}
          confidenceFirst={confidenceFirst}
          confidenceLatest={confidenceLatest}
          confidencePoints={confidencePoints}
        />
      )}
    </div>
  );
}

/* ─── Journey (90-day heatmap) ─────────────────────────────────────── */

function JourneyPanel({ days }: { days: { date: string; completions: number }[] }) {
  return (
    <div>
      <p className="text-btf-text-mid font-light leading-relaxed mb-5">
        Each square is a day; brighter means more done. The empty ones are missed
        days — not failures, just information.
      </p>
      <Heatmap days={days} />
    </div>
  );
}

function Heatmap({ days }: { days: { date: string; completions: number }[] }) {
  if (days.length === 0) {
    return (
      <p className="text-sm text-btf-text-mid font-light italic">
        Nothing recorded yet. Start with one habit on Today.
      </p>
    );
  }

  const weeks: { date: string; completions: number; weekday: number }[][] = [];
  let currentWeek: { date: string; completions: number; weekday: number }[] = [];
  for (const d of days) {
    const dt = new Date(d.date + "T12:00:00Z");
    const weekday = dt.getUTCDay();
    if (currentWeek.length === 0 && weekday !== 0) {
      for (let i = 0; i < weekday; i++) {
        currentWeek.push({ date: "", completions: -1, weekday: i });
      }
    }
    currentWeek.push({ ...d, weekday });
    if (weekday === 6) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const maxCompletions = Math.max(1, ...days.map((d) => d.completions));

  function shade(n: number): string {
    if (n < 0) return "bg-transparent";
    if (n === 0) return "bg-btf-text-light/15";
    if (n <= maxCompletions * 0.33) return "bg-btf-gold/30";
    if (n <= maxCompletions * 0.66) return "bg-btf-gold/65";
    return "bg-btf-gold";
  }

  return (
    <div className="rounded-2xl bg-white border-2 border-btf-sky-pale/60 p-5 sm:p-6">
      <div className="flex gap-1 overflow-x-auto pb-2" aria-label="90-day completion heatmap">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1 flex-shrink-0">
            {Array.from({ length: 7 }).map((_, di) => {
              const cell = week[di];
              if (!cell || cell.completions < 0) {
                return <div key={di} className="w-4 h-4 sm:w-5 sm:h-5 bg-transparent" />;
              }
              const label = `${cell.date}: ${cell.completions} completion${cell.completions === 1 ? "" : "s"}`;
              return (
                <div
                  key={di}
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-sm ${shade(cell.completions)}`}
                  title={label}
                  aria-label={label}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 mt-4 text-[10px] tracking-[0.2em] uppercase text-btf-text-light">
        <span>Less</span>
        <span className="w-3 h-3 rounded-sm bg-btf-text-light/15" />
        <span className="w-3 h-3 rounded-sm bg-btf-gold/30" />
        <span className="w-3 h-3 rounded-sm bg-btf-gold/65" />
        <span className="w-3 h-3 rounded-sm bg-btf-gold" />
        <span>More</span>
      </div>
    </div>
  );
}

/* ─── Grove (grounding constellation) ─────────────────────────────── */

function GrovePanel({
  moments,
  insight,
}: {
  moments: ToolMoment[];
  insight: string[];
}) {
  if (moments.length === 0) {
    return (
      <div className="rounded-2xl bg-btf-sky-pale/60 border border-btf-sky-deep/10 p-6">
        <p className="text-btf-text-mid font-light leading-relaxed mb-5">
          No grounding moments yet. Each session adds a light here — your own
          words, kept.
        </p>
        <Link
          href="/tools/grounding/start"
          className="inline-block bg-btf-sky-deep hover:bg-btf-sky text-white font-medium px-6 py-3 rounded-full transition-colors"
        >
          Try a grounding session &rarr;
        </Link>
      </div>
    );
  }
  return (
    <div>
      <p className="text-btf-text-mid font-light leading-relaxed mb-5">
        You&rsquo;ve come back {moments.length}{" "}
        {moments.length === 1 ? "time" : "times"}. Each light is one of them.
      </p>
      {insight.length > 0 && (
        <div className="rounded-2xl bg-btf-sky-pale/60 border border-btf-sky-deep/10 p-5 mb-6">
          <p className="text-[11px] tracking-[0.2em] uppercase text-btf-sky-deep/80 font-semibold mb-2">
            What your grove shows
          </p>
          <ul className="space-y-1.5">
            {insight.map((line) => (
              <li key={line} className="text-btf-text-dark font-light leading-relaxed">
                {line}
              </li>
            ))}
          </ul>
          <p className="text-xs text-btf-text-light font-light mt-3 leading-relaxed">
            These are your own notes — a reminder of what helps you, not a clinical
            measure.
          </p>
        </div>
      )}
      <GroveConstellation moments={moments} />
    </div>
  );
}

/* ─── Waves (urge-surfing archive) ────────────────────────────────── */

function WavesPanel({
  waves,
  count,
  minutes,
  confidenceFirst,
  confidenceLatest,
  confidencePoints,
}: {
  waves: ToolMoment[];
  count: number;
  minutes: number;
  confidenceFirst: number | null;
  confidenceLatest: number | null;
  confidencePoints: number;
}) {
  if (waves.length === 0) {
    return (
      <div className="rounded-2xl bg-btf-sky-pale/60 border border-btf-sky-deep/10 p-6">
        <p className="text-btf-text-mid font-light leading-relaxed mb-5">
          No waves yet. Each urge you ride out is kept here — in your own words,
          every outcome counting the same.
        </p>
        <Link
          href="/tools/urge-surfing/start"
          className="inline-block bg-btf-sky-deep hover:bg-btf-sky text-white font-medium px-6 py-3 rounded-full transition-colors"
        >
          Ride one out &rarr;
        </Link>
      </div>
    );
  }

  const showTrend =
    confidencePoints >= 2 && confidenceFirst !== null && confidenceLatest !== null;

  return (
    <div>
      <p className="text-btf-text-mid font-light leading-relaxed mb-5">
        You&rsquo;ve stayed with {count} {count === 1 ? "wave" : "waves"}
        {minutes > 0 ? `, ${minutes} minutes in all` : ""}. Every one counts.
      </p>

      {showTrend && (
        <div className="rounded-2xl bg-btf-sky-pale/60 border border-btf-sky-deep/10 p-5 mb-6">
          <p className="text-[11px] tracking-[0.2em] uppercase text-btf-sky-deep/80 font-semibold mb-2">
            Your confidence
          </p>
          <p className="text-btf-text-dark font-light leading-relaxed">
            How able you feel to handle urges like these went from{" "}
            <span className="font-serif text-btf-sky-deep text-xl">
              {confidenceFirst}
            </span>{" "}
            to{" "}
            <span className="font-serif text-btf-sky-deep text-xl">
              {confidenceLatest}
            </span>
            .
          </p>
          <p className="text-xs text-btf-text-light font-light mt-2 leading-relaxed">
            Your own sense of your footing — not a clinical measure. The number
            that&rsquo;s good to see grow.
          </p>
        </div>
      )}

      <ul className="space-y-3">
        {waves.map((m) => (
          <li
            key={m.id}
            className="rounded-2xl bg-white border border-btf-sky-deep/10 px-5 py-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3 mb-1">
              <p className="text-[11px] tracking-[0.2em] uppercase text-btf-text-light font-semibold">
                {formatWhen(m.completedAt)}
              </p>
              {m.outcome && (
                <span className="text-[11px] tracking-[0.15em] uppercase text-btf-sky-deep font-semibold">
                  {OUTCOME_LABEL[m.outcome]}
                </span>
              )}
            </div>
            {m.words.length > 0 ? (
              <p className="text-btf-text-dark font-light leading-relaxed">
                {m.words.join(" · ")}
              </p>
            ) : (
              <p className="text-btf-text-light font-light italic">
                You stayed with it without needing words.
              </p>
            )}
            {m.confidence !== undefined && (
              <p className="text-sm text-btf-sky-deep font-light mt-2">
                Felt able to handle it: {m.confidence}/100
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
