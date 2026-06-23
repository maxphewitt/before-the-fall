"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Mystery, MysterySet } from "../../../lib/rosary";

/**
 * Client-side mystery picker.
 *
 * Why client-side: the day-of-week assignment is timezone-sensitive
 * (at 11pm PT Sunday, the server in UTC sees Monday and would show
 * the wrong mystery). Doing it in the browser uses the user's local
 * Date and is correct for every visitor regardless of where they are.
 *
 * Server pre-renders with `initialTodaySlug` (a reasonable default —
 * the server's idea of "today") so we don't ship an empty hero on
 * the first paint. Hydration corrects to the user's actual today on
 * mount.
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
    // Reading the browser's local Date requires the client. Allowed
    // exception to no-setState-in-effect because this state can only
    // be determined after hydration.
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
      {/* Today's mystery */}
      <section className="py-12 px-6 bg-gradient-to-b from-white to-btf-gold-pale/30">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-4">
            {weekdayName ? `Today is ${weekdayName}` : "Today's mystery"}
          </p>
          <Link
            href={`/catholic-path/rosary/${today.slug}`}
            className="group block rounded-2xl p-8 md:p-10 bg-white border-2 border-btf-gold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <h2 className="font-serif text-2xl md:text-3xl text-btf-sky-deep font-light mb-3 text-center">
              {today.name}
            </h2>
            <p className="text-center text-btf-text-mid font-light leading-relaxed mb-6 text-balance">
              {today.subtitle}
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 max-w-xl mx-auto text-sm text-btf-text-mid font-light">
              {today.decades.map((d) => (
                <li key={d.number} className="flex gap-2">
                  <svg
                    aria-hidden
                    className="text-btf-gold flex-shrink-0 mt-1"
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
            <p className="text-center text-[10px] uppercase tracking-[0.25em] text-btf-gold font-semibold mt-7 group-hover:translate-x-1 transition-transform">
              Begin →
            </p>
          </Link>
        </div>
      </section>

      {/* Other mysteries */}
      <section className="py-12 px-6 bg-btf-off-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-[11px] tracking-[0.25em] text-btf-text-light uppercase font-semibold mb-6">
            Other mysteries
          </p>
          <ul className="grid sm:grid-cols-3 gap-4">
            {others.map((m) => (
              <li key={m.slug}>
                <Link
                  href={`/catholic-path/rosary/${m.slug}`}
                  className="group h-full flex flex-col rounded-2xl bg-white border border-btf-gold/30 hover:border-btf-gold hover:shadow-md p-5 transition-all"
                >
                  <h3 className="font-serif text-lg text-btf-sky-deep font-light mb-1">
                    {m.name.replace(/^The /, "")}
                  </h3>
                  <p className="text-xs text-btf-text-light font-light mb-3">
                    {m.days.join(" · ")}
                  </p>
                  <p className="text-xs text-btf-text-mid font-light leading-relaxed flex-1">
                    {m.subtitle}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          <div className="rounded-xl bg-btf-gold-pale/40 border border-btf-gold/30 text-btf-text-mid text-xs font-light p-4 mt-10 leading-relaxed">
            <span className="font-medium text-btf-sky-deep">Draft v1 &middot; closed beta:</span> the prayer texts are traditional and public-domain. The brief mystery descriptions are factual summaries of scripture, not full meditations &mdash; richer reflections will be added after Father Murphy&rsquo;s review. The Rosary never replaces a priest or the sacraments.
          </div>
        </div>
      </section>
    </>
  );
}
