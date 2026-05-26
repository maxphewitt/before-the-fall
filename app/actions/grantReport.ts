"use server";

import { getCurrentAdminId } from "../lib/adminSession";
import { supabaseServer } from "../lib/supabase";

/**
 * Server action to generate a grant-reporting CSV.
 *
 * Admin-gated. Returns a CSV string the client downloads as a Blob.
 * Contains aggregates only — no individual user identifiers, no
 * journal content. Two sections: top-level totals for the date range
 * + a daily activity row per date in the range.
 */

type Ok = { success: true; data: { csv: string; filename: string } };
type Err = { success: false; error: string };

export async function fetchGrantReportCsv(input: {
  from: string; // YYYY-MM-DD
  to: string;   // YYYY-MM-DD
}): Promise<Ok | Err> {
  try {
    const adminId = await getCurrentAdminId();
    if (!adminId) return { success: false, error: "Not signed in as admin." };

    // Validate inputs.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.from) || !/^\d{4}-\d{2}-\d{2}$/.test(input.to)) {
      return { success: false, error: "Invalid date format." };
    }
    if (input.from > input.to) {
      return { success: false, error: "From date must be on or before To date." };
    }

    const fromISO = `${input.from}T00:00:00Z`;
    const toISO = `${input.to}T23:59:59.999Z`;
    const supabase = supabaseServer();

    // Totals
    const { count: usersInRange } = await supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .gte("created_at", fromISO)
      .lte("created_at", toISO);

    const { count: completionsInRange } = await supabase
      .from("habit_completions")
      .select("id", { count: "exact", head: true })
      .gte("completed_at", fromISO)
      .lte("completed_at", toISO);

    const { count: journalEntriesInRange } = await supabase
      .from("journal_entries")
      .select("id", { count: "exact", head: true })
      .neq("journal_type", "activity")
      .is("deleted_at", null)
      .gte("created_at", fromISO)
      .lte("created_at", toISO);

    const { count: toolSessionsInRange } = await supabase
      .from("journal_entries")
      .select("id", { count: "exact", head: true })
      .eq("journal_type", "activity")
      .is("deleted_at", null)
      .gte("created_at", fromISO)
      .lte("created_at", toISO);

    const { count: incidentsInRange } = await supabase
      .from("incidents")
      .select("id", { count: "exact", head: true })
      .gte("created_at", fromISO)
      .lte("created_at", toISO);

    // Distinct active users in range
    const { data: activeRows } = await supabase
      .from("habit_completions")
      .select("user_id")
      .gte("completed_at", fromISO)
      .lte("completed_at", toISO);
    const activeUsersInRange = new Set(
      (activeRows ?? []).map((r) => r.user_id as string)
    ).size;

    // Population breakdown across ALL users (since recovery code → user
    // is identity, we count cumulative populations, not date-filtered).
    const { data: profileRows } = await supabase
      .from("user_profiles")
      .select("populations");
    const popCounts = new Map<string, number>();
    for (const row of profileRows ?? []) {
      const pops = (row.populations as string[] | null) ?? [];
      for (const p of pops) popCounts.set(p, (popCounts.get(p) ?? 0) + 1);
    }

    // Per-day activity in range
    const { data: dailyRows } = await supabase
      .from("habit_completions")
      .select("user_id, completed_at")
      .gte("completed_at", fromISO)
      .lte("completed_at", toISO);
    const dayBucket = new Map<
      string,
      { users: Set<string>; completions: number }
    >();
    for (const row of dailyRows ?? []) {
      const iso = (row.completed_at as string).slice(0, 10);
      const cur = dayBucket.get(iso) ?? { users: new Set(), completions: 0 };
      cur.users.add(row.user_id as string);
      cur.completions += 1;
      dayBucket.set(iso, cur);
    }

    // Build CSV.
    const lines: string[] = [];
    lines.push("# Before the Fall — Grant Report");
    lines.push(`# Date range: ${input.from} to ${input.to}`);
    lines.push(`# Generated: ${new Date().toISOString()}`);
    lines.push(`# Aggregates only. No individual user identifiers or content.`);
    lines.push("");
    lines.push("Section,Metric,Value");
    lines.push(`Totals in range,New users registered,${usersInRange ?? 0}`);
    lines.push(`Totals in range,Distinct active users,${activeUsersInRange}`);
    lines.push(`Totals in range,Habit completions,${completionsInRange ?? 0}`);
    lines.push(`Totals in range,Journal entries (non-activity),${journalEntriesInRange ?? 0}`);
    lines.push(`Totals in range,Tool sessions (activity entries),${toolSessionsInRange ?? 0}`);
    lines.push(`Totals in range,Incidents created (crisis routing events),${incidentsInRange ?? 0}`);
    lines.push("");
    lines.push("Populations (cumulative across all users)");
    lines.push("Population,Users");
    for (const [pop, n] of Array.from(popCounts.entries()).sort(
      (a, b) => b[1] - a[1]
    )) {
      lines.push(`${csvEscape(pop)},${n}`);
    }
    lines.push("");
    lines.push("Daily activity in range");
    lines.push("Date,Active users,Completions");
    // Iterate through every date in the range so missing days show 0.
    const startDate = new Date(input.from + "T00:00:00Z");
    const endDate = new Date(input.to + "T00:00:00Z");
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setUTCDate(d.getUTCDate() + 1)
    ) {
      const iso = d.toISOString().slice(0, 10);
      const bucket = dayBucket.get(iso);
      lines.push(
        `${iso},${bucket?.users.size ?? 0},${bucket?.completions ?? 0}`
      );
    }

    return {
      success: true,
      data: {
        csv: lines.join("\n") + "\n",
        filename: `before-the-fall_grant-report_${input.from}_to_${input.to}.csv`,
      },
    };
  } catch (err) {
    console.error("fetchGrantReportCsv exception:", err);
    return { success: false, error: "Server error generating report." };
  }
}

function csvEscape(s: string): string {
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}
