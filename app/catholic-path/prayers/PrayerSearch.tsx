"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { searchPrayers } from "../../lib/prayerSearch";
import { CATEGORY_LABELS } from "../../lib/prayers";

/**
 * Plain-language search over the Prayer Library.
 *
 * No LLM; keyword + tag matching with synonym expansion (see
 * app/lib/prayerSearch.ts). Renders results live as the user types.
 *
 * Pre-suggested prompts under the input give a first-time user real
 * examples of how to phrase a query — better than guessing.
 */

const SUGGESTED_QUERIES = [
  "I can't stop the anxious thoughts",
  "I lost someone I love",
  "Tempted right now",
  "Help me forgive",
  "I don't know what to choose",
  "For someone I love who is sick",
  "I'm angry and I don't want to say something I'll regret",
  "I feel completely alone",
];

export default function PrayerSearch() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    return searchPrayers(query, 10);
  }, [query]);

  const showResults = query.trim().length >= 2;

  return (
    <section className="mt-2" aria-labelledby="search-heading">
      <p
        id="search-heading"
        className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3"
      >
        Tell me what you&rsquo;re carrying
      </p>

      <label className="block">
        <span className="sr-only">Describe a situation, feeling, or question</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="anxious, grieving, tempted, lost, angry, can't sleep…"
          aria-label="Search the prayer library"
          autoComplete="off"
          className="w-full rounded-2xl bg-white border-2 border-btf-sky-pale focus:border-btf-sky focus:outline-none px-5 py-4 text-base text-btf-text-dark font-light leading-relaxed shadow-sm transition-colors placeholder:text-btf-text-light/70 placeholder:italic"
        />
      </label>

      <p className="text-xs text-btf-text-light font-light mt-2 leading-relaxed">
        Plain language is fine. The search matches against tags, intent, and prayer text. No AI is generating prayers &mdash; only finding ones from the library.
      </p>

      {!showResults && (
        <div className="mt-4">
          <p className="text-[10px] tracking-[0.2em] uppercase text-btf-text-light font-semibold mb-2">
            Or try
          </p>
          <ul className="flex flex-wrap gap-2">
            {SUGGESTED_QUERIES.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => setQuery(s)}
                  className="text-xs text-btf-sky-deep bg-btf-sky-pale/50 hover:bg-btf-sky-pale border border-btf-sky-pale rounded-full px-3 py-1.5 transition-colors"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showResults && (
        <div className="mt-6" aria-live="polite">
          {results.length === 0 ? (
            <div className="rounded-2xl bg-btf-off-white border-2 border-btf-text-light/15 p-5 text-center">
              <p className="text-sm text-btf-text-mid font-light leading-relaxed">
                No matches for &ldquo;{query.trim()}&rdquo;. Try shorter or different words, or browse by category below.
              </p>
            </div>
          ) : (
            <>
              <p className="text-[10px] tracking-[0.2em] uppercase text-btf-text-light font-semibold mb-3">
                {results.length} {results.length === 1 ? "match" : "matches"}
              </p>
              <ul className="space-y-3">
                {results.map(({ prayer }) => (
                  <li key={prayer.id}>
                    <Link
                      href={`/catholic-path/prayers/${prayer.id}`}
                      className="block rounded-2xl bg-white border-2 border-btf-sky-pale/60 hover:border-btf-sky-light hover:shadow-md p-5 transition-all"
                    >
                      <div className="flex items-baseline justify-between gap-3 mb-1">
                        <p className="font-medium text-btf-sky-deep">
                          {prayer.title}
                        </p>
                        <span className="text-[10px] tracking-[0.2em] uppercase text-btf-text-light font-semibold whitespace-nowrap">
                          {CATEGORY_LABELS[prayer.category]}
                        </span>
                      </div>
                      <p className="text-xs text-btf-text-mid font-light leading-relaxed">
                        {prayer.when_to_use}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </section>
  );
}
