"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import BackLink from "../_nav/BackLink";
import { completeStartHereSession } from "../../actions/startHere";
import type { StartHereTrack } from "../../lib/startHere";

/**
 * StartHereWalker — one Start Here session, one page at a time. Modeled
 * on ModuleWalker's session view but deliberately simpler: NO quiz, NO
 * leaderboard, NO time tracking (Max's call — orientation, not a
 * course). Readings arrive fully resolved from the server page
 * (Catholic scripture is resolved from DR citations there; secular
 * text is inline in lib/startHere.ts) — this component never fetches.
 * Completion fires once when the closing screen is reached.
 */

export type WalkerReading = { ref: string; text: string; context: string };

type Page =
  | { kind: "reading"; ref: string; text: string }
  | { kind: "context"; text: string }
  | { kind: "teaching"; text: string }
  | { kind: "aspiration"; text: string }
  | { kind: "closing"; text: string };

/** Sentence splitter that won't break on common abbreviations (St., e.g., …). */
const ABBR = /\b(St|Ss|Mt|Mr|Mrs|Ms|Dr|Fr|vs|i\.e|e\.g|cf|ch|v)\.$/;
function splitSentences(t: string): string[] {
  const parts = t.split(/(?<=[.!?])\s+/);
  const out: string[] = [];
  for (const p of parts) {
    if (out.length && ABBR.test(out[out.length - 1])) out[out.length - 1] += " " + p;
    else out.push(p);
  }
  return out;
}
function chunk(t: string, per: number): string[] {
  const s = splitSentences(t);
  const c: string[] = [];
  for (let i = 0; i < s.length; i += per) c.push(s.slice(i, i + per).join(" "));
  return c.length ? c : [t];
}

