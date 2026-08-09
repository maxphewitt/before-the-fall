"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "../lib/supabase";
import { getCurrentUserId } from "../lib/session";
import { scanForTriggers } from "../lib/triggerScan";
import type { ServerResult } from "../lib/habitTypes";

/**
 * Walk Together actions: community-novena enrollment + counts, the anonymous
 * intentions wall (safety-scanned), and seasonal-challenge enrollment.
 * Communal, never competitive — only aggregate counts are ever exposed.
 */

const NOT_SIGNED_IN = "You're not signed in.";
const GENERIC = "Something went wrong. Please try again.";

/* ── Enrollment (community novenas + challenges share one table) ── */

export async function getEnrollment(
  itemId: string
): Promise<{ count: number; joined: boolean }> {
  try {
    const userId = await getCurrentUserId();
    const supabase = supabaseServer();
    const { count } = await supabase
      .from("community_enrollments")
      .select("*", { count: "exact", head: true })
      .eq("item_id", itemId);
    let joined = false;
    if (userId) {
      const { data } = await supabase
        .from("community_enrollments")
        .select("item_id")
        .eq("item_id", itemId)
        .eq("user_id", userId)
        .maybeSingle();
      joined = !!data;
    }
    return { count: count ?? 0, joined };
  } catch (err) {
    console.error("getEnrollment exception:", err);
    return { count: 0, joined: false };
  }
}

export async function joinCommunity(itemId: string): Promise<ServerResult> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };
    const supabase = supabaseServer();
    const { error } = await supabase
      .from("community_enrollments")
      .upsert(
        { user_id: userId, item_id: itemId, joined_at: new Date().toISOString() },
        { onConflict: "user_id,item_id", ignoreDuplicates: true }
      );
    if (error) {
      console.error("joinCommunity DB error:", error);
      return { success: false, error: GENERIC };
    }
    revalidatePath("/catholic-path/together");
    return { success: true };
  } catch (err) {
    console.error("joinCommunity exception:", err);
    return { success: false, error: GENERIC };
  }
}

/* ── Intentions wall ── */

export type WallIntention = {
  id: string;
  body: string;
  prayerCount: number;
  prayed: boolean;
  createdAt: string;
};

export async function listCommunityIntentions(): Promise<ServerResult<WallIntention[]>> {
  try {
    const userId = await getCurrentUserId();
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("community_intentions")
      .select("id, body, prayer_count, created_at")
      .eq("hidden", false)
      .order("created_at", { ascending: false })
      .limit(60);
    if (error) {
      console.error("listCommunityIntentions DB error:", error);
      return { success: false, error: GENERIC };
    }
    const rows = data ?? [];
    let prayedSet = new Set<string>();
    if (userId && rows.length > 0) {
      const { data: prayed } = await supabase
        .from("community_intention_prayers")
        .select("intention_id")
        .eq("user_id", userId)
        .in("intention_id", rows.map((r) => r.id as string));
      prayedSet = new Set((prayed ?? []).map((p) => p.intention_id as string));
    }
    const intentions: WallIntention[] = rows.map((r) => ({
      id: r.id as string,
      body: r.body as string,
      prayerCount: (r.prayer_count as number) ?? 0,
      prayed: prayedSet.has(r.id as string),
      createdAt: r.created_at as string,
    }));
    return { success: true, data: intentions };
  } catch (err) {
    console.error("listCommunityIntentions exception:", err);
    return { success: false, error: GENERIC };
  }
}

export async function postCommunityIntention(
  raw: string
): Promise<ServerResult<{ hidden: boolean }>> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };
    const body = raw.trim().slice(0, 280);
    if (body.length === 0) return { success: false, error: "Your intention is empty." };

    // Safety scan BEFORE it can appear publicly. Any hit → stored hidden
    // (kept for review, never broadcast on the public wall).
    const scan = scanForTriggers(body);
    const hidden = scan.hit;

    const supabase = supabaseServer();
    const { error } = await supabase.from("community_intentions").insert({
      user_id: userId,
      body,
      hidden,
    });
    if (error) {
      console.error("postCommunityIntention DB error:", error);
      return { success: false, error: GENERIC };
    }
    revalidatePath("/catholic-path/together");
    return { success: true, data: { hidden } };
  } catch (err) {
    console.error("postCommunityIntention exception:", err);
    return { success: false, error: GENERIC };
  }
}

export async function prayForIntention(intentionId: string): Promise<ServerResult> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };
    const supabase = supabaseServer();

    // Dedupe: one prayer per user per intention.
    const { error: insErr } = await supabase
      .from("community_intention_prayers")
      .insert({ user_id: userId, intention_id: intentionId });
    if (insErr) {
      // Unique violation = already prayed; treat as success no-op.
      if ((insErr as { code?: string }).code === "23505") return { success: true };
      console.error("prayForIntention insert error:", insErr);
      return { success: false, error: GENERIC };
    }

    // Increment the count (fetch-then-update; race-tolerant at this scale).
    const { data: cur } = await supabase
      .from("community_intentions")
      .select("prayer_count")
      .eq("id", intentionId)
      .maybeSingle();
    const next = ((cur?.prayer_count as number) ?? 0) + 1;
    await supabase
      .from("community_intentions")
      .update({ prayer_count: next })
      .eq("id", intentionId);

    revalidatePath("/catholic-path/together");
    return { success: true };
  } catch (err) {
    console.error("prayForIntention exception:", err);
    return { success: false, error: GENERIC };
  }
}
