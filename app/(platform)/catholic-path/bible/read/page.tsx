import { redirect } from "next/navigation";
import { getCurrentUserId } from "../../../../lib/session";
import OnboardingRequired from "../../../../components/OnboardingRequired";
import { getBiblePosition } from "../../../../actions/bibleReader";
import {
  getBookBySlug,
  getBookChapterCount,
  isBookAvailable,
} from "../../../../lib/bible";

/**
 * /catholic-path/bible/read — the "open the Bible" entry point.
 * First-timers land in Genesis 1; returning readers land exactly where
 * they left off (bible_positions, saved by the reader as they scroll).
 * The saved position is validated + clamped so a stale slug or an
 * out-of-range chapter can never 404 — it degrades to Genesis 1.
 *
 * The book grid stays at /catholic-path/bible, reachable via the
 * "Books" control in the reader header.
 */
export const dynamic = "force-dynamic";

export default async function BibleReadEntryPage() {
  const userId = await getCurrentUserId();
  if (!userId) return <OnboardingRequired returnTo="/catholic-path/bible/read" />;

  const position = await getBiblePosition();
  if (position) {
    const book = getBookBySlug(position.bookSlug);
    if (book && isBookAvailable(book)) {
      const chapter = Math.min(
        Math.max(1, position.chapter),
        getBookChapterCount(book)
      );
      redirect(`/catholic-path/bible/${book.slug}/${chapter}`);
    }
  }
  redirect("/catholic-path/bible/genesis/1");
}
