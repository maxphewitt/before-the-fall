import { getLatestArticles } from "../lib/articles";
import HomeCarousel from "./HomeCarousel";

/**
 * Public marketing home (landing) — the default route `/`.
 *
 * Deliberately minimal: a single welcoming hero carousel. Slide one is
 * "You are not a monster…" with one "Learn more" button into
 * /what-we-offer; the remaining slides cycle the newest BTF blogs,
 * articles, and news (getLatestArticles(); empty for now). The
 * loved-one and account-creation entry points live in the header, not
 * on the landing — keeping the first impression calm.
 *
 * Everything that used to live below the fold here (tiers, modules,
 * Catholic Path, what-this-is) now lives on /what-we-offer.
 */
export default async function Home() {
  const articles = await getLatestArticles();
  return <HomeCarousel articles={articles} />;
}
