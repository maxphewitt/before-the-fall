"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import BackLink from "../../_nav/BackLink";
import { createEntry } from "../../../actions/journal";
import type { JournalType } from "../../../lib/journalTypes";

/**
 * /journal/new — write a new entry.
 *
 * Client component because we hold the draft text + chosen type in
 * state until submit. The listing page is gated; if a logged-out user
 * somehow lands here, the action will reject and surface the "you're
 * not signed in" message.
 *
 * 'activity' is intentionally NOT in the type picker. Activity entries
 * are created by the Self-Help Tool Walker so they always have a
 * structured payload. A freeform "I went for a walk today" belongs
 * under Daily or Note.
 *
 * useSearchParams() requires a Suspense boundary in production builds
 * (Next.js static-prerender CSR-bailout requirement). The default
 * export wraps the form in <Suspense>; the actual implementation lives
 * in NewEntryForm below.
 */

type PickableType = Exclude<JournalType, "activity">;

const TYPE_OPTIONS: { value: PickableType; label: string; blurb: string }[] = [
  { value: "daily", label: "Daily", blurb: "Day-to-day writing." },
  { value: "reflection", label: "Reflection", blurb: "Longer thinking, after the fact." },
  { value: "note", label: "Note", blurb: "Quick capture." },
];

export default function NewEntryPage() {
  return (
    <Suspense fallback={null}>
      <NewEntryForm />
    </Suspense>
  );
}

function NewEntryForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ?type=intention lets the Catholic Path → Prayer Intentions tile
  // deep-link straight into an intention entry without forcing the
  // user to pick the type by hand. Falls back to daily.
  const initialType = (() => {
    const q = searchParams.get("type");
    return TYPE_OPTIONS.some((t) => t.value === q)
      ? (q as PickableType)
      : "daily";
  })();

  const [text, setText] = useState("");
  const [journalType, setJournalType] = useState<PickableType>(initialType);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await createEntry(text, journalType);
      if (res.success) {
        router.push("/journal");
        router.refresh();
      } else {
        setError(res.error);
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10 sm:py-14">
      <div>
        <BackLink
          fallbackHref="/journal"
          label="Journal"
          className="text-white/70 hover:text-white text-sm mb-6 inline-flex items-center gap-2 transition-colors"
        />

        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
          New entry
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-3">
          Whatever you need to say.
        </h1>
        <p className="text-white/70 font-light leading-relaxed mb-8 text-sm">
          Write as much or as little as you want. Encrypted before it touches the database.
        </p>

        <form onSubmit={onSubmit}>
          <fieldset className="mb-6" disabled={submitting}>
            <legend className="text-[11px] tracking-[0.25em] uppercase text-white/70 font-semibold mb-3">
              Type
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TYPE_OPTIONS.map((opt) => {
                const active = journalType === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setJournalType(opt.value)}
                    aria-pressed={active}
                    className={
                      "rounded-xl border px-3 py-3 text-left text-sm transition-all " +
                      (active
                        ? "border-btf-gold/50 bg-btf-gold/[0.14] text-[#e9f1f8]"
                        : "border-white/[0.09] bg-white/[0.055] text-white/70 hover:border-btf-gold/40 hover:bg-white/[0.08]")
                    }
                  >
                    <span className="block font-medium mb-0.5">{opt.label}</span>
                    <span className="block text-[11px] font-light text-[#9fb6c8] leading-snug">
                      {opt.blurb}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={submitting}
            autoFocus
            rows={14}
            aria-label="Journal entry text"
            placeholder="Start here…"
            className="w-full rounded-2xl bg-white/[0.06] border border-white/15 focus:border-btf-gold/50 focus:outline-none px-5 py-4 text-base text-[#e9f1f8] placeholder:text-[#9fb6c8] font-light leading-relaxed resize-y transition-colors"
          />

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-xl bg-[rgba(201,80,80,0.10)] border border-[rgba(201,80,80,0.3)] text-[#e8b3b3] text-sm p-4"
            >
              {error}
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={submitting || text.trim().length === 0}
              className="flex-1 bg-gradient-to-b from-btf-gold-light to-btf-gold text-[#2a2008] font-bold px-8 py-3.5 rounded-full shadow-[0_10px_24px_-10px_rgba(201,168,76,0.8)] disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-transform"
            >
              {submitting ? "Saving…" : "Save entry"}
            </button>
            <Link
              href="/journal"
              className="flex-1 flex items-center justify-center bg-white/[0.06] border border-white/15 text-[#e9f1f8] font-medium px-8 py-3.5 rounded-full hover:border-btf-gold/40 hover:bg-white/[0.08] transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
