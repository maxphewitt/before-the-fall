import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "../../lib/session";
import { getCurrentUserFaithRole } from "../../lib/profile";
import { currentMonthlyDevotion } from "../../lib/monthlyDevotions";
import { currentCommunityFeature } from "../../lib/community";
import { getEnrollment } from "../../actions/community";
import { dailyWisdom } from "../../lib/wisdom";
import { currentMonthlyWisdom } from "../../lib/monthlyWisdom";
import { COLLECTIONS } from "../../lib/collections";
import CommunityJoin from "../catholic-path/together/CommunityJoin";

/**
 * /explore — discovery surface (redesign 2026-06-28).
 *
 * Search is prayer-scoped for faith users ("Search prayers" → Prayer
 * Library) and "Search wisdom" for secular users. A faith-gated
 * "Christian Resources" rail surfaces the devotional modules (Rosary,
 * Daily Scripture, Prayer Intentions, Parish Finder, teaching videos) —
 * the Prayer Library is reached via the search bar, so it's not repeated
 * here. Collections / audio / community challenges remain roadmap
 * placeholders.
 *
 * TODO (see vault 06 - Operations note): everything here is currently
 * Christian-leaning. We must mirror it with a SECULAR track (secular
 * "wisdom"/skills content, secular collections) so non-faith users get an
 * equally rich Explore, not just an empty version of the Christian one.
 */
export const dynamic = "force-dynamic";

const CHIPS = ["Anxiety", "Grief", "Temptation", "Sleep", "Gratitude", "Stillness"];

type ChristianModule = {
  slug: string;
  title: string;
  blurb: string;
  status: "available" | "soon" | "production";
  href: string;
  glow: string;
};

const CHRISTIAN_MODULES: ChristianModule[] = [
  { slug: "rosary", title: "Rosary", blurb: "All four mysteries, paced.", status: "available", href: "/catholic-path/rosary", glow: "from-btf-gold/25" },
  { slug: "novenas", title: "Novenas", blurb: "Nine-day prayer journeys.", status: "available", href: "/catholic-path/novenas", glow: "from-btf-gold/20" },
  { slug: "scripture", title: "Daily Scripture", blurb: "A passage, read slowly.", status: "available", href: "/catholic-path/scripture", glow: "from-btf-sky/30" },
  { slug: "liturgy-of-hours", title: "Liturgy of the Hours", blurb: "Five hours a day, psalms and canticles.", status: "available", href: "/catholic-path/liturgy-of-the-hours", glow: "from-btf-gold/20" },
  { slug: "intentions", title: "Prayer Intentions", blurb: "Carry it to God, privately.", status: "available", href: "/catholic-path/intentions", glow: "from-btf-gold/15" },
  { slug: "parishes", title: "Parish Finder", blurb: "Mass & confession near you.", status: "soon", href: "/catholic-path/parishes", glow: "from-btf-sky-deep/40" },
  { slug: "videos", title: "Teaching Videos", blurb: "Priests & clinicians, weekly.", status: "production", href: "/catholic-path/videos", glow: "from-btf-sky/20" },
];

/**
 * Secular mirror of the Christian Resources rail (vault: Backlog 4d).
 * Hard rule: no religion, no spirituality — evidence-based skills and
 * public-domain wisdom from philosophers/poets only. "Soon" items point
 * at /tools until their surfaces exist.
 */
const SECULAR_MODULES: ChristianModule[] = [
  { slug: "breathing", title: "Breathing & Grounding", blurb: "Box breathing, STOP, 5-4-3-2-1.", status: "available", href: "/tools", glow: "from-btf-gold/25" },
  { slug: "urge", title: "Urge Surfing", blurb: "Ride the wave without acting.", status: "available", href: "/tools/urge-surfing/start", glow: "from-btf-sky/30" },
  { slug: "thought", title: "Thought Record", blurb: "Look at the thought, not from it.", status: "available", href: "/tools/thought-record/start", glow: "from-btf-gold/20" },
  { slug: "reflections", title: "Written Reflections", blurb: "Take stock, privately.", status: "available", href: "/journal", glow: "from-btf-gold/15" },
  { slug: "wisdom", title: "Wisdom Library", blurb: "Philosophers & poets, cited.", status: "available", href: "/wisdom", glow: "from-btf-sky-deep/40" },
  { slug: "support", title: "Meetings & Support", blurb: "Real rooms, real people.", status: "soon", href: "/tools", glow: "from-btf-sky/20" },
];

