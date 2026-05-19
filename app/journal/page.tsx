import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "../lib/session";
import { listEntries } from "../actions/journal";

/**
 * /journal — the user's list of decrypted entries.
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

        <Link
          href="/journal/new"
          className="inline-block bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium px-6 py-3 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform mb-10"
        >
          + New entry
        </Link>

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
          <ul className="space-y-3">
            {result.data.map((entry) => (
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
        )}
      </div>
    </main>
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
