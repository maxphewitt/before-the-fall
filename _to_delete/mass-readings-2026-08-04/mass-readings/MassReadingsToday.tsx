"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getMassReadingsSummary,
  type MassReadingsSummary,
} from "../../../actions/massReadings";

/**
 * Client-side "today" resolution, same reason as DailyScriptureSections:
 * the readings are tied to the actual liturgical calendar day, so we
 * need the visitor's LOCAL date, not the server's UTC guess — a Pacific
 * user at 11pm should still see tonight's date, not tomorrow's.
 */

function localDateISO(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function MassReadingsToday() {
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">(
    "loading"
  );
  const [dateISO, setDateISO] = useState<string | null>(null);
  const [summary, setSummary] = useState<MassReadingsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const iso = localDateISO(new Date());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDateISO(iso);
    getMassReadingsSummary(iso).then((res) => {
      if (res.success) {
        setSummary(res.data);
        setStatus("ready");
      } else {
        setError(res.error);
        setStatus("unavailable");
      }
    });
  }, []);

  if (status === "loading") {
    return (
      <div className="rounded-2xl bg-white/[0.055] border border-white/[0.09] p-6">
        <p className="text-sm text-white/50 font-light">
          Finding today&rsquo;s readings&hellip;
        </p>
      </div>
    );
  }

  if (status === "unavailable" || !summary || !dateISO) {
    return (
      <div className="rounded-2xl bg-white/[0.055] border border-white/[0.09] p-6">
        <p className="text-sm text-white/70 font-light leading-relaxed">
          {error ?? "Today's readings aren't in our library yet."} You can
          still read today&rsquo;s actual Mass readings at{" "}
          <a
            href="https://bible.usccb.org/bible/readings"
            target="_blank"
            rel="noopener noreferrer"
            className="text-btf-gold-light underline underline-offset-4"
          >
            usccb.org
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div>
      {summary.feast && (
        <p className="font-serif italic text-base text-[#e9f1f8] font-light mb-5 text-center">
          {summary.feast}
        </p>
      )}
      <ul className="space-y-2.5">
        {summary.readings.map((r) => (
          <li key={r.slot}>
            <Link
              href={`/catholic-path/mass-readings/${dateISO}/${r.slot}`}
              className="block rounded-2xl bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/40 hover:bg-white/[0.08] px-5 py-4 transition-all"
            >
              <p className="text-[10px] tracking-[0.2em] uppercase text-btf-gold-light font-semibold mb-1">
                {r.label}
              </p>
              <p className="text-sm text-white/85 font-light">{r.citation}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
