import Link from "next/link";
import { getCurrentUserId } from "../../lib/session";
import OnboardingRequired from "../../components/OnboardingRequired";

// Onboarding gate + activity tracking both require request context.
export const dynamic = "force-dynamic";

/**
 * /catholic-path — landing page for the Tier 5 faith layer.
 *
 * Six modules per the locked design ([[Catholic Path — Faith Layer Details]]).
 * Status badges signal which are live, pending content, or pending production.
 * Visible to anyone who can route to it; the home-page nav gates on faith_role.
 *
 * All content is DRAFT v1, pending Father Murphy review before public launch.
 */

type ModuleStatus = "available" | "pending-content" | "pending-production";

type Module = {
  slug: string;
  title: string;
  description: string;
  status: ModuleStatus;
  // Some modules link off /catholic-path entirely (e.g. intentions → /journal).
  href: string;
};

const MODULES: Module[] = [
  {
    slug: "start-here",
    title: "Start Here",
    description:
      "The front-door orientation: why this app exists, what prayer actually is, why Catholics ask the saints and Mary to pray, how to guard your heart without fear, and how every tool here fits together. Nine short sessions — revisit any of them whenever.",
    status: "available",
    href: "/start-here",
  },
  {
    slug: "prayers",
    title: "Prayer Library",
    description:
      "Thirty-plus prayers the Church has reached for, searchable by what you're carrying. Memorare, St. Michael, Anima Christi, Divine Mercy, prayers for grief and anxiety and discernment, prayers for the dying, prayers for the seasons. Each one cites its source.",
    status: "available",
    href: "/catholic-path/prayers",
  },
  {
    slug: "scripture",
    title: "Daily Scripture",
    description:
      "Twenty curated passages from the Douay-Rheims Catholic translation (public domain), browseable by what you're carrying — comfort, mercy, trust, suffering, hope. Verse-by-verse walker with optional reflection journaling. NABRE and RSV-2CE coming once licensed.",
    status: "available",
    href: "/catholic-path/scripture",
  },
  {
    slug: "liturgy-of-hours",
    title: "Liturgy of the Hours",
    description:
      "Five hours a day to hand things back to God — psalms, a canticle, a short reading — built from the public-domain Douay-Rheims. A link to the full official text is there too, for anyone who wants it.",
    status: "available",
    href: "/catholic-path/liturgy-of-the-hours",
  },
  {
    slug: "bible",
    title: "The Bible",
    description:
      "The whole of Scripture in the Douay-Rheims Catholic translation, book by book and chapter by chapter. When the curated passages aren't enough and you want to sit inside the full text itself.",
    status: "available",
    href: "/catholic-path/bible/read",
  },
  {
    slug: "rosary",
    title: "Rosary",
    description:
      "Walkthroughs of all four mysteries — Joyful, Sorrowful, Glorious, Luminous — with the prayers, the scripture, and the rhythm. Pray along, or use it as a script.",
    status: "available",
    href: "/catholic-path/rosary",
  },
  {
    slug: "novenas",
    title: "Novenas",
    description:
      "Nine-day prayer journeys to surrender a problem to God, ask for mercy, or pray through a struggle — the Surrender Novena, Divine Mercy, St. Jude, St. Dymphna, and more. Bring one intention and stay with it for nine days.",
    status: "available",
    href: "/catholic-path/novenas",
  },
  {
    slug: "together",
    title: "Walk Together",
    description:
      "Pray this month's community novena alongside others across the app, lift up one another's intentions on a shared wall, and join seasonal challenges. Communal, never a competition — you are never praying alone.",
    status: "available",
    href: "/catholic-path/together",
  },
  {
    slug: "parishes",
    title: "Parish Finder",
    description:
      "Find Catholic parishes near you with addresses, Mass times, confession schedules, websites, and pastor contact. Useful when it's time to be in a real building with a real priest.",
    status: "pending-content",
    href: "/catholic-path/parishes",
  },
  {
    slug: "videos",
    title: "Weekly Teaching Videos",
    description:
      "Short videos from priests and Catholic clinicians, on what scripture and the Magisterium have to say about the kinds of struggles people bring here.",
    status: "pending-production",
    href: "/catholic-path/videos",
  },
  {
    slug: "intentions",
    title: "Prayer Intentions",
    description:
      "Use your encrypted journal to write out what you're carrying to God this week. Same private space as your other entries — just dedicated to intention.",
    status: "available",
    href: "/catholic-path/intentions",
  },
];

