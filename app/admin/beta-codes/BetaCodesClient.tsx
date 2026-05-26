"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  mintBetaCode,
  deactivateBetaCode,
  exportBetaCsv,
  type BetaCodeRow,
} from "../../actions/betaCodes";

/**
 * Client subcomponent for /admin/beta-codes.
 *
 * Mint form + active codes list + deactivated codes list + CSV
 * download button. Optimistic UI on mint (newly-minted code appears
 * with a "copy this once" callout); deactivation refreshes the
 * server-rendered list via router.refresh().
 */
export default function BetaCodesClient({
  initialCodes,
}: {
  initialCodes: BetaCodeRow[];
}) {
  const router = useRouter();
  const [codes, setCodes] = useState<BetaCodeRow[]>(initialCodes);
  const [label, setLabel] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [freshCode, setFreshCode] = useState<{
    plaintext: string;
    id: string;
    label: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [csvBusy, setCsvBusy] = useState(false);

  async function onMint(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await mintBetaCode(label);
      if (res.success) {
        setFreshCode({ plaintext: res.code, id: res.id, label });
        setCodes((c) => [
          {
            id: res.id,
            label: label.trim() || null,
            createdAt: new Date().toISOString(),
            deactivatedAt: null,
            lastUsedAt: null,
            useCount: 0,
            sessionCount: 0,
            signupCount: 0,
          },
          ...c,
        ]);
        setLabel("");
        router.refresh();
      } else {
        setError(res.error);
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onDeactivate(id: string) {
    if (!confirm("Deactivate this code? Sessions already opened against it keep working until their cookies expire.")) {
      return;
    }
    try {
      const res = await deactivateBetaCode(id);
      if (res.success) {
        setCodes((c) =>
          c.map((row) =>
            row.id === id
              ? { ...row, deactivatedAt: new Date().toISOString() }
              : row
          )
        );
        router.refresh();
      } else {
        alert(res.error);
      }
    } catch (err) {
      console.error(err);
      alert("Unexpected error.");
    }
  }

  async function copyFreshCode() {
    if (!freshCode) return;
    try {
      await navigator.clipboard.writeText(freshCode.plaintext);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Clipboard failed:", err);
    }
  }

  async function onCsv() {
    if (csvBusy) return;
    setCsvBusy(true);
    try {
      const res = await exportBetaCsv();
      if (!res.success) {
        alert(res.error);
        return;
      }
      const blob = new Blob([res.data.csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `before-the-fall_beta-codes_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("CSV export failed.");
    } finally {
      setCsvBusy(false);
    }
  }

  const activeCodes = codes.filter((c) => !c.deactivatedAt);
  const deactivatedCodes = codes.filter((c) => c.deactivatedAt);

  return (
    <div className="space-y-10">
      {/* Mint form */}
      <section className="rounded-2xl bg-white border-2 border-btf-sky-pale p-5 sm:p-6">
        <h2 className="font-serif text-xl text-btf-sky-deep font-light mb-4">
          Mint a new code
        </h2>
        <form onSubmit={onMint} className="space-y-4">
          <label className="block">
            <span className="text-[10px] tracking-[0.25em] uppercase text-btf-text-light font-semibold mb-2 block">
              Label (who is this for?)
            </span>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              disabled={submitting}
              placeholder="e.g., John D — friend"
              className="w-full rounded-xl bg-white border-2 border-btf-sky-pale focus:border-btf-sky focus:outline-none px-4 py-3 text-sm text-btf-text-dark"
            />
          </label>
          {error && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm p-3"
            >
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium px-6 py-3 rounded-full shadow-lg disabled:opacity-50 hover:-translate-y-0.5 transition-transform"
          >
            {submitting ? "Minting…" : "Mint code →"}
          </button>
        </form>

        {/* Fresh-code reveal — shown ONCE after mint */}
        {freshCode && (
          <div className="mt-6 rounded-2xl bg-btf-gold-pale/60 border-2 border-btf-gold/50 p-5">
            <p className="text-[10px] tracking-[0.25em] uppercase text-btf-sky-deep font-semibold mb-2">
              New code &middot; {freshCode.label || "no label"}
            </p>
            <p className="font-mono text-2xl text-btf-sky-deep break-all select-all mb-3">
              {freshCode.plaintext}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={copyFreshCode}
                className="bg-btf-sky-deep hover:bg-btf-sky text-white text-sm font-medium px-4 py-2 rounded-full"
              >
                {copied ? "Copied ✓" : "Copy"}
              </button>
              <button
                type="button"
                onClick={() => setFreshCode(null)}
                className="text-btf-text-mid hover:text-btf-sky-deep text-sm underline underline-offset-4"
              >
                Done (hide)
              </button>
            </div>
            <p className="text-xs text-btf-text-mid font-light mt-3 leading-relaxed">
              This is the only time you&rsquo;ll see the plaintext. Copy it and send it to the tester now.
            </p>
          </div>
        )}
      </section>

      {/* CSV */}
      <section className="text-right">
        <button
          type="button"
          onClick={onCsv}
          disabled={csvBusy}
          className="bg-white border-2 border-btf-text-light/30 text-btf-text-mid text-sm font-medium px-5 py-2 rounded-full hover:bg-btf-off-white disabled:opacity-50"
        >
          {csvBusy ? "Generating…" : "Download CSV"}
        </button>
      </section>

      {/* Active codes */}
      <section>
        <h2 className="font-serif text-xl text-btf-sky-deep font-light mb-4">
          Active &middot; {activeCodes.length}
        </h2>
        {activeCodes.length === 0 ? (
          <p className="text-sm text-btf-text-mid font-light italic">
            No active codes yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {activeCodes.map((c) => (
              <CodeRow key={c.id} row={c} onDeactivate={onDeactivate} />
            ))}
          </ul>
        )}
      </section>

      {/* Deactivated codes */}
      {deactivatedCodes.length > 0 && (
        <section>
          <h2 className="font-serif text-xl text-btf-text-light font-light mb-4">
            Deactivated &middot; {deactivatedCodes.length}
          </h2>
          <ul className="space-y-2">
            {deactivatedCodes.map((c) => (
              <CodeRow key={c.id} row={c} onDeactivate={onDeactivate} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function CodeRow({
  row,
  onDeactivate,
}: {
  row: BetaCodeRow;
  onDeactivate: (id: string) => void;
}) {
  const isActive = !row.deactivatedAt;
  return (
    <li
      className={
        "rounded-xl border-2 px-4 py-3 " +
        (isActive
          ? "bg-white border-btf-sky-pale/60"
          : "bg-btf-off-white border-btf-text-light/15 opacity-60")
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-btf-sky-deep">
            {row.label || (
              <span className="italic text-btf-text-light">unlabeled</span>
            )}
          </p>
          <p className="text-xs text-btf-text-light font-light mt-0.5">
            Created {formatDate(row.createdAt)}
            {row.lastUsedAt
              ? ` · last used ${formatDate(row.lastUsedAt)}`
              : " · never used"}
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-btf-text-mid">
          <span title="Number of times the code was redeemed">
            <span className="font-mono tabular-nums text-btf-sky-deep font-medium">
              {row.useCount}
            </span>{" "}
            redeem{row.useCount === 1 ? "" : "s"}
          </span>
          <span title="Distinct sessions (browser cookies issued)">
            <span className="font-mono tabular-nums text-btf-sky-deep font-medium">
              {row.sessionCount}
            </span>{" "}
            session{row.sessionCount === 1 ? "" : "s"}
          </span>
          <span title="User accounts created while this code's cookie was set">
            <span className="font-mono tabular-nums text-btf-sky-deep font-medium">
              {row.signupCount}
            </span>{" "}
            signup{row.signupCount === 1 ? "" : "s"}
          </span>
          {isActive ? (
            <button
              type="button"
              onClick={() => onDeactivate(row.id)}
              className="text-red-700 hover:text-red-900 underline underline-offset-4"
            >
              Deactivate
            </button>
          ) : (
            <span className="italic text-btf-text-light">deactivated</span>
          )}
        </div>
      </div>
    </li>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
