import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getCurrentAdminId } from "../../../lib/adminSession";
import { supabaseServer } from "../../../lib/supabase";
import IncidentEditor from "./IncidentEditor";

export const metadata = {
  robots: { index: false, follow: false },
};

type AuditRow = {
  id: number;
  event_type: string;
  occurred_at: string;
  actor_admin_id: string | null;
  payload: Record<string, unknown>;
};

type IncidentDetail = {
  id: string;
  user_id: string;
  entry_id: string | null;
  trigger_categories: string[];
  severity: "low" | "medium" | "high";
  match_count: number;
  status: string;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
};

export default async function IncidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const adminId = await getCurrentAdminId();
  if (!adminId) redirect("/admin/login");

  const supabase = supabaseServer();

  const [incidentRes, auditRes] = await Promise.all([
    supabase
      .from("incidents")
      .select(
        "id, user_id, entry_id, trigger_categories, severity, match_count, status, admin_notes, reviewed_by, reviewed_at, created_at"
      )
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("incident_audit_log")
      .select("id, event_type, occurred_at, actor_admin_id, payload")
      .eq("incident_id", id)
      .order("id", { ascending: true }),
  ]);

  if (incidentRes.error || !incidentRes.data) {
    notFound();
  }

  const incident = incidentRes.data as IncidentDetail;
  const auditTrail = (auditRes.data ?? []) as AuditRow[];

  return (
    <main className="min-h-screen bg-btf-off-white px-6 py-10 sm:py-14">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/admin/review"
          className="text-btf-text-light hover:text-btf-sky-deep text-sm mb-6 inline-flex items-center gap-2 transition-colors"
        >
          <span aria-hidden>&larr;</span> Review queue
        </Link>

        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
          Incident
        </p>
        <h1 className="font-serif text-2xl md:text-3xl text-btf-sky-deep font-light leading-tight mb-3">
          {incident.trigger_categories.join(" · ") || "Trigger hit"}
        </h1>
        <p className="text-xs text-btf-text-light font-light mb-8">
          Incident {incident.id.slice(0, 8)}… &middot; created {new Date(incident.created_at).toLocaleString()} &middot; severity <span className="font-medium uppercase">{incident.severity}</span>
        </p>

        <IncidentEditor
          incidentId={incident.id}
          currentStatus={incident.status}
          currentNotes={incident.admin_notes ?? ""}
          hasEntry={incident.entry_id !== null}
        />

        {/* Audit trail */}
        <section className="mt-12">
          <p className="text-[11px] tracking-[0.25em] text-btf-text-light uppercase font-semibold mb-3">
            Audit log · {auditTrail.length} {auditTrail.length === 1 ? "event" : "events"}
          </p>
          <div className="rounded-2xl bg-white border border-btf-text-light/15 overflow-hidden">
            {auditTrail.length === 0 ? (
              <p className="px-5 py-4 text-sm text-btf-text-light font-light">
                No events.
              </p>
            ) : (
              <ul>
                {auditTrail.map((e, i) => (
                  <li
                    key={e.id}
                    className={`px-5 py-3 text-sm ${i > 0 ? "border-t border-btf-text-light/10" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="font-medium text-btf-sky-deep">
                        {e.event_type.replace(/_/g, " ")}
                      </span>
                      <span className="text-btf-text-light">
                        {new Date(e.occurred_at).toLocaleString()}
                      </span>
                    </div>
                    {Object.keys(e.payload ?? {}).length > 0 && (
                      <pre className="mt-2 text-[11px] text-btf-text-mid font-mono bg-btf-off-white rounded-lg p-2 overflow-x-auto">
                        {JSON.stringify(e.payload, null, 2)}
                      </pre>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
