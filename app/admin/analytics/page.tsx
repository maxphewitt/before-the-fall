import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdminId } from "../../lib/adminSession";
import { supabaseServer } from "../../lib/supabase";

/**
 * /admin/analytics — aggregate engagement metrics for closed beta.
 *
 * Read-only. Server component, gated by admin cookie. Designed for:
 *   - Internal product sense-checking (are testers actually returning?)
 *   - Grant reporting (Hogg, RWJF, SAMHSA all ask for these numbers)
 *
 * NO individual user content — only aggregates. Everything is computed
 * across the closed-beta cohort.
 */
export const metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Metrics = {
  totalUsers: number;
  dau: number;
  wau: number;
  mau: number;
  totalCompletions7d: number;
  totalCompletions30d: number;
  totalJournalEntries: number;
  totalActivityEntries: number;
  totalIncidents: number;
  pendingIncidents: number;
  populationBreakdown: { population: string; users: number }[];
  habitCompletionBreakdown: { habit_slug: string; total: number }[];
  perDayLast30: { date: string; activeUsers: number; completions: number }[];
  // Loved-one (CSO) referral metrics.
  csoCodesGenerated: number;
  csoCodesRedeemed: number;
  csoRedemptionRate: number;
  csoMedianTimeToRedemptionDays: number | null;
};

async function fetchMetrics(): Promise<Metrics> {
  const supabase = supabaseServer();

  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const day1 = new Date(todayStart);
  day1.setUTCDate(day1.getUTCDate() - 1);
  const day7 = new Date(todayStart);
  day7.setUTCDate(day7.getUTCDate() - 7);
  const day30 = new Date(todayStart);
  day30.setUTCDate(day30.getUTCDate() - 30);

  // Total users
  const { count: totalUsers } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true });

  // DAU/WAU/MAU based on habit_completions
  async function distinctUsersSince(since: Date): Promise<number> {
    const { data } = await supabase
      .from("habit_completions")
      .select("user_id")
      .gte("completed_at", since.toISOString());
    if (!data) return 0;
    return new Set(data.map((r) => r.user_id as string)).size;
  }
  const dau = await distinctUsersSince(todayStart);
  const wau = await distinctUsersSince(day7);
  const mau = await distinctUsersSince(day30);

  // Completion totals
  const { count: totalCompletions7d } = await supabase
    .from("habit_completions")
    .select("id", { count: "exact", head: true })
    .gte("completed_at", day7.toISOString());
  const { count: totalCompletions30d } = await supabase
    .from("habit_completions")
    .select("id", { count: "exact", head: true })
    .gte("completed_at", day30.toISOString());

  // Journal totals
  const { count: totalJournalEntries } = await supabase
    .from("journal_entries")
    .select("id", { count: "exact", head: true })
    .neq("journal_type", "activity")
    .is("deleted_at", null);
  const { count: totalActivityEntries } = await supabase
    .from("journal_entries")
    .select("id", { count: "exact", head: true })
    .eq("journal_type", "activity")
    .is("deleted_at", null);

  // Incidents
  const { count: totalIncidents } = await supabase
    .from("incidents")
    .select("id", { count: "exact", head: true });
  const { count: pendingIncidents } = await supabase
    .from("incidents")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  // Population breakdown — user_profiles.populations is text[].
  // Easier to fetch all and tally client-side at the count scale we
  // expect during closed beta (<100 users).
  const { data: profileRows } = await supabase
    .from("user_profiles")
    .select("populations");
  const popCounts = new Map<string, number>();
  for (const row of profileRows ?? []) {
    const pops = (row.populations as string[] | null) ?? [];
    for (const p of pops) {
      popCounts.set(p, (popCounts.get(p) ?? 0) + 1);
    }
  }
  const populationBreakdown = Array.from(popCounts.entries())
    .map(([population, users]) => ({ population, users }))
    .sort((a, b) => b.users - a.users);

  // Habit completion breakdown
  const { data: habitRows } = await supabase
    .from("habit_completions")
    .select("habit_slug")
    .gte("completed_at", day30.toISOString());
  const habitCounts = new Map<string, number>();
  for (const row of habitRows ?? []) {
    const s = row.habit_slug as string;
    habitCounts.set(s, (habitCounts.get(s) ?? 0) + 1);
  }
  const habitCompletionBreakdown = Array.from(habitCounts.entries())
    .map(([habit_slug, total]) => ({ habit_slug, total }))
    .sort((a, b) => b.total - a.total);

  // Per-day last 30
  const { data: last30Rows } = await supabase
    .from("habit_completions")
    .select("user_id, completed_at")
    .gte("completed_at", day30.toISOString());
  const dayBucket = new Map<
    string,
    { users: Set<string>; completions: number }
  >();
  for (const row of last30Rows ?? []) {
    const iso = (row.completed_at as string).slice(0, 10);
    const cur = dayBucket.get(iso) ?? { users: new Set(), completions: 0 };
    cur.users.add(row.user_id as string);
    cur.completions += 1;
    dayBucket.set(iso, cur);
  }
  const perDayLast30: { date: string; activeUsers: number; completions: number }[] =
    [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(todayStart);
    d.setUTCDate(d.getUTCDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const bucket = dayBucket.get(iso);
    perDayLast30.push({
      date: iso,
      activeUsers: bucket?.users.size ?? 0,
      completions: bucket?.completions ?? 0,
    });
  }

  // Loved-one (CSO) referral metrics — codes generated, redeemed,
  // redemption rate, and median time-to-redemption in days. Closed-beta
  // scale is small enough that fetching the rows and computing in JS
  // is fine.
  const { count: csoCodesGenerated } = await supabase
    .from("loved_one_intake")
    .select("id", { count: "exact", head: true });

  const { data: csoRedeemedRows } = await supabase
    .from("loved_one_intake")
    .select("created_at, redeemed_at")
    .not("redeemed_at", "is", null);

  const csoCodesRedeemed = (csoRedeemedRows ?? []).length;
  const csoRedemptionRate =
    csoCodesGenerated && csoCodesGenerated > 0
      ? csoCodesRedeemed / csoCodesGenerated
      : 0;

  let csoMedianTimeToRedemptionDays: number | null = null;
  if (csoCodesRedeemed > 0) {
    const deltas = (csoRedeemedRows ?? [])
      .map((r) => {
        const createdAt = new Date(r.created_at as string).getTime();
        const redeemedAt = new Date(r.redeemed_at as string).getTime();
        return (redeemedAt - createdAt) / (1000 * 60 * 60 * 24);
      })
      .sort((a, b) => a - b);
    const mid = Math.floor(deltas.length / 2);
    csoMedianTimeToRedemptionDays =
      deltas.length % 2 === 0
        ? (deltas[mid - 1] + deltas[mid]) / 2
        : deltas[mid];
  }

  return {
    totalUsers: totalUsers ?? 0,
    dau,
    wau,
    mau,
    totalCompletions7d: totalCompletions7d ?? 0,
    totalCompletions30d: totalCompletions30d ?? 0,
    totalJournalEntries: totalJournalEntries ?? 0,
    totalActivityEntries: totalActivityEntries ?? 0,
    totalIncidents: totalIncidents ?? 0,
    pendingIncidents: pendingIncidents ?? 0,
    populationBreakdown,
    habitCompletionBreakdown,
    perDayLast30,
    csoCodesGenerated: csoCodesGenerated ?? 0,
    csoCodesRedeemed,
    csoRedemptionRate,
    csoMedianTimeToRedemptionDays,
  };
}

