import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "../../../lib/session";
import { getToolMoments } from "../../../actions/journal";
import { getStateCheckSummary } from "../../../actions/stateChecks";
import { getUrgeSurfStats } from "../../../actions/urgeSurf";
import { getJourney, getTodaySummary } from "../../../actions/habits";
import { listNovenaProgress } from "../../../actions/novenas";
import { getNovenaById } from "../../../lib/novenas";
import type { TimeOfDayBucket, ToolMoment, UrgeOutcome } from "../../../lib/journalTypes";
import { GoldCrossIcon } from "../../../components/StreakChip";
import { OliveBranchIcon } from "../../../components/OliveBranch";
import { getCurrentUserFaithRole } from "../../../lib/profile";
import GroveConstellation from "./GroveConstellation";

/**
 * /today/grove — the one progress hub (rebuilt 2026-06-28).
 *
 * A single calm scroll (no tabs): a progress hero (days-with-you + the
 * 90-day dot grid + a quiet streak), milestones, the grounding "sky"
 * constellation, and the urge "waves you rode" archive. Strengths-based,
 * explicitly non-clinical — no scores, no broken streaks.
 */
export const dynamic = "force-dynamic";

const TIME_LABEL: Record<TimeOfDayBucket, string> = {
  "early-morning": "the early morning",
  morning: "the morning",
  afternoon: "the afternoon",
  evening: "the evening",
  night: "at night",
  "late-night": "late at night",
};

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

