"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Mystery, MysterySet } from "../../../lib/rosary";
import ArtPlaceholder from "../../../components/ArtPlaceholder";

/**
 * Client-side mystery picker — Hallow-style cards (redesigned 2026-07-28):
 * every card carries an artwork area up top (ArtPlaceholder until real
 * illustrations land; see that component for the swap instructions).
 *
 * Why client-side: the day-of-week assignment is timezone-sensitive
 * (at 11pm PT Sunday, the server in UTC sees Monday and would show the
 * wrong mystery). The browser's local Date is correct for every visitor;
 * the server pre-renders with `initialTodaySlug` so the first paint
 * isn't empty, and hydration corrects it on mount.
 */

const DAY_TO_MYSTERY: Record<number, MysterySet> = {
  0: "glorious",
  1: "joyful",
  2: "sorrowful",
  3: "glorious",
  4: "luminous",
  5: "sorrowful",
  6: "joyful",
};

export default function MysteryPicker({
  mysteries,
  initialTodaySlug,
}: {
  mysteries: Mystery[];
  initialTodaySlug: MysterySet;
}) {
  const [todaySlug, setTodaySlug] = useState<MysterySet>(initialTodaySlug);
  const [weekdayName, setWeekdayName] = useState<string>("");

  useEffect(() => {
    // Browser-local date — allowed setState-in-effect exception (this
    // can only be known after hydration).
    const now = new Date();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTodaySlug(DAY_TO_MYSTERY[now.getDay()]);
    setWeekdayName(now.toLocaleDateString(undefined, { weekday: "long" }));
  }, []);

  const today = mysteries.find((m) => m.slug === todaySlug);
  const others = mysteries.filter((m) => m.slug !== todaySlug);
  if (!today) return null;

  return (
    <>
      {/* Today's mystery — hero card with artwork banner */}
      <section className="pt-10 pb-6 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-[11px] tracking-[0.25em] text-btf-gold-light uppercase font-semibold mb-4">
            {weekdayName ? `Today is ${weekdayName}` : "Today's mystery"}
          </p>
          <Link
            href={`/catholic-path/rosary/${today.slug}`}
            className="group block rounded-3xl overflow-hidden bg-white/[0.055] border border-btf-gold/40 hover:border-btf-gold/70 hover:-translate-y-0.5 transition-all"
          >
            {/* Artwork area — see ArtPlaceholder for how to add the real
                illustration (drop an <img> + keep the scrim). */}
            <div className="relative aspect-[21/9]">
              <ArtPlaceholder className="absolute inset-0" />
              <span
                className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
                aria-hidden
              />
              <span className="absolute top-3 right-3 text-[9px] uppercase tracking-[0.16em] font-semibold px-2.5 py-1 rounded-full bg-btf-gold/25 text-btf-gold-light border border-btf-gold/40 backdrop-blur-sm">
                Today
              </span>
            </div>
            <div className="p-7 md:p-8">
              <h2 className="font-serif text-2xl md:text-3xl text-white font-light mb-2 text-center">
                {today.name}
              </h2>
              <p className="text-center text-white/85 font-light leading-relaxed mb-6 text-balance">
                {today.subtitle}
              </p>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 max-w-xl mx-auto text-sm text-white/85 font-light">
                {today.decades.map((d) => (
                  <li key={d.number} className="flex gap-2">
                    <svg
                      aria-hidden
                      className="text-btf-gold-light flex-shrink-0 mt-1"
                      width={11}
                      height={11}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
                    </svg>
                    <span>{d.name}</span>
                  </li>
                ))}
              </ul>
              <p className="text-center text-[10px] uppercase tracking-[0.25em] text-btf-gold-light font-semibold mt-7 group-hover:translate-x-1 transition-transform">
                Begin →
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Other mysteries — artwork-topped tiles */}
      <section className="py-6 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] tracking-[0.25em] text-white/70 uppercase font-semibold mb-4 px-0.5">
            Other mysteries
          </p>
          <ul className="grid sm:grid-cols-3 gap-4">
            {others.map((m) => (
              <li key={m.slug}>
                <Link
                  href={`/catholic-path/rosary/${m.slug}`}
                  className="group h-full flex flex-col rounded-2xl overflow-hidden bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/40 hover:-translate-y-0.5 transition-all"
                >
                  <div className="relative aspect-[4/3]">
                    <ArtPlaceholder className="absolute inset-0" />
                    <span
                      className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
                      aria-hidden
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-serif text-lg text-white font-light mb-0.5">
                      {m.name.replace(/^The /, "")}
                    </h3>
                    <p className="text-xs text-btf-gold-light/90 font-light mb-2">
                      {m.days.join(" · ")}
                    </p>
                    <p className="text-xs text-white/70 font-light leading-relaxed flex-1">
                      {m.subtitle}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