export default async function AnalyticsPage() {
  const adminId = await getCurrentAdminId();
  if (!adminId) redirect("/admin/login");

  const m = await fetchMetrics();

  return (
    <main className="min-h-screen bg-btf-off-white px-6 py-10 sm:py-14">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/admin/review"
            className="text-btf-text-light hover:text-btf-sky-deep text-sm inline-flex items-center gap-2 transition-colors"
          >
            <span aria-hidden>&larr;</span> Admin home
          </Link>
          <Link
            href="/admin/grant-reports"
            className="text-xs text-btf-sky-deep underline underline-offset-4 hover:text-btf-sky"
          >
            Grant reports &rarr;
          </Link>
        </div>

        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
          Admin &middot; analytics
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light leading-tight mb-3">
          Closed-beta engagement
        </h1>
        <p className="text-btf-text-mid font-light leading-relaxed mb-8 text-sm">
          Aggregate metrics. No individual user content. Refresh the page for an update — counts run against the live database.
        </p>

        {/* Top-line numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          <Stat label="Total users" value={m.totalUsers} />
          <Stat label="DAU" value={m.dau} />
          <Stat label="WAU" value={m.wau} />
          <Stat label="MAU" value={m.mau} />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-10">
          <Stat label="Completions · 7d" value={m.totalCompletions7d} />
          <Stat label="Completions · 30d" value={m.totalCompletions30d} />
          <Stat label="Journal entries" value={m.totalJournalEntries} />
          <Stat label="Tool sessions" value={m.totalActivityEntries} />
          <Stat label="Incidents · pending" value={m.pendingIncidents} accent />
          <Stat label="Incidents · total" value={m.totalIncidents} />
        </div>

        {/* Loved-one (CSO) referral metrics */}
        <section className="mb-10">
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">
            Loved-one referral codes
          </p>
          <p className="text-xs text-btf-text-mid font-light leading-relaxed mb-4">
            Concerned Significant Other (CSO) engagement metrics. CRAFT
            literature predicts 60–70% redemption in mature programs;
            below that is normal during beta while word-of-mouth ramps.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="Codes generated" value={m.csoCodesGenerated} />
            <Stat label="Codes redeemed" value={m.csoCodesRedeemed} />
            <Stat
              label="Redemption rate"
              value={Math.round(m.csoRedemptionRate * 100)}
              suffix="%"
            />
            <Stat
              label="Median time to redeem"
              value={
                m.csoMedianTimeToRedemptionDays !== null
                  ? Math.round(m.csoMedianTimeToRedemptionDays * 10) / 10
                  : 0
              }
              suffix={m.csoMedianTimeToRedemptionDays !== null ? " d" : ""}
            />
          </div>
        </section>

        {/* Population breakdown */}
        <section className="mb-10">
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">
            Users by population
          </p>
          {m.populationBreakdown.length === 0 ? (
            <p className="text-sm text-btf-text-mid font-light italic">
              No population data yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {m.populationBreakdown.map((row) => (
                <li
                  key={row.population}
                  className="flex items-center justify-between rounded-xl bg-white border border-btf-sky-pale/60 px-4 py-3"
                >
                  <span className="text-sm text-btf-text-dark font-medium">
                    {row.population}
                  </span>
                  <span className="text-sm text-btf-sky-deep font-medium tabular-nums">
                    {row.users}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Habit completion breakdown */}
        <section className="mb-10">
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">
            Completions by habit · last 30 days
          </p>
          {m.habitCompletionBreakdown.length === 0 ? (
            <p className="text-sm text-btf-text-mid font-light italic">
              No completions yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {m.habitCompletionBreakdown.map((row) => (
                <li
                  key={row.habit_slug}
                  className="flex items-center justify-between rounded-xl bg-white border border-btf-sky-pale/60 px-4 py-3"
                >
                  <span className="text-sm text-btf-text-dark font-medium">
                    {row.habit_slug}
                  </span>
                  <span className="text-sm text-btf-sky-deep font-medium tabular-nums">
                    {row.total}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Per-day strip */}
        <section className="mb-10">
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">
            Daily activity &middot; last 30 days
          </p>
          <div className="rounded-2xl bg-white border-2 border-btf-sky-pale/60 p-4 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-btf-text-light text-[10px] uppercase tracking-[0.2em]">
                  <th className="text-left py-2 pr-4">Date</th>
                  <th className="text-right py-2 pr-4">Active users</th>
                  <th className="text-right py-2">Completions</th>
                </tr>
              </thead>
              <tbody>
                {m.perDayLast30.map((row) => (
                  <tr key={row.date} className="border-t border-btf-sky-pale/60">
                    <td className="py-1.5 pr-4 text-btf-text-mid tabular-nums">
                      {row.date}
                    </td>
                    <td className="py-1.5 pr-4 text-btf-sky-deep text-right tabular-nums">
                      {row.activeUsers}
                    </td>
                    <td className="py-1.5 text-btf-sky-deep text-right tabular-nums">
                      {row.completions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="rounded-xl bg-btf-gold-pale/40 border border-btf-gold/30 text-btf-text-mid text-xs font-light p-4 leading-relaxed">
          <span className="font-medium text-btf-sky-deep">Privacy note:</span> these aggregates contain no individual user identifiers, no journal content, no recovery codes. They satisfy Hogg / RWJF / SAMHSA grant reporting requirements while preserving the anonymous-user contract.
        </div>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  accent,
  suffix,
}: {
  label: string;
  value: number;
  accent?: boolean;
  suffix?: string;
}) {
  return (
    <div
      className={
        "rounded-2xl border-2 p-4 " +
        (accent
          ? "bg-btf-gold-pale/60 border-btf-gold/40"
          : "bg-white border-btf-sky-pale/60")
      }
    >
      <p className="text-[10px] tracking-[0.25em] uppercase text-btf-text-light font-semibold mb-1">
        {label}
      </p>
      <p className="font-serif text-3xl text-btf-sky-deep font-light tabular-nums">
        {value}
        {suffix ?? ""}
      </p>
    </div>
  );
}
