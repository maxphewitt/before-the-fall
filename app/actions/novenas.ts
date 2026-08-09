"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "../lib/supabase";
import { getCurrentUserId } from "../lib/session";
import { getNovenaById } from "../lib/novenas";
import type { ServerResult } from "../lib/habitTypes";

/**
 * Novena progress (task-43). Deliberately forgiving: a missed day never
 * resets progress (unlike the traditional restart rule) — we let the user
 * continue. current_day is the next day to pray (1..10, where 10 = done);
 * completed_days is how many of the 9 they have prayed.
 */

const NOT_SIGNED_IN = "You're not signed in.";
const GENERIC = "Something went wrong. Please try again.";

export type NovenaProgress = {
  novenaId: string;
  currentDay: number;
  completedDays: number;
  completed: boolean;
  /** Local "HH:MM" reminder time if the user added this novena to their day. */
  reminderTime: string | null;
};

export async function listNovenaProgress(): Promise<ServerResult<NovenaProgress[]>> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("novena_progress")
      .select("novena_id, current_day, completed_days, completed_at, reminder_time")
      .eq("user_id", userId);
    if (error) {
      console.error("listNovenaProgress DB error:", error);
      return { success: false, error: GENERIC };
    }
    const rows: NovenaProgress[] = (data ?? []).map((r) => ({
      novenaId: r.novena_id as string,
      currentDay: (r.current_day as number) ?? 1,
      completedDays: (r.completed_days as number) ?? 0,
      completed: r.completed_at !== null,
      reminderTime: r.reminder_time ? (r.reminder_time as string).slice(0, 5) : null,
    }));
    return { success: true, data: rows };
  } catch (err) {
    console.error("listNovenaProgress exception:", err);
    return { success: false, error: GENERIC };
  }
}

export async function getNovenaProgress(
  novenaId: string
): Promise<NovenaProgress | null> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return null;
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("novena_progress")
      .select("current_day, completed_days, completed_at, reminder_time")
      .eq("user_id", userId)
      .eq("novena_id", novenaId)
      .maybeSingle();
    if (error || !data) return null;
    return {
      novenaId,
      currentDay: (data.current_day as number) ?? 1,
      completedDays: (data.completed_days as number) ?? 0,
      completed: data.completed_at !== null,
      reminderTime: data.reminder_time ? (data.reminder_time as string).slice(0, 5) : null,
    };
  } catch (err) {
    console.error("getNovenaProgress exception:", err);
    return null;
  }
}

/**
 * Add (or clear) a daily reminder time for an in-progress novena. Called from
 * the Day-1 completion screen ("add to my day"). Pass "HH:MM" to set, null to
 * clear. Requires a novena_progress row (present once Day 1 is recorded).
 */
export async function setNovenaReminder(
  novenaId: string,
  time: string | null
): Promise<ServerResult> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };
    if (!getNovenaById(novenaId)) return { success: false, error: "Unknown novena." };

    let normalized: string | null = null;
    if (time && time.trim() !== "") {
      const m = time.trim().match(/^(\d{1,2}):(\d{2})$/);
      if (!m || Number(m[1]) > 23 || Number(m[2]) > 59) {
        return { success: false, error: "That time doesn't look right." };
      }
      normalized = `${m[1].padStart(2, "0")}:${m[2]}`;
    }

    const supabase = supabaseServer();
    const { error } = await supabase
      .from("novena_progress")
      .update({ reminder_time: normalized })
      .eq("user_id", userId)
      .eq("novena_id", novenaId);
    if (error) {
      console.error("setNovenaReminder DB error:", error);
      return { success: false, error: GENERIC };
    }
    revalidatePath("/home");
    revalidatePath(`/catholic-path/novenas/${novenaId}`);
    return { success: true };
  } catch (err) {
    console.error("setNovenaReminder exception:", err);
    return { success: false, error: GENERIC };
  }
}

export async function recordNovenaDay(
  novenaId: string,
  day: number
): Promise<ServerResult<{ currentDay: number; completed: boolean }>> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };
    const novena = getNovenaById(novenaId);
    if (!novena) return { success: false, error: "Unknown novena." };
    if (day < 1 || day > 9) return { success: false, error: "Invalid day." };

    const supabase = supabaseServer();
    const { data: existing } = await supabase
      .from("novena_progress")
      .select("current_day, completed_days, completed_at, started_at")
      .eq("user_id", userId)
      .eq("novena_id", novenaId)
      .maybeSingle();

    const prevCurrent = (existing?.current_day as number) ?? 1;
    const prevCompleted = (existing?.completed_days as number) ?? 0;

    // Monotonic + forgiving: praying day N means days 1..N are done.
    const newCompleted = Math.min(9, Math.max(prevCompleted, day));
    const newCurrent = Math.min(10, Math.max(prevCurrent, day + 1));
    const isDone = newCompleted >= 9;
    const nowIso = new Date().toISOString();

    const { error } = await supabase
      .from("novena_progress")
      .upsert(
        {
          user_id: userId,
          novena_id: novenaId,
          current_day: newCurrent,
          completed_days: newCompleted,
          last_prayed_at: nowIso,
          completed_at: isDone
            ? ((existing?.completed_at as string | null) ?? nowIso)
            : null,
          ...(existing?.started_at ? {} : { started_at: nowIso }),
        },
        { onConflict: "user_id,novena_id" }
      );

    if (error) {
      console.error("recordNovenaDay DB error:", error);
      return { success: false, error: GENERIC };
    }

    revalidatePath(`/catholic-path/novenas/${novenaId}`);
    revalidatePath("/catholic-path/novenas");
    return { success: true, data: { currentDay: newCurrent, completed: isDone } };
  } catch (err) {
    console.error("recordNovenaDay exception:", err);
    return { success: false, error: GENERIC };
  }
}
