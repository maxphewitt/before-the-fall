"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import BackLink from "../../../../_nav/BackLink";
import { recordNovenaDay, setNovenaReminder } from "../../../../../actions/novenas";
import { formatScheduleTime } from "../../../../../lib/habitTypes";

type Phase = "reflect" | "discern" | "pray" | "closing" | "done";

/**
 * Interactive novena day, on the immersive dark Shell:
 *   Reflect (the meditation) → Discern (write what you're bringing) →
 *   Pray (the refrain 3x, three beads that fill gold) → Closing prayer → Amen.
 * Progress is forgiving — missing a day never resets the novena.
 */
export default function NovenaDayView({
  novenaId,
  novenaTitle,
  dayNumber,
  total,
  dayTitle,
  meditation,
  prayer,
  repeat,
  closing,
}: {
  novenaId: string;
  novenaTitle: string;
  dayNumber: number;
  total: number;
  dayTitle: string;
  meditation: string[];
  prayer: string;
  repeat: number;
  closing: string[];
}) {
  const [phase, setPhase] = useState<Phase>("reflect");
  const [intention, setIntention] = useState("");
  const [prayed, setPrayed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const detailHref = `/catholic-path/novenas/${novenaId}`;
  const nextDay = dayNumber < total ? dayNumber + 1 : null;

  function complete() {
    setError(null);
    startTransition(async () => {
      const res = await recordNovenaDay(novenaId, dayNumber);
      if (res.success) setPhase("done");
      else setError(res.error);
    });
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-btf-deep-night via-btf-sky-deep to-btf-sky text-white">
      <div className="max-w-xl mx-auto px-6 py-8 sm:py-12 min-h-screen flex flex-col">
        <BackLink fallbackHref={detailHref} label={novenaTitle} className="text-white/60 hover:text-white text-sm inline-flex items-center gap-2" />

        {phase !== "done" && (
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mt-8 mb-2">
            Day {dayNumber} of {total}
          </p>
        )}

        {/* A small reminder of what they're bringing, once written */}
        {intention.trim() && phase !== "reflect" && phase !== "discern" && phase !== "done" && (
          <div className="mb-4 rounded-xl bg-white/[0.06] border border-btf-gold/25 px-3.5 py-2 text-[13px] text-white/85">
            <span className="text-btf-gold-light text-[10px] uppercase tracking-[0.16em] font-semibold block mb-0.5">Bringing</span>
            {intention}
          </div>
        )}

        {/* ── Reflect ── */}
        {phase === "reflect" && (
          <div className="flex-1 flex flex-col">
            <h1 className="font-serif text-3xl md:text-4xl font-light leading-tight mb-6">{dayTitle}</h1>
            <div className="space-y-4">
              {meditation.map((line, i) => (
                <p key={i} className="text-white/85 font-light leading-relaxed text-[17px]">{line}</p>
              ))}
            </div>
            <div className="mt-auto pt-10">
              <PrimaryButton onClick={() => setPhase("discern")}>Continue</PrimaryButton>
            </div>
          </div>
        )}

        {/* ── Discern ── */}
        {phase === "discern" && (
          <div className="flex-1 flex flex-col">
            <h1 className="font-serif text-3xl font-light leading-tight mb-3">What are you bringing?</h1>
            <p className="text-white/75 font-light leading-relaxed mb-5">
              Before you pray, sit for a moment. What is on your heart today — a person, a fear, a hope, a question you are discerning? Name it in your own words, or simply be still.
            </p>
            <textarea
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              rows={4}
              placeholder="What's calling you today… (optional)"
              className="w-full rounded-2xl bg-white/[0.06] border border-white/15 px-4 py-3 text-[#e9f1f8] placeholder:text-[#9fb6c8] outline-none focus:border-btf-gold/50 resize-none"
            />
            <div className="mt-auto pt-8">
              <PrimaryButton onClick={() => setPhase("pray")}>
                {intention.trim() ? "Bring it to prayer" : "Continue to prayer"}
              </PrimaryButton>
            </div>
          </div>
        )}

        {/* ── Pray (beads) ── */}
        {phase === "pray" && (
          <div className="flex-1 flex flex-col">
            <p className="text-[11px] tracking-[0.2em] uppercase text-white/60 font-semibold mb-4">
              Pray {repeat === 3 ? "three times" : `${repeat} times`}
            </p>
            <div className="flex-1 flex items-center">
              <p className="font-serif italic text-2xl md:text-3xl text-btf-gold-light font-light leading-snug">
                {prayer}
              </p>
            </div>

            {/* Beads */}
            <div className="flex items-center justify-center gap-4 mb-8">
              {Array.from({ length: repeat }).map((_, i) => (
                <span
                  key={i}
                  className={
                    "w-6 h-6 rounded-full border transition-colors " +
                    (i < prayed
                      ? "bg-gradient-to-br from-btf-gold to-btf-gold-light border-btf-gold"
                      : "bg-white/[0.06] border-white/25")
                  }
                />
              ))}
            </div>

            {prayed < repeat ? (
              <PrimaryButton onClick={() => setPrayed((p) => Math.min(repeat, p + 1))}>
                Prayed {prayed > 0 ? `(${prayed}/${repeat})` : ""}
              </PrimaryButton>
            ) : (
              <PrimaryButton onClick={() => setPhase(closing.length > 0 ? "closing" : "done")}>
                Continue
              </PrimaryButton>
            )}
          </div>
        )}

        {/* ── Closing ── */}
        {phase === "closing" && (
          <div className="flex-1 flex flex-col">
            <p className="text-[11px] tracking-[0.2em] uppercase text-white/60 font-semibold mt-4 mb-4">To close</p>
            <div className="flex-1 flex items-center">
              <div className="space-y-4">
                {closing.map((line, i) => (
                  <p key={i} className="text-white/90 font-light leading-relaxed text-[18px]">{line}</p>
                ))}
              </div>
            </div>
            {error && <p className="text-[#e8b3b3] text-sm mb-4">{error}</p>}
            <div className="pt-6">
              <PrimaryButton onClick={complete} disabled={pending}>
                {pending ? "Saving…" : "Amen — mark today complete"}
              </PrimaryButton>
            </div>
          </div>
        )}

        {/* ── Done ── */}
        {phase === "done" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <svg width="34" height="42" viewBox="0 0 13 16" fill="none" className="mb-6" aria-hidden>
              <path d="M5.2 1.4h2.6v4.2H12v2.6H7.8V15H5.2V8.2H1V5.6h4.2V1.4z" fill="#e8cc7a" />
            </svg>
            <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-2">
              Day {dayNumber} complete
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-light leading-tight mb-3">
              {nextDay ? "Well prayed. Rest now." : "You have completed the novena."}
            </h2>
            <p className="text-white/75 font-light leading-relaxed mb-8 max-w-sm">
              {nextDay
                ? "Come back tomorrow for the next day — and if a day slips by, that is alright. Your novena is waiting for you, not counting against you."
                : "Nine days of faithful prayer. Whatever comes, you have placed it in God's hands."}
            </p>
            {/* After Day 1, offer to add the novena to their day with a time. */}
            {dayNumber === 1 && nextDay && <ReminderPrompt novenaId={novenaId} />}

            <div className="w-full max-w-xs space-y-3">
              {nextDay && (
                <Link
                  href={`/catholic-path/novenas/${novenaId}/${nextDay}`}
                  className="block w-full text-center rounded-full py-3.5 px-6 font-semibold text-[#2a2008] bg-gradient-to-b from-btf-gold-light to-btf-gold"
                >
                  Preview Day {nextDay}
                </Link>
              )}
              <Link href={detailHref} className="block w-full text-center rounded-full py-3 px-6 border border-white/15 text-[#cfe0ee]">
                Back to the novena
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function ReminderPrompt({ novenaId }: { novenaId: string }) {
  const [time, setTime] = useState("08:00");
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function add() {
    setError(null);
    startTransition(async () => {
      const res = await setNovenaReminder(novenaId, time);
      if (res.success) setSaved(time);
      else setError(res.error);
    });
  }

  if (saved) {
    return (
      <div className="w-full max-w-sm mb-6 rounded-2xl bg-white/[0.055] border border-btf-gold/25 p-4 text-center">
        <p className="text-[13px] text-btf-gold-light inline-flex items-center gap-1.5 justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e8cc7a" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          Added to your daily habits at {formatScheduleTime(saved)}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mb-6 rounded-2xl bg-white/[0.055] border border-white/[0.09] p-4">
      <p className="text-sm text-white/85 font-medium mb-1">Keep it going</p>
      <p className="text-[12px] text-[#9fb6c8] mb-3 leading-relaxed">
        Add this novena to your daily habits with a time, and it&rsquo;ll be waiting for you on your home each day.
      </p>
      <div className="flex items-center gap-2">
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="bg-white/[0.06] border border-white/15 rounded-lg px-2.5 py-1.5 text-[#e9f1f8] outline-none focus:border-btf-gold/50 [color-scheme:dark]"
        />
        <button
          type="button"
          onClick={add}
          disabled={pending}
          className="flex-1 rounded-full bg-gradient-to-b from-btf-gold-light to-btf-gold text-[#2a2008] font-semibold text-sm px-4 py-2 disabled:opacity-60"
        >
          {pending ? "Adding…" : "Add to my day"}
        </button>
      </div>
      {error && <p className="text-[#e8b3b3] text-xs mt-2">{error}</p>}
    </div>
  );
}

function PrimaryButton({
  onClick,
  children,
  disabled,
}: {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full inline-flex items-center justify-center rounded-full py-3.5 px-6 font-semibold text-[#2a2008] bg-gradient-to-b from-btf-gold-light to-btf-gold disabled:opacity-60 transition-transform hover:-translate-y-0.5"
    >
      {children}
    </button>
  );
}
