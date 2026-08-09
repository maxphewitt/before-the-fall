"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "../lib/supabase";
import { getCurrentUserId } from "../lib/session";
import { HABIT_SLUGS, type HabitSlug } from "../lib/habits";
import type { ServerResult, HabitSchedule } from "../lib/habitTypes";

/**
 * Daily-habit scheduling actions (task-41). A schedule is a local
 * time-of-day the user wants to do a habit. It's a when-to-do-it layer
 * only: completing a scheduled habit still records a habit_completion the
 * usual way, so schedules never affect streak/journey math.
 */

const NOT_SIGNED_IN = "You're not signed in.";
const GENERIC = "Something went wrong. Please try again.";

/** Accepts "HH:MM" or "HH:MM:SS" (24h). Returns normalized "HH:MM" or null. */
function normalizeTime(raw: string | null): string | null | undefined {
  if (raw === null || raw.trim() === "") return null;
  const m = raw.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!m) return undefined; // invalid
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h < 0 || h > 23 || min < 0 || min > 59) return undefined;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

export async function listHabitSchedules(): Promise<ServerResult<HabitSchedule[]>> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };

    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("habit_schedules")
      .select("habit_slug, scheduled_time, active")
      .eq("user_id", userId);

    if (error) {
      console.error("listHabitSchedules DB error:", error);
      return { success: false, error: GENERIC };
    }

    const schedules: HabitSchedule[] = (data ?? []).map((row) => ({
      habitSlug: row.habit_slug as HabitSlug,
      // Postgres TIME comes back as "HH:MM:SS"; trim to "HH:MM".
      scheduledTime: row.scheduled_time
        ? (row.scheduled_time as string).slice(0, 5)
        : null,
      active: (row.active as boolean) ?? true,
    }));
    return { success: true, data: schedules };
  } catch (err) {
    console.error("listHabitSchedules exception:", err);
    return { success: false, error: GENERIC };
  }
}

/**
 * Set (or clear) a habit's scheduled time. Pass null/"" to clear the time
 * while keeping the row; pass "HH:MM" to set it. Upserts on (user, slug).
 */
export async function setHabitSchedule(
  slug: HabitSlug,
  time: string | null
): Promise<ServerResult> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };
    if (!HABIT_SLUGS.includes(slug)) {
      return { success: false, error: "Unknown habit." };
    }

    const normalized = normalizeTime(time);
    if (normalized === undefined) {
      return { success: false, error: "That time doesn't look right." };
    }

    const supabase = supabaseServer();
    const { error } = await supabase
      .from("habit_schedules")
      .upsert(
        {
          user_id: userId,
          habit_slug: slug,
          scheduled_time: normalized,
          active: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,habit_slug" }
      );

    if (error) {
      console.error("setHabitSchedule DB error:", error);
      return { success: false, error: GENERIC };
    }

    revalidatePath("/home");
    revalidatePath("/today/schedule");
    return { success: true };
  } catch (err) {
    console.error("setHabitSchedule exception:", err);
    return { success: false, error: GENERIC };
  }
}
