/**
 * Wisdom readings (2026-07-21) — the secular mirror of Daily Scripture.
 *
 * Rules (Max, 2026-07-21): NO religion and NO spirituality of any kind.
 * Sources are philosophers, poets, and historic figures only, all public
 * domain (pre-1930 publications / PD translations: George Long's Marcus
 * Aurelius, Carter/Higginson's Epictetus, Gummere's Seneca, etc.).
 *
 * DRAFT v1 — passage wording is from public-domain translations quoted
 * from reference; VERIFY exact wording against the printed PD editions
 * before public launch (flagged in the pre-launch copyright note).
 * Framing is supportive, never clinical.
 */

export type WisdomTheme =
  | "anxiety"
  | "courage"
  | "grief"
  | "self-control"
  | "hope"
  | "starting-over"
  | "stillness"
  | "perseverance";

export const WISDOM_THEMES: { slug: WisdomTheme; label: string }[] = [
  { slug: "anxiety", label: "Anxiety" },
  { slug: "courage", label: "Courage" },
  { slug: "grief", label: "Grief" },
  { slug: "self-control", label: "Self-control" },
  { slug: "hope", label: "Hope" },
  { slug: "starting-over", label: "Starting over" },
  { slug: "stillness", label: "Stillness" },
  { slug: "perseverance", label: "Perseverance" },
];

export type WisdomReading = {
  id: string;
  author: string;
  source: string; // work + translator where relevant
  themes: WisdomTheme[];
  text: string;
};

