import Link from "next/link";
import BackLink from "../_nav/BackLink";
import { getCurrentUserId } from "../../lib/session";
import { getCurrentUserFaithRole } from "../../lib/profile";
import OnboardingRequired from "../../components/OnboardingRequired";
import { listFastingSeasons } from "../../actions/fastingSeasons";
import {
  LITURGICAL_TEMPLATES,
  SECULAR_PRESETS,
  CUSTOM_TEMPLATE,
  upcomingLiturgicalSeasons,
  todayISOFrom,
} from "../../lib/fastingSeasons";
import SeasonCard from "./SeasonCard";

/**
 * /seasons — the fasting / discipline season tracker (task-55).
 * Catholic path: Lent, St. Michael's Lent, Advent + custom seasons of
 * fasting and penance. Secular path: discipline challenges (75-day,
 * 30-day, custom) — same machinery, zero religious framing.
 */
export const dynamic = "force-dynamic";

export default async function SeasonsPage() {
  const userId = await getCurrentUserId();
  if (!userId) return <OnboardingRequired returnTo="/seasons" />;

  const [faithRole, seasonsRes] = await Promise.all([
    getCurrentUserFaithRole(),
    listFastingSeasons(),
  ]);
  const secular = faithRole === "secular";
  const seasons = seasonsRes.success ? seasonsRes.data : [];
  const todayISO = todayISOFrom(new Date());
  const upcoming = secular
    ? []
    : upcomingLiturgicalSeasons(todayISO, 45).filter(
        (u) => !seasons.some((s) => s.kind === u.kind && s.endDate >= u.start)
      );

  return (
    <main className="min-h-screen">
      <section className="relative bg-gradient-to-b from-btf-sky-deep via-btf-sky-deep to-btf-sky text-white py-14 px-6 overflow-hidden">
        <div
          className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-btf-gold/25 blur-3xl pointer-events-none"
          aria-hidden
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <BackLink
            fallbackHref="/home"
            label="Home"
            className="text-white/60 hover:text-white text-xs mb-8 inline-flex items-center gap-2 transition-colors uppercase tracking-[0.25em]"
          />
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3 mt-4">
            Seasons
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light leading-[1.15] mb-5">
            {secular ? "Hold one hard line." : "Offer something that costs you."}
          </h1>
          <p className="font-serif italic text-lg md:text-xl text-white/85 font-light mb-2 max-w-xl mx-auto text-balance">
            {secular
              ? "Pick a discipline, name what you're setting down, and walk it day by day. A stumble is marked and the season keeps going — nothing resets."
              : "Fasting and penance, walked day by day — the Church's seasons or one of your own. A stumble is marked and the season keeps going — nothing resets."}
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6 py-10 sm:py-14 space-y-10">
        {seasons.length > 0 && (
          <section>
            <h2 className="font-serif font-medium text-xl mb-3.5">Your seasons</h2>
            <div className="space-y-3">
              {seasons.map((s) => (
                <SeasonCard key={s.id} season={s} todayISO={todayISO} />
              ))}
            </div>
          </section>
        )}

        {!secular && upcoming.length > 0 && (
          <section>
            <h2 className="font-serif font-medium text-xl mb-3.5">On the Church&rsquo;s calendar</h2>
            <div className="space-y-3">
              {upcoming.map((u) => (
                <Link
                  key={u.kind}
                  href={`/seasons/new?kind=${u.kind}`}
                  className="block rounded-[20px] p-[18px] border border-btf-gold/30 bg-[radial-gradient(120%_120%_at_80%_0%,rgba(201,168,76,0.18),transparent_55%),linear-gradient(160deg,rgba(26,111,168,0.4),rgba(10,26,42,0.7))] hover:border-btf-gold/50 transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-serif text-[19px] leading-tight">{u.label}</p>
                    <p className="text-[12px] text-btf-gold-light">
                      {u.daysUntil > 1
                        ? `begins in ${u.daysUntil} days`
                        : u.daysUntil === 1
                          ? "begins tomorrow"
                          : u.daysUntil === 0
                            ? "begins today"
                            : "underway — join now"}
                    </p>
                  </div>
                  <p className="text-[13px] text-[#cddcea] font-light leading-relaxed mt-1.5">
                    {u.blurb}
                  </p>
                  <p className="text-[12px] text-btf-gold-light mt-2.5">
                    Discern what you&rsquo;ll offer &rarr;
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="font-serif font-medium text-xl mb-3.5">
            {secular ? "Start a challenge" : "Start a season"}
          </h2>
          <div className="space-y-3">
            {secular &&
              SECULAR_PRESETS.map((p) => (
                <Link
                  key={p.label}
                  href={`/seasons/new?days=${p.days}&preset=${encodeURIComponent(p.label)}`}
                  className="block rounded-2xl bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/40 px-5 py-4 transition-all"
                >
                  <span className="block font-serif text-lg text-[#e9f1f8]">{p.label}</span>
                  <span className="block text-[13px] text-[#9fb6c8] font-light mt-0.5">{p.blurb}</span>
                </Link>
              ))}
            {!secular &&
              LITURGICAL_TEMPLATES.map((t) => (
                <Link
                  key={t.kind}
                  href={`/seasons/new?kind=${t.kind}`}
                  className="block rounded-2xl bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/40 px-5 py-4 transition-all"
                >
                  <span className="block font-serif text-lg text-[#e9f1f8]">{t.label}</span>
                  <span className="block text-[13px] text-[#9fb6c8] font-light mt-0.5">{t.blurb}</span>
                </Link>
              ))}
            <Link
              href="/seasons/new?kind=custom"
              className="block rounded-2xl bg-white/[0.055] border border-btf-gold/25 hover:border-btf-gold/50 px-5 py-4 transition-all"
            >
              <span className="block font-serif text-lg text-[#e9f1f8]">{CUSTOM_TEMPLATE.label}</span>
              <span className="block text-[13px] text-[#9fb6c8] font-light mt-0.5">
                {secular
                  ? "Any length from a day to a year. Name the line, hold the line."
                  : CUSTOM_TEMPLATE.blurb}
              </span>
            </Link>
          </div>
        </section>

        <div className="rounded-xl bg-white/[0.04] border border-btf-gold/25 text-white/70 text-xs font-light p-4 leading-relaxed">
          <span className="font-medium text-[#e9f1f8]">How this counts:</span>{" "}
          one honest tap a day &mdash; kept, or stumbled. A stumbled day is marked and the season
          keeps going; nothing here ever resets your journey. What you write about your season is
          encrypted, like your journal.
        </div>
      </div>
    </main>
  );
}
