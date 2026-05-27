import { redirect } from "next/navigation";
import { getCurrentAdminId } from "../../lib/adminSession";
import GrantReportClient from "./GrantReportClient";
import AdminNav from "../AdminNav";

/**
 * /admin/grant-reports — exportable CSV summaries for grant submissions.
 *
 * Grant officers (Hogg, RWJF, SAMHSA, foundations) ask for specific
 * outcome data: users served by population, engagement curves,
 * outcome proxies, crisis routing event counts. This page lets Max +
 * Pop pull a CSV per date range without having to write SQL.
 */
export const metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function GrantReportsPage() {
  const adminId = await getCurrentAdminId();
  if (!adminId) redirect("/");

  return (
    <main className="min-h-screen bg-btf-off-white px-6 py-10 sm:py-14">
      <div className="max-w-3xl mx-auto">
        <AdminNav current="grant-reports" />

        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
          Admin &middot; grant reports
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light leading-tight mb-3">
          Exportable summaries
        </h1>
        <p className="text-btf-text-mid font-light leading-relaxed mb-8 text-sm">
          Pick a date range. Pull a CSV. Drop it into the grant package. No individual user data is exported &mdash; only aggregates.
        </p>

        <GrantReportClient />

        <div className="rounded-xl bg-btf-gold-pale/40 border border-btf-gold/30 text-btf-text-mid text-xs font-light p-4 mt-10 leading-relaxed">
          <span className="font-medium text-btf-sky-deep">What&rsquo;s in the CSV:</span> totals (users served, populations, completions, sessions, journal entries, incidents) for the date range, plus a daily activity row for every day in the range. All numeric. No PII, no recovery codes, no journal content.
        </div>
      </div>
    </main>
  );
}
