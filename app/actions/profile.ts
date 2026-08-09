"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "../lib/supabase";
import { getCurrentUserId } from "../lib/session";
import type { ServerResult } from "../lib/habitTypes";
import { ALL_THEMES } from "../lib/recommend";

/**
 * Update the user's chosen display name / nickname (optional, editable any
 * time from the You page). Trimmed and capped at 40 chars; an empty value
 * clears it. Not identity — anonymity is unchanged.
 */
export async function updateDisplayName(
  raw: string
): Promise<ServerResult> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: "You're not signed in." };

    const name = raw.trim().slice(0, 40);
    const supabase = supabaseServer();
    const { error } = await supabase
      .from("user_profiles")
      .update({ display_name: name.length > 0 ? name : null })
      .eq("user_id", userId);

    if (error) {
      console.error("updateDisplayName DB error:", error);
      return { success: false, error: "Couldn't save your name. Please try again." };
    }

    revalidatePath("/home");
    revalidatePath("/you");
    return { success: true };
  } catch (err) {
    console.error("updateDisplayName exception:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

/**
 * Save the user's chosen feed topics (theme keys). Only known themes are
 * stored; anything else is ignored. These customize the daily Scripture /
 * prayer recommendations on top of their onboarding defaults.
 */
export async function updateFeedTopics(themes: string[]): Promise<ServerResult> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: "You're not signed in." };

    const valid = Array.from(
      new Set(themes.filter((t) => (ALL_THEMES as readonly string[]).includes(t)))
    );

    const supabase = supabaseServer();
    const { error } = await supabase
      .from("user_profiles")
      .update({ feed_topics: valid })
      .eq("user_id", userId);

    if (error) {
      console.error("updateFeedTopics DB error:", error);
      return { success: false, error: "Couldn't save your topics. Please try again." };
    }

    revalidatePath("/home");
    return { success: true };
  } catch (err) {
    console.error("updateFeedTopics exception:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
