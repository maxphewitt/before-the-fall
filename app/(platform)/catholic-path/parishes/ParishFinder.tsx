"use client";

import { useState, useTransition } from "react";
import { findParishes, type ParishHit } from "../../../actions/parishes";

/**
 * Parish Finder — search by current location or ZIP.
 *
 * Privacy: coordinates/ZIP are sent once to the server action, used
 * in-memory to sort results, and never stored or logged. The UI says so
 * plainly, because users in this app have good reasons to care.
 */
export default function ParishFinder() {
  const [zip, setZip] = useState("");
  const [hits, setHits] = useState<ParishHit[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [pending, startTransition] = useTransition();

  function run(input: { lat: number; lng: number } | { zip: string }) {
    setError(null);
    startTransition(async () => {
      const res = await findParishes(input);
      if (res.success) setHits(res.data);
      else setError(res.error);
    });
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError("Your browser doesn't support location. Try a ZIP code instead.");
      return;
    }
    setError(null);
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        run({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setLocating(false);
        setError("We couldn't access your location. A ZIP code works just as well.");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
    );
  }

  function submitZip() {
    if (zip.trim()) run({ zip });
  }

  const busy = pending || locating;

  return (
    <div>
      {/* Search controls */}
      <div className="rounded-2xl bg-white/[0.055] border border-white/[0.09] p-5">
        <button
          type="button"
          onClick={useMyLocation}
          disabled={busy}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full py-3.5 px-6 font-semibold text-[#2a2008] bg-gradient-to-b from-btf-gold-light to-btf-gold transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
          {locating ? "Finding you…" : "Use my current location"}
        </button>

        <div className="flex items-center gap-3 my-4" aria-hidden>
          <span className="flex-1 h-px bg-white/10" />
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/40 font-semibold">or</span>
          <span className="flex-1 h-px bg-white/10" />
        </div>

        <div className="flex gap-2">
          <input
            value={zip}
            onChange={(e) => setZip(e.target.value.replace(/[^\d]/g, "").slice(0, 5))}
            onKeyDown={(e) => { if (e.key === "Enter") submitZip(); }}
            inputMode="numeric"
            placeholder="ZIP code, e.g. 10022"
            aria-label="ZIP code"
            className="flex-1 rounded-full bg-white/[0.06] border border-white/15 px-5 py-3 text-[15px] text-[#e9f1f8] placeholder:text-[#9fb6c8] outline-none focus:border-btf-gold/50"
          />
          <button
            type="button"
            onClick={submitZip}
            disabled={busy || zip.trim().length !== 5}
            className="rounded-full py-3 px-6 font-semibold text-btf-gold-light bg-btf-gold/15 border border-btf-gold/30 disabled:opacity-50"
          >
            {pending ? "Searching…" : "Find"}
          </button>
        </div>

        <p className="text-[11px] text-[#8aa0b0] font-light mt-3 leading-snug">
          Your location or ZIP is used once to sort results and is never stored.
        </p>
      </div>

      {error && (
        <p className="mt-4 text-sm text-[#e8b3b3] bg-[rgba(201,80,80,0.1)] border border-[rgba(201,80,80,0.3)] rounded-2xl px-4 py-3">
          {error}
        </p>
      )}

      {/* Results */}
      {hits !== null && !error && (
        <section className="mt-6">
          <p className="text-[11px] tracking-[0.2em] uppercase text-btf-gold font-semibold mb-3">
            {hits.length > 0 ? "Nearest parishes" : "No parishes found"}
          </p>
          {hits.length === 0 && (
            <p className="text-sm text-white/70 font-light leading-relaxed">
              The directory is still growing during beta — none near you yet. Check back soon.
            </p>
          )}
          <ul className="space-y-3">
            {hits.map((p) => (
              <li key={p.id} className="rounded-2xl bg-white/[0.055] border border-white/[0.09] p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-serif text-[19px] text-[#e9f1f8] font-light leading-snug">
                    {p.name}
                  </h3>
                  <span className="flex-none text-[12px] text-btf-gold-light tabular-nums mt-1">
                    {p.distanceMiles} mi
                  </span>
                </div>
                <p className="text-[13px] text-[#9fb6c8] font-light mt-1">
                  {/* OSM-imported rows may lack street/city/zip — show what exists */}
                  {[p.address, p.city, `${p.state}${p.zip ? ` ${p.zip}` : ""}`]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                {p.massTimes && (
                  <p className="text-[12px] text-white/70 font-light mt-2">Mass: {p.massTimes}</p>
                )}
                {p.confessionTimes && (
                  <p className="text-[12px] text-white/70 font-light mt-0.5">Confession: {p.confessionTimes}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  {p.website ? (
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] font-semibold text-btf-gold-light bg-btf-gold/15 border border-btf-gold/30 rounded-full px-3.5 py-1.5"
                    >
                      Visit website ↗
                    </a>
                  ) : (
                    /* No stored site (OSM metadata gap) — a targeted web
                       search finds the parish site in one tap. */
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(
                        `${p.name} ${p.city || ""} ${p.state} catholic church website`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] font-semibold text-btf-gold-light bg-btf-gold/15 border border-btf-gold/30 rounded-full px-3.5 py-1.5"
                    >
                      Find website ↗
                    </a>
                  )}
                  {p.phone && (
                    <a
                      href={`tel:${p.phone.replace(/[^\d+]/g, "")}`}
                      className="text-[12px] text-[#cfe0ee] bg-white/[0.06] border border-white/15 rounded-full px-3.5 py-1.5"
                    >
                      {p.phone}
                    </a>
                  )}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${p.name}, ${p.address}, ${p.city}, ${p.state} ${p.zip}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] text-[#cfe0ee] bg-white/[0.06] border border-white/15 rounded-full px-3.5 py-1.5"
                  >
                    Directions ↗
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