export const WISDOM_READINGS: WisdomReading[] = [
  {
    id: "aurelius-rising",
    author: "Marcus Aurelius",
    source: "Meditations, Book V (trans. George Long)",
    themes: ["starting-over", "perseverance"],
    text: "In the morning when thou risest unwillingly, let this thought be present: I am rising to the work of a human being. Why then am I dissatisfied if I am going to do the things for which I exist and for which I was brought into the world?",
  },
  {
    id: "aurelius-future",
    author: "Marcus Aurelius",
    source: "Meditations, Book VII (trans. George Long)",
    themes: ["anxiety"],
    text: "Let not future things disturb thee, for thou wilt come to them, if it shall be necessary, having with thee the same reason which now thou usest for present things.",
  },
  {
    id: "aurelius-obstacle",
    author: "Marcus Aurelius",
    source: "Meditations, Book V (trans. George Long)",
    themes: ["perseverance", "courage"],
    text: "The mind converts and turns to its own purpose every hindrance to its activity; and that which is an obstacle on the road helps us on this road.",
  },
  {
    id: "aurelius-whole-life",
    author: "Marcus Aurelius",
    source: "Meditations, Book VIII (trans. George Long)",
    themes: ["anxiety", "stillness"],
    text: "Do not disturb thyself by thinking of the whole of thy life. Let not thy thoughts at once embrace all the various troubles which thou mayest expect to befall thee: but on every occasion ask thyself, What is there in this which is intolerable and past bearing?",
  },
  {
    id: "epictetus-control",
    author: "Epictetus",
    source: "Enchiridion, ch. 1 (trans. Elizabeth Carter)",
    themes: ["self-control", "anxiety"],
    text: "Some things are in our control and others not. Things in our control are opinion, pursuit, desire, aversion, and, in a word, whatever are our own actions. Things not in our control are body, property, reputation, command, and, in one word, whatever are not our own actions.",
  },
  {
    id: "epictetus-notions",
    author: "Epictetus",
    source: "Enchiridion, ch. 5 (trans. Elizabeth Carter)",
    themes: ["anxiety", "self-control"],
    text: "Men are disturbed, not by things, but by the principles and notions which they form concerning things. When therefore we are hindered, or disturbed, or grieved, let us never attribute it to others, but to ourselves — that is, to our own principles.",
  },
  {
    id: "seneca-imagination",
    author: "Seneca",
    source: "Letters to Lucilius, XIII (trans. Richard Gummere)",
    themes: ["anxiety"],
    text: "There are more things likely to frighten us than there are to crush us; we suffer more often in imagination than in reality. Some things torment us more than they ought; some torment us before they ought; and some torment us when they ought not to torment us at all.",
  },
  {
    id: "seneca-grief",
    author: "Seneca",
    source: "Letters to Lucilius, LXIII (trans. Richard Gummere)",
    themes: ["grief"],
    text: "Let not the eyes be dry when we have lost a friend, nor let them overflow. We may weep, but we must not wail. Let us see to it that the recollection of those whom we have lost becomes a pleasant memory to us.",
  },
  {
    id: "seneca-postponing",
    author: "Seneca",
    source: "Letters to Lucilius, I (trans. Richard Gummere)",
    themes: ["starting-over", "perseverance"],
    text: "While we are postponing, life speeds by. Nothing is ours except time. Hold every hour in your grasp; lay hold of today's task, and you will not need to depend so much upon tomorrow's.",
  },
  {
    id: "thoreau-deliberately",
    author: "Henry David Thoreau",
    source: "Walden (1854)",
    themes: ["stillness", "starting-over"],
    text: "I went to the woods because I wished to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach, and not, when I came to die, discover that I had not lived.",
  },
  {
    id: "thoreau-dreams",
    author: "Henry David Thoreau",
    source: "Walden (1854)",
    themes: ["hope", "courage"],
    text: "If one advances confidently in the direction of his dreams, and endeavors to live the life which he has imagined, he will meet with a success unexpected in common hours.",
  },
  {
    id: "emerson-trust",
    author: "Ralph Waldo Emerson",
    source: "Self-Reliance (1841)",
    themes: ["courage"],
    text: "Trust thyself: every heart vibrates to that iron string. Insist on yourself; never imitate. Nothing can bring you peace but yourself.",
  },
  {
    id: "emerson-finish-day",
    author: "Ralph Waldo Emerson",
    source: "Journals",
    themes: ["starting-over"],
    text: "Finish each day and be done with it. You have done what you could; some blunders and absurdities no doubt crept in; forget them as soon as you can. Tomorrow is a new day; begin it well and serenely.",
  },
  {
    id: "henley-invictus",
    author: "William Ernest Henley",
    source: "Invictus (1888)",
    themes: ["courage", "perseverance"],
    text: "In the fell clutch of circumstance I have not winced nor cried aloud. Under the bludgeonings of chance my head is bloody, but unbowed. … I am the master of my fate: I am the captain of my soul.",
  },
  {
    id: "kipling-if",
    author: "Rudyard Kipling",
    source: "If— (1910)",
    themes: ["self-control", "perseverance"],
    text: "If you can keep your head when all about you are losing theirs and blaming it on you; if you can trust yourself when all men doubt you, but make allowance for their doubting too; if you can wait and not be tired by waiting … yours is the Earth and everything that's in it.",
  },
  {
    id: "longfellow-psalm",
    author: "Henry Wadsworth Longfellow",
    source: "A Psalm of Life (1838)",
    themes: ["hope", "perseverance"],
    text: "Let us, then, be up and doing, with a heart for any fate; still achieving, still pursuing, learn to labor and to wait.",
  },
  {
    id: "whitman-enough",
    author: "Walt Whitman",
    source: "Song of Myself (1855)",
    themes: ["stillness", "courage"],
    text: "I exist as I am, that is enough. If no other in the world be aware, I sit content; and if each and all be aware, I sit content.",
  },
  {
    id: "dickinson-hope",
    author: "Emily Dickinson",
    source: "'Hope' is the thing with feathers (c. 1861)",
    themes: ["hope"],
    text: "'Hope' is the thing with feathers that perches in the soul, and sings the tune without the words, and never stops at all, and sweetest in the gale is heard; and sore must be the storm that could abash the little bird that kept so many warm.",
  },
  {
    id: "douglass-struggle",
    author: "Frederick Douglass",
    source: "West India Emancipation speech (1857)",
    themes: ["perseverance", "courage"],
    text: "If there is no struggle, there is no progress. Those who profess to favor freedom, and yet deprecate agitation, are men who want crops without plowing up the ground.",
  },
  {
    id: "franklin-strokes",
    author: "Benjamin Franklin",
    source: "Poor Richard's Almanack",
    themes: ["perseverance", "starting-over"],
    text: "Little strokes fell great oaks. Lost time is never found again. Diligence is the mother of good luck.",
  },
];

/** Readings for a theme (or all). */
export function readingsByTheme(theme?: WisdomTheme): WisdomReading[] {
  if (!theme) return WISDOM_READINGS;
  return WISDOM_READINGS.filter((r) => r.themes.includes(theme));
}

/** Deterministic daily pick — same reading for everyone all day. */
export function dailyWisdom(d: Date = new Date()): WisdomReading {
  const start = Date.UTC(d.getFullYear(), 0, 0);
  const day = Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - start) / 86400000);
  return WISDOM_READINGS[day % WISDOM_READINGS.length];
}
