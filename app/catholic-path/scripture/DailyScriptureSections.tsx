"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ScripturePassage, ScriptureLiturgicalSeason } from "../../lib/scripture";

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
        <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">
          Today
        </p>
        <h2
          id="today-heading"
          className="font-serif text-2xl text-btf-sky-deep font-light mb-2"
        >
          {todaysPassage.title}
        </h2>
        <p className="text-xs text-btf-text-light font-light mb-5">
          {todaysPassage.citation} &middot; {todaysPassage.translation}
        </p>

        <Link
          href={`/catholic-path/scripture/${todaysPassage.id}`}
          className="block rounded-2xl bg-white border-2 border-btf-gold/30 hover:border-btf-gold hover:shadow-md p-6 transition-all"
        >
          {/* No verse preview — the guided read is the experience.
              Just the why-it-was-picked framing + the begin CTA. */}
          <p className="text-[10px] tracking-[0.2em] uppercase text-btf-sky font-semibold mb-2">
            For when
          </p>
          <p className="font-serif italic text-base text-btf-text-mid font-light leading-relaxed mb-4">
            {todaysPassage.when_to_use}
          </p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-btf-gold font-semibold">
            Read this slowly &rarr;
          </p>
        </Link>
      </section>

      {/* Liturgical season */}
      {seasonList.length > 0 && (
        <section className="mb-12" aria-labelledby="season-heading">
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">
            For this season
          </p>
          <h2
            id="season-heading"
            className="font-serif text-2xl text-btf-sky-deep font-light mb-2"
          >
            {seasonLabel}
          </h2>
          <p className="text-sm text-btf-text-mid font-light leading-relaxed mb-5">
            {seasonBlurb}
          </p>
          <ul className="space-y-3">
            {seasonList.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/catholic-path/scripture/${p.id}`}
                  className="block rounded-2xl bg-white border border-btf-sky-pale/60 hover:border-btf-sky-light hover:shadow-md p-4 transition-all"
                >
                  <p className="font-medium text-btf-sky-deep">{p.title}</p>
                  <p className="text-xs text-btf-text-light font-light mt-0.5">
                    {p.citation}
                  </p>
                  <p className="text-xs text-btf-text-mid font-light mt-1 leading-relaxed">
                    {p.when_to_use}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* USCCB Mass readings link — date is the user's local date */}
      <section className="mt-12 rounded-2xl bg-btf-sky-pale/40 border border-btf-sky-pale p-5 text-center">
        <p className="text-[10px] tracking-[0.25em] uppercase text-btf-sky-deep font-semibold mb-2">
          For today&rsquo;s Mass
        </p>
        <a
          href={`https://bible.usccb.org/bible/readings/${usccbDate}.cfm`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-btf-sky-deep underline underline-offset-4 font-medium"
        >
          Read today&rsquo;s actual Mass readings at usccb.org &rarr;
        </a>
        <p className="text-xs text-btf-text-mid font-light mt-2 leading-relaxed">
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
