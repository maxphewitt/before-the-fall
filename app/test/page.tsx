"use client";

import { useState } from "react";
import {
  createUser,
  type CreateUserResult,
  type ProfileData,
} from "../actions/createUser";

/**
 * Smoke test for the createUser server action.
 *
 * Visit /test in dev. Clicking the button calls the server action with a
 * fixed dev profile, which generates a recovery code, hashes it, inserts
 * rows into users + user_profiles + safety_logs, sets the session cookie,
 * and returns the plaintext code (one-time only).
 *
 * Delete this route before public launch. It is gated by the noindex
 * meta tag on the site, but should still go away before launch since
 * it is a dev-only verification tool.
 */

// Fixed profile used for the smoke test — matches the shape of a real
// answer set from /onboard so the row is realistic. Values were picked
// to be unambiguous in the safety_logs / user_profiles tables when
// auditing dev data later.
const DEV_PROFILE: ProfileData = {
  framing: "starting",
  here_for: "self",
  populations: ["other"],
  emotional_state: "ready",
  faith_role: "open",
  support_level: "self_guided",
  duration: "recent",
  discovery: "searching",
};

export default function TestPage() {
  const [result, setResult] = useState<CreateUserResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    setResult(null);
    try {
      const res = await createUser(DEV_PROFILE);
      setResult(res);
    } catch (err) {
      setResult({ success: false, error: String(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-btf-off-white px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
          Dev smoke test
        </p>
        <h1 className="font-serif text-3xl text-btf-sky-deep font-light mb-3">
          Generate a user
        </h1>
        <p className="text-btf-text-mid font-light leading-relaxed mb-8 text-sm">
          Clicking the button below calls the <code className="text-btf-sky">createUser</code>{" "}
          server action, which generates a fresh 12-word recovery code, hashes it with SHA-256,
          inserts the hash into the <code className="text-btf-sky">users</code> table on Supabase,
          and returns the plaintext code here. Delete this page before public launch.
        </p>

        <button
          onClick={handleClick}
          disabled={loading}
          className="bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium px-8 py-3 rounded-full shadow-lg disabled:opacity-50 hover:-translate-y-0.5 transition-transform"
        >
          {loading ? "Generating..." : "Generate a user"}
        </button>

        {result && (
          <div className="mt-8 bg-white border border-btf-sky-pale rounded-2xl p-6">
            {result.success ? (
              <>
                <p className="text-[11px] tracking-[0.2em] text-btf-sky uppercase font-semibold mb-3">
                  Success
                </p>
                <p className="text-xs text-btf-text-light mb-2">User ID</p>
                <p className="font-mono text-sm text-btf-text-dark mb-4 break-all">
                  {result.userId}
                </p>
                <p className="text-xs text-btf-text-light mb-2">Recovery code (plaintext, one time only)</p>
                <p className="font-mono text-sm text-btf-text-dark break-words leading-relaxed">
                  {result.recoveryCode}
                </p>
              </>
            ) : (
              <>
                <p className="text-[11px] tracking-[0.2em] text-red-700 uppercase font-semibold mb-3">
                  Error
                </p>
                <p className="font-mono text-sm text-btf-text-dark">
                  {result.error}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
