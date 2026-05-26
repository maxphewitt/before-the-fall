import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "../lib/session";
import { listEntries } from "../actions/journal";
import type { JournalEntry, JournalType } from "../lib/journalTypes";

/**
 * /journal — the user's entries, grouped by type and (for Activity)
 * sub-grouped by tool slug.
 *
 * Server component. Gated by the session cookie. Anonymous visitors
 * are bounced to /return so they paste their code and come back.
 */
export default async function JournalPage() {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/return");
  }

  const result = await listEntries();

  return (
    <main className="min-h-screen bg-btf-off-white px-6 py-10 sm:py-14">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-btf-text-light hover:text-btf-sky-deep text-sm mb-6 inline-flex items-center gap-2 transition-colors"
        >
          <span aria-hidden>&larr;</span> Home
        </Link>

        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
          Journal
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light leading-tight mb-3">
          Your entries.
        </h1>
        <p className="text-btf-text-mid font-light leading-relaxed mb-8">
          Encrypted at rest. Only you and the safeguards we are legally
          required to maintain can read them.
        </p>

        <div className="flex flex-wrap gap-3 mb-10">
          <Link
            href="/journal/new"
            className="inline-block bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium px-6 py-3 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
          >
            + New entry
          </Link>
          <Link
            href="/tools"
            className="inline-block bg-white border-2 border-btf-gold/40 text-btf-sky-deep font-medium px-6 py-3 rounded-full hover:border-btf-gold hover:-translate-y-0.5 transition-all"
          >
            Use a self-help tool →
          </Link>
        </div>

        {!result.success && (
          <div
            role="alert"
            className="rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm p-4"
          >
            {result.error}
          </div>
        )}

        {result.success && result.data.length === 0 && (
          <div className="rounded-2xl bg-white border-2 border-btf-sky-pale/60 p-8 text-center">
            <p className="text-btf-text-mid font-light leading-relaxed">
              Nothing here yet. When you&rsquo;re ready, write down whatever you need to.
              There&rsquo;s no wrong way to do this.
            </p>
          </div>
        )}

        {result.success && result.data.length > 0 && (
          <GroupedEntries entries={result.data} />
        )}
      </div>
    </main>
  );
}

/* ─── Grouped rendering ─────────────────────────────────────────────── */

type SectionDef = {
  key: JournalType;
  label: string;
  blurb: string;
};

const SECTIONS: SectionDef[] = [
  { key: "daily", label: "Daily journal", blurb: "Day-to-day writing." },
  { key: "reflection", label: "Reflections", blurb: "Longer thinking, after the fact." },
  { key: "activity", label: "Activity journals", blurb: "Self-help tool sessions, grouped by exercise." },
  { key: "note", label: "Notes", blurb: "Quick captures." },
  { key: "intention", label: "Intentions", blurb: "What you’re carrying to God this week." },
];

function GroupedEntries({ entries }: { entries: JournalEntry[] }) {
  const byType = new Map<JournalType, JournalEntry[]>();
  for (const e of entries) {
    const arr = byType.get(e.journalType) ?? [];
    arr.push(e);
    byType.set(e.journalType, arr);
  }

  return (
    <div className="space-y-12">
      {SECTIONS.map((section) => {
        const list = byType.get(section.key) ?? [];
        if (list.length === 0) return null;
        return (
          <section key={section.key} aria-labelledby={`section-${section.key}`}>
            <div className="mb-4 flex items-baseline justify-between">
              <h2
                id={`section-${section.key}`}
                className="text-[11px] tracking-[0.25em] uppercase text-btf-sky-deep font-semibold"
              >
                {section.label}
              </h2>
              <span className="text-[11px] text-btf-text-light">
                {list.length} {list.length === 1 ? "entry" : "entries"}
              </span>
            </div>

            {section.key === "activity" ? (
              <ActivityGroup entries={list} />
            ) : (
              <FlatGroup entries={list} />
            )}
          </section>
        );
      })}
    </div>
  );
}

function FlatGroup({ entries }: { entries: JournalEntry[] }) {
  return (
    <ul className="space-y-3">
      {entries.map((entry) => (
        <li key={entry.id}>
          <Link
            href={`/journal/${entry.id}`}
            className="block rounded-2xl bg-white border-2 border-btf-sky-pale/60 hover:border-btf-sky-light hover:shadow-md p-5 transition-all"
          >
            <p className="text-[10px] tracking-[0.2em] uppercase text-btf-text-light font-semibold mb-2">
              {formatEntryDate(entry.createdAt)}
            </p>
            <p className="text-sm text-btf-text-dark font-light leading-relaxed whitespace-pre-line line-clamp-3">
              {entry.text}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * Activity entries are tool sessions; sub-group by tool slug so the user
 * sees their "Urge Surfing" sessions, "Box Breathing" sessions, etc.,
 * each in their own block. Entries without a parsed tool session
 * (shouldn't normally happen, but guard anyway) fall into an "Other"
 * group.
 */
function ActivityGroup({ entries }: { entries: JournalEntry[] }) {
  const bySlug = new Map<
    string,
    { name: string; entries: JournalEntry[] }
  >();
  for (const e of entries) {
    const slug = e.toolSession?.toolSlug ?? "_other";
    const name = e.toolSession?.toolName ?? "Other activity";
    const cur = bySlug.get(slug) ?? { name, entries: [] };
    cur.entries.push(e);
    bySlug.set(slug, cur);
  }

  return (
    <div className="space-y-6">
      {Array.from(bySlug.values()).map((group) => (
        <div key={group.name}>
          <p className="text-sm text-btf-sky-deep font-medium mb-3">
            {group.name}{" "}
            <span className="text-btf-text-light font-light">
              · {group.entries.length} {group.entries.length === 1 ? "session" : "sessions"}
            </span>
          </p>
          <ul className="space-y-3">
            {group.entries.map((entry) => {
              const stepCount = entry.toolSession?.steps.length ?? 0;
              const previewStep = entry.toolSession?.steps.find(
                (s) => s.userAnswer.length > 0
              );
              return (
                <li key={entry.id}>
                  <Link
                    href={`/journal/${entry.id}`}
                    className="block rounded-2xl bg-white border-2 border-btf-gold-pale hover:border-btf-gold hover:shadow-md p-5 transition-all"
                  >
                    <p className="text-[10px] tracking-[0.2em] uppercase text-btf-text-light font-semibold mb-2">
                      {formatEntryDate(entry.createdAt)} · {stepCount} steps
                    </p>
                    {previewStep && (
                      <p className="text-sm text-btf-text-dark font-light leading-relaxed line-clamp-2">
                        <span className="font-medium">{previewStep.heading}:</span>{" "}
                        {previewStep.userAnswer}
                      </p>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

function formatEntryDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
