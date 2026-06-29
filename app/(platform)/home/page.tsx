import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "../../lib/session";
import { getTodaySummary } from "../../actions/habits";
import { getDisplayStreak } from "../../actions/streaks";
import { getJourney } from "../../actions/habits";
import { getCurrentUserFaithRole } from "../../lib/profile";
import { HABITS, type HabitSlug } from "../../lib/habits";

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

  const [summaryRes, journeyRes, streak, faithRole] = await Promise.all([
    getTodaySummary(),
    getJourney(90),
    getDisplayStreak(),
    getCurrentUserFaithRole(),
  ]);

  const summary = summaryRes.success ? summaryRes.data : null;
  const journey = journeyRes.success ? journeyRes.data : [];
  const secular = faithRole === "secular";

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
  const hero = heroFor(new Date().getHours(), secular);

  return (
    <main className="mx-auto w-full max-w-[480px] md:max-w-[600px] px-[18px]">
      {/* Top strip */}
      <header className="flex items-center justify-between pt-6 pb-3.5 px-0.5">
        <div>
          <div className="font-serif text-[26px] font-medium leading-tight">
            {greeting()}
          </div>
          <div className="text-xs uppercase tracking-[0.06em] text-[#8aa0b0] mt-1">
            {longDate()}
          </div>
        </div>
        {streak && (
          <Link
            href="/today/grove"
            className="flex items-center gap-1.5 text-[13px] text-[#cfe0ee] bg-white/[0.06] border border-white/10 rounded-full px-2.5 py-1.5"
          >
            <GoldCross className="w-3 h-4" />
            <span className="text-btf-gold-light font-bold">{streak.value}</span>
          </Link>
        )}
      </header>

      {/* Hero — Today */}
      <section className="relative rounded-[24px] overflow-hidden mt-1.5 p-[22px] border border-btf-gold/30 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.7)] bg-[radial-gradient(120%_90%_at_80%_0%,rgba(201,168,76,0.28),transparent_55%),linear-gradient(160deg,rgba(26,111,168,0.55),rgba(13,79,124,0.65)_70%,rgba(10,26,42,0.85))]">
        <div className="flex items-center gap-2 font-cinzel text-[11px] tracking-[0.18em] uppercase text-btf-gold-light">
          <GoldCross className="w-3 h-[15px]" />
          {hero.eyebrow}
        </div>
        <h1 className="font-serif font-medium text-[30px] leading-[1.12] mt-3 mb-2">
          {hero.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2.5 text-[13px] text-[#d4e3f0] mb-[18px]">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs">
            <ClockIcon /> {hero.time}
          </span>
          <span
            className={
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs " +
              (secular
                ? "bg-white/10 border border-white/15"
                : "bg-btf-gold/15 border border-btf-gold/40 text-btf-gold-light")
            }
          >
            {hero.tag}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href={hero.href}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-[14px] py-3.5 px-[18px] font-bold text-[15px] text-[#2a2008] bg-gradient-to-b from-btf-gold-light to-btf-gold shadow-[0_10px_24px_-10px_rgba(201,168,76,0.8)] transition-transform hover:-translate-y-0.5"
          >
            Begin
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#2a2008"><path d="M8 5v14l11-7z" /></svg>
          </Link>
          <Link href="/explore" className="text-[13px] text-[#cfe0ee] underline underline-offset-[3px] px-1.5 py-2">
            Choose another
          </Link>
        </div>
      </section>

      {/* Daily habits */}
      <Section title="Daily habits" actionLabel="Set times" actionHref="/today/edit">
        <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">
          {dailyHabitSlugs.map((slug) => {
            const def = HABITS[slug];
            const done = completedSlugs.has(slug);
            return (
              <Link
                key={slug}
                href={def.beginHref}
                className="flex-none w-[152px] p-[15px] rounded-[18px] bg-white/[0.055] border border-white/[0.09] flex flex-col gap-2.5"
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
                <span className="text-[11px] text-[#8aa0b0]">Set a time</span>
                <span className={"text-[11px] flex items-center gap-1.5 " + (done ? "text-btf-gold-light" : "text-[#9fb6c8]")}>
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
            No daily habits yet. Add a prayer or devotion and pick a time to do it.
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

      {/* Close the day */}
      <section className="mt-7 mb-2 rounded-[20px] p-5 text-center border border-dashed border-btf-gold/30 bg-[radial-gradient(120%_120%_at_50%_0%,rgba(201,168,76,0.14),transparent_60%)]">
        <GoldCross className="w-[22px] h-[27px] mx-auto" />
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

type Hero = {
  eyebrow: string;
  title: string;
  time: string;
  tag: string;
  href: string;
};

function heroFor(hour: number, secular: boolean): Hero {
  if (secular) {
    const evening = hour >= 17 || hour < 5;
    return {
      eyebrow: evening ? "This evening" : "Right now",
      title: evening ? "Wind down with a slow breath" : "Take a steadying moment",
      time: "4 min",
      tag: "For you",
      href: "/tools/box-breathing/start",
    };
  }
  if (hour >= 5 && hour < 12) {
    return {
      eyebrow: "This morning",
      title: "Begin the day with Scripture",
      time: "8 min",
      tag: "Faith path",
      href: "/catholic-path/scripture",
    };
  }
  if (hour >= 12 && hour < 17) {
    return {
      eyebrow: "Midday",
      title: "Pray today's mystery of the Rosary",
      time: "18 min",
      tag: "Faith path",
      href: "/catholic-path/rosary",
    };
  }
  return {
    eyebrow: hour >= 21 || hour < 5 ? "Night prayer" : "This evening",
    title: "Close the day in prayer",
    time: "6 min",
    tag: "Faith path",
    href: "/catholic-path/prayers",
  };
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Peace tonight.";
  if (h < 12) return "Good morning.";
  if (h < 17) return "Good afternoon.";
  if (h < 21) return "Good evening.";
  return "Peace tonight.";
}

function longDate(): string {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
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
