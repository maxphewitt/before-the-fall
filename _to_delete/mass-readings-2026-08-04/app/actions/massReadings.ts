"use server";

import {
  getMassReadingsForDate,
  getWalkableReadings,
  LECTIONARY_MIN_DATE,
  LECTIONARY_MAX_DATE,
  type MassReadingSlot,
} from "../lib/lectionary";
import type { ServerResult } from "../lib/habitTypes";

/**
 * Daily Mass Readings — summary lookup for the landing page.
 *
 * Client-callable (not gated on sign-in; reading Scripture never
 * requires an account, same as Daily Scripture). Returns just citations
 * + labels for the day's list — verse text is resolved server-side per
 * reading, in the [date]/[slot] page, not here.
 */

export type MassReadingsSummary = {
  date: string;
  feast: string;
  lectionaryNumber: number;
  readings: { slot: MassReadingSlot; label: string; citation: string }[];
};

export async function getMassReadingsSummary(
  dateISO: string
): Promise<ServerResult<MassReadingsSummary>> {
  const day = getMassReadingsForDate(dateISO);
  if (!day) {
    const outOfRange = dateISO < LECTIONARY_MIN_DATE || dateISO > LECTIONARY_MAX_DATE;
    return {
      success: false,
      error: outOfRange
        ? "Today's date is outside our Mass reading library's current range."
        : "Today's readings aren't in our library yet.",
    };
  }

  const readings = getWalkableReadings(day);
  if (readings.length === 0) {
    return { success: false, error: "Today's readings aren't in our library yet." };
  }

  return {
    success: true,
    data: {
      date: dateISO,
      feast: day.feast,
      lectionaryNumber: day.lectionary_number,
      readings,
    },
  };
}
