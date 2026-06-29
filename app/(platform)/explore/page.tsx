import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "../../lib/session";

/**
 * /explore — discovery surface (redesign 2026-06-28).
 *
 * PHASE 1 SCAFFOLD. The structure (search, path filter, topic chips,
 * collections, "Walk together" challenge) is in place, but the content
 * rails are placeholders: collections, reflections/audio, and community
 * challenges are backlog items (see vault 06 - Operations note). Topic
 * chips link into the existing Catholic Path library and tools so the
 * page is useful today; the rest fills in as that content ships.
 */
export const dynamic = "force-dynamic";

const CHIPS = ["Anxiety", "Grief", "Temptation", "Sleep", "Gratitude", "Lectio Divina"];

export default async function ExplorePage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/return");

  return (
    <main className="mx-auto w-full max-w-[480px] md:max-w-[600px] px-[18px]">
      <header className="pt-6 pb-3 px-0.5">
        <div className="font-serif text-[26px] font-medium leading-tight">Explore</div>
        <div className="text-xs uppercase tracking-[0.06em] text-[#8aa0b0] mt-1">
          Find what meets you today
        </div>
      </header>

      {/* Search (visual placeholder for now) */}
      <div className="flex items-center gap-2.5 rounded-[14px] px-3.5 py-3 bg-white/[0.07] border border-white/12 mt-1.5">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9fb6c8" strokeWidth={1.8} strokeLinecap="round">
          <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
        </svg>
        <span className="text-sm text-[#9fb6c8]">Search prayers, tools, reflections…</span>
      </div>

      {/* Topic chips */}
      <div className="flex gap-2.5 overflow-x-auto pt-4 pb-1 [scrollbar-width:none]">
        {CHIPS.map((c) => (
          <Link
            key={c}
            href="/catholic-path/prayers"
            className="flex-none text-xs text-[#cfe0ee] bg-white/[0.06] border border-white/12 px-3.5 py-2 rounded-full"
          >
            {c}
          </Link>
        ))}
      </div>

      {/* Collections (placeholder) */}
      <section className="mt-7">
        <div className="flex items-baseline justify-between mb-3.5 px-0.5">
          <h2 className="font-serif font-medium text-xl">For where you are</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">
          {[
            { l: "Anxiety", t: "Coming soon", href: "/tools/box-breathing/start" },
            { l: "Grief", t: "Coming soon", href: "/catholic-path/prayers" },
            { l: "Lectio Divina", t: "Faith", href: "/catholic-path/scripture" },
            { l: "Sleep", t: "Coming soon", href: "/tools/box-breathing/start" },
          ].map((c) => (
            <Link
              key={c.l}
              href={c.href}
              className="relative flex-none w-[158px] h-[108px] p-3.5 rounded-[18px] overflow-hidden flex flex-col justify-end bg-white/[0.055] border border-white/[0.09]"
            >
              <span className="absolute inset-0 bg-gradient-to-br from-btf-sky/40 to-btf-deep-night/20" />
              <span className="relative font-serif text-[17px]">{c.l}</span>
              <span className="relative text-[11px] text-[#cddcea] mt-0.5">{c.t}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Walk together (placeholder challenge) */}
      <section className="mt-7">
        <div className="flex items-baseline justify-between mb-3.5 px-0.5">
          <h2 className="font-serif font-medium text-xl">Walk together</h2>
        </div>
        <div className="rounded-[20px] p-[18px] border border-btf-gold/25 bg-gradient-to-br from-btf-sky-deep/75 to-btf-deep-night/70">
          <div className="font-cinzel text-[10px] tracking-[0.18em] uppercase text-btf-gold-light">
            Community · Coming soon
          </div>
          <h3 className="font-serif font-medium text-[22px] mt-2 mb-1.5">A Week of Surrender</h3>
          <p className="text-[13px] text-[#d4e3f0] mb-3.5 leading-snug">
            Seven gentle days of letting go. Join anytime and go at your own pace —
            missed days stay open for you. Group challenges are on the way.
          </p>
        </div>
      </section>

      <p className="mt-7 mb-2 text-center text-[11px] text-[#8aa0b0] leading-relaxed">
        Explore is being built out. Reflections, audio, collections, and community
        challenges are on the roadmap.
      </p>
    </main>
  );
}
