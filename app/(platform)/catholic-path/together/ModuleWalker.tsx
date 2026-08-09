"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { submitSessionQuiz, getLeaderboard, type Leaderboard } from "../../../actions/quiz";
import { savePosition, addTime, type DevotionPosition } from "../../../actions/devotion";
import type { ModuleSession } from "../../../lib/monthlyDevotions";

/**
 * The month's learning module, one bite-size page at a time (like the prayer
 * walkers). Reads Scripture/teaching/prayer page by page, then a short quiz.
 * Resumes where the user left off, tracks time on the journey (during-month
 * leaderboard), and records quiz scores (end-of-month leaderboard).
 */
type View = "list" | "session" | "quiz" | "result";

type Page =
  | { kind: "scripture"; ref: string; text: string }
  | { kind: "context"; text: string }
  | { kind: "teaching"; text: string }
  | { kind: "prayer"; text: string }
  | { kind: "closing"; text: string };

/** Module-scope so the render-purity lint rule doesn't flag Date.now(). */
function nowMs(): number {
  return Date.now();
}

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
/** Chunk text into pages of at most `per` sentences each. */
function chunk(t: string, per: number): string[] {
  const s = splitSentences(t);
  const c: string[] = [];
  for (let i = 0; i < s.length; i += per) c.push(s.slice(i, i + per).join(" "));
  return c.length ? c : [t];
}

function buildPages(s: ModuleSession): Page[] {
  const pages: Page[] = [];
  for (const sc of s.scriptures) {
    pages.push({ kind: "scripture", ref: sc.ref, text: sc.text });
    if (sc.context) for (const c of chunk(sc.context, 3)) pages.push({ kind: "context", text: c });
  }
  for (const t of s.teaching) for (const c of chunk(t, 2)) pages.push({ kind: "teaching", text: c });
  if (s.prayer) pages.push({ kind: "prayer", text: s.prayer });
  if (s.closingPrayer) pages.push({ kind: "closing", text: s.closingPrayer });
  return pages;
}

