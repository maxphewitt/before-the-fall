/**
 * Ride It Out (Urge Surfing) — narration content.
 *
 * All scripture and quotes are PUBLIC DOMAIN and were verified by a
 * content-accuracy agent (2026-06-16). Corrections applied: 1 Pet 5:7
 * → KJV (was NIV), Ps 34:18 → "broken heart" (KJV), removed the
 * copyrighted Rilke translation and the spurious Rumi/Aristotle/Emerson
 * attributions, switched Marcus Aurelius/Seneca to PD translations,
 * samurai parable reworded to avoid the copyrighted Reps/Senzaki text.
 *
 * WARNING: Faith-path content is DRAFT pending review by a priest/pastor;
 * the CBT approach is pending licensed-clinician review (see PROMPT.md
 * "Accuracy" + platform Launch Gates). Every story carries sourceRefs
 * so reviewers can check it.
 *
 * Piece 1 (tagged library + trigger matching) and Piece 2 (a shared
 * "bridge back" closer pool that recombines with each story) live here.
 */

export type Path = "catholic" | "secular";
export type Moment = "welcome" | "peak" | "heard" | "closing";
export type Quote = { text: string; src: string };
export type Theme =
  | "craving"
  | "anger"
  | "loneliness"
  | "despair"
  | "late-night"
  | "boredom"
  | "shame"
  | "stress"
  | "fear"
  | "feeling-overpowered";

export type Story = {
  id: string;
  path: Path;
  themes: Theme[];
  register: string;
  sourceRefs: string[];
  /** Body of the story, one line per narrator beat. A bridge closer is
   *  appended at runtime from BRIDGES (Piece 2). */
  lines: string[];
};

/* ─── Quotes, by path + moment (all public domain) ─── */
export const QUOTES: Record<Path, Record<Moment, Quote[]>> = {
  catholic: {
    welcome: [
      { text: "Be still, and know that I am God.", src: "Psalm 46:10" },
      { text: "The Lord is my shepherd; I shall not want.", src: "Psalm 23:1" },
    ],
    peak: [
      { text: "Casting all your care upon him; for he careth for you.", src: "1 Peter 5:7 (KJV)" },
      { text: "I can do all things in him who strengtheneth me.", src: "Philippians 4:13 (DR)" },
      { text: "Weeping may endure for a night, but joy cometh in the morning.", src: "Psalm 30:5" },
    ],
    heard: [
      { text: "The Lord is nigh unto them that are of a broken heart.", src: "Psalm 34:18 (KJV)" },
      { text: "Come to me, all you that labour, and I will refresh you.", src: "Matthew 11:28 (DR)" },
    ],
    closing: [
      { text: "Peace I leave with you, my peace I give unto you.", src: "John 14:27" },
      { text: "They that wait upon the Lord shall renew their strength.", src: "Isaiah 40:31 (KJV)" },
    ],
  },
  secular: {
    welcome: [
      {
        text: "Such as are thy habitual thoughts, such also will be the character of thy mind.",
        src: "Marcus Aurelius, Meditations (Long tr.)",
      },
      { text: "This too shall pass.", src: "Persian adage" },
    ],
    peak: [
      { text: "We suffer more often in imagination than in reality.", src: "Seneca, Letters (Gummere tr.)" },
      { text: "Confine thyself to the present.", src: "Marcus Aurelius, Meditations (Long tr.)" },
    ],
    heard: [
      { text: "Knowing others is wisdom; knowing yourself is enlightenment.", src: "Tao Te Ching, ch. 33" },
      { text: "Look within. Within is the fountain of good.", src: "Marcus Aurelius, Meditations (Long tr.)" },
    ],
    closing: [
      {
        text: "It is not that we have a short time to live, but that we waste a great deal of it.",
        src: "Seneca, On the Shortness of Life",
      },
      { text: "Our life is what our thoughts make it.", src: "Marcus Aurelius, Meditations (Long tr.)" },
    ],
  },
};

