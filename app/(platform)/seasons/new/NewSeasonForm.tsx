"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createFastingSeason } from "../../../actions/fastingSeasons";
import { addDaysISO, type SeasonKind } from "../../../lib/fastingSeasons";

/**
 * Season setup form. Liturgical seasons arrive with fixed dates; custom
 * seasons pick a length (1–365 days, starting today). "What are you
 * setting down?" is required — writing it down IS the setup (Max's
 * spec) — and it's encrypted server-side like journal text.
 *
 * Strict mode (visible current-run resets after a stumble) is offered
 * for CUSTOM seasons only, off by default, framed as a discerned
 * choice — never a punishment. Copy pending clinician review.
 */
export default function NewSeasonForm({
  kind,
  label,
  fixedStart,
  fixedEnd,
  defaultDays,
  todayISO,
  secular,
}: {
  kind: SeasonKind;
  label: string;
  /** Present for liturgical seasons; absent for custom. */
  fixedStart?: string;
  fixedEnd?: string;
  /** Custom seasons: preset length (e.g. 75 or 30), else 30. */
  defaultDays: number;
  todayISO: string;
  secular: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [days, setDays] = useState(defaultDays);
  const [strict, setStrict] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCustom = kind === "custom";
  const startDate = isCustom ? todayISO : fixedStart!;
  const endDate = isCustom ? addDaysISO(todayISO, Math.max(1, days) - 1) : fixedEnd!;

  function submit() {
    setError(null);
    startTransition(async () => {
      const res = await createFastingSeason({
        kind,
        title,
        startDate,
        endDate,
        strict: isCustom ? strict : false,
      });
      if (!res.success) setError(res.error);
      else router.push("/seasons");
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="season-title"
          className="block text-[11px] tracking-[0.2em] uppercase text-btf-gold-light font-semibold mb-2"
        >
          {secular ? "What are you setting down?" : "What are you offering?"}
        </label>
        <textarea
          id="season-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          rows={2}
          placeholder={
            secular
              ? "Name it plainly — the thing this season is clean of."
              : "Name it plainly — what you're fasting from, or the penance you're taking up."
          }
          className="w-full rounded-xl bg-white/[0.06] border border-white/15 px-3.5 py-3 text-[#e9f1f8] placeholder:text-[#7a8e9e] outline-none focus:border-btf-gold/50 resize-none text-[15px] font-light"
        />
        <p className="text-[11px] text-[#8aa0b0] font-light mt-1.5">
          Encrypted like your journal &mdash; nobody reads this but you.
        </p>
      </div>

      {isCustom ? (
        <div>
          <label
            htmlFor="season-days"
            className="block text-[11px] tracking-[0.2em] uppercase text-btf-gold-light font-semibold mb-2"
          >
            How long?
          </label>
          <div className="flex items-center gap-3">
            <input
              id="season-days"
              type="number"
              min={1}
              max={365}
              value={days}
              onChange={(e) => setDays(Math.max(1, Math.min(365, Number(e.target.value) || 1)))}
              className="w-24 rounded-xl bg-white/[0.06] border border-white/15 px-3.5 py-2.5 text-[#e9f1f8] outline-none focus:border-btf-gold/50 text-[15px] tabular-nums"
            />
            <span className="text-[14px] text-[#9fb6c8] font-light">
              days &mdash; starting today, ending {endDate}
            </span>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-white/[0.04] border border-white/[0.09] px-4 py-3 text-[14px] text-[#cddcea] font-light">
          {label} runs <span className="text-btf-gold-light">{startDate}</span> through{" "}
          <span className="text-btf-gold-light">{endDate}</span>.{" "}
          {todayISO < startDate
            ? "Your season is set and begins automatically on day one."
            : "It's already underway — you join from today, and the earlier days simply stay unmarked."}
        </div>
      )}

      {isCustom && (
        <div className="rounded-xl bg-white/[0.04] border border-white/[0.09] px-4 py-3.5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={strict}
              onChange={(e) => setStrict(e.target.checked)}
              className="mt-1 accent-[#c9a84c]"
            />
            <span>
              <span className="block text-[14px] text-[#e9f1f8]">
                Strict mode: my &ldquo;current run&rdquo; restarts after a stumble
              </span>
              <span className="block text-[12px] text-[#9fb6c8] font-light mt-1 leading-relaxed">
                The season itself never resets and every kept day stays gold &mdash; this only
                changes the run counter you see. Choose it because it helps you, never to punish
                yourself.
              </span>
            </span>
          </label>
        </div>
      )}

      {error && <p className="text-[13px] text-[#e8b3b3]">{error}</p>}

      <button
        type="button"
        disabled={pending || title.trim().length === 0}
        onClick={submit}
        className="w-full inline-flex items-center justify-center rounded-full py-3.5 px-6 font-semibold text-[#2a2008] bg-gradient-to-b from-btf-gold-light to-btf-gold transition-transform hover:-translate-y-0.5 disabled:opacity-50"
      >
        {pending ? "Setting your season…" : "Begin this season"}
      </button>
    </div>
  );
}