export default function StartHereWalker({
  track,
  sessionN,
  sessionTotal,
  title,
  readings,
  teaching,
  aspiration,
  closing,
  nextHref,
}: {
  track: StartHereTrack;
  sessionN: number;
  sessionTotal: number;
  title: string;
  readings: WalkerReading[];
  teaching: string[];
  aspiration: string;
  closing: string;
  /** Next session's href, or null when this is the last session. */
  nextHref: string | null;
}) {
  const catholic = track === "catholic";
  const aspirationLabel = catholic ? "Pray" : "Practice";
  const closingLabel = catholic ? "Closing prayer" : "Closing thought";

  const pages: Page[] = [];
  for (const r of readings) {
    pages.push({ kind: "reading", ref: r.ref, text: r.text });
    for (const c of chunk(r.context, 3)) pages.push({ kind: "context", text: c });
  }
  for (const t of teaching) for (const c of chunk(t, 2)) pages.push({ kind: "teaching", text: c });
  pages.push({ kind: "aspiration", text: aspiration });
  pages.push({ kind: "closing", text: closing });

  const [page, setPage] = useState(0);
  const [done, setDone] = useState(false);

  const completionFired = useRef(false);
  useEffect(() => {
    if (done && !completionFired.current) {
      completionFired.current = true;
      completeStartHereSession(track, sessionN).catch(() => {
        /* best-effort — never blocks the closing screen */
      });
    }
  }, [done, track, sessionN]);

  if (done) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-btf-deep-night via-btf-sky-deep to-btf-sky text-white">
        <div className="max-w-xl mx-auto px-6 py-8 sm:py-12 min-h-screen flex flex-col">
          <div className="flex items-center justify-between mb-12">
            <BackLink
              fallbackHref="/start-here"
              label="Start Here"
              className="text-white/60 hover:text-white text-xs inline-flex items-center gap-2 transition-colors uppercase tracking-[0.25em]"
            />
            <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold">
              Session {sessionN} of {sessionTotal}
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3">
              Session complete
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-4 max-w-md">
              {title}
            </h1>
            <p className="font-serif italic text-base text-white/85 font-light leading-relaxed max-w-md">
              {nextHref
                ? "Take a breath. The next session is ready whenever you are."
                : "That's the whole orientation. Everything here stays open to you — come back to any session, any time."}
            </p>
          </div>

          <div className="space-y-3 mt-12">
            {nextHref ? (
              <Link
                href={nextHref}
                className="block w-full text-center bg-btf-gold hover:bg-btf-gold-light text-btf-sky-deep font-medium px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 transition-all"
              >
                Next session &rarr;
              </Link>
            ) : (
              <Link
                href="/home"
                className="block w-full text-center bg-btf-gold hover:bg-btf-gold-light text-btf-sky-deep font-medium px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 transition-all"
              >
                Pick one habit for tomorrow &rarr;
              </Link>
            )}
            <Link
              href="/start-here"
              className="block w-full text-center rounded-full py-3 px-6 border border-white/15 text-[#cfe0ee]"
            >
              All sessions
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-btf-deep-night via-btf-sky-deep to-btf-sky text-white">
      <div className="max-w-xl mx-auto px-6 py-8 sm:py-12 min-h-screen flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <BackLink
            fallbackHref="/start-here"
            label="Start Here"
            className="text-white/60 hover:text-white text-xs inline-flex items-center gap-2 transition-colors uppercase tracking-[0.25em]"
          />
          <p className="text-[11px] text-[#8aa0b0]">
            {page + 1} / {pages.length}
          </p>
        </div>

        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={pages.length}
          aria-valuenow={page + 1}
          aria-label="Session progress"
          className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-8"
        >
          <div
            className="h-full bg-btf-gold transition-all duration-500"
            style={{ width: `${Math.round(((page + 1) / pages.length) * 100)}%` }}
          />
        </div>

        <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-2">
          Session {sessionN} of {sessionTotal}
        </p>
        <h2 className="font-serif text-2xl font-light leading-tight mb-6">{title}</h2>

        <div className="flex-1 flex items-center">
          <PageBody page={pages[page]} aspirationLabel={aspirationLabel} closingLabel={closingLabel} />
        </div>

        <div className="pt-8 flex items-center gap-3">
          {page > 0 && (
            <button
              type="button"
              onClick={() => setPage(page - 1)}
              className="rounded-full py-3 px-5 border border-white/15 text-[#cfe0ee] text-sm"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={() => (page < pages.length - 1 ? setPage(page + 1) : setDone(true))}
            className="flex-1 inline-flex items-center justify-center rounded-full py-3.5 px-6 font-semibold text-[#2a2008] bg-gradient-to-b from-btf-gold-light to-btf-gold transition-transform hover:-translate-y-0.5"
          >
            {page < pages.length - 1 ? "Continue" : "Finish"}
          </button>
        </div>
      </div>
    </main>
  );
}

function PageBody({
  page,
  aspirationLabel,
  closingLabel,
}: {
  page: Page;
  aspirationLabel: string;
  closingLabel: string;
}) {
  if (page.kind === "reading") {
    return (
      <div className="w-full rounded-2xl bg-white/[0.055] border border-white/[0.09] p-6">
        <p className="font-serif italic text-2xl md:text-[26px] text-white/90 leading-relaxed mb-3">
          &ldquo;{page.text}&rdquo;
        </p>
        <p className="text-[12px] text-btf-gold-light">{page.ref}</p>
      </div>
    );
  }
  if (page.kind === "context") {
    return (
      <div className="w-full">
        <p className="text-[10px] tracking-[0.2em] uppercase text-btf-gold font-semibold mb-4">
          How this ties in
        </p>
        <p className="text-white/90 font-light leading-relaxed text-[19px]">{page.text}</p>
      </div>
    );
  }
  if (page.kind === "aspiration") {
    return (
      <div className="w-full text-center">
        <p className="text-[10px] tracking-[0.2em] uppercase text-btf-gold font-semibold mb-4">
          {aspirationLabel}
        </p>
        <p className="font-serif italic text-2xl text-btf-gold-light leading-relaxed">{page.text}</p>
      </div>
    );
  }
  if (page.kind === "closing") {
    return (
      <div className="w-full">
        <p className="text-[10px] tracking-[0.2em] uppercase text-btf-gold font-semibold mb-4 text-center">
          {closingLabel}
        </p>
        <p className="font-serif italic text-[20px] text-btf-gold-light leading-relaxed">{page.text}</p>
      </div>
    );
  }
  return <p className="text-white/90 font-light leading-relaxed text-[19px]">{page.text}</p>;
}
