"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAdmin } from "../../actions/admin";

/**
 * /admin/login — paste your 64-char hex admin code.
 *
 * Mirrors the /return user flow visually but lives in its own namespace.
 * Generic error message on every failure path so attackers cannot
 * distinguish "malformed code" from "unknown code" from "revoked admin."
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await loginAdmin(code);
      if (res.success) {
        router.push("/admin/review");
        router.refresh();
      } else {
        setError(res.error);
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-btf-off-white px-6 py-10 sm:py-14">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-btf-text-light hover:text-btf-sky-deep text-sm mb-6 inline-flex items-center gap-2 transition-colors"
        >
          <span aria-hidden>&larr;</span> Home
        </Link>

        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
          Admin
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light leading-tight mb-3">
          Reviewer sign-in.
        </h1>
        <p className="text-btf-text-mid font-light leading-relaxed mb-8 text-sm">
          Paste your 64-character admin code. This is a separate credential from any user-side account.
        </p>

        <form onSubmit={onSubmit}>
          <label
            htmlFor="admin-code"
            className="block text-[10px] tracking-[0.25em] uppercase text-btf-text-light font-semibold mb-2"
          >
            Admin code
          </label>
          <textarea
            id="admin-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={submitting}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            rows={3}
            placeholder="64 lowercase hex characters"
            className="w-full rounded-2xl bg-white border-2 border-btf-sky-pale/60 focus:border-btf-sky focus:outline-none px-5 py-4 font-mono text-sm text-btf-sky-deep leading-relaxed tracking-wide resize-none shadow-sm transition-colors"
          />

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm p-4"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || code.trim().length === 0}
            className="mt-6 w-full max-w-md mx-auto bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium px-8 py-3.5 rounded-full shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-transform block"
          >
            {submitting ? "Verifying…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