const STATUS_LABEL: Record<ChristianModule["status"], string> = {
  available: "Available now",
  soon: "Coming soon",
  production: "In production",
};

export default async function ExplorePage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/return");

  const faithRole = await getCurrentUserFaithRole();
  const secular = faithRole === "secular";

  // Community novena (shown under Walk Together for faith users).
  const community = !secular ? currentCommunityFeature() : null;
  const communityEnroll = community ? await getEnrollment(community.novena.id) : null;

  return (
    <main className="mx-auto w-full max-w-[480px] md:max-w-[600px] px-[18px]">
      <header className="pt-6 pb-3 px-0.5">
        <div className="font-serif text-[26px] font-medium leading-tight">Explore</div>
        <div className="text-xs uppercase tracking-[0.06em] text-[#8aa0b0] mt-1">
          Find what meets you today
        </div>
      </header>

      {/* Search — "Search prayers" for faith users, "Search wisdom" for secular */}
      {secular ? (
        <Link
          href="/wisdom"
          className="flex items-center gap-2.5 rounded-[14px] px-3.5 py-3 bg-white/[0.07] border border-white/12 mt-1.5 hover:border-btf-gold/40 transition-colors"
        >
          <SearchIcon />
          <span className="text-sm text-[#9fb6c8]">Search wisdom…</span>
        </Link>
      ) : (
        <Link
          href="/catholic-path/prayers"
          className="flex items-center gap-2.5 rounded-[14px] px-3.5 py-3 bg-white/[0.07] border border-white/12 mt-1.5 hover:border-btf-gold/40 transition-colors"
        >
          <SearchIcon />
          <span className="text-sm text-[#9fb6c8]">Search prayers…</span>
        </Link>
      )}

      {/* Topic chips */}
      <div className="flex gap-2.5 overflow-x-auto pt-4 pb-1 [scrollbar-width:none]">
        {CHIPS.map((c) => (
          <Link
            key={c}
            href={secular ? "/tools" : "/catholic-path/prayers"}
            className="flex-none text-xs text-[#cfe0ee] bg-white/[0.06] border border-white/12 px-3.5 py-2 rounded-full"
          >
            {c}
          </Link>
        ))}
      </div>

      {/* The Bible — deliberately outside the rail: it's the foundation,
          not one module among many. Full-width card + sidebar nav entry. */}
      {!secular && (
        <Link
          href="/catholic-path/bible/read"
          className="group block mt-8 rounded-[20px] p-[18px] border border-btf-gold/30 bg-[radial-gradient(120%_90%_at_80%_0%,rgba(201,168,76,0.22),transparent_55%),linear-gradient(160deg,rgba(26,111,168,0.45),rgba(10,26,42,0.75))] hover:border-btf-gold/50 transition-colors"
        >
          <p className="font-cinzel text-[10px] tracking-[0.18em] uppercase text-btf-gold-light">
            The foundation
          </p>
          <h3 className="font-serif font-medium text-[24px] mt-2 mb-1.5">The Bible</h3>
          <p className="text-[13px] text-[#d4e3f0] leading-snug">
            All 73 books of the Douay-Rheims — the whole of His Word, a chapter
            at a time, deuterocanon included.
          </p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-btf-gold font-semibold mt-3 group-hover:translate-x-1 transition-transform">
            Open →
          </p>
        </Link>
      )}

      {/* Christian Resources — the devotional modules, Hallow-style rail */}
      {!secular && (
        <section className="mt-8">
          <div className="flex items-baseline justify-between mb-3.5 px-0.5">
            <h2 className="font-serif font-medium text-xl">Christian Resources</h2>
            <Link href="/catholic-path" className="text-xs text-btf-gold-light">
              See all
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-[18px] px-[18px] [scrollbar-width:none]">
            {CHRISTIAN_MODULES.map((m) => (
              <Link
                key={m.slug}
                href={m.href}
                className="group relative flex-none w-[172px] h-[196px] rounded-[20px] overflow-hidden p-4 flex flex-col bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/40 transition-all"
              >
                <span className={`absolute inset-0 bg-gradient-to-br ${m.glow} to-transparent opacity-70`} aria-hidden />
                <span className="relative w-11 h-11 rounded-2xl grid place-items-center bg-white/[0.08] border border-btf-gold/25">
                  <ModuleIcon slug={m.slug} />
                </span>
                <span className="relative mt-auto font-serif text-[19px] leading-tight">{m.title}</span>
                <span className="relative text-[12px] text-[#9fb6c8] mt-1 leading-snug">{m.blurb}</span>
                <span
                  className={
                    "relative text-[10px] uppercase tracking-[0.16em] mt-2 " +
                    (m.status === "available" ? "text-btf-gold-light" : "text-[#8aa0b0]")
                  }
                >
                  {STATUS_LABEL[m.status]}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Start Here — the orientation module's standing card (secular
          path landing = Explore; faith users get theirs on /catholic-path). */}
      {secular && (
        <Link
          href="/start-here"
          className="block mt-8 rounded-[20px] overflow-hidden p-5 border border-white/[0.09] bg-white/[0.055] hover:border-btf-gold/40 transition-colors"
        >
          <p className="text-[10px] tracking-[0.22em] uppercase text-btf-gold-light font-semibold mb-1.5">
            Start Here
          </p>
          <p className="font-serif text-[17px] leading-snug text-white/95">
            The short orientation: why this app exists, why practice beats willpower, and how every tool fits together.
          </p>
        </Link>
      )}

      {/* Today's wisdom — daily rotating public-domain reading (secular) */}
      {secular && (
        <Link
          href="/wisdom"
          className="block mt-8 rounded-[20px] overflow-hidden p-5 border border-btf-gold/30 bg-[radial-gradient(120%_90%_at_80%_0%,rgba(201,168,76,0.2),transparent_55%),linear-gradient(160deg,rgba(26,111,168,0.4),rgba(10,26,42,0.7))] hover:border-btf-gold/50 transition-colors"
        >
          <p className="text-[10px] tracking-[0.22em] uppercase text-btf-gold-light font-semibold mb-2.5">
            Today&rsquo;s wisdom
          </p>
          <p className="font-serif italic text-[17px] leading-relaxed text-white/95 line-clamp-3">
            &ldquo;{dailyWisdom().text}&rdquo;
          </p>
          <p className="text-[12px] text-btf-gold-light mt-2.5">
            {dailyWisdom().author}
            <span className="text-[#8aa0b0]"> — {dailyWisdom().source}</span>
          </p>
        </Link>
      )}

      {/* Wisdom & Practice — the secular mirror of the rail above */}
      {secular && (
        <section className="mt-8">
          <div className="flex items-baseline justify-between mb-3.5 px-0.5">
            <h2 className="font-serif font-medium text-xl">Wisdom &amp; Practice</h2>
            <Link href="/tools" className="text-xs text-btf-gold-light">
              See all
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-[18px] px-[18px] [scrollbar-width:none]">
            {SECULAR_MODULES.map((m) => (
              <Link
                key={m.slug}
                href={m.href}
                className="group relative flex-none w-[172px] h-[196px] rounded-[20px] overflow-hidden p-4 flex flex-col bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/40 transition-all"
              >
                <span className={`absolute inset-0 bg-gradient-to-br ${m.glow} to-transparent opacity-70`} aria-hidden />
                <span className="relative w-11 h-11 rounded-2xl grid place-items-center bg-white/[0.08] border border-btf-gold/25">
                  <ModuleIcon slug={m.slug} />
                </span>
                <span className="relative mt-auto font-serif text-[19px] leading-tight">{m.title}</span>
                <span className="relative text-[12px] text-[#9fb6c8] mt-1 leading-snug">{m.blurb}</span>
                <span
                  className={
                    "relative text-[10px] uppercase tracking-[0.16em] mt-2 " +
                    (m.status === "available" ? "text-btf-gold-light" : "text-[#8aa0b0]")
                  }
                >
                  {STATUS_LABEL[m.status]}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Collections — live curated bundles per state */}
      <section className="mt-8">
        <div className="flex items-baseline justify-between mb-3.5 px-0.5">
          <h2 className="font-serif font-medium text-xl">For where you are</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-[18px] px-[18px] [scrollbar-width:none]">
          {COLLECTIONS.map((c) => (
            <Link
              key={c.slug}
              href={`/explore/collections/${c.slug}`}
              className="relative flex-none w-[158px] h-[108px] p-3.5 rounded-[18px] overflow-hidden flex flex-col justify-end bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/40 transition-colors"
            >
              <span className="absolute inset-0 bg-gradient-to-br from-btf-sky/40 to-btf-deep-night/20" aria-hidden />
              <span className="relative font-serif text-[17px]">{c.title}</span>
              <span className="relative text-[11px] text-[#cddcea] mt-0.5">{c.tagline}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Walk together — community novena + intentions wall */}
      {!secular && (() => {
        const devotion = currentMonthlyDevotion();
        return (
          <section className="mt-8">
            <div className="flex items-baseline justify-between mb-3.5 px-0.5">
              <h2 className="font-serif font-medium text-xl">Walk together</h2>
              <Link href="/catholic-path/together" className="text-xs text-btf-gold-light">Open</Link>
            </div>
            <Link
              href="/catholic-path/together"
              className="block rounded-[20px] p-[18px] border border-btf-gold/25 bg-gradient-to-br from-btf-sky-deep/75 to-btf-deep-night/70 hover:border-btf-gold/45 transition-colors"
            >
              <div className="font-cinzel text-[10px] tracking-[0.18em] uppercase text-btf-gold-light">
                {devotion.monthLabel}
              </div>
              <h3 className="font-serif font-medium text-[22px] mt-2 mb-1.5">{devotion.title}</h3>
              <p className="text-[13px] text-[#d4e3f0] mb-1 leading-snug">
                This month&rsquo;s devotion, together — pray, learn His Word, and lift up one
                another&rsquo;s intentions. Join anytime, at your own pace.
              </p>
            </Link>
          </section>
        );
      })()}

      {/* Learn together — the secular mirror of Walk together: this month's
          topic taught by 1-2 philosophers, a week at a time, with quizzes
          and the shared month board. */}
      {secular && (() => {
        const wisdom = currentMonthlyWisdom();
        return (
          <section className="mt-8">
            <div className="flex items-baseline justify-between mb-3.5 px-0.5">
              <h2 className="font-serif font-medium text-xl">Learn together</h2>
              <Link href="/wisdom/together" className="text-xs text-btf-gold-light">Open</Link>
            </div>
            <Link
              href="/wisdom/together"
              className="block rounded-[20px] p-[18px] border border-btf-gold/25 bg-gradient-to-br from-btf-sky-deep/75 to-btf-deep-night/70 hover:border-btf-gold/45 transition-colors"
            >
              <div className="font-cinzel text-[10px] tracking-[0.18em] uppercase text-btf-gold-light">
                {wisdom.monthLabel}
              </div>
              <h3 className="font-serif font-medium text-[22px] mt-2 mb-1.5">{wisdom.topic}</h3>
              <p className="text-[13px] text-[#d4e3f0] mb-1 leading-snug">
                This month&rsquo;s topic with {wisdom.philosophers.join(" and ")} — a week at a
                time, learning to steady the mind, the body, and what you give your attention
                to. Short readings, a quiz, and the month&rsquo;s board. Join anytime, at your
                own pace.
              </p>
            </Link>
          </section>
        );
      })()}

      {/* Community novena — pray the month's novena alongside others */}
      {community && communityEnroll && (
        <section className="mt-4">
          <div className="rounded-[20px] p-[18px] border border-btf-gold/25 bg-gradient-to-br from-btf-sky-deep/60 to-btf-deep-night/60">
            <div className="font-cinzel text-[10px] tracking-[0.18em] uppercase text-btf-gold-light">
              Pray together this month
            </div>
            <h3 className="font-serif font-medium text-[20px] mt-2 mb-1.5">{community.novena.title}</h3>
            <p className="text-[13px] text-[#d4e3f0] mb-3.5 leading-snug">{community.feature.blurb}</p>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="text-[12px] text-[#cfe0ee]">
                {communityEnroll.count > 0
                  ? `${communityEnroll.count.toLocaleString()} walking this with you`
                  : "Be the first to begin — others will join you"}
              </span>
              <CommunityJoin
                itemId={community.novena.id}
                href={`/catholic-path/novenas/${community.novena.id}`}
                joined={communityEnroll.joined}
              />
            </div>
          </div>
        </section>
      )}

      <p className="mt-7 mb-2 text-center text-[11px] text-[#8aa0b0] leading-relaxed">
        Explore is being built out. Reflections, audio, and collections are on the
        roadmap.
      </p>
    </main>
  );
}

function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9fb6c8" strokeWidth={1.8} strokeLinecap="round">
      <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ModuleIcon({ slug }: { slug: string }) {
  const common = {
    width: 21, height: 21, viewBox: "0 0 24 24", fill: "none",
    stroke: "#e8cc7a", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
  };
  switch (slug) {
    case "rosary":
      return <svg {...common}><circle cx="12" cy="8" r="5" /><path d="M12 13v4M10.3 15.3h3.4" /></svg>;
    case "scripture":
      return <svg {...common}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
    case "novenas":
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
    case "intentions":
      return <svg {...common}><path d="M12 3v4M12 3 9 6M12 3l3 3" /><path d="M5 21v-4a7 7 0 0 1 14 0v4z" /></svg>;
    case "parishes":
      return <svg {...common}><path d="M12 2v6M9 8h6" /><path d="M5 22V11l7-4 7 4v11z" /><path d="M10 22v-5h4v5" /></svg>;
    case "liturgy-of-hours":
      return <svg {...common}><path d="M12 3a5 5 0 0 0-5 5v4l-2 3h14l-2-3V8a5 5 0 0 0-5-5z" /><path d="M9 19a3 3 0 0 0 6 0" /></svg>;
    // ── Secular rail ──
    case "breathing":
      return <svg {...common}><path d="M3 8h9a3 3 0 1 0-3-3" /><path d="M3 12h13a3 3 0 1 1-3 3" /><path d="M3 16h6" /></svg>;
    case "urge":
      return <svg {...common}><path d="M2 14c2-3 4-3 6 0s4 3 6 0 4-3 6 0" /><path d="M2 19c2-3 4-3 6 0s4 3 6 0 4-3 6 0" /></svg>;
    case "thought":
      return <svg {...common}><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-4 10.5c.7.6 1 1.5 1 2.5h6c0-1 .3-1.9 1-2.5A6 6 0 0 0 12 3z" /></svg>;
    case "reflections":
      return <svg {...common}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>;
    case "wisdom":
      return <svg {...common}><path d="M2 6s2-2 5-2 5 2 5 2v14s-2-2-5-2-5 2-5 2z" /><path d="M22 6s-2-2-5-2-5 2-5 2v14s2-2 5-2 5 2 5 2z" /></svg>;
    case "support":
      return <svg {...common}><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></svg>;
    case "learn":
      return <svg {...common}><path d="M22 10 12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" /></svg>;
    default: // videos
      return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M10 9l5 3-5 3z" /></svg>;
  }
}
