import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "../../lib/session";
import { getTodaySummary, getJourney } from "../../actions/habits";
import { getCurrentUserFaithRole } from "../../lib/profile";
import { signOutUser } from "../../actions/userSession";

/**
 * /you — the personal tab (redesign 2026-06-28).
 *
 * This is where streak detail and settings live, deliberately OFF the
 * home page (Hallow quarantines streaks to "Me"; calmer for a
 * mental-health context). PHASE 1: real stat tiles (streak, days-with-you,
 * best run) + a real path display + functional Sign out and crisis link.
 * The settings controls (hide-streak toggle, reminder times, weekly goal,
 * account name) are scaffolded and land in the next slice — they need a
 * profile/schedule write path, so they're shown as upcoming rather than
 * as fake toggles.
 */
export const dynamic = "force-dynamic";

export default async function YouPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/return");

  const [summaryRes, journeyRes, faithRole] = await Promise.all([
    getTodaySummary(),
    getJourney(90),
    getCurrentUserFaithRole(),
  ]);
  const summary = summaryRes.success ? summaryRes.data : null;
  const journey = journeyRes.success ? journeyRes.data : [];
  const daysWithYou = journey.filter((d) => d.completions > 0).length;
  const pathLabel =
    faithRole === "secular" ? "Secular" : faithRole ? "Faith path" : "Not set";

  return (
    <main className="mx-auto w-full max-w-[480px] md:max-w-[600px] px-[18px]">
      {/* Profile header */}
      <div className="flex items-center gap-3.5 pt-7 pb-4 px-0.5">
        <div className="flex-none w-[62px] h-[62px] rounded-full grid place-items-center bg-gradient-to-br from-btf-sky-light to-btf-gold-light text-btf-deep-night font-serif text-[26px] font-semibold">
          <GoldCross className="w-5 h-6" />
        </div>
        <div>
          <div className="font-serif text-[26px] font-medium leading-tight">You</div>
          <div className="text-xs text-[#8aa0b0] mt-1 flex items-center gap-1.5">
            <span className="text-[11px] text-btf-gold-light bg-btf-gold/[0.14] border border-btf-gold/35 px-2.5 py-0.5 rounded-full">
              {pathLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-3 gap-2.5">
        <Tile n={summary?.currentStreak ?? 0} l="day streak" />
        <Tile n={daysWithYou} l="days with you" />
        <Tile n={summary?.longestStreak ?? 0} l="best run" />
      </div>

      {/* Settings (scaffold) */}
      <section className="mt-7">
        <div className="flex items-baseline justify-between mb-3 px-0.5">
          <h2 className="font-serif font-medium text-xl">Settings</h2>
        </div>
        <div className="rounded-[18px] bg-white/[0.045] border border-white/[0.09] divide-y divide-white/[0.07]">
          <Row
            icon={<GoldCross className="w-[17px] h-5" />}
            title="Show streaks"
            sub="Hide the counter if it adds pressure — coming soon"
          />
          <Row
            icon={<BellIcon />}
            title="Reminder times"
            sub="Gentle nudges for your daily habits — coming soon"
          />
          <Row
            icon={<PathIcon />}
            title="Path"
            sub={pathLabel}
          />
        </div>
      </section>

      {/* Crisis */}
      <div className="mt-5 rounded-[16px] p-4 flex items-center gap-3 bg-[rgba(201,80,80,0.10)] border border-[rgba(201,80,80,0.3)]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8b3b3" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
        </svg>
        <div className="text-[13px]">
          Need help right now?
          <span className="block text-[#cdb3b3] text-[11px] mt-0.5">
            Crisis resources are always one tap away.
          </span>
        </div>
        <Link href="/tools" className="ml-auto bg-[#d98a8a] text-[#2a0808] font-semibold rounded-[11px] px-3.5 py-2 text-xs">
          Get help
        </Link>
      </div>

      {/* Sign out (functional) */}
      <form action={signOutUser} className="mt-[18px]">
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2.5 rounded-[14px] py-3.5 border border-white/14 text-[#cfe0ee] text-sm"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" />
          </svg>
          Sign out
        </button>
      </form>

      <p className="text-center text-[11px] text-[#8aa0b0] mt-4 mb-2 leading-relaxed">
        Before the Fall is in beta. Nothing here is a substitute for professional care.
        <br />Support, not treatment.
      </p>
    </main>
  );
}

function Tile({ n, l }: { n: number; l: string }) {
  return (
    <div className="rounded-[16px] py-4 px-3 text-center bg-white/[0.055] border border-white/[0.09]">
      <div className="font-serif text-[28px] font-medium text-btf-gold-light leading-none">{n}</div>
      <div className="text-[11px] text-[#8aa0b0] mt-1.5">{l}</div>
    </div>
  );
}

function Row({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-3.5 px-4 py-3.5">
      <span className="flex-none w-[34px] h-[34px] rounded-[10px] grid place-items-center bg-white/[0.06] border border-white/10">
        {icon}
      </span>
      <span>
        <span className="block text-sm">{title}</span>
        <span className="block text-[11px] text-[#8aa0b0] mt-0.5">{sub}</span>
      </span>
    </div>
  );
}

function GoldCross({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 13 16" fill="none" aria-hidden>
      <path d="M5.2 1.4h2.6v4.2H12v2.6H7.8V15H5.2V8.2H1V5.6h4.2V1.4z" fill="#e8cc7a" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#cfe0ee" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}
function PathIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#cfe0ee" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" /><path d="M5 8h14M5 16h14" />
    </svg>
  );
}
