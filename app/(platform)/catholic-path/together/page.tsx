import Link from "next/link";
import BackLink from "../../_nav/BackLink";
import { getCurrentUserId } from "../../../lib/session";
import { CHALLENGES, challengeAvailable } from "../../../lib/community";
import { getNovenaById } from "../../../lib/novenas";
import { getEnrollment, listCommunityIntentions } from "../../../actions/community";
import { currentMonthlyDevotion, periodKey } from "../../../lib/monthlyDevotions";
import { getLeaderboard } from "../../../actions/quiz";
import OnboardingRequired from "../../../components/OnboardingRequired";
import CommunityJoin from "./CommunityJoin";
import IntentionsWall from "./IntentionsWall";

/**
 * /catholic-path/together — Walk Together.
 *
 * Community novena (seasonal), the anonymous intentions wall, and seasonal
 * challenges. Communal social proof only ("N walking with you") — never a
 * leaderboard.
 */
export const dynamic = "force-dynamic";

export default async function TogetherPage() {
  const userId = await getCurrentUserId();
  if (!userId) return <OnboardingRequired returnTo="/catholic-path/together" />;

  const devotion = currentMonthlyDevotion();
  const period = periodKey();

  const [intentionsRes, leaderboard] = await Promise.all([
    listCommunityIntentions(),
    getLeaderboard(period),
  ]);
  const challengeEnrolls = await Promise.all(CHALLENGES.map((c) => getEnrollment(c.id)));

  const intentions = intentionsRes.success ? intentionsRes.data : [];
  const challenges = CHALLENGES.map((c, i) => ({
    ...c,
    enroll: challengeEnrolls[i],
    available: challengeAvailable(c),
  }));

  return (
    <main className="min-h-screen">
      <section className="relative bg-gradient-to-b from-btf-sky-deep via-btf-sky-deep to-btf-sky text-white py-14 px-6 overflow-hidden">
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-btf-gold/25 blur-3xl pointer-events-none" aria-hidden />
        <div className="relative max-w-3xl mx-auto text-center">
          <BackLink fallbackHref="/catholic-path" label="Catholic Path" className="text-white/60 hover:text-white text-xs mb-8 inline-flex items-center gap-2 transition-colors uppercase tracking-[0.25em]" />
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3 mt-4">Walk Together</p>
          <h1 className="font-serif text-4xl md:text-5xl font-light leading-[1.15] mb-5">You are not praying alone.</h1>
          <p className="font-serif italic text-lg md:text-xl text-white/85 font-light mb-2 max-w-xl mx-auto text-balance">
            Pray the same novena as others across the app, and lift up one another&rsquo;s intentions.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6 py-10 sm:py-14 space-y-12">
        {/* Devotion of the month — teaching (His Word) + prayer + quiz */}
        <section>
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">Devotion of the month</p>
          <div className="font-cinzel text-[11px] tracking-[0.16em] uppercase text-btf-gold-light mb-2">{devotion.monthLabel}</div>
          <h2 className="font-serif text-2xl text-[#e9f1f8] font-light mb-4">{devotion.title}</h2>

          {/* His Word */}
          <div className="rounded-2xl bg-white/[0.055] border border-white/[0.09] p-5 mb-4">
            <p className="text-[10px] tracking-[0.2em] uppercase text-btf-gold font-semibold mb-2">His Word</p>
            <p className="font-serif italic text-lg text-white/90 leading-relaxed mb-2">
              &ldquo;{devotion.scriptureText}&rdquo;
            </p>
            <p className="text-[11px] text-[#9fb6c8] mb-4">{devotion.scriptureRef}</p>
            <p className="text-sm text-white/80 font-light leading-relaxed">{devotion.teaching}</p>
          </div>

          {/* Prayer */}
          <div className="rounded-2xl bg-white/[0.055] border border-btf-gold/25 p-5 mb-6">
            <p className="text-[10px] tracking-[0.2em] uppercase text-btf-gold font-semibold mb-2">{devotion.prayerLabel}</p>
            <p className="font-serif italic text-[17px] text-btf-gold-light leading-relaxed">{devotion.prayer}</p>
          </div>

          {/* Begin the learning module */}
          <Link
            href="/catholic-path/together/learn"
            className="block w-full text-center rounded-full py-3.5 px-6 font-bold text-[#2a2008] bg-gradient-to-b from-btf-gold-light to-btf-gold hover:-translate-y-0.5 transition-transform"
          >
            Begin this month&rsquo;s teaching
          </Link>
          <p className="text-[12px] text-[#9fb6c8] text-center mt-2">
            A guided deep-dive, session by session, with a short daily quiz.
          </p>

          {/* Leaderboard — time on the journey this month (quiz scores at month's end) */}
          <div className="rounded-2xl bg-white/[0.045] border border-white/[0.09] p-4 mt-6">
            <p className="text-[11px] tracking-[0.2em] uppercase text-btf-gold font-semibold mb-1">
              {leaderboard.mode === "time" ? "Time on the journey this month" : "End-of-month quiz leaderboard"}
            </p>
            <p className="text-[11px] text-[#8aa0b0] mb-3">
              {leaderboard.mode === "time"
                ? "Ranked by minutes walking the journey — quiz standings are revealed at month's end."
                : "Final standings by quiz score."}
            </p>
            {leaderboard.entries.length === 0 ? (
              <p className="text-sm text-white/70 font-light">Be the first on the board this month — begin the teaching above.</p>
            ) : (
              <ul className="space-y-2">
                {leaderboard.entries.map((e, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <span className="w-5 text-[#9fb6c8] tabular-nums">{i + 1}</span>
                    <span className={"flex-1 " + (e.you ? "font-semibold text-btf-gold-light" : "text-white/90")}>
                      {e.name}
                      {e.you && <span className="ml-2 text-[10px] uppercase tracking-[0.14em] text-btf-gold-light">you</span>}
                    </span>
                    <span className="text-white/70 tabular-nums">{e.value} {leaderboard.unit}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Intentions wall */}
        <section>
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">Intentions wall</p>
          <h2 className="font-serif text-2xl text-[#e9f1f8] font-light mb-4">Carry one another&rsquo;s burdens.</h2>
          <IntentionsWall initial={intentions} />
        </section>

        {/* Seasonal challenges */}
        <section>
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">Seasonal challenges</p>
          <ul className="space-y-3">
            {challenges.map((c) => (
              <li key={c.id} className="rounded-2xl bg-white/[0.055] border border-white/[0.09] p-5">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h3 className="font-serif text-lg text-[#e9f1f8] font-light">{c.title}</h3>
                  <span className="flex-shrink-0 text-[10px] uppercase tracking-[0.2em] font-semibold px-2.5 py-1 rounded-full bg-white/[0.08] text-[#9fb6c8]">
                    {c.available ? (c.enroll.count > 0 ? `${c.enroll.count} joined` : "Open") : c.seasonLabel}
                  </span>
                </div>
                <p className="text-sm text-white/70 font-light leading-relaxed mb-4">{c.summary}</p>
                <CommunityJoin
                  itemId={c.id}
                  href={`/catholic-path/novenas/${getNovenaById(c.novenaId)?.id ?? "surrender"}`}
                  joined={c.enroll.joined}
                  disabled={!c.available}
                />
              </li>
            ))}
          </ul>
        </section>

        <p className="text-xs text-[#9fb6c8] font-light text-center leading-relaxed">
          Walk Together is communal, never a competition. We only ever show how many are praying — never who.
        </p>
      </div>
    </main>
  );
}
