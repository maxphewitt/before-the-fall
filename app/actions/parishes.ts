"use server";

import { getCurrentUserId } from "../lib/session";
import { supabaseServer } from "../lib/supabase";
import type { ServerResult } from "../lib/habitTypes";

/**
 * Parish Finder actions.
 *
 * PRIVACY (non-negotiable, per Max 2026-07-21): the user's location —
 * whether browser geolocation coordinates or a typed ZIP — is used ONCE,
 * in-memory, to sort results, and is never written to the database, never
 * logged, and never attached to the user's profile. Do not add logging of
 * `lat`/`lng`/`zip` to this file.
 *
 * ZIP → coordinates uses zippopotam.us (free, no key, no account); the
 * request carries only the ZIP itself.
 */

export type ParishHit = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string | null;
  website: string | null;
  massTimes: string | null;
  confessionTimes: string | null;
  distanceMiles: number;
};

const GENERIC = "Something went wrong. Please try again.";

function haversineMiles(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 3958.8; // earth radius, miles
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

async function zipToCoords(zip: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`, {
      // Never cache per-user lookups into anything shared with identity;
      // this URL contains only the ZIP itself.
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { places?: { latitude: string; longitude: string }[] };
    const place = data.places?.[0];
    if (!place) return null;
    return { lat: parseFloat(place.latitude), lng: parseFloat(place.longitude) };
  } catch {
    return null;
  }
}

/**
 * Find the nearest parishes to a point (browser geolocation) or a ZIP.
 * Directory-scale is beta-small, so distance is computed in-process —
 * no location ever touches the database.
 */
export async function findParishes(
  input: { lat: number; lng: number } | { zip: string }
): Promise<ServerResult<ParishHit[]>> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: "Please sign in first." };

    let lat: number, lng: number;
    if ("zip" in input) {
      const zip = input.zip.trim();
      if (!/^\d{5}$/.test(zip)) {
        return { success: false, error: "Please enter a 5-digit ZIP code." };
      }
      const coords = await zipToCoords(zip);
      if (!coords) {
        return { success: false, error: "We couldn't find that ZIP code. Please check it and try again." };
      }
      ({ lat, lng } = coords);
    } else {
      lat = input.lat;
      lng = input.lng;
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
        return { success: false, error: GENERIC };
      }
    }

    const supabase = supabaseServer();

    // Bounding-box prefilter, widened until we have enough neighbors.
    // (A flat `.limit(2000)` breaks at national scale: it returns the
    // first rows by insertion order, so whole states never make the
    // cut. The box keeps the query small AND local.) 1° lat ≈ 69 mi.
    let data: Record<string, unknown>[] | null = null;
    for (const radiusDeg of [0.5, 1.5, 4, 12, 60]) {
      const { data: rows, error } = await supabase
        .from("parishes")
        .select("id, name, address, city, state, zip, phone, website, mass_times, confession_times, lat, lng")
        .gte("lat", lat - radiusDeg)
        .lte("lat", lat + radiusDeg)
        .gte("lng", lng - radiusDeg)
        .lte("lng", lng + radiusDeg)
        .limit(2000);
      if (error) {
        console.error("findParishes DB error:", error.message);
        return { success: false, error: GENERIC };
      }
      data = rows;
      if ((rows?.length ?? 0) >= 20) break;
    }

    const hits: ParishHit[] = (data ?? [])
      .map((p) => ({
        id: p.id as string,
        name: p.name as string,
        address: p.address as string,
        city: p.city as string,
        state: p.state as string,
        zip: p.zip as string,
        phone: (p.phone as string | null) ?? null,
        website: (p.website as string | null) ?? null,
        massTimes: (p.mass_times as string | null) ?? null,
        confessionTimes: (p.confession_times as string | null) ?? null,
        distanceMiles:
          Math.round(haversineMiles(lat, lng, p.lat as number, p.lng as number) * 10) / 10,
      }))
      .sort((a, b) => a.distanceMiles - b.distanceMiles)
      .slice(0, 20);

    return { success: true, data: hits };
  } catch (err) {
    console.error("findParishes exception:", err instanceof Error ? err.message : "unknown");
    return { success: false, error: GENERIC };
  }
}
