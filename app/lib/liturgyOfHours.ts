/**
 * Liturgy of the Hours (2026-08-04) — the Church's daily cycle of
 * psalm-prayer, built from public-domain sources only, same posture as
 * the rest of the platform's Scripture content:
 *
 *   - Every psalm, canticle, and short reading below is a CITATION,
 *     resolved at request time to our own self-hosted Douay-Rheims
 *     text via lib/scriptureCitation.ts. We never hand-transcribe
 *     Scripture. Every citation here was verified directly against
 *     our own public/bible/dra/ JSON before being written down (not
 *     from memory) — see the 2026-08-04 handoff entry for the check.
 *   - Antiphons, responsories (except Compline's, which is itself a
 *     citation), intercessions, and closing collects are ORIGINAL
 *     compositions, not translations of any copyrighted breviary —
 *     same approach as the Seven Sorrows Rosary's factual summaries.
 *     DRAFT, pending Father Murphy's review like everything else.
 *   - The Our Father, Hail Holy Queen, and Sign of the Cross reuse the
 *     exact traditional wording already established in lib/rosary.ts
 *     (PRAYERS), rather than being retyped.
 *   - The MODERN ICEL/USCCB Liturgy of the Hours translation and the
 *     Grail Psalms are copyrighted — we do not use, paraphrase, or
 *     reproduce them. (Max's call, 2026-08-04: also keep a link-out to
 *     the real thing — see the landing page — for anyone who wants the
 *     full official text and doesn't need our public-domain version.)
 *
 * SCOPE (v1, 2026-08-04): one complete day — "Cycle I" — across all
 * five hours a layperson actually prays (Office of Readings, Morning,
 * Daytime, Evening, Night). The historic 4-week psalter rotation and
 * seasonal propers are NOT built — this repeats the same day. That's a
 * real, honest v1 (same "one template, deepen later" pattern as
 * monthlyDevotions), not the complete historical breviary. Traditional
 * Latin hymns (e.g. "O Splendor of God's Glory Bright") were
 * deliberately left OUT of v1 — a research pass couldn't fully verify
 * exact public-domain hymn text with confidence; add them once
 * verified directly against a primary source (hymnary.org / ccel.org),
 * not from memory.
 */

export type HourSlug =
  | "office-of-readings"
  | "morning-prayer"
  | "daytime-prayer"
  | "evening-prayer"
  | "night-prayer";

export type HourStep =
  | { kind: "note"; label?: string; lines: string[] }
  | { kind: "versicle"; citation: string }
  | { kind: "doxology" }
  | { kind: "psalmody"; label: string; antiphon: string; citation: string }
  | { kind: "canticle"; label: string; antiphon: string; citation: string }
  | { kind: "reading"; label?: string; citation: string }
  | { kind: "responsory"; citation?: string; lines?: string[] }
  | { kind: "intercessions"; intro: string; petitions: string[] }
  | { kind: "ourFather" }
  | { kind: "hailHolyQueen" }
  | { kind: "signOfTheCross" }
  | { kind: "collect"; text: string }
  | { kind: "dismissal" };

export type HourOffice = {
  slug: HourSlug;
  label: string;
  subtitle: string;
  steps: HourStep[];
};

