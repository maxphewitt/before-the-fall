"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { OliveBranch } from "../../components/OliveBranch";

/**
 * Time-aware Home hero + greeting.
 *
 * Client component so the time of day reflects the USER's local clock, not
 * the server's timezone (the old server-rendered version showed "Good
 * morning" in the afternoon on non-UTC/user machines).
 *
 * The server resolves the actual recommended content (which needs the day
 * and the user's topics, not the hour) and passes the three candidates in;
 * this component only picks by local hour and renders the greeting. A
 * one-frame skeleton before mount avoids any hydration mismatch.
 */
export type HeroRec = {
  eyebrow: string;
  title: string;
  time: string;
  tag: string;
  href: string;
};

export default function HeroClient({
  name,
  secular,
  morning,
  afternoon,
  evening,
  secularRec,
  streakValue,
}: {
  name: string | null;
  secular: boolean;
  morning: HeroRec;
  afternoon: HeroRec;
  evening: HeroRec;
  secularRec: HeroRec;
  streakValue: number | null;
}) {
  const [hour, setHour] = useState<number | null>(null);
  // Read the user's local hour after mount (avoids SSR/client timezone mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHour(new Date().getHours());
  }, []);

  if (hour === null) {
    // Pre-mount skeleton — same shape as the hero, no time assumptions.
    return (
      <>
        <header className="flex items-center justify-between pt-6 pb-3.5 px-0.5">
          <div>
            <div className="h-7 w-44 rounded-md bg-white/10 animate-pulse" />
            <div className="h-3 w-28 rounded bg-white/[0.07] mt-2.5 animate-pulse" />
          </div>
        </header>
        <div className="mt-1.5 h-[196px] rounded-[24px] bg-white/[0.06] border border-white/[0.08] animate-pulse" />
      </>
    );
  }

  const rec = secular
    ? secularRec
    : hour >= 5 && hour < 12
      ? morning
      : hour >= 12 && hour < 17
        ? afternoon
        : evening;

  return (
    <>
      <header className="flex items-center justify-between pt-6 pb-3.5 px-0.5">
        <div>
          <div className="font-serif text-[26px] font-medium leading-tight">
            {greeting(hour, name)}
          </div>
          <div className="text-xs uppercase tracking-[0.06em] text-[#8aa0b0] mt-1">
            {longDate()}
          </div>
        </div>
        {streakValue !== null && (
          <Link
            href="/today/grove"
            className="flex items-center gap-1.5 text-[13px] text-[#cfe0ee] bg-white/[0.06] border border-white/10 rounded-full px-2.5 py-1.5"
          >
            {secular ? <OliveBranch className="w-3 h-4" /> : <GoldCross className="w-3 h-4" />}
            <span className="text-btf-gold-light font-bold">{streakValue}</span>
          </Link>
        )}
      </header>

      <section className="relative rounded-[24px] overflow-hidden mt-1.5 p-[22px] border border-btf-gold/30 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.7)] bg-[radial-gradient(120%_90%_at_80%_0%,rgba(201,168,76,0.28),transparent_55%),linear-gradient(160deg,rgba(26,111,168,0.55),rgba(13,79,124,0.65)_70%,rgba(10,26,42,0.85))]">
        <div className="flex items-center gap-2 font-cinzel text-[11px] tracking-[0.18em] uppercase text-btf-gold-light">
          {secular ? <OliveBranch className="w-3 h-[15px]" /> : <GoldCross className="w-3 h-[15px]" />}
          {rec.eyebrow}
        </div>
        <h1 className="font-serif font-medium text-[30px] leading-[1.12] mt-3 mb-2">
          {rec.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2.5 text-[13px] text-[#d4e3f0] mb-[18px]">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs">
            <ClockIcon /> {rec.time}
          </span>
          <span
            className={
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs " +
              (secular
                ? "bg-white/10 border border-white/15"
                : "bg-btf-gold/15 border border-btf-gold/40 text-btf-gold-light")
            }
          >
            {rec.tag}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href={rec.href}
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
    </>
  );
}

function greeting(hour: number, name: string | null): string {
  const who = name ? `, ${name}` : "";
  if (hour < 5) return `Peace tonight${who}.`;
  if (hour < 12) return `Good morning${who}.`;
  if (hour < 17) return `Good afternoon${who}.`;
  if (hour < 21) return `Good evening${who}.`;
  return `Peace tonight${who}.`;
}

function longDate(): string {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

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
