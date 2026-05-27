import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdminId } from "../../lib/adminSession";
import { supabaseServer } from "../../lib/supabase";
import { logoutAdminForm } from "../../actions/admin";

/**
 * /admin/review — incident queue.
 *
 * Server component. Gated by admin cookie. Lists pending incidents
 * (severity DESC, oldest first) so the most urgent + longest-waiting
 * floats to the top.
 *
 * No plaintext is displayed here. The list shows category labels,
 * severity, and age only. Plaintext is fetched on the detail page via
 * an explicit decrypt action that logs the read.
 */
export const metadata = {
  robots: { index: false, follow: false },
};

type IncidentRow = {
  id: string;
  user_id: string;
  entry_id: string | null;
  trigger_categories: string[];
  severity: "low" | "medium" | "high";
  match_count: number;
  status: string;
  created_at: string;
};

async function fetchPendingIncidents(): Promise<IncidentRow[]> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("incidents")
    .select(
      "id, user_id, entry_id, trigger_categories, severity, match_count, status, created_at"
    )
    .eq("status", "pending")
    .order("severity", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("fetchPendingIncidents error:", error);
    return [];
  }
  return (data ?? []) as IncidentRow[];
}

async function fetchRecentlyClosed(): Promise<IncidentRow[]> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("incidents")
    .select(
      "id, user_id, entry_id, trigger_categories, severity, match_count, status, created_at"
    )
    .neq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) return [];
  return (data ?? []) as IncidentRow[];
}

function severityClasses(sev: string): string {
  switch (sev) {
    case "high":
      return "bg-red-50 border-red-200 text-red-800";
    case "medium":
      return "bg-amber-50 border-amber-200 text-amber-800";
    default:
      return "bg-btf-off-white border-btf-text-light/20 text-btf-text-mid";
  }
}

function formatAge(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function AdminReviewQueue() {
  const adminId = await getCurrentAdminId();
  if (!adminId) redirect("/");

  const [pending, closed] = await Promise.all([
    fetchPendingIncidents(),
    fetchRecentlyClosed(),
  ]);

  return (
    <main className="min-h-screen bg-btf-off-white px-6 py-10 sm:py-14">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="text-btf-text-light hover:text-btf-sky-deep text-sm inline-flex items-center gap-2 transition-colors"
            >
              <span aria-hidden>&larr;</span> Home
            </Link>
            <Link
              href="/admin/audit"
              className="text-btf-text-light hover:text-btf-sky-deep text-xs tracking-[0.25em] uppercase transition-colors"
            >
              Verify chain
            </Link>
          </div>
          <form action={logoutAdminForm}>
            <button
              type="submit"
              className="text-xs tracking-[0.25em] uppercase text-btf-text-light hover:text-btf-sky-deep transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>

        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
          Admin
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light leading-tight mb-3">
          Review queue.
        </h1>
        <p className="text-btf-text-mid font-light leading-relaxed mb-8 text-sm">
          Trigger hits from journal scans. Plaintext is never shown on this page — open an incident to request decryption. Each decrypt is recorded in the audit log.
        </p>

        <h2 className="text-[11px] tracking-[0.25em] text-btf-sky uppercase font-semibold mb-4">
          Pending · {pending.length}
        </h2>

        {pending.length === 0 ? (
          <div className="rounded-2xl bg-white border-2 border-btf-sky-pale/60 p-8 text-center mb-12">
            <p className="text-btf-text-mid font-light leading-relaxed">
              Nothing pending. The queue updates automatically as new journal entries are saved.
            </p>
          </div>
        ) : (
          <ul className="space-y-3 mb-12">
            {pending.map((inc) => (
              <li key={inc.id}>
                <Link
                  href={`/admin/incidents/${inc.id}`}
                  className="block rounded-2xl bg-white border-2 border-btf-sky-pale/60 hover:border-btf-sky hover:shadow-md p-5 transition-all"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <span
                      className={`text-[10px] uppercase tracking-[0.2em] font-medium px-2.5 py-1 rounded-full border ${severityClasses(inc.severity)}`}
                    >
                      {inc.severity}
                    </span>
                    <span className="text-xs text-btf-text-light">
                      {formatAge(inc.created_at)} &middot; {inc.match_count} match{inc.match_count === 1 ? "" : "es"}
                    </span>
                  </div>
                  <p className="text-sm text-btf-text-dark font-medium leading-relaxed">
                    {inc.trigger_categories.join(", ")}
                  </p>
                  <p className="text-xs text-btf-text-light font-light mt-2">
                    user {inc.user_id.slice(0, 8)}… &middot; entry {inc.entry_id?.slice(0, 8) ?? "missing"}…
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <h2 className="text-[11px] tracking-[0.25em] text-btf-text-light uppercase font-semibold mb-4">
          Recently closed · {closed.length}
        </h2>

        {closed.length === 0 ? (
          <div className="rounded-2xl bg-white border border-btf-text-light/20 p-6 text-center text-btf-text-light text-sm font-light">
            No closed incidents yet.
          </div>
        ) : (
          <ul className="space-y-2">
            {closed.map((inc) => (
              <li key={inc.id}>
                <Link
                  href={`/admin/incidents/${inc.id}`}
                  className="block rounded-xl bg-white border border-btf-text-light/20 hover:border-btf-sky-light p-4 transition-all"
                >
                  <div className="flex items-center gap-3 text-xs">
                    <span className={`uppercase tracking-[0.2em] font-medium px-2 py-0.5 rounded-full border ${severityClasses(inc.severity)}`}>
                      {inc.severity}
                    </span>
                    <span className="text-btf-text-mid font-medium">
                      {inc.status.replace(/_/g, " ")}
                    </span>
                    <span className="text-btf-text-light">
                      {inc.trigger_categories.join(", ")}
                    </span>
                    <span className="text-btf-text-light ml-auto">
                      {formatAge(inc.created_at)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
