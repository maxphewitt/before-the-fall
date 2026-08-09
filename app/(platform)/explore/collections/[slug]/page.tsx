import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUserId } from "../../../../lib/session";
import { getCurrentUserFaithRole } from "../../../../lib/profile";
import { getCollectionBySlug } from "../../../../lib/collections";
import {
  PASSAGES,
  getPassageById,
  type ScripturePassage,
} from "../../../../lib/scripture";
import { WISDOM_THEMES, readingsByTheme } from "../../../../lib/wisdom";
import { listCollectionReflections } from "../../../../actions/collectionReflections";
import ReflectionSpace from "./ReflectionSpace";

/**
 * /explore/collections/[slug] — a "For where you are" collection page.
 * One state (anxiety, grief, stillness, sleep), everything the app has
 * for it: tools for everyone; Scripture + prayers for faith users;
 * wisdom readings for secular users.
 */
export const dynamic = "force-dynamic";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const userId = await getCurrentUserId();
  if (!userId) redirect("/return");
  const secular = (await getCurrentUserFaithRole()) === "secular";

  // Faith: the curated passages for this state. Theme filter remains as
  // a fallback only, in case a curated id ever falls out of the
  // Scripture dataset. Commentary lives on the passage itself now
  // (ScripturePassage.deeper), shown after the guided reading.
  const curated = collection.passages
    .map((cp) => getPassageById(cp.id))
    .filter((p): p is ScripturePassage => p !== undefined);
  const passages =
    curated.length > 0
      ? curated
      : PASSAGES.filter((p) =>
          p.themes.some((t) => collection.scriptureThemes.includes(t))
        ).slice(0, 3);

  // Secular: up to 3 wisdom readings matching its themes.
  const readings = collection.wisdomThemes
    .flatMap((t) => readingsByTheme(t))
    .filter((r, i, arr) => arr.findIndex((x) => x.id === r.id) === i)
    .slice(0, 3);

  // Shared reflection space: initial list, fetched server-side.
  const reflectionsRes = await listCollectionReflections(slug);
  const reflections = reflectionsRes.success ? reflectionsRes.data : [];

  return (
    <main className="mx-auto w-full max-w-[480px] md:max-w-[600px] px-[18px]">
      <header className="pt-8 pb-5">
        <Link
          href="/explore"
          className="text-white/60 hover:text-white text-xs tracking-[0.25em] uppercase font-medium"
        >
          ← Explore
        </Link>
        <p className="text-[11px] tracking-[0.2em] uppercase text-btf-gold font-semibold mt-5">
          {collection.tagline}
        </p>
        <h1 className="font-serif font-medium text-[28px] mt-1">{collection.title}</h1>
        <p className="text-[13px] text-[#9fb6c8] mt-1.5 leading-snug">{collection.intro}</p>
      </header>

      {/* Tools — both paths */}
      <section className="mb-7">
        <h2 className="text-[11px] tracking-[0.2em] uppercase text-btf-gold font-semibold mb-3">
          Steady yourself
        </h2>
        <ul className="space-y-2.5">
          {collection.tools.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/tools/${t.slug}/start`}
                className="block rounded-2xl bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/40 px-4 py-3.5 transition-colors"
              >
                <span className="block text-[15px] text-white/90 font-medium">{t.label}</span>
                <span className="block text-[12px] text-[#8aa0b0] font-light mt-0.5">{t.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Faith track */}
      {!secular && passages.length > 0 && (
        <section className="mb-7">
          <h2 className="text-[11px] tracking-[0.2em] uppercase text-btf-gold font-semibold mb-3">
            Scripture for this
          </h2>
          <ul className="space-y-2.5">
            {passages.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/catholic-path/scripture/${p.id}?read=1`}
                  className="block rounded-2xl bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/40 px-4 py-3.5 transition-colors"
                >
                  <span className="block text-[15px] text-white/90 font-medium">{p.title}</span>
                  <span className="block text-[11px] text-btf-gold-light mt-0.5">{p.citation}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex gap-2 mt-3">
            <Link
              href="/catholic-path/scripture"
              className="flex-1 text-center text-[12px] font-semibold text-btf-gold-light bg-btf-gold/15 border border-btf-gold/30 rounded-full px-3.5 py-2"
            >
              More Scripture
            </Link>
            <Link
              href="/catholic-path/prayers"
              className="flex-1 text-center text-[12px] text-[#cfe0ee] bg-white/[0.06] border border-white/15 rounded-full px-3.5 py-2"
            >
              Prayers for this
            </Link>
          </div>
        </section>
      )}

      {/* Secular track */}
      {secular && readings.length > 0 && (
        <section className="mb-7">
          <h2 className="text-[11px] tracking-[0.2em] uppercase text-btf-gold font-semibold mb-3">
            Wisdom for this
          </h2>
          <ul className="space-y-2.5">
            {readings.map((r) => (
              <li key={r.id} className="rounded-2xl bg-white/[0.055] border border-white/[0.09] px-4 py-3.5">
                <p className="font-serif italic text-[14px] text-white/90 leading-relaxed">
                  &ldquo;{r.text.length > 180 ? r.text.slice(0, 177) + "…" : r.text}&rdquo;
                </p>
                <p className="text-[11px] text-btf-gold-light mt-1.5">
                  {r.author}
                  <span className="text-[#8aa0b0]"> — {r.source}</span>
                </p>
              </li>
            ))}
          </ul>
          <Link
            href={`/wisdom?theme=${collection.wisdomThemes[0]}`}
            className="block mt-3 text-center text-[12px] font-semibold text-btf-gold-light bg-btf-gold/15 border border-btf-gold/30 rounded-full px-3.5 py-2"
          >
            More {WISDOM_THEMES.find((t) => t.slug === collection.wisdomThemes[0])?.label.toLowerCase()} readings
          </Link>
        </section>
      )}

      {/* Reflection space — shared, anonymous, fades after 7 days */}
      <section className="mb-10">
        <ReflectionSpace slug={collection.slug} initial={reflections} />
      </section>
    </main>
  );
}