const STATUS_LABEL: Record<ModuleStatus, string> = {
  available: "Available now",
  "pending-content": "Coming soon",
  "pending-production": "In production",
};

const STATUS_BADGE_STYLES: Record<ModuleStatus, string> = {
  available: "bg-btf-gold text-btf-sky-deep",
  "pending-content": "bg-white/[0.08] text-[#9fb6c8]",
  "pending-production": "bg-white/[0.08] text-[#9fb6c8]",
};

export default async function CatholicPathLanding() {
  const userId = await getCurrentUserId(); // also bumps activity as a side effect
  if (!userId) return <OnboardingRequired returnTo="/catholic-path" />;

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-btf-sky-deep via-btf-sky-deep to-btf-sky text-white py-16 px-6 overflow-hidden">
        {/* Gold glow */}
        <div
          className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-btf-gold/25 blur-3xl pointer-events-none"
          aria-hidden
        />

        <div className="relative max-w-3xl mx-auto text-center">
          {/* Cross */}
          <div className="relative w-14 h-14 mx-auto mb-8 mt-2" aria-hidden>
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-2 h-14 bg-btf-gold rounded-sm" />
            <div className="absolute left-1/2 top-4 -translate-x-1/2 w-10 h-2 bg-btf-gold rounded-sm" />
          </div>

          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3">
            The Faith-Based Pathway
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light leading-[1.15] mb-5">
            Catholic Path
          </h1>
          <p className="font-serif italic text-lg md:text-xl text-white/85 font-light mb-2 max-w-xl mx-auto text-balance">
            A daily walk in scripture and Catholic teaching, alongside whichever tier you&rsquo;re in.
          </p>
        </div>
      </section>

      {/* Modules */}
      <section className="py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-[11px] tracking-[0.25em] text-btf-gold uppercase font-medium mb-3">
            {MODULES.length} modules
          </p>
          <h2 className="text-center font-serif text-3xl text-[#e9f1f8] font-light mb-10">
            Everything in one place.
          </h2>

          <ul className="grid sm:grid-cols-2 gap-4">
            {MODULES.map((m) => (
              <li key={m.slug}>
                <Link
                  href={m.href}
                  className="group h-full block rounded-2xl bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/40 hover:bg-white/[0.08] hover:-translate-y-0.5 transition-all p-6 flex flex-col"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-serif text-xl text-[#e9f1f8] font-light">
                      {m.title}
                    </h3>
                    <span
                      className={`flex-shrink-0 text-[10px] uppercase tracking-[0.2em] font-medium px-2.5 py-1 rounded-full ${STATUS_BADGE_STYLES[m.status]}`}
                    >
                      {STATUS_LABEL[m.status]}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 font-light leading-relaxed flex-1">
                    {m.description}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-btf-gold font-semibold mt-4 group-hover:translate-x-1 transition-transform">
                    {m.status === "available" ? "Open →" : "Preview →"}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          {/* DRAFT v1 banner */}
          <div className="rounded-xl bg-white/[0.04] border border-btf-gold/25 text-white/70 text-xs font-light p-4 mt-10 leading-relaxed">
            <span className="font-medium text-[#e9f1f8]">
              Draft v1 &middot; closed beta:
            </span>{" "}
            faith-layer content is pending Father Murphy&rsquo;s review before public launch. The Catholic Path never replaces a priest or a confessor &mdash; if anything you&rsquo;re carrying belongs in confession, take it there.
          </div>
        </div>
      </section>
    </main>
  );
}
