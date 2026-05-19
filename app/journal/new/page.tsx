"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createEntry } from "../../actions/journal";

/**
 * /journal/new — write a new entry.
 *
 * Client component because we hold the draft text in state until submit.
 * The listing page is gated; if a logged-out user somehow lands here,
 * the action will reject and surface the "you're not signed in" message.
 */
export default function NewEntryPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await createEntry(text);
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
    <main className="min-h-screen bg-btf-off-white px-6 py-10 sm:py-14">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/journal"
          className="text-btf-text-light hover:text-btf-sky-deep text-sm mb-6 inline-flex items-center gap-2 transition-colors"
        >
          <span aria-hidden>&larr;</span> Journal
        </Link>

        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
          New entry
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light leading-tight mb-3">
          Whatever you need to say.
        </h1>
        <p className="text-btf-text-mid font-light leading-relaxed mb-8 text-sm">
          Write as much or as little as you want. Encrypted before it touches the database.
        </p>

        <form onSubmit={onSubmit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={submitting}
            autoFocus
            rows={14}
            aria-label="Journal entry text"
            placeholder="Start here…"
            className="w-full rounded-2xl bg-white border-2 border-btf-sky-pale/60 focus:border-btf-sky focus:outline-none px-5 py-4 text-base text-btf-text-dark font-light leading-relaxed resize-y shadow-sm transition-colors"
          />

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm p-4"
            >
              {error}
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={submitting || text.trim().length === 0}
              className="flex-1 bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium px-8 py-3.5 rounded-full shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-transform"
            >
              {submitting ? "Saving…" : "Save entry"}
            </button>
            <Link
              href="/journal"
              className="flex-1 flex items-center justify-center bg-white border-2 border-btf-text-light/30 text-btf-text-mid font-medium px-8 py-3.5 rounded-full hover:bg-btf-off-white transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
