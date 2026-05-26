"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdminId } from "../lib/adminSession";
import { supabaseServer } from "../lib/supabase";
import {
  generateBetaAccessCode,
  hashBetaAccessCode,
} from "../lib/betaAccessCode";

/**
 * Admin server actions for beta access code management. All require
 * an admin cookie.
 *
 *   mintBetaCode       — generate a new code, store hash, return
 *                        plaintext ONCE. Same posture as recovery
 *                        codes (plaintext not retrievable later).
 *   deactivateBetaCode — flip deactivated_at on a code id; sessions
 *                        already opened against it remain valid until
 *                        their cookies expire (we don't enforce a
 *                        retro-revoke at the edge).
 *   listBetaCodes      — paginated list for the admin page.
 *   exportBetaCsv      — date-range CSV for grant/program reporting
 *                        + future daily-reporting agent input.
 */

const NOT_SIGNED_IN = "Not signed in as admin.";
const GENERIC = "Server error.";

type MintOk = { success: true; code: string; id: string };
type Err = { success: false; error: string };

export async function mintBetaCode(label: string): Promise<MintOk | Err> {
  try {
    const adminId = await getCurrentAdminId();
    if (!adminId) return { success: false, error: NOT_SIGNED_IN };

    const code = generateBetaAccessCode();
    const codeHash = hashBetaAccessCode(code);
    const supabase = supabaseServer();

    const { data, error } = await supabase
      .from("beta_access_codes")
      .insert({
        code_hash: codeHash,
        label: label.trim() || null,
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("mintBetaCode DB error:", error);
      return { success: false, error: GENERIC };
    }

    revalidatePath("/admin/beta-codes");
    return { success: true, code, id: data.id as string };
  } catch (err) {
    console.error("mintBetaCode exception:", err);
    return { success: false, error: GENERIC };
  }
}

type DeactivateOk = { success: true };
export async function deactivateBetaCode(id: string): Promise<DeactivateOk | Err> {
  try {
    const adminId = await getCurrentAdminId();
    if (!adminId) return { success: false, error: NOT_SIGNED_IN };

    const supabase = supabaseServer();
    const { error } = await supabase
      .from("beta_access_codes")
      .update({ deactivated_at: new Date().toISOString() })
      .eq("id", id)
      .is("deactivated_at", null);

    if (error) {
      console.error("deactivateBetaCode DB error:", error);
      return { success: false, error: GENERIC };
    }
    revalidatePath("/admin/beta-codes");
    return { success: true };
  } catch (err) {
    console.error("deactivateBetaCode exception:", err);
    return { success: false, error: GENERIC };
  }
}

export type BetaCodeRow = {
  id: string;
  label: string | null;
  createdAt: string;
  deactivatedAt: string | null;
  lastUsedAt: string | null;
  useCount: number;
  sessionCount: number;
  signupCount: number;
};

type ListOk = { success: true; data: BetaCodeRow[] };
export async function listBetaCodes(): Promise<ListOk | Err> {
  try {
    const adminId = await getCurrentAdminId();
    if (!adminId) return { success: false, error: NOT_SIGNED_IN };

    const supabase = supabaseServer();
    const { data: codes, error } = await supabase
      .from("beta_access_codes")
      .select("id, label, created_at, deactivated_at, last_used_at, use_count")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("listBetaCodes DB error:", error);
      return { success: false, error: GENERIC };
    }

    // Pull session + signup counts. At closed-beta scale we just
    // fetch all sessions + users and tally client-side; if this grows,
    // do GROUP BY queries server-side.
    const { data: sessions } = await supabase
      .from("beta_access_sessions")
      .select("beta_code_id");
    const sessionCounts = new Map<string, number>();
    for (const row of sessions ?? []) {
      const k = row.beta_code_id as string;
      sessionCounts.set(k, (sessionCounts.get(k) ?? 0) + 1);
    }

    const { data: users } = await supabase
      .from("users")
      .select("beta_access_code_id")
      .not("beta_access_code_id", "is", null);
    const signupCounts = new Map<string, number>();
    for (const row of users ?? []) {
      const k = row.beta_access_code_id as string;
      signupCounts.set(k, (signupCounts.get(k) ?? 0) + 1);
    }

    const rows: BetaCodeRow[] = (codes ?? []).map((c) => ({
      id: c.id as string,
      label: (c.label as string | null) ?? null,
      createdAt: c.created_at as string,
      deactivatedAt: (c.deactivated_at as string | null) ?? null,
      lastUsedAt: (c.last_used_at as string | null) ?? null,
      useCount: c.use_count as number,
      sessionCount: sessionCounts.get(c.id as string) ?? 0,
      signupCount: signupCounts.get(c.id as string) ?? 0,
    }));

    return { success: true, data: rows };
  } catch (err) {
    console.error("listBetaCodes exception:", err);
    return { success: false, error: GENERIC };
  }
}

type CsvOk = { success: true; data: { csv: string } };
export async function exportBetaCsv(): Promise<CsvOk | Err> {
  try {
    const adminId = await getCurrentAdminId();
    if (!adminId) return { success: false, error: NOT_SIGNED_IN };

    const list = await listBetaCodes();
    if (!list.success) return list;

    const lines: string[] = [];
    lines.push("# Before the Fall — Beta access codes report");
    lines.push(`# Generated: ${new Date().toISOString()}`);
    lines.push(
      "# Each row: one tester. Aggregates only — no individual content."
    );
    lines.push("");
    lines.push(
      "Label,Code id,Created at,Deactivated at,Last used at,Use count,Session count,Signups attributed"
    );
    for (const row of list.data) {
      const fields = [
        csvEscape(row.label ?? ""),
        row.id,
        row.createdAt,
        row.deactivatedAt ?? "",
        row.lastUsedAt ?? "",
        String(row.useCount),
        String(row.sessionCount),
        String(row.signupCount),
      ];
      lines.push(fields.join(","));
    }
    return { success: true, data: { csv: lines.join("\n") + "\n" } };
  } catch (err) {
    console.error("exportBetaCsv exception:", err);
    return { success: false, error: GENERIC };
  }
}

function csvEscape(s: string): string {
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}
