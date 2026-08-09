import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "../../lib/session";
import {
  WISDOM_THEMES,
  readingsByTheme,
  dailyWisdom,
  type WisdomTheme,
} from "../../lib/wisdom";

/**
 * /wisdom — the secular mirror of Daily Scripture (vault: Backlog 4d).
 *
 * Public-domain passages from philosophers, poets, and historic figures,
 * browseable by what you're carrying. No religion, no spirituality —
 * Max's standing rule for the secular track. Today's reading up top,
 * theme chips filter the rest. Draft v1; wording pending verification
 * against printed public-domain editions before launch.
 */
export const dynamic = "force-dynamic";

export default async function WisdomPage({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string }>;
}) {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/return");

  const { theme: rawTheme } = await searchParams;
  const theme = WISDOM_THEMES.some((t) => t.slug === rawTheme)
    ? (rawTheme as WisdomTheme)
    : undefined;

  const today = dailyWisdom();
  const readings = readingsByTheme(theme).filter((r) => r.id !== (theme ? "" : today.id));

  return (
    <main className="mx-auto w-full max-w-[480px] md:max-w-[600px] px-[18px]">
      <header className="pt-8 pb-1">
        <h1 className="font-serif font-medium text-[28px]">Wisdom</h1>
        <p className="text-[13px] text-[#9fb6c8] mt-0.5">
          Philosophers, poets, and people who endured — a line at a time.
        </p>
      </header>

      {/* Today's reading */}
      {!theme && (
        <section className="mt-5 rounded-[24px] overflow-hidden p-[22px] border border-btf-gold/30 bg-[radial-gradient(120%_90%_at_80%_0%,rgba(201,168,76,0.22),transparent_55%),linear-gradient(160deg,rgba(26,111,168,0.45),rgba(10,26,42,0.75))]">
          <p className="text-[10px] tracking-[0.22em] uppercase text-btf-gold-light font-semibold mb-3">
            Today&rsquo;s reading
          </p>
          <p className="font-serif italic text-[19px] leading-relaxed text-white/95">
            &ldquo;{today.text}&rdquo;
          </p>
          <p className="text-[12px] text-btf-gold-light mt-3">
            {today.author}
            <span className="text-[#8aa0b0]"> — {today.source}</span>
          </p>
        </section>
      )}

      {/* Theme chips */}
      <div className="flex gap-2 overflow-x-auto mt-6 pb-1 -mx-[18px] px-[18px] [scrollbar-width:none]">
        <Link
          href="/wisdom"
          className={
            "flex-none rounded-full px-3.5 py-1.5 text-[12px] border transition-colors " +
            (!theme
              ? "bg-btf-gold/20 border-btf-gold/50 text-btf-gold-light"
              : "bg-white/[0.05] border-white/10 text-[#cfe0ee]")
          }
        >
          All
        </Link>
        {WISDOM_THEMES.map((t) => (
          <Link
            key={t.slug}
            href={`/wisdom?theme=${t.slug}`}
            className={
              "flex-none rounded-full px-3.5 py-1.5 text-[12px] border transition-colors " +
              (theme === t.slug
                ? "bg-btf-gold/20 border-btf-gold/50 text-btf-gold-light"
                : "bg-white/[0.05] border-white/10 text-[#cfe0ee]")
            }
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Readings */}
      <ul className="mt-4 space-y-3">
        {readings.map((r) => (
          <li
            key={r.id}
            className="rounded-[20px] bg-white/[0.055] border border-white/[0.09] p-5"
          >
            <p className="font-serif italic text-[16px] leading-relaxed text-white/90">
              &ldquo;{r.text}&rdquo;
            </p>
            <div className="flex items-baseline justify-between gap-3 mt-3">
              <p className="text-[12px] text-btf-gold-light">
                {r.author}
                <span className="text-[#8aa0b0]"> — {r.source}</span>
              </p>
              <span className="flex-none text-[10px] uppercase tracking-[0.14em] text-[#8aa0b0]">
                {r.themes
                  .map((t) => WISDOM_THEMES.find((w) => w.slug === t)?.label)
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-7 mb-2 text-center text-[11px] text-[#8aa0b0] leading-relaxed">
        All passages are public domain, cited to their authors. More readings,
        and a paced reader with reflection journaling, are on the roadmap.
      </p>
    </main>
  );
}
