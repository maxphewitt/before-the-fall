"use client";

import { useState } from "react";
import { runAuditVerify, type AuditVerifyResult } from "../../actions/audit";

export default function AuditVerifyPanel() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<AuditVerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onRun() {
    if (running) return;
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      const res = await runAuditVerify();
      setResult(res);
    } catch (err) {
      console.error(err);
      setError("Unexpected error running verifier.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <section className="rounded-2xl bg-white border-2 border-btf-sky-pale/60 p-6">
      <button
        type="button"
        onClick={onRun}
        disabled={running}
        className="bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium px-6 py-3 rounded-full shadow-lg disabled:opacity-50 hover:-translate-y-0.5 transition-transform"
      >
        {running ? "Verifying…" : "Run verifyChain()"}
      </button>

      {error && (
        <div role="alert" className="mt-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm p-4">
          {error}
        </div>
      )}

      {result && !result.authorized && (
        <div role="alert" className="mt-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm p-4">
          Not authorized. Sign in as an admin and try again.
        </div>
      )}

      {result && result.authorized && result.ok && (
        <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-5">
          <p className="font-medium uppercase tracking-[0.2em] text-[10px] mb-2">
            Chain intact
          </p>
          <p className="font-light leading-relaxed">
            All <span className="font-mono font-semibold">{result.rowsVerified}</span> {result.rowsVerified === 1 ? "row" : "rows"} verified. Every <code>row_hash</code> equals SHA-256(<code>hash_input</code>) and the <code>prev_hash</code> chain is consistent.
          </p>
          <p className="font-light leading-relaxed mt-2 text-xs">
            Checked at{" "}
            <span className="font-mono text-emerald-900">
              {new Date(result.checkedAt).toLocaleString()}
            </span>
            .
          </p>
        </div>
      )}

      {result && result.authorized && !result.ok && (
        <div role="alert" className="mt-4 rounded-xl bg-red-50 border-2 border-red-300 text-red-900 text-sm p-5 space-y-3">
          <p className="font-medium uppercase tracking-[0.2em] text-[10px]">
            Chain integrity FAILED
          </p>
          <p className="font-light leading-relaxed">
            Row <span className="font-mono font-semibold">{result.firstBadRowId}</span> is the first row that failed verification.
          </p>
          <p className="font-light leading-relaxed">
            <span className="font-medium text-red-700">Reason: </span>
            {result.reason}
          </p>
          <div className="bg-white rounded-lg p-3 font-mono text-[11px] space-y-1 break-all">
            <p><span className="text-red-700">Expected:</span> {result.expected}</p>
            <p><span className="text-red-700">Actual:&nbsp;&nbsp;</span> {result.actual}</p>
          </div>
          <p className="font-light leading-relaxed text-xs">
            Next steps: do NOT use the audit log as evidence until investigated. Capture a snapshot of the table, then trace what changed.
          </p>
          <p className="font-light text-xs">
            Checked at <span className="font-mono">{new Date(result.checkedAt).toLocaleString()}</span>.
          </p>
        </div>
      )}
    </section>
  );
}
