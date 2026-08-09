import Link from "next/link";
import BackLink from "../_nav/BackLink";
import { getCurrentUserId } from "../../lib/session";
import { getCurrentUserFaithRole } from "../../lib/profile";
import OnboardingRequired from "../../components/OnboardingRequired";
import { listStartHereCompletions } from "../../actions/startHere";
import {
  CATHOLIC_START_HERE,
  SECULAR_START_HERE,
  startHereTrackForRole,
} from "../../lib/startHere";

/**
 * /start-here — the front-door orientation module, one track per path
 * (same name on both, Max's call). Session list with sequential unlock:
 * session n opens when n = 1 or n-1 is completed. Never a gate — the
 * rest of the app stays fully reachable whether or not this is touched.
 */
export const dynamic = "force-dynamic";

export default async function StartHereLanding() {
  const userId = await getCurrentUserId();
  if (!userId) return <OnboardingRequired returnTo="/start-here" />;

  // Role + completions in parallel — track filtering happens in-process
  // (perf plan #6: no serial round trips).
  const [faithRole, completedRes] = await Promise.all([
    getCurrentUserFaithRole(),
    listStartHereCompletions(),
  ]);
  const track = startHereTrackForRole(faithRole);
  const sessions =
    track === "catholic"
      ? CATHOLIC_START_HERE.map((s) => ({ n: s.n, title: s.title }))
      : SECULAR_START_HERE.map((s) => ({ n: s.n, title: s.title }));

  const completed = new Set(
    completedRes.success
      ? completedRes.data.filter((r) => r.track === track).map((r) => r.sessionN)
      : []
  );
  const allDone = sessions.every((s) => completed.has(s.n));

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
            Start Here
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light leading-[1.15] mb-5">
            {allDone ? "Welcome back to the beginning." : "Before anything else."}
          </h1>
          <p className="font-serif italic text-lg md:text-xl text-white/85 font-light mb-2 max-w-xl mx-auto text-balance">
            {track === "catholic"
              ? "Why this app exists, what prayer actually is, and how every tool here fits together — a short orientation, one session at a time."
              : "Why this app exists, why practice beats willpower, and how every tool here fits together — a short orientation, one session at a time."}
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6 py-10 sm:py-14">
        <ul className="space-y-2.5">
          {sessions.map((s, i) => {
            const done = completed.has(s.n);
            const unlocked = i === 0 || completed.has(sessions[i - 1].n);
            const inner = (
              <span className="flex items-center gap-3">
                <span
                  className={
                    "flex-none w-7 h-7 rounded-full grid place-items-center text-[12px] font-semibold " +
                    (done
                      ? "bg-btf-gold text-[#2a2008]"
                      : unlocked
                        ? "bg-white/[0.08] text-[#9fb6c8]"
                        : "bg-white/[0.04] text-[#5f7182]")
                  }
                >
                  {done ? (
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#2a2008"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : (
                    s.n
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={
                      "block font-serif text-lg " + (unlocked ? "text-[#e9f1f8]" : "text-[#7a8e9e]")
                    }
                  >
                    {s.title}
                  </span>
                  <span className="block text-[12px] text-[#8aa0b0] font-light">
                    {done
                      ? "Completed — tap to revisit"
                      : unlocked
                        ? "Begin"
                        : "Unlocks after the previous session"}
                  </span>
                </span>
              </span>
            );
            return (
              <li key={s.n}>
                {unlocked ? (
                  <Link
                    href={`/start-here/${s.n}`}
                    className="block rounded-2xl bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/40 hover:bg-white/[0.08] px-5 py-4 transition-all"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div className="block rounded-2xl bg-white/[0.03] border border-white/[0.05] px-5 py-4">
                    {inner}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="rounded-xl bg-white/[0.04] border border-btf-gold/25 text-white/70 text-xs font-light p-4 mt-8 leading-relaxed">
          <span className="font-medium text-[#e9f1f8]">Draft v1 &middot; closed beta:</span>{" "}
          orientation content pending review before public launch. Nothing here is locked away
          &mdash; the whole app stays open whether or not you finish this.
        </div>
      </div>
    </main>
  );
}