/* ─── Tagged story library (Piece 1) ─── */
export const STORIES: Story[] = [
  {
    id: "david_goliath",
    path: "catholic",
    themes: ["fear", "feeling-overpowered"],
    register: "rousing",
    sourceRefs: ["1 Samuel 17"],
    lines: [
      "When David faced Goliath, everyone said the giant was too big to beat.",
      "David saw it the other way — too big to miss.",
      "Whatever towers over you right now, you don't beat it with force.",
    ],
  },
  {
    id: "clean_heart",
    path: "catholic",
    themes: ["shame", "despair"],
    register: "tender",
    sourceRefs: ["Psalm 51:10", "2 Samuel 12"],
    lines: [
      "Even David fell, once. And when he did, he didn't run or hide.",
      "He turned back and prayed, “Create in me a clean heart, O God.”",
      "If a wave ever knocks you down, the turning back is always open.",
    ],
  },
  {
    id: "wilderness",
    path: "catholic",
    themes: ["craving", "late-night", "fear"],
    register: "steadying",
    sourceRefs: ["Matthew 4:1–11", "Mark 1:12–13", "Luke 4:1–13"],
    lines: [
      "Before everything began, Jesus went into the wilderness, and was tempted there forty days.",
      "He was hungry and tired, and the voice offered him every easy thing.",
      "He didn't bargain with it. He stayed rooted, and the time passed.",
    ],
  },
  {
    id: "peter_rock",
    path: "catholic",
    themes: ["shame", "despair"],
    register: "reassuring",
    sourceRefs: ["Matthew 26:69–75", "Matthew 16:18"],
    lines: [
      "Peter swore he'd never falter, then faltered before morning.",
      "And still he was the rock everything was built on.",
      "One hard moment doesn't define you. This one won't either.",
    ],
  },
  {
    id: "peace_be_still",
    path: "catholic",
    themes: ["anger", "stress", "fear"],
    register: "steadying",
    sourceRefs: ["Mark 4:35–39"],
    lines: [
      "A storm rose on the lake, and the waves broke into the boat, and the disciples were afraid.",
      "He spoke three words to the wind and the water: “Peace, be still.”",
      "And there was a great calm. The same voice is near this water, too.",
    ],
  },
  {
    id: "odysseus",
    path: "secular",
    themes: ["craving", "feeling-overpowered"],
    register: "steadying",
    sourceRefs: ["Homer, Odyssey, Bk. 12 (PD)"],
    lines: [
      "The Greeks told of Odysseus, who had to sail past the Sirens.",
      "Their song made men throw themselves into the sea.",
      "He didn't trust willpower — he had his crew bind him to the mast.",
      "When the song came he strained against the ropes… but the ship sailed on, and the danger passed.",
    ],
  },
  {
    id: "aurelius_citadel",
    path: "secular",
    themes: ["stress", "feeling-overpowered"],
    register: "steadying",
    sourceRefs: ["Marcus Aurelius, Meditations (Long tr., PD)"],
    lines: [
      "Marcus Aurelius ruled the whole Roman world, yet each morning he wrote private notes just to stay steady.",
      "Again and again he reminded himself that the mind, rightly kept, is a citadel no outside thing can storm.",
      "The urge is an outside event. Your breath, your staying — that part is yours.",
    ],
  },
  {
    id: "seneca_imagination",
    path: "secular",
    themes: ["fear", "craving"],
    register: "reassuring",
    sourceRefs: ["Seneca, Letters (Ep. 13), Gummere tr. (PD)"],
    lines: [
      "Seneca noticed something simple: we suffer more often in imagination than in reality.",
      "The urge promises so much, and delivers so little.",
      "Watch it make its promises now… and watch the water carry them off.",
    ],
  },
  {
    id: "samurai",
    path: "secular",
    themes: ["anger"],
    register: "rousing",
    sourceRefs: ["Traditional Zen parable (Hakuin tradition); reworded, PD"],
    lines: [
      "A proud warrior once demanded that an old teacher show him heaven and hell.",
      "The teacher only mocked him — his sword, his manners, his pride — until the warrior drew his blade in fury.",
      "“That,” the teacher said calmly, “is hell.” The warrior froze, understood, and lowered the blade.",
      "“And that,” said the teacher, “is heaven.” The storm in him rose, and then it passed.",
    ],
  },
  {
    id: "this_too",
    path: "secular",
    themes: ["despair", "loneliness", "late-night"],
    register: "tender",
    sourceRefs: ["Persian/Sufi adage (PD)"],
    lines: [
      "A king once asked for a sentence that would be true in every season of life.",
      "His wise men gave him four words: this too shall pass.",
      "True at the height of the wave, and true on the way down.",
    ],
  },
];

/* ─── Piece 2: shared "bridge back to you on the water" closers ─── */
export const BRIDGES: Record<Path, string[]> = {
  catholic: [
    "You don't have to win this by force. You win it by staying, and breathing, one small stone at a time.",
    "Right now, you haven't fallen. You're still standing in the water.",
    "Your wilderness has an end too. You're already walking through it.",
    "Stay with the breath. You're doing better than you think.",
  ],
  secular: [
    "That's all you're doing now — not silencing the urge, just staying tied to the mast while it passes.",
    "The urge is weather. You are the shore it breaks on.",
    "Keep it. Breathe. The part that's yours is the staying.",
    "Yours will pass too. You're already lowering the blade.",
  ],
};

