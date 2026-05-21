"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  decryptIncidentEntry,
  setIncidentStatus,
  type IncidentStatus,
} from "../../../actions/admin";

/**
 * Client subcomponent for the incident detail page.
 *
 * Two interactive features:
 *   1. Decrypt-on-click — explicit, logged. The plaintext lives in this
 *      component's state for the duration of the page view; it is NOT
 *      written to any storage, cache, or analytics.
 *   2. Disposition action buttons — set the incident status with optional
 *      notes. Each click logs to the tamper-evident audit chain.
 */

const STATUS_OPTIONS: { value: IncidentStatus; label: string; tone: string }[] = [
  { value: "false_positive", label: "False positive", tone: "neutral" },
  { value: "dismissed_no_action", label: "Reviewed · no escalation", tone: "neutral" },
  { value: "escalated_988", label: "Escalated to 988", tone: "warn" },
  { value: "escalated_ncmec", label: "Escalated to NCMEC", tone: "warn" },
  { value: "escalated_le", label: "Escalated to law enforcement", tone: "warn" },
  { value: "escalated_other", label: "Escalated · other", tone: "warn" },
];

export default function IncidentEditor({
  incidentId,
  currentStatus,
  currentNotes,
  hasEntry,
}: {
  incidentId: string;
  currentStatus: string;
  currentNotes: string;
  hasEntry: boolean;
}) {
  const router = useRouter();
  const [plaintext, setPlaintext] = useState<string | null>(null);
  const [decrypting, setDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState<string | null>(null);

  const [selectedStatus, setSelectedStatus] = useState<IncidentStatus | "">("");
  const [notes, setNotes] = useState<string>(currentNotes);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmEscalation, setConfirmEscalation] = useState(false);

  const isClosed = currentStatus !== "pending";

  async function onDecrypt() {
    if (decrypting) return;
    setDecrypting(true);
    setDecryptError(null);
    try {
      const res = await decryptIncidentEntry(incidentId);
      if (res.success) {
        setPlaintext(res.text);
      } else {
        setDecryptError(res.error);
      }
    } catch (err) {
      console.error(err);
      setDecryptError("Unexpected error decrypting.");
    } finally {
      setDecrypting(false);
    }
  }

  async function onSubmitStatus() {
    if (!selectedStatus || submitting) return;
    setSubmitting(true);
    setActionError(null);
    try {
      const trimmedNotes = notes.trim() === "" ? null : notes.trim();
      const res = await setIncidentStatus(incidentId, selectedStatus, trimmedNotes);
      if (res.success) {
        router.refresh();
      } else {
        setActionError(res.error);
      }
    } catch (err) {
      console.error(err);
      setActionError("Unexpected error setting status.");
    } finally {
      setSubmitting(false);
      setConfirmEscalation(false);
    }
  }

  function onAttemptSubmit() {
    if (!selectedStatus) return;
    if (selectedStatus.startsWith("escalated_")) {
      setConfirmEscalation(true);
      return;
    }
    onSubmitStatus();
  }

  return (
    <div className="space-y-6">
      {/* Decrypt panel */}
      <section className="rounded-2xl bg-white border-2 border-btf-sky-pale/60 p-6">
        <p className="text-[10px] tracking-[0.2em] uppercase text-btf-sky font-semibold mb-3">
          Entry plaintext
        </p>
        {!hasEntry ? (
          <p className="text-sm text-btf-text-light font-light italic">
            The original entry was deleted. Plaintext is no longer recoverable.
          </p>
        ) : plaintext === null ? (
          <>
            <p className="text-sm text-btf-text-mid font-light leading-relaxed mb-4">
              Plaintext is encrypted at rest. Clicking decrypt records an{" "}
              <code className="text-btf-sky-deep">admin_decrypted_entry</code> event in the audit log with your admin ID and the current timestamp.
            </p>
            <button
              type="button"
              onClick={onDecrypt}
              disabled={decrypting}
              className="bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium px-6 py-3 rounded-full shadow-lg disabled:opacity-50 hover:-translate-y-0.5 transition-transform"
            >
              {decrypting ? "Decrypting…" : "Decrypt + view entry"}
            </button>
            {decryptError && (
              <div role="alert" className="mt-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm p-3">
                {decryptError}
              </div>
            )}
          </>
        ) : (
          <div className="rounded-xl bg-btf-off-white border border-btf-text-light/20 p-4">
            <p className="text-sm text-btf-text-dark font-light leading-relaxed whitespace-pre-line">
              {plaintext}
            </p>
          </div>
        )}
      </section>

      {/* Disposition panel */}
      <section className="rounded-2xl bg-white border-2 border-btf-gold/30 p-6">
        <p className="text-[10px] tracking-[0.2em] uppercase text-btf-gold font-semibold mb-4">
          Disposition
        </p>
        {isClosed && (
          <div className="rounded-xl bg-btf-off-white border border-btf-text-light/20 text-sm p-4 mb-5">
            <p className="text-btf-text-mid font-light">
              Current status:{" "}
              <span className="font-medium text-btf-sky-deep uppercase tracking-wider">
                {currentStatus.replace(/_/g, " ")}
              </span>
            </p>
            {currentNotes && (
              <p className="text-xs text-btf-text-light font-light mt-2 whitespace-pre-line">
                Notes: {currentNotes}
              </p>
            )}
            <p className="text-xs text-btf-text-light font-light mt-3">
              You can re-classify, but every change is recorded.
            </p>
          </div>
        )}

        <fieldset disabled={submitting} className="space-y-2 mb-4">
          {STATUS_OPTIONS.map((opt) => {
            const checked = selectedStatus === opt.value;
            const isEscalation = opt.value.startsWith("escalated_");
            return (
              <label
                key={opt.value}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-colors ${
                  checked
                    ? isEscalation
                      ? "border-amber-400 bg-amber-50"
                      : "border-btf-sky bg-btf-sky-pale/40"
                    : "border-btf-text-light/20 bg-white hover:border-btf-text-light/40"
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value={opt.value}
                  checked={checked}
                  onChange={() => setSelectedStatus(opt.value)}
                  className="sr-only"
                />
                <span aria-hidden className="flex-shrink-0 w-4 h-4 rounded-full border-2 border-current grid place-items-center">
                  {checked && <span className="w-2 h-2 rounded-full bg-current" aria-hidden />}
                </span>
                <span className="text-sm text-btf-text-dark font-medium">
                  {opt.label}
                </span>
              </label>
            );
          })}
        </fieldset>

        <label
          htmlFor="admin-notes"
          className="block text-[10px] tracking-[0.25em] uppercase text-btf-text-light font-semibold mb-2"
        >
          Notes (PII-free; admin's own words on rationale)
        </label>
        <textarea
          id="admin-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={submitting}
          rows={4}
          placeholder="Why this disposition? Keep it free of user PII."
          className="w-full rounded-xl bg-white border-2 border-btf-sky-pale/60 focus:border-btf-sky focus:outline-none px-4 py-3 text-sm text-btf-text-dark font-light leading-relaxed resize-y transition-colors"
        />

        {actionError && (
          <div role="alert" className="mt-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm p-3">
            {actionError}
          </div>
        )}

        <button
          type="button"
          onClick={onAttemptSubmit}
          disabled={!selectedStatus || submitting}
          className="mt-5 bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium px-6 py-3 rounded-full shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-transform"
        >
          {submitting ? "Saving…" : "Save disposition"}
        </button>
      </section>

      {/* Escalation confirmation modal */}
      {confirmEscalation && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !submitting && setConfirmEscalation(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif text-xl text-btf-sky-deep font-light mb-3">
              Confirm escalation
            </h2>
            <p className="text-sm text-btf-text-mid font-light leading-relaxed mb-4">
              You&rsquo;re about to mark this incident as <span className="font-medium">{selectedStatus.replace(/_/g, " ")}</span>. This is recorded in the audit log and forms part of the permanent Incident Log.
            </p>
            <p className="text-xs text-btf-text-light font-light mb-5">
              This system does <span className="font-medium text-btf-sky-deep">not</span> contact 988, NCMEC, or law enforcement automatically. That action is yours to take outside this UI per the [[Mandatory Reporting Escalation Protocol]]. Confirming below records that you have done so.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onSubmitStatus}
                disabled={submitting}
                className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-medium px-5 py-3 rounded-full transition-colors"
              >
                {submitting ? "Recording…" : "Yes, record escalation"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmEscalation(false)}
                disabled={submitting}
                className="flex-1 bg-white border-2 border-btf-text-light/30 text-btf-text-mid font-medium px-5 py-3 rounded-full hover:bg-btf-off-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
