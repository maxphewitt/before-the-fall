"use server";

import { getCurrentAdminId } from "../lib/adminSession";
import { verifyChain } from "../lib/auditLog";

export type AuditVerifyResult =
  | { authorized: false }
  | { authorized: true; ok: true; rowsVerified: number; checkedAt: string }
  | {
      authorized: true;
      ok: false;
      firstBadRowId: number;
      reason: string;
      expected: string;
      actual: string;
      checkedAt: string;
    };

/**
 * Run the hash-chain integrity check on demand. Admin-gated.
 *
 * Returns a structured result so the page can render OK or the
 * first-bad-row diagnostic. The result is also useful evidence in any
 * later legal review — capture the timestamp + outcome.
 */
export async function runAuditVerify(): Promise<AuditVerifyResult> {
  const adminId = await getCurrentAdminId();
  if (!adminId) return { authorized: false };

  const result = await verifyChain();
  const checkedAt = new Date().toISOString();

  if (result.ok) {
    return {
      authorized: true,
      ok: true,
      rowsVerified: result.rowsVerified,
      checkedAt,
    };
  }

  return {
    authorized: true,
    ok: false,
    firstBadRowId: result.firstBadRowId,
    reason: result.reason,
    expected: result.expected,
    actual: result.actual,
    checkedAt,
  };
}
