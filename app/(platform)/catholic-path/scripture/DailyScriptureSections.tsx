"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ScripturePassage, ScriptureLiturgicalSeason } from "../../../lib/scripture";

/**
 * Client-side rendering of the date-dependent scripture sections.
 *
 * Why client-side: "today's passage" rotates by day-of-year, computed
 * with `new Date()`. The server runs in UTC, so a Pacific-time user at
 * 11pm sees the next day's passage — and the USCCB readings link
 * also points at the wrong date. Doing this in the browser uses the
 * user's local clock and stays correct everywhere.
 *
 * Server passes the full list of passages (or season subset) so the
 * client can pick today's without an extra round-trip. Until the client
 * mounts, we render the server's best-guess today as a placeholder so
 * there's no flash of empty content.
 */

type Props = {
  // All passages eligible to be "today's". The server has already
  // filtered down to season-specific OR general; we pass whichever
  // it computed as the initial set.
  allPassages: ScripturePassage[];
  seasonPassages: ScripturePassage[];
  season: ScriptureLiturgicalSeason;
  seasonLabel: string;
  seasonBlurb: string;
  initialPassageId: string;
};

export default function DailyScriptureSections({
  allPassages,
  seasonPassages,
  seasonLabel,
  seasonBlurb,
  initialPassageId,
}: Props) {
  const [passageId, setPassageId] = useState<string>(initialPassageId);
  const [usccbDate, setUsccbDate] = useState<string>(initialUsccbDate());

  useEffect(() => {
    // Reading the browser's local Date requires the client. Allowed
    // exception to no-setState-in-effect because this state can only
    // be determined after hydration.
    const now = new Date();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPassageId(pickPassageIdForDate(now, allPassages, seasonPassages));
    setUsccbDate(formatUsccbDate(now));
  }, [allPassages, seasonPassages]);

  const todaysPassage =
    allPassages.find((p) => p.id === passageId) ?? allPassages[0];
  const seasonList = seasonPassages.filter((p) => p.id !== todaysPassage.id);

  return (
    <>
      {/* Today's passage */}
      <section className="mb-12" aria-labelledby="today-heading">
        <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light font-semibold mb-3">
          Today
        </p>
        <h2
          id="today-heading"
          className="font-serif text-2xl text-white font-light mb-2"
        >
          {todaysPassage.title}
        </h2>
        <p className="text-xs text-white/70 font-light mb-5">
          {todaysPassage.citation} &middot; {todaysPassage.translation}
        </p>

        <Link
          href={`/catholic-path/scripture/${todaysPassage.id}`}
          className="block rounded-2xl bg-white/[0.055] border border-btf-gold/30 hover:border-btf-gold/40 hover:bg-white/[0.08] p-6 transition-all"
        >
          {/* No verse preview — the guided read is the experience.
              Just the why-it-was-picked framing + the begin CTA. */}
          <p className="text-[10px] tracking-[0.2em] uppercase text-btf-gold-light font-semibold mb-2">
            For when
          </p>
          <p className="font-serif italic text-base text-[#e9f1f8] font-light leading-relaxed mb-4">
            {todaysPassage.when_to_use}
          </p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-btf-gold-light font-semibold">
            Read this slowly &rarr;
          </p>
        </Link>
      </section>

      {/* Liturgical season */}
      {seasonList.length > 0 && (
        <section className="mb-12" aria-labelledby="season-heading">
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light font-semibold mb-3">
            For this season
          </p>
          <h2
            id="season-heading"
            className="font-serif text-2xl text-white font-light mb-2"
          >
            {seasonLabel}
          </h2>
          <p className="text-sm text-white/85 font-light leading-relaxed mb-5">
            {seasonBlurb}
          </p>
          <ul className="space-y-3">
            {seasonList.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/catholic-path/scripture/${p.id}`}
                  className="block rounded-2xl bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/40 hover:bg-white/[0.08] p-4 transition-all"
                >
                  <p className="font-medium text-white">{p.title}</p>
                  <p className="text-xs text-white/70 font-light mt-0.5">
                    {p.citation}
                  </p>
                  <p className="text-xs text-[#e9f1f8] font-light mt-1 leading-relaxed">
                    {p.when_to_use}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* USCCB Mass readings link — date is the user's local date. Kept
          as an external link to USCCB rather than reproduced/rendered on
          our own (2026-08-04, Max's call) — it's already free and
          complete there. Styled as a real button, not a bare hyperlink. */}
      <section className="mt-12 rounded-2xl bg-white/[0.055] border border-white/[0.09] p-5 text-center">
        <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light font-semibold mb-3">
          For today&rsquo;s Mass
        </p>
        <a
          href={`https://bible.usccb.org/bible/readings/${usccbDate}.cfm`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-btf-gold hover:bg-btf-gold-light text-btf-sky-deep font-medium text-sm px-6 py-3 shadow-lg hover:-translate-y-0.5 transition-all"
        >
          Read Today&rsquo;s Mass Readings <span aria-hidden>&rarr;</span>
        </a>
        <p className="text-xs text-white/70 font-light mt-3 leading-relaxed">
          The library above is a curated set of passages for moments the platform&rsquo;s users actually face. For the daily lectionary, go directly to the USCCB.
        </p>
      </section>
    </>
  );
}

function initialUsccbDate(): string {
  // SSR placeholder. Replaced on mount with the user's local date.
  return formatUsccbDate(new Date());
}

function formatUsccbDate(date: Date): string {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${mm}${dd}${yy}`;
}

function pickPassageIdForDate(
  date: Date,
  allPassages: ScripturePassage[],
  seasonPassages: ScripturePassage[]
): string {
  // Same algorithm as the server-side getPassageForDate so we stay
  // consistent: 4-of-7 days favor the season subset, 3-of-7 fall to
  // the general pool.
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );
  if (seasonPassages.length > 0 && dayOfYear % 7 < 4) {
    return seasonPassages[dayOfYear % seasonPassages.length].id;
  }
  return allPassages[dayOfYear % allPassages.length].id;
}
