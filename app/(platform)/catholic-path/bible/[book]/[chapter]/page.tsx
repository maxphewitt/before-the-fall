import { notFound } from "next/navigation";
import { getCurrentUserId } from "../../../../../lib/session";
import OnboardingRequired from "../../../../../components/OnboardingRequired";
import {
  BIBLE_BOOKS,
  getBookBySlug,
  getChapter,
  isBookAvailable,
  getBookChapterCount,
} from "../../../../../lib/bible";
import { listHighlights, saveBiblePosition } from "../../../../../actions/bibleReader";
import type { ReaderBookMeta } from "../../../../../lib/bibleReaderTypes";
import BibleReader from "./BibleReader";

/**
 * /catholic-path/bible/[book]/[chapter] — thin server shell for the
 * reader. Validates the reference, gates on the session, fetches the
 * chapter text + the user's highlights server-side, records the reading
 * position (so /catholic-path/bible/read resumes here), and hands
 * everything to the BibleReader client component, which owns scrolling,
 * infinite chapter pagination, search, highlights, and notes.
 *
 * This URL remains canonical — the reader keeps it in sync via
 * history.replaceState as the user scrolls across chapter boundaries.
 * The key prop forces a clean remount when a real navigation (search,
 * book grid) changes the reference.
 */
export const dynamic = "force-dynamic";

export default async function BibleChapterPage({
  params,
}: {
  params: Promise<{ book: string; chapter: string }>;
}) {
  const { book: bookSlug, chapter: chapterRaw } = await params;
  const book = getBookBySlug(bookSlug);
  const chapter = parseInt(chapterRaw, 10);
  if (!book || !isBookAvailable(book) || !Number.isFinite(chapter) || chapter < 1) {
    notFound();
  }
  // Local DR text is authoritative for how many chapters exist.
  const chapterCount = getBookChapterCount(book);
  if (chapter > chapterCount) {
    notFound();
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    return <OnboardingRequired returnTo={`/catholic-path/bible/${bookSlug}/${chapter}`} />;
  }

  const [verses, highlightsRes] = await Promise.all([
    getChapter(book, chapter),
    listHighlights(book.slug, chapter),
    // Landing on a chapter IS the reading position — record it so the
    // /read entry point resumes here even if the user never scrolls.
    saveBiblePosition(book.slug, chapter),
  ]);

  if (!verses) {
    return (
      <main className="mx-auto w-full max-w-[480px] md:max-w-[600px] px-[18px]">
        <div className="mt-10 rounded-[20px] bg-white/[0.045] border border-white/[0.08] p-6">
          <p className="text-sm text-white/70 font-light leading-relaxed">
            This chapter couldn&rsquo;t be loaded right now. Please try again in a
            moment.
          </p>
        </div>
      </main>
    );
  }

  // Slim book metadata for client-side pagination + reference parsing.
  // Chapter counts come from the local DR text where it exists.
  const books: ReaderBookMeta[] = BIBLE_BOOKS.map((b) => ({
    slug: b.slug,
    name: b.name,
    chapters: getBookChapterCount(b),
    available: isBookAvailable(b),
  }));

  return (
    <BibleReader
      key={`${book.slug}-${chapter}`}
      initialBookSlug={book.slug}
      initialBookName={book.name}
      initialChapter={chapter}
      initialVerses={verses}
      initialHighlights={highlightsRes.success ? highlightsRes.data : []}
      books={books}
    />
  );
}
