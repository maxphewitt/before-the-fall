import { redirect } from "next/navigation";
import { getCurrentAdminId } from "../../lib/adminSession";
import { getFieldReviewQueue } from "../../actions/fieldJournal";
import { contextLabel, OUTCOMES, type Outcome } from "../../lib/fieldJournalContent";
import AdminNav from "../AdminNav";
import ReviewButton from "./ReviewButton";

/**
 * /admin/field-review — Field Journal care-team queue.
 *
 * Lists urge logs the heuristic flagged as needs_review (highest
 * severity surfaced to a human). Admin-gated.
 *
 * WARNING: The severity heuristic is a PLACEHOLDER. Automated severity
 * detection is not a validated screen; thresholds + the review SLA + who
 * reviews are pending clinician + legal sign-off (see the legal note in
 * the vault: "03 - Legal & Governance"). This queue surfaces flags for a
 * human; it makes no clinical determination.
 */
export const metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function FieldReviewPage() {
  const adminId = await getCurrentAdminId();
  if (!adminId) redirect("/");

  const rows = await getFieldReviewQueue();

  return (
    <main className="min-h-screen bg-btf-off-white">
      <AdminNav current="review" />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-serif text-3xl text-btf-sky-deep font-light mb-2">
          Field Journal — review queue
        </h1>
        <p className="text-sm text-btf-text-mid font-light mb-6 leading-relaxed">
          Logs the severity heuristic flagged for a human. This is not a clinical
          determination — review with care and route to the agreed support pathway.
          Thresholds are placeholders pending clinician + legal sign-off.
        </p>

        {rows.length === 0 ? (
          <p className="text-btf-text-mid font-light">Nothing waiting for review.</p>
        ) : (
          <ul className="space-y-3">
            {rows.map((r) => (
              <li key={r.id} className="rounded-2xl bg-white border border-btf-text-light/20 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex-1 font-medium text-btf-sky-deep">{contextLabel(r.context)}</span>
                  <span className="text-sm text-btf-text-mid">intensity {r.intensity}</span>
                  <span className="text-sm text-btf-text-light">{OUTCOMES[r.outcome as Outcome]?.label ?? r.outcome}</span>
                </div>
                {r.detail && (
                  <p className="text-sm text-btf-text-dark font-light italic mb-3">&ldquo;{r.detail}&rdquo;</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-btf-text-light">
                    {new Date(r.loggedAt).toLocaleString()}
                  </span>
                  <ReviewButton id={r.id} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
