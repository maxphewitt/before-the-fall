"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "../lib/supabase";
import { getCurrentUserId } from "../lib/session";
import { scanForTriggers } from "../lib/triggerScan";
import { getCollectionBySlug } from "../lib/collections";
import type { ServerResult } from "../lib/habitTypes";
import { createEntry } from "./journal";

/**
 * Reflection space actions for the "For where you are" collections: a
 * shared, ANONYMOUS list of short reflections per collection that fades
 * after 7 days, plus a private path that saves to the encrypted journal
 * instead. Bodies only — user ids and names are never exposed.
 *
 * The 7-day fade is enforced twice: a pg_cron sweep deletes old rows
 * (scripts/task-51-collection-reflections.sql), AND every read here
 * filters created_at to the last 7 days regardless.
 */

const NOT_SIGNED_IN = "You're not signed in.";
const GENERIC = "Something went wrong. Please try again.";
const UNKNOWN_COLLECTION = "We can't find that collection.";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export type CollectionReflection = {
  id: string;
  body: string;
  createdAt: string;
  hearts: number;
  hearted: boolean;
  mine: boolean;
};

export async function listCollectionReflections(
  slug: string
): Promise<ServerResult<CollectionReflection[]>> {
  try {
    if (!getCollectionBySlug(slug)) {
      return { success: false, error: UNKNOWN_COLLECTION };
    }
    const userId = await getCurrentUserId();
    const supabase = supabaseServer();

    // Belt and braces with the pg_cron sweep: never surface anything
    // older than 7 days, even if the scheduled delete hasn't run.
    const cutoff = new Date(Date.now() - SEVEN_DAYS_MS).toISOString();
    const { data, error } = await supabase
      .from("collection_reflections")
      .select("id, body, created_at, user_id")
      .eq("collection_slug", slug)
      .gt("created_at", cutoff)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) {
      console.error("listCollectionReflections DB error:", error);
      return { success: false, error: GENERIC };
    }

    const rows = data ?? [];
    const heartCounts = new Map<string, number>();
    const heartedSet = new Set<string>();
    if (rows.length > 0) {
      const { data: hearts } = await supabase
        .from("collection_reflection_hearts")
        .select("reflection_id, user_id")
        .in("reflection_id", rows.map((r) => r.id as string));
      for (const h of hearts ?? []) {
        const rid = h.reflection_id as string;
        heartCounts.set(rid, (heartCounts.get(rid) ?? 0) + 1);
        if (userId && h.user_id === userId) heartedSet.add(rid);
      }
    }

    // Anonymity: user_id is used server-side for `mine`/`hearted` only
    // and never crosses the boundary.
    const reflections: CollectionReflection[] = rows.map((r) => ({
      id: r.id as string,
      body: r.body as string,
      createdAt: r.created_at as string,
      hearts: heartCounts.get(r.id as string) ?? 0,
      hearted: heartedSet.has(r.id as string),
      mine: !!userId && r.user_id === userId,
    }));
    return { success: true, data: reflections };
  } catch (err) {
    console.error("listCollectionReflections exception:", err);
    return { success: false, error: GENERIC };
  }
}

export async function postCollectionReflection(
  slug: string,
  raw: string,
  isPublic: boolean
): Promise<ServerResult<{ savedTo: "shared" | "journal" }>> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };
    if (!getCollectionBySlug(slug)) {
      return { success: false, error: UNKNOWN_COLLECTION };
    }
    const body = (raw ?? "").trim().slice(0, 500);
    if (body.length === 0) {
      return { success: false, error: "Your reflection is empty." };
    }

    // Private path: land it in the encrypted journal as a reflection
    // entry — createEntry handles encryption, safety scan, and habits.
    if (!isPublic) {
      const res = await createEntry(body, "reflection");
      if (!res.success) return { success: false, error: res.error };
      return { success: true, data: { savedTo: "journal" } };
    }

    // Safety scan BEFORE anything can appear publicly — same rule as the
    // intentions wall. A hit is never broadcast: the reflection is saved
    // to the user's own encrypted journal instead, where createEntry's
    // scan opens the usual incident for review.
    const scan = scanForTriggers(body);
    if (scan.hit) {
      const res = await createEntry(body, "reflection");
      if (!res.success) return { success: false, error: res.error };
      return { success: true, data: { savedTo: "journal" } };
    }

    const supabase = supabaseServer();
    const { error } = await supabase.from("collection_reflections").insert({
      user_id: userId,
      collection_slug: slug,
      body,
    });
    if (error) {
      console.error("postCollectionReflection DB error:", error);
      return { success: false, error: GENERIC };
    }
    revalidatePath(`/explore/collections/${slug}`);
    return { success: true, data: { savedTo: "shared" } };
  } catch (err) {
    console.error("postCollectionReflection exception:", err);
    return { success: false, error: GENERIC };
  }
}

export async function heartReflection(
  reflectionId: string
): Promise<ServerResult> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };
    const supabase = supabaseServer();

    // Dedupe: one heart per user per reflection.
    const { error } = await supabase
      .from("collection_reflection_hearts")
      .insert({ reflection_id: reflectionId, user_id: userId });
    if (error) {
      // Unique violation = already hearted; treat as success no-op.
      if ((error as { code?: string }).code === "23505") return { success: true };
      console.error("heartReflection insert error:", error);
      return { success: false, error: GENERIC };
    }
    return { success: true };
  } catch (err) {
    console.error("heartReflection exception:", err);
    return { success: false, error: GENERIC };
  }
}