export default function ModuleWalker({
  monthLabel,
  devotionTitle,
  period,
  sessions,
  initialCompleted,
  initialLeaderboard,
  initialPosition,
  // The secular Learn Together module reuses this walker with different
  // labels (no prayer language) and a different exit route. Defaults keep
  // the Catholic module unchanged.
  backHref = "/catholic-path/together",
  backLabel = "Walk Together",
  prayLabel = "Pray",
  closingLabel = "Closing prayer",
  resultCopy = "Well done — every answer is time spent with His Word. Your place is saved.",
}: {
  monthLabel: string;
  devotionTitle: string;
  period: string;
  sessions: ModuleSession[];
  initialCompleted: number[];
  initialLeaderboard: Leaderboard;
  initialPosition: DevotionPosition | null;
  backHref?: string;
  backLabel?: string;
  prayLabel?: string;
  closingLabel?: string;
  resultCopy?: string;
}) {
  // Resume: if there's a saved spot in an unfinished session, open straight to it.
  const resumeIdx = initialPosition
    ? Math.max(0, sessions.findIndex((s) => s.n === initialPosition.sessionN))
    : -1;
  const resumeUnfinished =
    resumeIdx >= 0 && !initialCompleted.includes(sessions[resumeIdx].n);

  const [view, setView] = useState<View>(resumeUnfinished ? "session" : "list");
  const [active, setActive] = useState(resumeUnfinished ? resumeIdx : 0);
  const [page, setPage] = useState(
    resumeUnfinished
      ? Math.min(
          Math.max(0, initialPosition!.page),
          buildPages(sessions[resumeIdx]).length - 1
        )
      : 0
  );
  const [saved, setSaved] = useState(false);
  const [completed, setCompleted] = useState<number[]>(initialCompleted);
  const [board, setBoard] = useState<Leaderboard>(initialLeaderboard);

  const [qIdx, setQIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [, startTransition] = useTransition();

  const session = sessions[active];
  const pages = buildPages(session);
  const lastFlush = useRef<number>(0);
  useEffect(() => {
    lastFlush.current = nowMs();
  }, []);

  /** Send active reading time since the last flush (capped server-side). */
  function flushTime() {
    const now = nowMs();
    const secs = Math.floor((now - lastFlush.current) / 1000);
    lastFlush.current = now;
    if (secs > 0) startTransition(() => { addTime(period, secs); });
  }
  function persist(sessionN: number, pg: number) {
    startTransition(() => { savePosition(period, sessionN, pg); });
  }

  function openSession(i: number) {
    setActive(i);
    setPage(0);
    setSaved(false);
    setView("session");
    lastFlush.current = nowMs();
    persist(sessions[i].n, 0);
  }
  /** Explicit "Save my place": flush time, persist position, confirm briefly. */
  function saveNow() {
    flushTime();
    persist(session.n, page);
    setSaved(true);
  }
  function nextPage() {
    flushTime();
    setSaved(false);
    if (page < pages.length - 1) {
      const np = page + 1;
      setPage(np);
      persist(session.n, np);
    } else {
      // Move into the quiz.
      persist(session.n, pages.length);
      setQIdx(0); setPicked(null); setScore(0);
      setView("quiz");
    }
  }
  function prevPage() {
    setSaved(false);
    if (page > 0) { const pp = page - 1; setPage(pp); persist(session.n, pp); }
    else setView("list");
  }
  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === session.quiz[qIdx].answer) setScore((s) => s + 1);
  }
  function nextQuestion() {
    if (qIdx < session.quiz.length - 1) { setQIdx((n) => n + 1); setPicked(null); }
    else finishQuiz();
  }
  function finishQuiz() {
    flushTime();
    const total = session.quiz.length;
    const correct = score;
    startTransition(async () => {
      await submitSessionQuiz(period, session.n, correct, total);
      const fresh = await getLeaderboard(period);
      setBoard(fresh);
      setCompleted((c) => (c.includes(session.n) ? c : [...c, session.n]));
      setView("result");
    });
  }

  const nextSession = active < sessions.length - 1 ? active + 1 : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-btf-deep-night via-btf-sky-deep to-btf-sky text-white">
      <div className="max-w-xl mx-auto px-6 py-8 sm:py-12 min-h-screen flex flex-col">
        {view === "list" && (
          <>
            <Link href={backHref} className="text-white/60 hover:text-white text-sm inline-flex items-center gap-2">
              <span aria-hidden>&larr;</span> {backLabel}
            </Link>
            <p className="font-cinzel text-[11px] tracking-[0.16em] uppercase text-btf-gold-light mt-8 mb-2">{monthLabel}</p>
            <h1 className="font-serif text-3xl md:text-4xl font-light leading-tight mb-2">{devotionTitle}</h1>
            <p className="text-white/70 font-light leading-relaxed mb-6">
              A guided deep-dive, a little at a time. Read a page, sit with it, and come back whenever — your place is saved.
            </p>
            <ul className="space-y-2.5 mb-8">
              {sessions.map((s, i) => {
                const done = completed.includes(s.n);
                const resumeHere = resumeUnfinished && i === resumeIdx;
                return (
                  <li key={s.n}>
                    <button
                      type="button"
                      onClick={() => openSession(i)}
                      className="w-full text-left flex items-center gap-3 rounded-2xl bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/40 p-4 transition-colors"
                    >
                      <span className={"flex-none w-7 h-7 rounded-full grid place-items-center text-[12px] font-semibold " + (done ? "bg-btf-gold text-[#2a2008]" : "bg-white/[0.08] text-[#9fb6c8]")}>
                        {done ? (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2a2008" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                        ) : (
                          s.n
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-medium">{s.title}</span>
                        <span className="block text-[12px] text-[#8aa0b0]">{done ? "Completed — tap to review" : resumeHere ? "Continue where you left off" : "Begin"}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <LeaderboardView board={board} />
          </>
        )}

        {view === "session" && (
          <div className="flex-1 flex flex-col">
            <button type="button" onClick={() => setView("list")} className="text-white/60 hover:text-white text-sm inline-flex items-center gap-2">
              <span aria-hidden>&larr;</span> Sessions
            </button>
            <div className="flex items-center justify-between mt-8 mb-2">
              <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold">
                Session {session.n} of {sessions.length}
              </p>
              <p className="text-[11px] text-[#8aa0b0]">{page + 1} / {pages.length}</p>
            </div>
            <h2 className="font-serif text-2xl font-light leading-tight mb-6">{session.title}</h2>

            <div className="flex-1 flex items-center">
              <PageBody page={pages[page]} prayLabel={prayLabel} closingLabel={closingLabel} />
            </div>

            <div className="pt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={prevPage}
                className="rounded-full py-3 px-5 border border-white/15 text-[#cfe0ee] text-sm"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextPage}
                className="flex-1 inline-flex items-center justify-center rounded-full py-3.5 px-6 font-semibold text-[#2a2008] bg-gradient-to-b from-btf-gold-light to-btf-gold transition-transform hover:-translate-y-0.5"
              >
                {page < pages.length - 1 ? "Continue" : "Take the quiz"}
              </button>
            </div>
            <button
              type="button"
              onClick={saveNow}
              className="mt-3 self-center inline-flex items-center gap-1.5 text-[12px] text-[#8aa0b0] hover:text-btf-gold-light transition-colors"
            >
              {saved ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 6 9 17l-5-5" /></svg>
                  Saved
                </>
              ) : (
                "Save my place"
              )}
            </button>
          </div>
        )}

        {view === "quiz" && (
          <div className="flex-1 flex flex-col">
            <p className="text-[11px] tracking-[0.2em] uppercase text-white/60 font-semibold mt-4 mb-4">
              Question {qIdx + 1} of {session.quiz.length}
            </p>
            <h2 className="font-serif text-2xl font-light leading-snug mb-6">{session.quiz[qIdx].q}</h2>
            <div className="space-y-2.5">
              {session.quiz[qIdx].options.map((opt, i) => {
                const isAnswer = i === session.quiz[qIdx].answer;
                const chosen = picked === i;
                let cls = "bg-white/[0.055] border-white/[0.09] hover:border-btf-gold/40";
                if (picked !== null) {
                  if (isAnswer) cls = "bg-btf-gold/15 border-btf-gold/50 text-btf-gold-light";
                  else if (chosen) cls = "bg-[rgba(201,80,80,0.12)] border-[rgba(201,80,80,0.4)] text-[#e8b3b3]";
                  else cls = "bg-white/[0.03] border-white/[0.06] text-white/50";
                }
                return (
                  <button key={i} type="button" onClick={() => pick(i)} disabled={picked !== null}
                    className={"w-full text-left rounded-2xl px-4 py-3 border text-sm transition-colors flex items-center gap-2 " + cls}>
                    <span className="flex-1">{opt}</span>
                    {picked !== null && isAnswer && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e8cc7a" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-auto pt-8">
              {picked !== null && (
                <button type="button" onClick={nextQuestion}
                  className="w-full inline-flex items-center justify-center rounded-full py-3.5 px-6 font-semibold text-[#2a2008] bg-gradient-to-b from-btf-gold-light to-btf-gold transition-transform hover:-translate-y-0.5">
                  {qIdx < session.quiz.length - 1 ? "Next" : "See results"}
                </button>
              )}
            </div>
          </div>
        )}

        {view === "result" && (
          <div className="flex-1 flex flex-col">
            <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mt-6 mb-2">Session {session.n} complete</p>
            <h2 className="font-serif text-3xl font-light leading-tight mb-2">
              You scored {score} of {session.quiz.length}
            </h2>
            <p className="text-white/75 font-light leading-relaxed mb-6">
              {resultCopy}
            </p>
            <LeaderboardView board={board} />
            <div className="mt-8 space-y-3">
              {nextSession !== null && (
                <button type="button" onClick={() => openSession(nextSession)}
                  className="w-full inline-flex items-center justify-center rounded-full py-3.5 px-6 font-semibold text-[#2a2008] bg-gradient-to-b from-btf-gold-light to-btf-gold transition-transform hover:-translate-y-0.5">
                  Next session
                </button>
              )}
              <button type="button" onClick={() => setView("list")} className="w-full text-center rounded-full py-3 px-6 border border-white/15 text-[#cfe0ee]">
                Back to sessions
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function PageBody({
  page,
  prayLabel,
  closingLabel,
}: {
  page: Page;
  prayLabel: string;
  closingLabel: string;
}) {
  if (page.kind === "scripture") {
    return (
      <div className="w-full rounded-2xl bg-white/[0.055] border border-white/[0.09] p-6">
        <p className="font-serif italic text-2xl md:text-[26px] text-white/90 leading-relaxed mb-3">&ldquo;{page.text}&rdquo;</p>
        <p className="text-[12px] text-btf-gold-light">{page.ref}</p>
      </div>
    );
  }
  if (page.kind === "context") {
    return (
      <div className="w-full">
        <p className="text-[10px] tracking-[0.2em] uppercase text-btf-gold font-semibold mb-4">How this ties in</p>
        <p className="text-white/90 font-light leading-relaxed text-[19px]">{page.text}</p>
      </div>
    );
  }
  if (page.kind === "prayer") {
    return (
      <div className="w-full text-center">
        <p className="text-[10px] tracking-[0.2em] uppercase text-btf-gold font-semibold mb-4">{prayLabel}</p>
        <p className="font-serif italic text-2xl text-btf-gold-light leading-relaxed">{page.text}</p>
      </div>
    );
  }
  if (page.kind === "closing") {
    return (
      <div className="w-full">
        <p className="text-[10px] tracking-[0.2em] uppercase text-btf-gold font-semibold mb-4 text-center">{closingLabel}</p>
        <p className="font-serif italic text-[20px] text-btf-gold-light leading-relaxed">{page.text}</p>
      </div>
    );
  }
  return <p className="text-white/90 font-light leading-relaxed text-[19px]">{page.text}</p>;
}

function LeaderboardView({ board }: { board: Leaderboard }) {
  const youInTop = board.entries.some((e) => e.you);
  const title = board.mode === "time" ? "Time on the journey this month" : "End-of-month quiz leaderboard";
  return (
    <div className="rounded-2xl bg-white/[0.045] border border-white/[0.09] p-4">
      <p className="text-[11px] tracking-[0.2em] uppercase text-btf-gold font-semibold mb-1">{title}</p>
      <p className="text-[11px] text-[#8aa0b0] mb-3">
        {board.mode === "time" ? "Ranked by minutes spent walking the journey." : "Final standings by quiz score."}
      </p>
      {board.entries.length === 0 ? (
        <p className="text-sm text-white/70 font-light">Be the first on the board this month.</p>
      ) : (
        <ul className="space-y-2">
          {board.entries.map((e, i) => (
            <li key={i} className="flex items-center gap-3 text-sm">
              <span className="w-5 text-[#9fb6c8] tabular-nums">{i + 1}</span>
              <span className={"flex-1 " + (e.you ? "font-semibold text-btf-gold-light" : "text-white/90")}>
                {e.name}
                {e.you && <span className="ml-2 text-[10px] uppercase tracking-[0.14em] text-btf-gold-light">you</span>}
              </span>
              <span className="text-white/70 tabular-nums">{e.value} {board.unit}</span>
            </li>
          ))}
        </ul>
      )}
      {board.yourRank !== null && !youInTop && (
        <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-3 text-sm">
          <span className="w-5 text-btf-gold-light tabular-nums">{board.yourRank}</span>
          <span className="flex-1 font-semibold text-btf-gold-light">You</span>
          <span className="text-white/70 tabular-nums">{board.yourValue} {board.unit}</span>
        </div>
      )}
    </div>
  );
}
