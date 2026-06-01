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

export type BetaCodeActivity = {
  lastSeenAt: string | null;       // most recent users.last_seen_at among linked users
  journalEntries: number;           // non-deleted, non-activity-type journal rows
  toolSessions: number;             // journal rows with journal_type='activity'
  habitCompletions: number;
  incidentsFlagged: number;         // all-time incidents linked to these users
  daysActiveLast30: number;         // distinct calendar days with any activity in last 30 days
};

export type BetaCodeRow = {
  id: string;
  label: string | null;
  createdAt: string;
  deactivatedAt: string | null;
  // Redemption-side metrics (only bump on /api/verify-code).
  lastUsedAt: string | null;
  useCount: number;
  sessionCount: number;
  signupCount: number;
  // Per-tester daily-activity rollup across all users that signed up
  // under this code. Null when no users have onboarded under it yet.
  // Closed-beta convention is one user per code; tolerates more.
  activity: BetaCodeActivity | null;
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

    // Pull session counts (one row per code redemption).
    const { data: sessions } = await supabase
      .from("beta_access_sessions")
      .select("beta_code_id");
    const sessionCounts = new Map<string, number>();
    for (const row of sessions ?? []) {
      const k = row.beta_code_id as string;
      sessionCounts.set(k, (sessionCounts.get(k) ?? 0) + 1);
    }

    // Pull users that signed up under any beta code. We need id +
    // last_seen_at so we can later aggregate their daily activity per
    // code, and group user_ids by beta_access_code_id.
    const { data: users } = await supabase
      .from("users")
      .select("id, beta_access_code_id, last_seen_at")
      .not("beta_access_code_id", "is", null);

    const usersByCode = new Map<
      string,
      { id: string; lastSeenAt: string | null }[]
    >();
    for (const u of users ?? []) {
      const codeId = u.beta_access_code_id as string;
      const userId = u.id as string;
      const lastSeenAt = (u.last_seen_at as string | null) ?? null;
      if (!usersByCode.has(codeId)) usersByCode.set(codeId, []);
      usersByCode.get(codeId)!.push({ id: userId, lastSeenAt });
    }

    const allLinkedUserIds = Array.from(usersByCode.values())
      .flat()
      .map((u) => u.id);

    // Bulk-fetch activity for every linked user, then bucket by user_id.
    // At closed-beta scale (≤ ~50 users) this is fine; revisit if we
    // ever break into hundreds.
    const journalByUser = new Map<
      string,
      { kind: "activity" | "other"; createdAt: string }[]
    >();
    const habitsByUser = new Map<string, string[]>(); // user_id -> completed_at[]
    const incidentsByUser = new Map<string, number>();

    if (allLinkedUserIds.length > 0) {
      const { data: journals } = await supabase
        .from("journal_entries")
        .select("user_id, journal_type, created_at")
        .in("user_id", allLinkedUserIds)
        .is("deleted_at", null);
      for (const j of journals ?? []) {
        const uid = j.user_id as string;
        const kind =
          (j.journal_type as string) === "activity" ? "activity" : "other";
        const createdAt = j.created_at as string;
        if (!journalByUser.has(uid)) journalByUser.set(uid, []);
        journalByUser.get(uid)!.push({ kind, createdAt });
      }

      const { data: habits } = await supabase
        .from("habit_completions")
        .select("user_id, completed_at")
        .in("user_id", allLinkedUserIds);
      for (const h of habits ?? []) {
        const uid = h.user_id as string;
        if (!habitsByUser.has(uid)) habitsByUser.set(uid, []);
        habitsByUser.get(uid)!.push(h.completed_at as string);
      }

      const { data: incidents } = await supabase
        .from("incidents")
        .select("user_id")
        .in("user_id", allLinkedUserIds);
      for (const inc of incidents ?? []) {
        const uid = inc.user_id as string;
        incidentsByUser.set(uid, (incidentsByUser.get(uid) ?? 0) + 1);
      }
    }

    // Build per-code activity rollup.
    const day30Ago = new Date();
    day30Ago.setUTCDate(day30Ago.getUTCDate() - 30);

    function rollupForCode(codeId: string): BetaCodeActivity | null {
      const codeUsers = usersByCode.get(codeId);
      if (!codeUsers || codeUsers.length === 0) return null;

      let lastSeenAt: string | null = null;
      let journalEntries = 0;
      let toolSessions = 0;
      let habitCompletions = 0;
      let incidentsFlagged = 0;
      const activeDays = new Set<string>(); // YYYY-MM-DD

      for (const u of codeUsers) {
        if (u.lastSeenAt && (!lastSeenAt || u.lastSeenAt > lastSeenAt)) {
          lastSeenAt = u.lastSeenAt;
        }
        for (const j of journalByUser.get(u.id) ?? []) {
          if (j.kind === "activity") toolSessions += 1;
          else journalEntries += 1;
          if (new Date(j.createdAt) >= day30Ago) {
            activeDays.add(j.createdAt.slice(0, 10));
          }
        }
        for (const completedAt of habitsByUser.get(u.id) ?? []) {
          habitCompletions += 1;
          if (new Date(completedAt) >= day30Ago) {
            activeDays.add(completedAt.slice(0, 10));
          }
        }
        // last_seen_at also implies activity on that calendar day.
        if (u.lastSeenAt && new Date(u.lastSeenAt) >= day30Ago) {
          activeDays.add(u.lastSeenAt.slice(0, 10));
        }
        incidentsFlagged += incidentsByUser.get(u.id) ?? 0;
      }

      return {
        lastSeenAt,
        journalEntries,
        toolSessions,
        habitCompletions,
        incidentsFlagged,
        daysActiveLast30: activeDays.size,
      };
    }

    const rows: BetaCodeRow[] = (codes ?? []).map((c) => {
      const codeId = c.id as string;
      return {
        id: codeId,
        label: (c.label as string | null) ?? null,
        createdAt: c.created_at as string,
        deactivatedAt: (c.deactivated_at as string | null) ?? null,
        lastUsedAt: (c.last_used_at as string | null) ?? null,
        useCount: c.use_count as number,
        sessionCount: sessionCounts.get(codeId) ?? 0,
        signupCount: usersByCode.get(codeId)?.length ?? 0,
        activity: rollupForCode(codeId),
      };
    });

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
      "Label,Code id,Created at,Deactivated at,Last redeemed at,Redeem count,Session count,Signups attributed,Last seen at,Journal entries,Tool sessions,Habit completions,Days active (30d),Incidents flagged"
    );
    for (const row of list.data) {
      const a = row.activity;
      const fields = [
        csvEscape(row.label ?? ""),
        row.id,
        row.createdAt,
        row.deactivatedAt ?? "",
        row.lastUsedAt ?? "",
        String(row.useCount),
        String(row.sessionCount),
        String(row.signupCount),
        a?.lastSeenAt ?? "",
        String(a?.journalEntries ?? 0),
        String(a?.toolSessions ?? 0),
        String(a?.habitCompletions ?? 0),
        String(a?.daysActiveLast30 ?? 0),
        String(a?.incidentsFlagged ?? 0),
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
