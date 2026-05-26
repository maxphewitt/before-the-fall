/**
 * Liturgical calendar — given a Date, returns the current Roman Catholic
 * liturgical season.
 *
 * Movable feasts (Ash Wednesday, Easter, Pentecost) are computed from
 * a small hardcoded table for 2026–2030. For dates outside that range
 * we fall back to ordinary-time so the app never crashes on a future
 * date. TODO: implement Computus (Gauss's Easter algorithm) for the
 * general case before 2031.
 *
 * Boundaries:
 *   - Advent: 1st Sunday of Advent (Sunday on/before Nov 30+4 weeks) → Dec 24
 *   - Christmas: Dec 25 → Baptism of the Lord (~Jan 10–13)
 *   - Ordinary Time I: Baptism of the Lord → Ash Wednesday - 1
 *   - Lent: Ash Wednesday → Holy Saturday (Easter - 1)
 *   - Easter: Easter Sunday → Pentecost
 *   - Ordinary Time II: Pentecost + 1 → 1st Sunday of Advent - 1
 */

import type { LiturgicalSeason } from "./prayers";

type YearKey = number;

type MovableFeasts = {
  /** YYYY-MM-DD strings, all in local-Vatican-equivalent date logic. */
  ashWednesday: string;
  easter: string;
  pentecost: string;
  /** Baptism of the Lord — closes the Christmas season; Sunday after Jan 6. */
  baptismOfTheLord: string;
  /** First Sunday of Advent — start of the liturgical year. */
  firstSundayOfAdvent: string;
};

const TABLE: Record<YearKey, MovableFeasts> = {
  2026: {
    ashWednesday: "2026-02-18",
    easter: "2026-04-05",
    pentecost: "2026-05-24",
    baptismOfTheLord: "2026-01-11",
    firstSundayOfAdvent: "2026-11-29",
  },
  2027: {
    ashWednesday: "2027-02-10",
    easter: "2027-03-28",
    pentecost: "2027-05-16",
    baptismOfTheLord: "2027-01-10",
    firstSundayOfAdvent: "2027-11-28",
  },
  2028: {
    ashWednesday: "2028-03-01",
    easter: "2028-04-16",
    pentecost: "2028-06-04",
    baptismOfTheLord: "2028-01-09",
    firstSundayOfAdvent: "2028-12-03",
  },
  2029: {
    ashWednesday: "2029-02-14",
    easter: "2029-04-01",
    pentecost: "2029-05-20",
    baptismOfTheLord: "2029-01-07",
    firstSundayOfAdvent: "2029-12-02",
  },
  2030: {
    ashWednesday: "2030-03-06",
    easter: "2030-04-21",
    pentecost: "2030-06-09",
    baptismOfTheLord: "2030-01-13",
    firstSundayOfAdvent: "2030-12-01",
  },
};

function dateOnly(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return dateOnly(d);
}

export function getCurrentLiturgicalSeason(now: Date = new Date()): LiturgicalSeason {
  const year = now.getFullYear();
  const today = dateOnly(now);

  const cur = TABLE[year];
  const prev = TABLE[year - 1];
  if (!cur) return "ordinary-time"; // Defensive fallback.

  // Christmas: Dec 25 of previous year through Baptism of the Lord this year.
  if (prev && today >= `${year - 1}-12-25` && today <= prev.baptismOfTheLord) {
    return "christmas";
  }
  if (today >= `${year}-12-25` && cur.baptismOfTheLord) {
    // Edge case: we're between Dec 25 and year-end. Christmas season hasn't
    // crossed into next year's Baptism yet.
    return "christmas";
  }

  // Advent: 1st Sunday of Advent → Dec 24 (this year).
  if (today >= cur.firstSundayOfAdvent && today <= `${year}-12-24`) {
    return "advent";
  }

  // Lent: Ash Wednesday → Holy Saturday (Easter - 1).
  const holySaturday = addDays(cur.easter, -1);
  if (today >= cur.ashWednesday && today <= holySaturday) {
    return "lent";
  }

  // Easter: Easter Sunday → Pentecost.
  if (today >= cur.easter && today <= cur.pentecost) {
    return "easter";
  }

  // Everything else is Ordinary Time.
  return "ordinary-time";
}

/**
 * Friendly one-liner for the current season — used on the library
 * landing card.
 */
export function getSeasonBlurb(season: LiturgicalSeason): string {
  switch (season) {
    case "advent":
      return "Four weeks of waiting before Christmas. Prepare for what is coming.";
    case "christmas":
      return "The twelve days of Christmas through the Baptism of the Lord. He has come.";
    case "lent":
      return "Forty days of repentance and return. Ash Wednesday through Holy Saturday.";
    case "easter":
      return "Fifty days of resurrection joy. Easter through Pentecost. Alleluia.";
    case "ordinary-time":
      return "The long, ordinary stretch — where most of the year is lived.";
  }
}
