"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "../lib/supabase";
import { getCurrentUserId } from "../lib/session";
import {
  HABIT_SLUGS,
  defaultHabitsForUser,
  type HabitSlug,
  type PopulationSlug,
} from "../lib/habits";
import {
  computeStreaks,
  startOfDayISO,
  type ServerResult,
  type UserHabit,
  type TodayHabitState,
  type TodaySummary,
  type JourneyDay,
} from "../lib/habitTypes";

/**
 * Habit + completion server actions. Types and the pure streak math
 * live in app/lib/habitTypes.ts — Next.js Server Action modules can
 * only export async functions, so non-function exports stay outside.
 *
 * Two halves of this file:
 *   - User-facing habit CRUD.
 *   - Completion recording — called by walker closing screens and by
 *     createEntry / createToolSession.
 */

const NOT_SIGNED_IN = "You're not signed in.";
const GENERIC = "Something went wrong. Please try again.";

/* ────────────────────────────────────────────────────────────────────
   User habit CRUD
   ──────────────────────────────────────────────────────────────────── */

export async function listUserHabits(): Promise<ServerResult<UserHabit[]>> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };

    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("user_habits")
      .select("id, habit_slug, display_order")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("listUserHabits DB error:", error);
      return { success: false, error: GENERIC };
    }

    const habits: UserHabit[] = (data ?? []).map((row) => ({
      id: row.id as string,
      habitSlug: row.habit_slug as HabitSlug,
      displayOrder: row.display_order as number,
    }));

    return { success: true, data: habits };
  } catch (err) {
    console.error("listUserHabits exception:", err);
    return { success: false, error: GENERIC };
  }
}

export async function addUserHabit(slug: HabitSlug): Promise<ServerResult> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };
    if (!HABIT_SLUGS.includes(slug)) {
      return { success: false, error: "Unknown habit." };
    }

    const supabase = supabaseServer();
    const { data: existing } = await supabase
      .from("user_habits")
      .select("display_order")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .order("display_order", { ascending: false })
      .limit(1);
    const nextOrder =
      existing && existing.length > 0
        ? (existing[0].display_order as number) + 1
        : 0;

    const { error: insertError } = await supabase
      .from("user_habits")
      .insert({
        user_id: userId,
        habit_slug: slug,
        display_order: nextOrder,
      });

    if (insertError) {
      // Likely unique violation from a soft-deleted row. Un-soft-delete.
      const { error: updateError } = await supabase
        .from("user_habits")
        .update({ deleted_at: null, display_order: nextOrder })
        .eq("user_id", userId)
        .eq("habit_slug", slug);
      if (updateError) {
        console.error("addUserHabit DB error:", updateError);
        return { success: false, error: GENERIC };
      }
    }

    revalidatePath("/home");
    revalidatePath("/today/edit");
    return { success: true };
  } catch (err) {
    console.error("addUserHabit exception:", err);
    return { success: false, error: GENERIC };
  }
}

export async function removeUserHabit(slug: HabitSlug): Promise<ServerResult> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };

    // Field Journal is mandatory and cannot be removed.
    if (slug === "field-journal") {
      return { success: false, error: "The Field Journal is part of the platform and can't be removed." };
    }

    const supabase = supabaseServer();
    const { error } = await supabase
      .from("user_habits")
      .update({ deleted_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("habit_slug", slug)
      .is("deleted_at", null);

    if (error) {
      console.error("removeUserHabit DB error:", error);
      return { success: false, error: GENERIC };
    }

    revalidatePath("/home");
    revalidatePath("/today/edit");
    return { success: true };
  } catch (err) {
    console.error("removeUserHabit exception:", err);
    return { success: false, error: GENERIC };
  }
}

/**
 * Populate the user's habit list from their population + faith profile.
 * Called once at the end of onboarding (createUser). Safe to call again
 * later if needed (won't duplicate because of the unique index).
 */
export async function seedDefaultHabitsForUser(input: {
  userId: string;
  populations: PopulationSlug[];
  catholicPath: boolean;
}): Promise<ServerResult> {
  try {
    const defaults = defaultHabitsForUser(
      input.populations,
      input.catholicPath
    );
    if (defaults.length === 0) return { success: true };

    const supabase = supabaseServer();
    const rows = defaults.map((slug, i) => ({
      user_id: input.userId,
      habit_slug: slug,
      display_order: i,
    }));

    const { error } = await supabase
      .from("user_habits")
      .upsert(rows, {
        onConflict: "user_id,habit_slug",
        ignoreDuplicates: true,
      });

    if (error) {
      console.error("seedDefaultHabitsForUser DB error:", error);
      return { success: false, error: GENERIC };
    }
    return { success: true };
  } catch (err) {
    console.error("seedDefaultHabitsForUser exception:", err);
    return { success: false, error: GENERIC };
  }
}

