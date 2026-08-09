import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "../../lib/session";
import { getTodaySummary } from "../../actions/habits";
import { getDisplayStreak } from "../../actions/streaks";
import { getJourney } from "../../actions/habits";
import { getCurrentUserFaithRole, getCurrentUserDisplayName, getCurrentUserPopulations, getCurrentUserFeedTopics } from "../../lib/profile";
import { listHabitSchedules } from "../../actions/habitSchedules";
import { listNovenaProgress } from "../../actions/novenas";
import { getCheckInStatus } from "../../actions/checkIns";
import { getCheckInInvite } from "../../lib/checkIn";
import { listStartHereCompletions } from "../../actions/startHere";
import { startHereSessionCount, startHereTrackForRole } from "../../lib/startHere";
import { getNovenaById } from "../../lib/novenas";
import { formatScheduleTime } from "../../lib/habitTypes";
import { OliveBranch } from "../../components/OliveBranch";
import { HABITS, mapOnboardingPopulation, type HabitSlug, type PopulationSlug } from "../../lib/habits";
import type { ScriptureTheme } from "../../lib/scripture";
import {
  ALL_THEMES,
  scriptureThemesFor,
  prayerTagsFor,
  daySeed,
  recommendScripture,
  recommendPrayer,
  recommendRosary,
} from "../../lib/recommend";
import HeroClient, { type HeroRec } from "./HeroClient";

/**
 * /home — the post-login daily hub (redesign 2026-06-28).
 *
 * Replaces the old /today tab layout. A Hallow-style daily hub:
 *   - a time-aware "Today" hero recommending a reflection / devotion,
 *   - a "Daily habits" rail (the user's schedulable Catholic devotions;
 *     secular replacement habits to come — see vault 06 - Operations note),
 *   - an "If you need support now" rail of the six urge-control tools,
 *   - a calm 90-day journey dot-grid + a quiet, forgiving momentum line.
 *
 * Everything is wired to existing data: getTodaySummary (habits +
 * completion state), getJourney (90-day completions), getDisplayStreak
 * (the single calm momentum chip), and the user's faith_role. Completing
 * a Catholic devotion already records a habit completion, so devotions
 * count toward the streak and journey exactly like the tools — no extra
 * wiring needed (decision locked 2026-06-28).
 *
 * Force-dynamic so the time-of-day framing reflects the request.
 */
export const dynamic = "force-dynamic";

const TIER1: HabitSlug[] = [
  "stop",
  "urge-surfing",
  "box-breathing",
  "grounding",
  "tipp",
  "thought-record",
];
const CATHOLIC: HabitSlug[] = ["prayer", "rosary", "scripture"];

