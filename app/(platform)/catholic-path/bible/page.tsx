import Link from "next/link";
import { getCurrentUserId } from "../../../lib/session";
import OnboardingRequired from "../../../components/OnboardingRequired";
import { BIBLE_BOOKS, isBookAvailable, getBookChapterCount } from "../../../lib/bible";

/**
 * /catholic-path/bible — full Bible reader, book index.
 * Douay-Rheims (public domain), self-hosted with an API fallback (see
 * lib/bible.ts header). Availability and chapter counts come from
 * isBookAvailable()/getBookChapterCount() so the deuterocanon lights up
 * and Daniel/Esther show their full DR chapter counts as soon as the
 * local text is built; books stay greyed only in the API-fallback world.
 */
export const dynamic = "force-dynamic";

export default async function BibleIndexPage() {
  const userId = await getCurrentUserId();
  if (!userId) return <OnboardingRequired returnTo="/catholic-path/bible" />;

  const testaments = [
    { key: "old" as const, label: "Old Testament" },
    { key: "new" as const, label: "New Testament" },
  ];

  return (
    <main className="mx-auto w-full max-w-[480px] md:max-w-[600px] px-[18px]">
      <header className="pt-8 pb-5">
        <Link
          href="/catholic-path"
          className="text-white/60 hover:text-white text-xs tracking-[0.25em] uppercase font-medium"
        >
          ← Catholic Path
        </Link>
        <h1 className="font-serif font-medium text-[28px] mt-4">The Bible</h1>
        <p className="text-[13px] text-[#9fb6c8] mt-1 leading-snug">
          Douay-Rheims translation — read any book, a chapter at a time.
        </p>
      </header>

      {testaments.map((t) => (
        <section key={t.key} className="mb-8">
          <p className="text-[11px] tracking-[0.2em] uppercase text-btf-gold font-semibold mb-3">
            {t.label}
          </p>
          <ul className="grid grid-cols-2 gap-2">
            {BIBLE_BOOKS.filter((bk) => bk.testament === t.key).map((bk) =>
              isBookAvailable(bk) ? (
                <li key={bk.slug}>
                  <Link
                    href={`/catholic-path/bible/${bk.slug}/1`}
                    className="block rounded-2xl bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/40 px-4 py-3 transition-colors"
                  >
                    <span className="block text-[14px] text-white/90">{bk.name}</span>
                    <span className="block text-[11px] text-[#8aa0b0] font-light">
                      {getBookChapterCount(bk)} {getBookChapterCount(bk) === 1 ? "chapter" : "chapters"}
                    </span>
                  </Link>
                </li>
              ) : (
                <li key={bk.slug}>
                  <div className="rounded-2xl bg-white/[0.025] border border-white/[0.05] px-4 py-3">
                    <span className="block text-[14px] text-white/40">{bk.name}</span>
                    <span className="block text-[11px] text-white/30 font-light">
                      Text coming soon
                    </span>
                  </div>
                </li>
              )
            )}
          </ul>
        </section>
      ))}

      <p className="mt-2 mb-4 text-center text-[11px] text-[#8aa0b0] leading-relaxed">
        Douay-Rheims 1899 American Edition (public domain). The deuterocanonical
        books are part of the Catholic canon and will be added as their text
        source comes online.
      </p>
    </main>
  );
}