/* ────────────────────────────────────────────────────────────────────
   Completion recording
   ──────────────────────────────────────────────────────────────────── */

/**
 * Insert a habit_completions row. Called by createEntry, createToolSession,
 * and walker close screens. Never throws — completion logging is
 * best-effort and must not interrupt the user's flow.
 */
export async function recordHabitCompletion(input: {
  userId: string;
  habitSlug: HabitSlug;
  sourceJournalId?: string;
}): Promise<void> {
  try {
    if (!HABIT_SLUGS.includes(input.habitSlug)) return;
    const supabase = supabaseServer();
    await supabase.from("habit_completions").insert({
      user_id: input.userId,
      habit_slug: input.habitSlug,
      source_journal_id: input.sourceJournalId ?? null,
    });
  } catch (err) {
    console.error("recordHabitCompletion swallowed error:", err);
  }
}

/**
 * Public action wrapper that resolves userId via the session cookie.
 * Used by walker close screens that don't already know the user id.
 */
export async function recordHabitCompletionForCurrentUser(
  habitSlug: HabitSlug,
  sourceJournalId?: string
): Promise<ServerResult> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };
    await recordHabitCompletion({ userId, habitSlug, sourceJournalId });
    revalidatePath("/home");
    return { success: true };
  } catch (err) {
    console.error("recordHabitCompletionForCurrentUser exception:", err);
    return { success: false, error: GENERIC };
  }
}

/* ────────────────────────────────────────────────────────────────────
   Today summary + journey
   ──────────────────────────────────────────────────────────────────── */

export async function getTodaySummary(): Promise<ServerResult<TodaySummary>> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };

    const habitsRes = await listUserHabits();
    if (!habitsRes.success) return habitsRes;

    const supabase = supabaseServer();

    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    const { data: todayRows, error: todayError } = await supabase
      .from("habit_completions")
      .select("habit_slug, completed_at")
      .eq("user_id", userId)
      .gte("completed_at", todayStart.toISOString())
      .order("completed_at", { ascending: false });

    if (todayError) {
      console.error("getTodaySummary today error:", todayError);
      return { success: false, error: GENERIC };
    }

    const completedTodayBySlug = new Map<string, string>();
    for (const row of todayRows ?? []) {
      const slug = row.habit_slug as string;
      const ts = row.completed_at as string;
      if (!completedTodayBySlug.has(slug)) completedTodayBySlug.set(slug, ts);
    }

    const todayHabits: TodayHabitState[] = habitsRes.data.map((h) => ({
      habit: h,
      completedAt: completedTodayBySlug.get(h.habitSlug) ?? null,
    }));

    const oneYearAgo = new Date();
    oneYearAgo.setUTCDate(oneYearAgo.getUTCDate() - 365);
    const { data: yearRows, error: yearError } = await supabase
      .from("habit_completions")
      .select("completed_at")
      .eq("user_id", userId)
      .gte("completed_at", oneYearAgo.toISOString());

    if (yearError) {
      console.error("getTodaySummary year error:", yearError);
      return { success: false, error: GENERIC };
    }

    const daysWithCompletion = new Set<string>();
    for (const row of yearRows ?? []) {
      daysWithCompletion.add(
        startOfDayISO(new Date(row.completed_at as string))
      );
    }

    const { currentStreak, longestStreak, timesCameBack } = computeStreaks(
      daysWithCompletion,
      new Date()
    );

    const weekStrip: { date: string; completed: boolean }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - i);
      const iso = startOfDayISO(d);
      weekStrip.push({ date: iso, completed: daysWithCompletion.has(iso) });
    }

    return {
      success: true,
      data: {
        habits: todayHabits,
        currentStreak,
        longestStreak,
        timesCameBack,
        weekStrip,
      },
    };
  } catch (err) {
    console.error("getTodaySummary exception:", err);
    return { success: false, error: GENERIC };
  }
}

export async function getJourney(
  days: number = 90
): Promise<ServerResult<JourneyDay[]>> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };

    const supabase = supabaseServer();
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - days + 1);
    since.setUTCHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("habit_completions")
      .select("completed_at")
      .eq("user_id", userId)
      .gte("completed_at", since.toISOString());

    if (error) {
      console.error("getJourney DB error:", error);
      return { success: false, error: GENERIC };
    }

    const counts = new Map<string, number>();
    for (const row of data ?? []) {
      const iso = startOfDayISO(new Date(row.completed_at as string));
      counts.set(iso, (counts.get(iso) ?? 0) + 1);
    }

    const journey: JourneyDay[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(since);
      d.setUTCDate(d.getUTCDate() + i);
      const iso = startOfDayISO(d);
      journey.push({ date: iso, completions: counts.get(iso) ?? 0 });
    }
    return { success: true, data: journey };
  } catch (err) {
    console.error("getJourney exception:", err);
    return { success: false, error: GENERIC };
  }
}