export const HOURS: HourOffice[] = [
  {
    slug: "office-of-readings",
    label: "Office of Readings",
    subtitle: "Any time — the hour for sitting longest with the Word.",
    steps: [
      { kind: "versicle", citation: "Psalm 69:2" },
      { kind: "doxology" },
      {
        kind: "psalmody",
        label: "Psalm 1",
        antiphon: "Blessed are they who delight in the law of the Lord — plant me beside the running water.",
        citation: "Psalm 1:1-6",
      },
      {
        kind: "reading",
        label: "A reading from the Letter of St. Paul to the Romans",
        citation: "Romans 8:35, 38-39",
      },
      {
        kind: "responsory",
        lines: [
          "Nothing in life or death can separate us from the love of God.",
          "Nothing in life or death can separate us from the love of God.",
        ],
      },
      {
        kind: "intercessions",
        intro: "As we begin to listen, we bring what's on our hearts:",
        petitions: [
          "For everyone waking today to a struggle they're tired of naming — steady them.",
          "For the people we carry silently — friends, family, the ones we pray for without being asked.",
          "For the grace to hear your word today, not just read it.",
          "For those who have no one praying for them right now — let this count.",
        ],
      },
      {
        kind: "collect",
        text: "Lord, you have opened our ears to your word this day. Let it take root slowly, the way seed does in the dark, unseen but working. Through Christ our Lord. Amen.",
      },
      { kind: "dismissal" },
    ],
  },
  {
    slug: "morning-prayer",
    label: "Morning Prayer",
    subtitle: "Lauds — praying the day open, before it gets away from you.",
    steps: [
      { kind: "versicle", citation: "Psalm 69:2" },
      { kind: "doxology" },
      {
        kind: "psalmody",
        label: "Psalm 63",
        antiphon: "At the break of day I watch for you, O God, my God.",
        citation: "Psalm 62:2-9",
      },
      {
        kind: "psalmody",
        label: "Psalm 148",
        antiphon: "Let everything that has breath praise the Lord this morning.",
        citation: "Psalm 148:1-6",
      },
      {
        kind: "canticle",
        label: "Canticle of Zechariah (Benedictus)",
        antiphon: "Blessed be the Lord, who visits us like the dawn from on high.",
        citation: "Luke 1:68-79",
      },
      {
        kind: "reading",
        label: "A reading from the Letter of St. Paul to the Romans",
        citation: "Romans 13:12-13",
      },
      {
        kind: "responsory",
        lines: [
          "The night is over, the day is at hand.",
          "Let us walk as children of the light.",
        ],
      },
      {
        kind: "intercessions",
        intro: "Lord, as the day opens in front of us:",
        petitions: [
          "For the choices ahead today, especially the hard ones — give us clear sight.",
          "For anyone dreading this day — meet them in it.",
          "For the people we'll cross paths with, known and unknown — let us be a mercy to them.",
          "For our own hearts — keep them soft, not hardened by what's coming.",
        ],
      },
      { kind: "ourFather" },
      {
        kind: "collect",
        text: "Father, you have brought us safely to the beginning of this day. Walk it with us — not ahead of us, not behind us, but beside us, the whole way through. Through Christ our Lord. Amen.",
      },
      { kind: "dismissal" },
    ],
  },
  {
    slug: "daytime-prayer",
    label: "Daytime Prayer",
    subtitle: "A short pause in the middle of whatever today is.",
    steps: [
      { kind: "versicle", citation: "Psalm 69:2" },
      { kind: "doxology" },
      {
        kind: "psalmody",
        label: "Psalm 119",
        antiphon: "Your word is a lamp for my feet, a light for my path.",
        citation: "Psalm 118:105-112",
      },
      {
        kind: "reading",
        label: "A reading from the Letter of St. James",
        citation: "James 1:22",
      },
      {
        kind: "responsory",
        lines: ["Be doers of the word,", "not hearers only."],
      },
      {
        kind: "collect",
        text: "Lord, in the middle of an ordinary day, keep us close to you. Whatever the next hours ask of us, let us meet them without losing sight of you. Through Christ our Lord. Amen.",
      },
      { kind: "dismissal" },
    ],
  },
  {
    slug: "evening-prayer",
    label: "Evening Prayer",
    subtitle: "Vespers — handing the day back before it hands itself back to you.",
    steps: [
      { kind: "versicle", citation: "Psalm 69:2" },
      { kind: "doxology" },
      {
        kind: "psalmody",
        label: "Psalm 141",
        antiphon: "Let my prayer rise before you like incense, O Lord, my evening sacrifice.",
        citation: "Psalm 140:1-10",
      },
      {
        kind: "psalmody",
        label: "Psalm 130",
        antiphon: "Out of the depths I cry to you, Lord — with you there is mercy.",
        citation: "Psalm 129:1-8",
      },
      {
        kind: "canticle",
        label: "Canticle of Mary (Magnificat)",
        antiphon: "My soul magnifies the Lord, for he has looked on me in my lowliness.",
        citation: "Luke 1:46-55",
      },
      {
        kind: "reading",
        label: "A reading from the First Letter of St. Paul to the Thessalonians",
        citation: "1 Thessalonians 5:5-6",
      },
      {
        kind: "responsory",
        lines: [
          "Into your hands, Lord, I entrust this day.",
          "Into your hands, Lord, I entrust this day.",
        ],
      },
      {
        kind: "intercessions",
        intro: "As the day closes, Lord, we hand it back to you:",
        petitions: [
          "For what went well today — thank you.",
          "For what didn't — mercy, not shame.",
          "For everyone who found today harder than they let on.",
          "For rest that actually restores us tonight.",
        ],
      },
      { kind: "ourFather" },
      {
        kind: "collect",
        text: "Lord, the day is nearly done, and we are grateful and tired and human. Receive what we did well, forgive what we didn't, and let this evening's peace be real. Through Christ our Lord. Amen.",
      },
      { kind: "dismissal" },
    ],
  },
  {
    slug: "night-prayer",
    label: "Night Prayer",
    subtitle: "Compline — the last thing before sleep, so tomorrow doesn't get dragged into tonight.",
    steps: [
      {
        kind: "note",
        label: "Before we begin",
        lines: [
          "A brief examination: where did you meet God today, even without noticing? Where did you fall short? Bring both honestly — this isn't about scoring the day, just naming it before you rest. (The Daily Examen in the Prayer Library walks this more slowly, if you want it.)",
        ],
      },
      { kind: "versicle", citation: "Psalm 69:2" },
      { kind: "doxology" },
      {
        kind: "psalmody",
        label: "Psalm 91",
        antiphon: "Whoever rests in the shelter of the Most High rests secure.",
        citation: "Psalm 90:1-6",
      },
      {
        kind: "reading",
        label: "A reading from the First Letter of St. Peter",
        citation: "1 Peter 5:8-9",
      },
      {
        kind: "responsory",
        citation: "Psalm 30:6",
      },
      {
        kind: "canticle",
        label: "Canticle of Simeon (Nunc Dimittis)",
        antiphon: "Lord, now you let your servant go in peace; your word has been fulfilled.",
        citation: "Luke 2:29-32",
      },
      {
        kind: "collect",
        text: "Lord, before we sleep, watch over what we cannot watch over ourselves tonight — our fears, our dreams, the people we love who are out of reach right now. Bring us to a new day, if it is your will, ready to begin again. Through Christ our Lord. Amen.",
      },
      { kind: "hailHolyQueen" },
      { kind: "signOfTheCross" },
    ],
  },
];

export function getHourBySlug(slug: string): HourOffice | undefined {
  return HOURS.find((h) => h.slug === slug);
}
