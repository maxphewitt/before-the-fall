import Link from "next/link";
import { getCurrentUserId } from "../../../lib/session";
import OnboardingRequired from "../../../components/OnboardingRequired";
import ParishFinder from "./ParishFinder";

/**
 * /catholic-path/parishes — the Parish Finder (replaced the stub
 * 2026-07-21). Search the national directory by current location or ZIP;
 * the user's location is used once to sort and never stored (see
 * app/actions/parishes.ts). Directory data lives in the `parishes` table
 * (scripts/task-50-parishes.sql) and grows during beta.
 */
export const dynamic = "force-dynamic";

export default async function ParishesPage() {
  const userId = await getCurrentUserId();
  if (!userId) return <OnboardingRequired returnTo="/catholic-path/parishes" />;

  return (
    <main className="mx-auto w-full max-w-[480px] md:max-w-[600px] px-[18px]">
      <header className="pt-8 pb-5">
        <Link
          href="/catholic-path"
          className="text-white/60 hover:text-white text-xs tracking-[0.25em] uppercase font-medium"
        >
          ← Catholic Path
        </Link>
        <h1 className="font-serif font-medium text-[28px] mt-4">Parish Finder</h1>
        <p className="text-[13px] text-[#9fb6c8] mt-1 leading-snug">
          Find a Catholic parish near you — when it&rsquo;s time to be in a real
          building with real people.
        </p>
      </header>

      <ParishFinder />

      <p className="mt-7 mb-2 text-center text-[11px] text-[#8aa0b0] leading-relaxed">
        The directory is growing during beta. Mass and confession times are
        listed when a parish has published them — the parish website always has
        the latest. Includes data &copy; OpenStreetMap contributors.
      </p>
    </main>
  );
}
