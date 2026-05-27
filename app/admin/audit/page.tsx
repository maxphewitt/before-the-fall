import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdminId } from "../../lib/adminSession";
import AuditVerifyPanel from "./AuditVerifyPanel";

export const metadata = {
  robots: { index: false, follow: false },
};

/**
 * /admin/audit — manual integrity check for the incident audit log.
 *
 * Walks the hash chain in the DB and reports the first row whose hash
 * doesn't match a recompute. Use case: weekly admin discipline + ad-hoc
 * verification before any external disclosure of the log.
 */
export default async function AdminAuditPage() {
  const adminId = await getCurrentAdminId();
  if (!adminId) redirect("/");

  return (
    <main className="min-h-screen bg-btf-off-white px-6 py-10 sm:py-14">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/admin/review"
          className="text-btf-text-light hover:text-btf-sky-deep text-sm mb-6 inline-flex items-center gap-2 transition-colors"
        >
          <span aria-hidden>&larr;</span> Review queue
        </Link>

        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
          Admin · Audit
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light leading-tight mb-3">
          Verify the audit chain.
        </h1>
        <p className="text-btf-text-mid font-light leading-relaxed mb-8 text-sm">
          Walks the entire <code className="text-btf-sky-deep">incident_audit_log</code> from the genesis row forward, recomputing each row hash and comparing against what&rsquo;s stored. If any past row was modified, the first divergent row is reported. Run this weekly and any time the chain&rsquo;s integrity matters for external disclosure.
        </p>

        <AuditVerifyPanel />

        <div className="rounded-xl bg-btf-off-white border border-btf-text-light/15 text-btf-text-mid text-xs font-light p-4 mt-8 leading-relaxed">
          <span className="font-medium text-btf-sky-deep">Operational note:</span>{" "}
          Service-role access to Supabase can in principle bypass the append-only triggers on this table. The hash chain is the durable guard against silent tampering &mdash; a modified past row will surface here on the next verify. Run this as part of weekly admin review.
        </div>
      </div>
    </main>
  );
}