export default async function GrovePage() {
  const userId = await getCurrentUserId();
  const secular = (await getCurrentUserFaithRole()) === "secular";
  // Secular users see the olive branch wherever faith users see the cross.
  const Mark = secular ? OliveBranchIcon : GoldCrossIcon;
  if (!userId) redirect("/return");

  const [journeyRes, grounding, groundingSummary, waves, urgeStats, todayRes, novenaRes] =
    await Promise.all([
      getJourney(90),
      getToolMoments("grounding"),
      getStateCheckSummary("grounding"),
      getToolMoments("urge-surfing"),
      getUrgeSurfStats(),
      getTodaySummary(),
      listNovenaProgress(),
    ]);

  const journeyDays = journeyRes.success ? journeyRes.data : [];
  const groundingMoments = grounding.success ? grounding.data : [];
  const waveMoments = waves.success ? waves.data : [];

  // Novena journeys — in-progress first, then completed.
  const novenaJourneys = (novenaRes.success ? novenaRes.data : [])
    .map((p) => ({ p, novena: getNovenaById(p.novenaId) }))
    .filter((x): x is { p: typeof x.p; novena: NonNullable<typeof x.novena> } => !!x.novena)
    .sort((a, b) => Number(a.p.completed) - Number(b.p.completed));
  const today = todayRes.success ? todayRes.data : null;

  const daysWithYou = journeyDays.filter((d) => d.completions > 0).length;
  const dayNumber = journeyDays.length;

  const groundingInsight: string[] = [];
  if (groundingSummary && groundingSummary.pairedCount > 0) {
    groundingInsight.push(
      `When you noted a before and after, it eased ${groundingSummary.easedCount} of ${groundingSummary.pairedCount} ${groundingSummary.pairedCount === 1 ? "time" : "times"}.`
    );
  }
  if (groundingSummary?.mostCommonTime) {
    groundingInsight.push(
      `You reach for grounding most in ${TIME_LABEL[groundingSummary.mostCommonTime.timeOfDay]}.`
    );
  }

  const showConfidence =
    !!urgeStats &&
    urgeStats.confidencePoints >= 2 &&
    urgeStats.firstConfidence !== null &&
    urgeStats.latestConfidence !== null;

  const milestones: { value: string; label: string }[] = [
    { value: String(today?.timesCameBack ?? 0), label: "times back" },
    { value: String(groundingMoments.length), label: "grounded" },
    { value: String(waveMoments.length), label: "waves ridden" },
  ];

  return (
    <main className="mx-auto w-full max-w-[480px] md:max-w-[600px] px-[18px]">
      <header className="pt-6 pb-3 px-0.5">
        <div className="font-serif text-[26px] font-medium leading-tight">Your grove</div>
        <div className="text-xs uppercase tracking-[0.06em] text-[#8aa0b0] mt-1">
          A quiet record of showing up
        </div>
      </header>

      {/* Progress hero */}
      <section className="rounded-[24px] p-[22px] mt-1.5 border border-btf-gold/25 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.7)] bg-[radial-gradient(120%_90%_at_80%_0%,rgba(201,168,76,0.22),transparent_55%),linear-gradient(160deg,rgba(26,111,168,0.5),rgba(10,26,42,0.85))]">
        <div className="flex items-baseline gap-2.5">
          <span className="font-serif text-[46px] font-medium text-btf-gold-light leading-none">
            {daysWithYou}
          </span>
          <span className="text-sm text-[#d4e3f0]">days with you</span>
        </div>
        <p className="text-xs text-[#8aa0b0] mt-1.5 mb-4">
          Day {dayNumber} of your journey · keep going at your own pace
        </p>

        <div className="grid grid-cols-[repeat(18,1fr)] gap-1.5">
          {journeyDays.map((d, i) => {
            const isToday = i === journeyDays.length - 1;
            const filled = d.completions > 0;
            return (
              <span
                key={d.date}
                title={`${d.date}: ${d.completions} completed`}
                className={
                  "aspect-square rounded-[3px] " +
                  (isToday
                    ? "border-[1.5px] border-btf-gold-light shadow-[0_0_0_2px_rgba(232,204,122,0.2)]"
                    : filled
                      ? "bg-gradient-to-br from-btf-gold to-btf-gold-light"
                      : "bg-white/[0.08]")
                }
              />
            );
          })}
        </div>

        {today && (
          <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-white/10 text-[13px] text-[#cfe0ee]">
            <Mark width={12} glow={false} />
            Current streak <b className="text-btf-gold-light font-semibold">{today.currentStreak}</b>
            <span className="text-white/40">·</span> best {today.longestStreak}
          </div>
        )}
        <div className="mt-3 text-xs text-[#9fb6c8] flex items-center gap-2">
          <MoonIcon /> Rest is part of the journey — a missed day never breaks it.
        </div>
      </section>

      {/* Milestones */}
      <section className="mt-7">
        <h2 className="font-serif font-medium text-xl mb-3.5 px-0.5">Milestones</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-[18px] px-[18px] [scrollbar-width:none]">
          {milestones.map((m) => (
            <div
              key={m.label}
              className="flex-none w-[120px] rounded-[18px] bg-white/[0.055] border border-white/[0.09] p-4 flex flex-col items-center text-center gap-1.5"
            >
              <Mark width={11} glow={false} />
              <div className="font-serif text-2xl font-light leading-none mt-1">{m.value}</div>
              <div className="text-[10px] tracking-[0.16em] uppercase text-white/70 font-semibold">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Novena journeys */}
      {novenaJourneys.length > 0 && (
        <section className="mt-7">
          <h2 className="font-serif font-medium text-xl mb-3.5 px-0.5">Novena journeys</h2>
          <ul className="space-y-2.5">
            {novenaJourneys.map(({ p, novena }) => {
              const dayN = Math.min(p.currentDay, 9);
              const label = novena.title.replace(/^Novena to (the )?/, "");
              const href = p.completed
                ? `/catholic-path/novenas/${novena.id}`
                : `/catholic-path/novenas/${novena.id}/${dayN}`;
              return (
                <li key={novena.id}>
                  <Link
                    href={href}
                    className="flex items-center gap-3 rounded-[16px] bg-white/[0.045] border border-white/[0.08] hover:border-btf-gold/40 p-4 transition-colors"
                  >
                    <span className="flex-none"><Mark width={13} glow={false} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">{label}</span>
                      <span className="block text-[12px] text-[#8aa0b0] mt-0.5">
                        {p.completed ? "Completed" : `Day ${dayN} of 9`}
                      </span>
                    </span>
                    {/* 9-dot progress */}
                    <span className="flex-none flex gap-1">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <span
                          key={i}
                          className={
                            "w-1.5 h-1.5 rounded-full " +
                            (i < p.completedDays ? "bg-btf-gold-light" : "bg-white/15")
                          }
                        />
                      ))}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Grounding sky */}
      <section className="mt-7">
        <h2 className="font-serif font-medium text-xl mb-3.5 px-0.5">Your grounding sky</h2>
        <GroveConstellation moments={groundingMoments} />
        <p className="text-xs text-[#8aa0b0] mt-3 px-0.5 leading-relaxed">
          {groundingMoments.length > 0
            ? `Each light is a moment you grounded yourself. ${groundingMoments.length} so far.`
            : "Each time you ground yourself, a light joins your sky."}
        </p>
        {groundingInsight.map((line) => (
          <p key={line} className="text-xs text-[#9fb6c8] mt-1.5 px-0.5">{line}</p>
        ))}
      </section>

      {/* Waves you rode */}
      <section className="mt-7 mb-2">
        <h2 className="font-serif font-medium text-xl mb-3.5 px-0.5">Waves you rode</h2>
        {showConfidence && urgeStats && (
          <div className="rounded-[18px] bg-white/[0.055] border border-white/[0.09] p-4 mb-3 flex items-center justify-between">
            <span className="text-[13px] text-white/70">Your confidence</span>
            <span className="text-[13px]">
              <span className="text-[#9fb6c8]">{urgeStats.firstConfidence}</span>
              <span className="mx-2 text-white/40">→</span>
              <span className="text-btf-gold-light font-semibold">{urgeStats.latestConfidence}</span>
            </span>
          </div>
        )}
        {waveMoments.length === 0 ? (
          <p className="text-xs text-[#8aa0b0] px-0.5">
            When you ride out an urge, it&rsquo;s recorded here — every one a wave you stayed with.
          </p>
        ) : (
          <ul className="space-y-2.5">
            {waveMoments.map((m: ToolMoment) => (
              <li
                key={m.id}
                className="rounded-[16px] bg-white/[0.045] border border-white/[0.08] p-4 flex items-center gap-3"
              >
                <span className="flex-none w-10 h-10 rounded-xl grid place-items-center bg-[rgba(61,143,196,0.18)] border border-[rgba(61,143,196,0.35)]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9fcbe9" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 16c2.5 0 2.5-3 5-3s2.5 3 5 3 2.5-3 5-3 2.5 3 5 3" />
                    <path d="M2 20c2.5 0 2.5-3 5-3s2.5 3 5 3 2.5-3 5-3 2.5 3 5 3" />
                  </svg>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">Urge surfed</div>
                  <div className="text-xs text-[#8aa0b0] mt-0.5">{formatWhen(m.completedAt)}</div>
                </div>
                {m.outcome && (
                  <span className="flex-none text-[11px] px-2.5 py-1 rounded-full bg-btf-gold/[0.14] border border-btf-gold/35 text-btf-gold-light whitespace-nowrap">
                    {OUTCOME_LABEL[m.outcome]}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-xs text-[#9fb6c8] font-light text-center mt-7 mb-2">
        No scores. No broken streaks. Just proof, in your own words.
      </p>
    </main>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9fb6c8" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
    </svg>
  );
}
