"use client";

import { useState } from "react";
import { fetchGrantReportCsv } from "../../actions/grantReport";

/**
 * Client subcomponent for /admin/grant-reports.
 *
 * Two date inputs + a Download CSV button. Calls a server action that
 * returns a CSV string; the client triggers a download via a Blob URL.
 */
export default function GrantReportClient() {
  const today = new Date().toISOString().slice(0, 10);
  const thirtyAgo = (() => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - 29);
    return d.toISOString().slice(0, 10);
  })();

  const [from, setFrom] = useState<string>(thirtyAgo);
  const [to, setTo] = useState<string>(today);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onDownload() {
    if (pending) return;
    setError(null);
    setPending(true);
    try {
      const res = await fetchGrantReportCsv({ from, to });
      if (!res.success) {
        setError(res.error);
        return;
      }
      const blob = new Blob([res.data.csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `before-the-fall_grant-report_${from}_to_${to}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Unexpected error generating the report.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white border-2 border-btf-sky-pale/60 p-5 sm:p-6">
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <label className="block">
          <span className="text-[10px] tracking-[0.25em] uppercase text-btf-text-light font-semibold mb-2 block">
            From
          </span>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            disabled={pending}
            className="w-full rounded-xl bg-white border-2 border-btf-sky-pale/60 focus:border-btf-sky focus:outline-none px-4 py-3 text-sm text-btf-text-dark"
          />
        </label>
        <label className="block">
          <span className="text-[10px] tracking-[0.25em] uppercase text-btf-text-light font-semibold mb-2 block">
            To
          </span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            disabled={pending}
            className="w-full rounded-xl bg-white border-2 border-btf-sky-pale/60 focus:border-btf-sky focus:outline-none px-4 py-3 text-sm text-btf-text-dark"
          />
        </label>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm p-4 mb-4"
        >
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={onDownload}
        disabled={pending || !from || !to || from > to}
        className="w-full bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium px-8 py-3.5 rounded-full shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-transform"
      >
        {pending ? "Generating…" : "Download CSV →"}
      </button>
    </div>
  );
}