export const ENCOURAGE = [
  "You're still here. That, right there, is the whole victory.",
  "Notice you haven't moved toward it — you've just breathed. Most people never see that strength in themselves.",
  "Every second you stay teaches your body that an urge is only weather. It passes.",
  "You're doing the quiet, hard thing. I see it.",
  "Look how far you've come already, without acting. Keep going — I'm right here.",
  "Good. Just like that.",
];

export const CHECKINS = [
  "Still with me? The wave has you. There's nothing you need to do but breathe.",
  "How are you holding up? If something's on your mind, the tab on the left is yours, any time.",
  "You don't have to answer anything. If you'd rather just breathe, that's more than enough.",
  "I'm still here. Take this as slow as you need — there's no rush, and no clock.",
];

export const PROMPTS = [
  "Where do you feel the urge in your body right now?",
  "If the urge had a colour or a shape, what would it be?",
  "On a scale from a whisper to a roar — how loud is it this moment?",
  "What is it really asking you for, underneath?",
  "What would you say to a friend who felt exactly this?",
  "Name one thing around you, right now, that's steady and unmoved.",
];

export const ACKS_CRESTING = [
  "I hear you. You don't have to do anything with that — staying here with it is the whole work, and you're doing it.",
  "That's real, and it's allowed to be here. Keep your eyes on the wave; it can't hold this height forever.",
  "Thank you for putting words to it instead of acting on it. That alone is the brave part. Just breathe and let it rise without you.",
  "Felt, and held. The pull is always loudest right before it breaks. Stay on the board.",
];

export const ACKS_EASING = [
  "Notice that? It's already quieter than it was a minute ago. You stayed, and it moved.",
  "There it goes — cresting and slipping back, exactly the way it was always going to. You let it.",
  "You're still here, and the wave is smaller. That's you, learning in real time that it passes.",
  "Look how far it's come down. You didn't push it away or chase it. You just outlasted it.",
];

export const BREATH_WORDS = {
  in: "Breathe in with the rising water…",
  hold: "Hold it, gently, at the top…",
  out: "And let it fall away…",
};

/* ─── Trigger → theme matching (Piece 1) ─── */
const THEME_KEYWORDS: Record<Theme, string[]> = {
  craving: ["crav", "urge", "want", "porn", "drink", "drug", "use", "smoke", "scroll", "binge", "relapse"],
  anger: ["anger", "angry", "rage", "furious", "mad", "resent", "irritat"],
  loneliness: ["lonely", "alone", "isolat", "abandon", "no one", "empty"],
  despair: ["hopeless", "despair", "pointless", "giving up", "worthless", "tired of"],
  "late-night": ["night", "midnight", "late", "can't sleep", "insomnia", "2am", "3am", "bed"],
  boredom: ["bored", "boredom", "restless", "nothing to do", "idle"],
  shame: ["shame", "guilt", "ashamed", "disgust", "failed", "slip", "dirty", "monster"],
  stress: ["stress", "work", "overwhelm", "anxious", "anxiety", "pressure", "deadline", "exhaust"],
  fear: ["fear", "afraid", "scared", "panic", "dread", "terrified"],
  "feeling-overpowered": ["too big", "overpower", "can't stop", "out of control", "powerless", "stronger than me"],
};

export function inferThemes(triggers: string[]): Theme[] {
  const text = triggers.join(" ").toLowerCase();
  const hits: Theme[] = [];
  (Object.keys(THEME_KEYWORDS) as Theme[]).forEach((theme) => {
    if (THEME_KEYWORDS[theme].some((kw) => text.includes(kw))) hits.push(theme);
  });
  return hits;
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickQuote(path: Path, moment: Moment): Quote {
  return pick(QUOTES[path][moment]);
}

/**
 * Choose the next story: filter to path, exclude ones already told this
 * session, score by theme overlap with the user's inferred themes, then
 * pick from the top-scoring set with a little randomness.
 */
export function selectStory(
  path: Path,
  themes: Theme[],
  excludeIds: string[]
): Story | null {
  let pool = STORIES.filter((s) => s.path === path && !excludeIds.includes(s.id));
  if (pool.length === 0) {
    // All told — allow repeats rather than stall.
    pool = STORIES.filter((s) => s.path === path);
  }
  if (pool.length === 0) return null;

  const scored = pool.map((s) => ({
    s,
    score: s.themes.filter((t) => themes.includes(t)).length,
  }));
  const maxScore = Math.max(...scored.map((x) => x.score));
  const top = scored.filter((x) => x.score === maxScore).map((x) => x.s);
  return pick(top);
}

export function bridgeFor(path: Path): string {
  return pick(BRIDGES[path]);
}