export default async function HomePage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/return");

  const [summaryRes, journeyRes, streak, faithRole, displayName, schedulesRes, populations, feedTopics, novenaProgressRes, checkInRes, startHereRes] = await Promise.all([
    getTodaySummary(),
    getJourney(90),
    getDisplayStreak(),
    getCurrentUserFaithRole(),
    getCurrentUserDisplayName(),
    listHabitSchedules(),
    getCurrentUserPopulations(),
    getCurrentUserFeedTopics(),
    listNovenaProgress(),
    getCheckInStatus(),
    // Both tracks in one query, filtered by track below once faith_role
    // is known — keeps this out of a serial round trip (perf plan #6).
    listStartHereCompletions(),
  ]);

  // Check-in invite — shown only when the user is returning after time
  // away (tier ≠ none) and hasn't checked in today. Never mentions how
  // long they were gone (welfare check, not attendance record). Fails
  // quiet: any status error simply hides the card.
  const checkInTier =
    checkInRes.success &&
    checkInRes.data.tier !== "none" &&
    !checkInRes.data.alreadyCheckedInToday
      ? checkInRes.data.tier
      : null;
  const checkInInvite = checkInTier ? getCheckInInvite(checkInTier) : null;

  // Start Here — the pinned orientation card. First position until every
  // session is complete, then it disappears (the module card on the path
  // landing remains for revisits). Never a gate; fails quiet if the
  // progress table isn't migrated yet (task-54).
  const startHereTrack = startHereTrackForRole(faithRole);
  const startHereTotal = startHereSessionCount(startHereTrack);
  const startHereDone = startHereRes.success
    ? startHereRes.data.filter((r) => r.track === startHereTrack).length
    : null;
  const showStartHere = startHereDone !== null && startHereDone < startHereTotal;

  // In-progress novenas power the Novena day tracker above Daily habits.
  const inProgressNovenas = (novenaProgressRes.success ? novenaProgressRes.data : [])
    .filter((p) => !p.completed)
    .map((p) => ({ p, novena: getNovenaById(p.novenaId) }))
    .filter((x): x is { p: typeof x.p; novena: NonNullable<typeof x.novena> } => !!x.novena);

  const summary = summaryRes.success ? summaryRes.data : null;
  const journey = journeyRes.success ? journeyRes.data : [];
  const secular = faithRole === "secular";
  const scheduleMap = new Map(
    (schedulesRes.success ? schedulesRes.data : []).map((s) => [s.habitSlug, s.scheduledTime])
  );

  // Personalized daily recommendations from what the user is working on
  // (their onboarding populations → themes/tags). Specific + deep-linked.
  const popSlugs = populations
    .map(mapOnboardingPopulation)
    .filter((p): p is PopulationSlug => p !== null);
  const seed = daySeed();
  const extraThemes = feedTopics.filter(
    (t): t is ScriptureTheme => (ALL_THEMES as readonly string[]).includes(t)
  );
  const scriptureRec = recommendScripture(scriptureThemesFor(popSlugs, extraThemes), seed);
  const prayerRec = recommendPrayer(prayerTagsFor(popSlugs), seed);
  const rosaryRec = recommendRosary();

  // Deep-link + specific sub-label for the three Catholic daily habits.
  const recForHabit: Partial<Record<HabitSlug, { href: string; sub: string }>> = {
    rosary: { href: rosaryRec.href, sub: `${rosaryRec.adjective} Mysteries` },
    scripture: scriptureRec ? { href: scriptureRec.href, sub: scriptureRec.title } : undefined,
    prayer: prayerRec ? { href: prayerRec.href, sub: prayerRec.title } : undefined,
  };

  // Hero candidates (server resolves content; HeroClient picks by local hour).
  const morning: HeroRec = {
    eyebrow: "This morning · Scripture",
    title: scriptureRec?.title ?? "Begin the day with Scripture",
    time: "5 min",
    tag: "Faith path",
    href: scriptureRec?.href ?? "/catholic-path/scripture",
  };
  const afternoon: HeroRec = {
    eyebrow: "This afternoon · Rosary",
    title: `Pray the ${rosaryRec.adjective} Mysteries`,
    time: "20 min",
    tag: "Faith path",
    href: rosaryRec.href,
  };
  const evening: HeroRec = {
    eyebrow: "This evening · Prayer",
    title: prayerRec?.title ?? "Close the day in prayer",
    time: "5 min",
    tag: "Faith path",
    href: prayerRec?.href ?? "/catholic-path/prayers",
  };
  const secularRec: HeroRec = {
    eyebrow: "A steadying moment",
    title: "Take a slow, steadying breath",
    time: "4 min",
    tag: "For you",
    href: "/tools/box-breathing/start",
  };

  // Which Catholic devotions the user actually carries, with done state.
  const completedSlugs = new Set(
    (summary?.habits ?? [])
      .filter((h) => h.completedAt !== null)
      .map((h) => h.habit.habitSlug)
  );
  const userSlugs = new Set((summary?.habits ?? []).map((h) => h.habit.habitSlug));
  const dailyHabitSlugs = CATHOLIC.filter((s) => userSlugs.has(s));

  // Calm cumulative metric + today's journey day.
  const daysWithYou = journey.filter((d) => d.completions > 0).length;
  const journeyDayNumber = journey.length; // 90-day window length

  return (
    <main className="mx-auto w-full max-w-[480px] md:max-w-[600px] px-[18px]">
      {/* Start Here — pinned first for new accounts until the orientation
          is complete. A doorway, never a gate. */}
      {showStartHere && (
        <Link
          href="/start-here"
          className="mt-6 flex items-center gap-4 rounded-[20px] p-[18px] border border-btf-gold/40 bg-[radial-gradient(120%_120%_at_20%_0%,rgba(201,168,76,0.28),transparent_55%),linear-gradient(160deg,rgba(26,111,168,0.5),rgba(10,26,42,0.8))] hover:border-btf-gold/60 transition-colors"
        >
          <span className="flex-none w-11 h-11 rounded-xl grid place-items-center bg-btf-gold/[0.18] border border-btf-gold/35">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e8cc7a"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] tracking-[0.22em] uppercase text-btf-gold-light font-semibold">
              Start Here
            </span>
            <span className="block font-serif text-[18px] leading-tight mt-0.5">
              {startHereDone === 0
                ? "Before anything else — a short orientation."
                : `Continue the orientation — session ${startHereDone + 1} of ${startHereTotal}.`}
            </span>
          </span>
          <span className="flex-none text-btf-gold-light" aria-hidden>
            &rarr;
          </span>
        </Link>
      )}

      {/* Check-in invite — top of the column, above the hero. Non-blocking:
          a warm doorway the user can walk past, never a gate. */}
      {checkInInvite && (
        <Link
          href="/check-in"
          className="mt-6 flex items-center gap-4 rounded-[20px] p-[18px] border border-btf-gold/30 bg-[radial-gradient(120%_120%_at_80%_0%,rgba(201,168,76,0.22),transparent_55%),linear-gradient(160deg,rgba(26,111,168,0.45),rgba(10,26,42,0.75))] hover:border-btf-gold/50 transition-colors"
        >
          <span className="flex-none w-11 h-11 rounded-xl grid place-items-center bg-btf-gold/[0.18] border border-btf-gold/35">
            <CheckInIcon />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-serif text-[18px] leading-tight">
              {checkInInvite.title}
            </span>
            <span className="block text-[12px] text-[#cddcea] mt-1 leading-snug">
              {checkInInvite.body}
            </span>
          </span>
          <span className="flex-none inline-flex items-center gap-1.5 rounded-full bg-gradient-to-b from-btf-gold-light to-btf-gold text-[#2a2008] font-semibold text-[13px] px-4 py-2">
            Take a minute
          </span>
        </Link>
      )}

      {/* Time-aware greeting + hero (client picks by the user's local hour) */}
      <HeroClient
        name={displayName}
        secular={secular}
        morning={morning}
        afternoon={afternoon}
        evening={evening}
        secularRec={secularRec}
        streakValue={streak ? streak.value : null}
      />

      {/* Novena day tracker — in-progress novenas, above Daily habits */}
      {inProgressNovenas.length > 0 && (
        <Section title={inProgressNovenas.length === 1 ? "Your novena" : "Your novenas"} actionLabel="All novenas" actionHref="/catholic-path/novenas">
          <div className="space-y-3">
            {inProgressNovenas.map(({ p, novena }) => {
              const dayN = Math.min(p.currentDay, 9);
              const label = novena.title.replace(/^Novena to (the )?/, "");
              const time = formatScheduleTime(p.reminderTime);
              return (
                <Link
                  key={novena.id}
                  href={`/catholic-path/novenas/${novena.id}/${dayN}`}
                  className="block rounded-[20px] p-[18px] border border-btf-gold/25 bg-gradient-to-br from-btf-sky-deep/60 to-btf-deep-night/70 hover:border-btf-gold/45 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <div className="font-serif text-[19px] leading-tight">{label}</div>
                      <div className="text-[12px] text-[#9fb6c8] mt-0.5">
                        Day {dayN} of 9{time ? ` · ${time}` : ""}
                      </div>
                    </div>
                    <span className="flex-none inline-flex items-center gap-1.5 rounded-full bg-gradient-to-b from-btf-gold-light to-btf-gold text-[#2a2008] font-semibold text-[13px] px-4 py-2">
                      Continue
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#2a2008"><path d="M8 5v14l11-7z" /></svg>
                    </span>
                  </div>
                  {/* 9-day tracker */}
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: 9 }).map((_, i) => {
                      const dayIndex = i + 1;
                      const done = dayIndex <= p.completedDays;
                      const isCurrent = dayIndex === dayN && !done;
                      return (
                        <span
                          key={i}
                          className={
                            "h-2 flex-1 rounded-full " +
                            (done
                              ? "bg-gradient-to-r from-btf-gold to-btf-gold-light"
                              : isCurrent
                                ? "bg-white/25 ring-1 ring-btf-gold-light/60"
                                : "bg-white/10")
                          }
                        />
                      );
                    })}
                  </div>
                  <div className="text-[11px] text-[#9fb6c8] mt-2">
                    {p.completedDays} of 9 days prayed — a missed day never resets it.
                  </div>
                </Link>
              );
            })}
          </div>
        </Section>
      )}

      {/* Daily habits */}
      <Section title="Daily habits" actionLabel="Set times" actionHref="/today/schedule">
        <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">
          {dailyHabitSlugs.map((slug) => {
            const def = HABITS[slug];
            const done = completedSlugs.has(slug);
            const time = formatScheduleTime(scheduleMap.get(slug) ?? null);
            const rec = recForHabit[slug];
            return (
              <Link
                key={slug}
                href={rec?.href ?? def.beginHref}
                className="flex-none w-[168px] p-[15px] rounded-[18px] bg-white/[0.055] border border-white/[0.09] flex flex-col gap-2"
              >
                <span
                  className={
                    "w-10 h-10 rounded-xl grid place-items-center border " +
                    (done
                      ? "bg-btf-gold/[0.28] border-btf-gold/40"
                      : "bg-btf-gold/[0.14] border-btf-gold/30")
                  }
                >
                  <DevotionIcon slug={slug} />
                </span>
                <span className="text-sm font-medium leading-tight">{def.label}</span>
                {rec && (
                  <span className="text-[12px] text-[#cfe0ee] leading-snug line-clamp-2">{rec.sub}</span>
                )}
                {time ? (
                  <span className="text-[11px] text-btf-gold-light inline-flex items-center gap-1">
                    <ClockIcon /> {time}
                  </span>
                ) : (
                  <span className="text-[11px] text-[#8aa0b0]">Set a time</span>
                )}
                <span className={"text-[11px] flex items-center gap-1.5 mt-auto " + (done ? "text-btf-gold-light" : "text-[#9fb6c8]")}>
                  {done ? <><CheckMini /> Done today</> : <><PlusMini /> In your day</>}
                </span>
              </Link>
            );
          })}
          <Link
            href="/today/edit"
            className="flex-none w-[152px] min-h-[148px] rounded-[18px] border border-dashed border-btf-gold/30 flex flex-col items-center justify-center gap-2 text-center text-xs text-[#9fb6c8]"
          >
            <PlusCircle />
            Add a habit<br />to your day
          </Link>
        </div>
        {dailyHabitSlugs.length === 0 && (
          <p className="text-xs text-[#9fb6c8] px-0.5 -mt-1">
            {secular
              ? "No daily habits yet. Add a steadying practice — a breath, a reflection — and pick a time to do it."
              : "No daily habits yet. Add a prayer or devotion and pick a time to do it."}
          </p>
        )}
      </Section>

      {/* Support tools */}
      <Section title="If you need support now" actionLabel="All tools" actionHref="/tools">
        <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">
          {TIER1.map((slug) => {
            const def = HABITS[slug];
            return (
              <Link
                key={slug}
                href={def.beginHref}
                className="flex-none w-[128px] p-[15px] rounded-[18px] bg-white/[0.055] border border-white/[0.09] flex flex-col gap-3"
              >
                <span className="w-10 h-10 rounded-xl grid place-items-center bg-btf-gold/[0.14] border border-btf-gold/30">
                  <ToolIcon slug={slug} />
                </span>
                <span className="text-sm font-medium leading-tight">{def.label}</span>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* 90-day journey */}
      <section className="mt-7 rounded-[20px] p-5 bg-white/[0.04] border border-white/[0.08]">
        <div className="flex items-baseline justify-between mb-1">
          <div className="font-serif text-xl">Your {journeyDayNumber} days</div>
          <div className="text-xs text-btf-gold-light">{daysWithYou} days with you</div>
        </div>
        <div className="text-xs text-[#8aa0b0] mb-4">
          Keep going at your own pace.
        </div>
        <div className="grid grid-cols-[repeat(18,1fr)] gap-1.5">
          {journey.map((d, i) => {
            const isToday = i === journey.length - 1;
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
        <div className="mt-3.5 text-xs text-[#9fb6c8] flex items-center gap-2">
          <MoonIcon /> Rest is part of the journey — a missed day never breaks it.
        </div>
      </section>

      {/* Field Journal */}
      <Link
        href="/field-journal"
        className="mt-7 flex items-center gap-4 rounded-[20px] p-5 bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/40 hover:bg-white/[0.08] transition-all"
      >
        <span className="flex-none w-11 h-11 rounded-xl grid place-items-center bg-btf-gold/[0.14] border border-btf-gold/30">
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#e8cc7a" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <path d="M9 7h7M9 11h5" />
          </svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-serif text-[18px] leading-tight">Field Journal</span>
          <span className="block text-[12px] text-[#9fb6c8] mt-0.5">
            Log an urge, or write the day out.
          </span>
        </span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9fb6c8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="flex-none">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </Link>

      {/* Close the day */}
      <section className="mt-7 mb-2 rounded-[20px] p-5 text-center border border-dashed border-btf-gold/30 bg-[radial-gradient(120%_120%_at_50%_0%,rgba(201,168,76,0.14),transparent_60%)]">
        {secular ? (
          <OliveBranch className="w-[22px] h-[27px] mx-auto" />
        ) : (
          <GoldCross className="w-[22px] h-[27px] mx-auto" />
        )}
        <h3 className="font-serif text-[21px] font-medium mt-2.5 mb-1.5">
          Close the day in your own words
        </h3>
        <p className="text-[13px] text-[#cddcea] mb-3.5">
          A few lines, encrypted and just for you.
        </p>
        <Link
          href="/journal/new"
          className="inline-flex items-center justify-center rounded-[14px] py-3 px-6 font-bold text-[#2a2008] bg-gradient-to-b from-btf-gold-light to-btf-gold"
        >
          Open journal
        </Link>
        <div className="mt-3">
          <Link href="/journal" className="text-[13px] text-btf-gold-light underline underline-offset-4">
            View past entries
          </Link>
        </div>
      </section>
    </main>
  );
}

/* ── small server helpers ── */

function Section({
  title,
  actionLabel,
  actionHref,
  children,
}: {
  title: string;
  actionLabel?: string;
  actionHref?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-7">
      <div className="flex items-baseline justify-between mb-3.5 px-0.5">
        <h2 className="font-serif font-medium text-xl">{title}</h2>
        {actionLabel && actionHref && (
          <Link href={actionHref} className="text-xs text-btf-gold-light">
            {actionLabel}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}


/* ── inline icons (SVG only; no emoji/dingbats) ── */

function GoldCross({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 13 16" fill="none" aria-hidden>
      <path d="M5.2 1.4h2.6v4.2H12v2.6H7.8V15H5.2V8.2H1V5.6h4.2V1.4z" fill="#e8cc7a" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d4e3f0" strokeWidth={1.7}>
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
    </svg>
  );
}
function CheckMini() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e8cc7a" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function PlusMini() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9fb6c8" strokeWidth={2} strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function PlusCircle() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e8cc7a" strokeWidth={1.8} strokeLinecap="round">
      <circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" />
    </svg>
  );
}
function CheckInIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#e8cc7a" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 21s-7-4.3-9.3-8.2C1 10 2.8 6.6 6.2 6.6c2 0 3.4 1.1 5.8 3.4 2.4-2.3 3.8-3.4 5.8-3.4 3.4 0 5.2 3.4 3.5 6.2C19 16.7 12 21 12 21z" />
      <path d="m8.5 12.5 2.2 2.2 4.8-4.8" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9fb6c8" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
    </svg>
  );
}

function DevotionIcon({ slug }: { slug: HabitSlug }) {
  const common = {
    width: 20, height: 20, viewBox: "0 0 24 24", fill: "none",
    stroke: "#e8cc7a", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
  };
  if (slug === "rosary") {
    return <svg {...common}><circle cx="12" cy="8" r="5" /><path d="M12 13v4M10.3 15.3h3.4" /></svg>;
  }
  if (slug === "scripture") {
    return <svg {...common}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
  }
  // prayer (hands / heart-light)
  return <svg {...common}><path d="M12 20s-6-3.7-8-7c-1.6-2.6 0-5.6 3-5.6 1.8 0 3 1 5 3 2-2 3.2-3 5-3 3 0 4.6 3 3 5.6" /></svg>;
}

function ToolIcon({ slug }: { slug: HabitSlug }) {
  const common = {
    width: 20, height: 20, viewBox: "0 0 24 24", fill: "none",
    stroke: "#e8cc7a", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
  };
  switch (slug) {
    case "stop":
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M9 9h6v6H9z" /></svg>;
    case "urge-surfing":
      return <svg {...common}><path d="M2 16c2.5 0 2.5-3 5-3s2.5 3 5 3 2.5-3 5-3 2.5 3 5 3" /><path d="M2 20c2.5 0 2.5-3 5-3s2.5 3 5 3 2.5-3 5-3 2.5 3 5 3" /></svg>;
    case "box-breathing":
      return <svg {...common}><rect x="4" y="4" width="16" height="16" rx="3" /></svg>;
    case "grounding":
      return <svg {...common}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>;
    case "tipp":
      return <svg {...common}><circle cx="12" cy="12" r="4" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /></svg>;
    default: // thought-record
      return <svg {...common}><path d="M12 8a4 4 0 0 0-4 4c0 1.5.8 2.3 1.5 3 .5.5.5 1 .5 2h4c0-1 0-1.5.5-2 .7-.7 1.5-1.5 1.5-3a4 4 0 0 0-4-4z" /><path d="M10 21h4" /></svg>;
  }
}
