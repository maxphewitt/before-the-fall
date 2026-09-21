"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { markFastingDay } from "../../actions/fastingSeasons";
import {
  seasonDayNumber,
  seasonTotalDays,
  seasonKeptCount,
  seasonCurrentRun,
  seasonIsFinished,
  addDaysISO,
  templateForKind,
  type FastingSeason,
} from "../../lib/fastingSeasons";

/**
 * One fasting season, as a card — used on Home (compact) and /seasons.
 *
 * MERCY IN THE PIXELS (Max, 2026-08-11): kept days are gold, stumbled
 * days are red, and the row keeps marching either way — the journey
 * never resets. The stumble button is quiet, the copy is field-journal
 * copy ("naming it is the work"), and unmarked days are simply unmarked.
 * The strict current-run counter renders ONLY when the user elected it
 * on a custom season.
 *
 * `todayISO` is computed server-side and passed in (no Date.now() in
 * render — react-hooks/purity).
 */
export default function SeasonCard({
  season,
  todayISO,
  compact = false,
}: {
  season: FastingSeason;
  todayISO: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const total = seasonTotalDays(season);
  const dayN = seasonDayNumber(season, todayISO);
  const kept = seasonKeptCount(season);
  const finished = seasonIsFinished(season, todayISO);
  const notStarted = dayN === 0;
  const todayStatus = season.days[todayISO];
  const label = season.kind === "custom" ? "Your season" : templateForKind(season.kind).label;

  function mark(status: "kept" | "stumbled") {
    setError(null);
    startTransition(async () => {
      const res = await markFastingDay(season.id, todayISO, status);
      if (!res.success) setError(res.error);
      else router.refresh();
    });
  }

  return (
    <div className="rounded-[20px] p-[18px] border border-white/[0.09] bg-white/[0.055]">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[10px] tracking-[0.22em] uppercase text-btf-gold-light font-semibold">
          {label}
        </p>
        <p className="text-[12px] text-[#9fb6c8] tabular-nums">
          {finished
            ? "Complete"
            : notStarted
              ? `Begins ${season.startDate}`
              : `Day ${dayN} of ${total}`}
        </p>
      </div>

      <p className="font-serif text-[18px] leading-snug mt-1.5 text-[#e9f1f8]">{season.title}</p>

      <div className="flex items-center gap-4 mt-2 text-[12px] text-[#9fb6c8]">
        <span>
          <span className="text-btf-gold-light font-semibold tabular-nums">{kept}</span>{" "}
          {kept === 1 ? "day" : "days"} kept
        </span>
        {season.strict && (
          <span>
            current run{" "}
            <span className="text-btf-gold-light font-semibold tabular-nums">
              {seasonCurrentRun(season)}
            </span>
          </span>
        )}
      </div>

      {/* Day grid — one square per day of the season, in order. */}
      <div className="flex flex-wrap gap-[3px] mt-3" aria-hidden>
        {Array.from({ length: total }, (_, i) => {
          const day = addDaysISO(season.startDate, i);
          const status = season.days[day];
          const isToday = day === todayISO;
          const future = day > todayISO;
          let cls = "bg-white/[0.08]"; // past, unmarked — no debt, just unmarked
          if (status === "kept") cls = "bg-gradient-to-b from-btf-gold-light to-btf-gold";
          else if (status === "stumbled") cls = "bg-[rgba(201,80,80,0.75)]";
          else if (future) cls = "bg-white/[0.04]";
          return (
            <span
              key={day}
              className={
                "w-2 h-2 rounded-[2px] " +
                cls +
                (isToday ? " ring-1 ring-btf-gold-light/80" : "")
              }
            />
          );
        })}
      </div>

      {finished ? (
        <p className="text-[13px] text-white/80 font-light leading-relaxed mt-3">
          {kept > 0
            ? `You carried this for ${total} days and kept ${kept} of them. Every gold square was a real choice.`
            : "The season is over. What it taught you comes with you."}
        </p>
      ) : notStarted ? (
        <p className="text-[13px] text-[#9fb6c8] font-light mt-3">
          Set — it begins automatically on day one.
        </p>
      ) : todayStatus ? (
        <p className="text-[13px] font-light mt-3">
          {todayStatus === "kept" ? (
            <span className="text-btf-gold-light">Today is kept. Well done.</span>
          ) : (
            <span className="text-[#cddcea]">
              Today is named, not hidden — that took honesty. Tomorrow is already waiting.
            </span>
          )}
        </p>
      ) : (
        <div className="flex items-center gap-2.5 mt-3.5">
          <button
            type="button"
            disabled={pending}
            onClick={() => mark("kept")}
            className="flex-1 rounded-full py-2.5 px-4 font-semibold text-[13px] text-[#2a2008] bg-gradient-to-b from-btf-gold-light to-btf-gold transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            I kept it today
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => mark("stumbled")}
            className="rounded-full py-2.5 px-4 text-[13px] text-[#cddcea] border border-white/15 hover:border-white/30 transition-colors disabled:opacity-60"
          >
            I stumbled
          </button>
        </div>
      )}

      {error && <p className="text-[12px] text-[#e8b3b3] mt-2">{error}</p>}

      {!compact && !finished && !notStarted && !todayStatus && (
        <p className="text-[11px] text-[#8aa0b0] font-light mt-2.5">
          One honest tap, either way — the log earns the same. Naming it is the work.
        </p>
      )}
    </div>
  );
}
