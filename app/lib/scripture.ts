/**
 * Daily Scripture — v1 dataset.
 *
 * All passages are from the Challoner revision of the Douay-Rheims
 * Bible (1750s), which is fully public domain. No licensing required.
 *
 * Per locked decisions:
 *   - Catholic translations only (NO Protestant translations — NIV,
 *     ESV, KJV all explicitly excluded).
 *   - Three approved translations: NABRE (default for future),
 *     RSV-2CE, Douay-Rheims (public domain — used here in v1).
 *   - NABRE and RSV-2CE require licensing, tracked as Task #16. Once
 *     licensed, we add a `translation` switch and offer all three.
 *
 * Each passage is curated for moments the platform's users actually
 * face — not the full daily lectionary, which is better served by
 * linking to usccb.org/bible/readings for the day's Mass.
 *
 * Content is DRAFT v1 — pending Father Murphy review. Same review
 * pattern as the Prayer Library: log content issues in
 * `07 - Content/Prayer Library v2 — Reference (Hundreds).md` Content
 * Review Backlog and process in a dedicated post-build pass.
 *
 * "Going deeper" (2026-08-03): the collections' "Food for thought"
 * notes were migrated verbatim into the matching passages' `deeper`
 * fields, shown after the guided reading. Roughly 30 of the 45
 * passages still lack a `deeper` paragraph — a future content pass
 * is welcome.
 */

export type ScriptureTheme =
  | "comfort"
  | "mercy"
  | "trust"
  | "suffering"
  | "hope"
  | "discernment"
  | "surrender"
  | "healing"
  | "conversion"
  | "thanksgiving";

export type ScriptureLiturgicalSeason =
  | "advent"
  | "christmas"
  | "lent"
  | "easter"
  | "ordinary-time";

export type ScripturePassage = {
  id: string;
  title: string;
  /** Standard biblical citation (e.g., "Matthew 6:25-34"). */
  citation: string;
  /** Verse-by-verse text for the walker. */
  verses: { number: string; text: string }[];
  /** Combined text for detail-page display. */
  full_text: string;
  translation: "Douay-Rheims";
  /** Primary themes for browsing and search. */
  themes: ScriptureTheme[];
  /** Optional liturgical season for season-aware surfacing. */
  season?: ScriptureLiturgicalSeason;
  /** Tags for the same NL search engine used by the Prayer Library. */
  tags: string[];
  /** One-sentence guidance for when to reach for this passage. */
  when_to_use: string;
  /** A single open-ended question to seed reflection journaling. */
  reflection_prompt: string;
  /**
   * "Going deeper" — a short study/reflection paragraph shown AFTER
   * the guided reading (verse walker closing sequence). DRAFT pending
   * Father Murphy review, same pattern as the rest of the dataset.
   */
  deeper?: string;
  /**
   * Verification status. False until Max + Father Murphy cross-check
   * verbatim against a canonical Douay-Rheims source.
   */
  verified?: boolean;
};

/* ────────────────────────────────────────────────────────────────────
   PASSAGES
   ──────────────────────────────────────────────────────────────────── */

export const PASSAGES: ScripturePassage[] = [
  {
    id: "psalm-23",
    title: "The Lord is my Shepherd",
    citation: "Psalm 23 (Vulgate 22):1–6",
    verses: [
      { number: "1", text: "The Lord ruleth me: and I shall want nothing." },
      { number: "2", text: "He hath set me in a place of pasture. He hath brought me up, on the water of refreshment:" },
      { number: "3", text: "He hath converted my soul. He hath led me on the paths of justice, for his own name's sake." },
      { number: "4", text: "For though I should walk in the midst of the shadow of death, I will fear no evils, for thou art with me. Thy rod and thy staff, they have comforted me." },
      { number: "5", text: "Thou hast prepared a table before me against them that afflict me. Thou hast anointed my head with oil; and my chalice which inebriateth me, how goodly is it!" },
      { number: "6", text: "And thy mercy will follow me all the days of my life. And that I may dwell in the house of the Lord unto length of days." },
    ],
    full_text:
      "The Lord ruleth me: and I shall want nothing. He hath set me in a place of pasture. He hath brought me up, on the water of refreshment: He hath converted my soul. He hath led me on the paths of justice, for his own name's sake.\n\nFor though I should walk in the midst of the shadow of death, I will fear no evils, for thou art with me. Thy rod and thy staff, they have comforted me. Thou hast prepared a table before me against them that afflict me. Thou hast anointed my head with oil; and my chalice which inebriateth me, how goodly is it!\n\nAnd thy mercy will follow me all the days of my life. And that I may dwell in the house of the Lord unto length of days.",
    translation: "Douay-Rheims",
    themes: ["comfort", "trust"],
    tags: ["shepherd", "valley", "fear", "comfort", "death", "anxiety", "psalm", "scripture"],
    when_to_use:
      "When fear has its weight on you — illness, death of someone you love, the dark valley of any kind. The universal Catholic comfort psalm.",
    reflection_prompt:
      "Which line landed hardest just now? Write whatever rises when you sit with it.",
    deeper:
      "This psalm has been prayed in the dark for three thousand years — 'the shadow of death' is night language, and the psalmist walked through it too. The shepherd doesn't wait at the far end of the valley; he walks it with you. You can hand him the watch for tonight.",
  },

  {
    id: "matt-11-28",
    title: "Come to me, all you that labour",
    citation: "Matthew 11:28–30",
    verses: [
      { number: "28", text: "Come to me, all you that labour, and are burdened, and I will refresh you." },
      { number: "29", text: "Take up my yoke upon you, and learn of me, because I am meek, and humble of heart: and you shall find rest to your souls." },
      { number: "30", text: "For my yoke is sweet and my burden light." },
    ],
    full_text:
      "Come to me, all you that labour, and are burdened, and I will refresh you.\n\nTake up my yoke upon you, and learn of me, because I am meek, and humble of heart: and you shall find rest to your souls.\n\nFor my yoke is sweet and my burden light.",
    translation: "Douay-Rheims",
    themes: ["comfort", "trust", "surrender"],
    tags: ["burden", "tired", "exhausted", "rest", "yoke", "weary", "labor"],
    when_to_use:
      "When you are tired — not just sleepy, but the kind of tired that doesn't go away. Christ's direct invitation, three verses.",
    reflection_prompt:
      "What burden are you carrying right now that you haven't named yet?",
    deeper:
      "There is a tiredness that sleep alone doesn't touch — the kind you carry into bed with you. Christ's invitation is aimed exactly there: come, you that labour and are burdened. He doesn't ask you to sort anything out first; the rest is a gift, not a reward.",
  },

  {
    id: "prodigal-son",
    title: "The Prodigal Son",
    citation: "Luke 15:11–24 (selected)",
    verses: [
      { number: "11", text: "A certain man had two sons:" },
      { number: "12", text: "And the younger of them said to his father: Father, give me the portion of substance that falleth to me. And he divided unto them his substance." },
      { number: "13", text: "And not many days after, the younger son, gathering all together, went abroad into a far country: and there wasted his substance, living riotously." },
      { number: "14", text: "And after he had spent all, there came a mighty famine in that country; and he began to be in want." },
      { number: "17", text: "And returning to himself, he said: How many hired servants in my father's house abound with bread, and I here perish with hunger!" },
      { number: "18", text: "I will arise, and will go to my father, and say to him: Father, I have sinned against heaven, and before thee:" },
      { number: "20", text: "And rising up he came to his father. And when he was yet a great way off, his father saw him, and was moved with compassion, and running to him, fell upon his neck, and kissed him." },
      { number: "21", text: "And the son said to him: Father, I have sinned against heaven, and before thee, I am not now worthy to be called thy son." },
      { number: "22", text: "And the father said to his servants: Bring forth quickly the first robe, and put it on him, and put a ring on his hand, and shoes on his feet:" },
      { number: "23", text: "And bring hither the fatted calf, and kill it, and let us eat and make merry:" },
      { number: "24", text: "Because this my son was dead, and is come to life again: was lost, and is found." },
    ],
    full_text:
      "A certain man had two sons: And the younger of them said to his father: Father, give me the portion of substance that falleth to me. And he divided unto them his substance. And not many days after, the younger son, gathering all together, went abroad into a far country: and there wasted his substance, living riotously. And after he had spent all, there came a mighty famine in that country; and he began to be in want.\n\nAnd returning to himself, he said: How many hired servants in my father's house abound with bread, and I here perish with hunger! I will arise, and will go to my father, and say to him: Father, I have sinned against heaven, and before thee:\n\nAnd rising up he came to his father. And when he was yet a great way off, his father saw him, and was moved with compassion, and running to him, fell upon his neck, and kissed him. And the son said to him: Father, I have sinned against heaven, and before thee, I am not now worthy to be called thy son.\n\nAnd the father said to his servants: Bring forth quickly the first robe, and put it on him, and put a ring on his hand, and shoes on his feet: And bring hither the fatted calf, and kill it, and let us eat and make merry: Because this my son was dead, and is come to life again: was lost, and is found.",
    translation: "Douay-Rheims",
    themes: ["mercy", "conversion", "hope"],
    season: "lent",
    tags: ["prodigal", "return", "father", "forgiveness", "lost", "found", "ashamed", "second-chance", "shame", "addiction"],
    when_to_use:
      "When you've fallen, and the voice in your head says you've gone too far for the Father to want you back. This passage was written for that voice.",
    reflection_prompt:
      "What did you read most into — the leaving, the return, or the running father?",
  },

  {
    id: "lilies-of-the-field",
    title: "Consider the lilies of the field",
    citation: "Matthew 6:25–34 (selected)",
    verses: [
      { number: "25", text: "Therefore I say to you, be not solicitous for your life, what you shall eat, nor for your body, what you shall put on. Is not the life more than the meat: and the body more than the raiment?" },
      { number: "26", text: "Behold the birds of the air, for they neither sow, nor do they reap, nor gather into barns: and your heavenly Father feedeth them. Are not you of much more value than they?" },
      { number: "27", text: "And which of you by taking thought, can add to his stature one cubit?" },
      { number: "28", text: "And for raiment why are you solicitous? Consider the lilies of the field, how they grow: they labour not, neither do they spin." },
      { number: "29", text: "But I say to you, that not even Solomon in all his glory was arrayed as one of these." },
      { number: "33", text: "Seek ye therefore first the kingdom of God, and his justice, and all these things shall be added unto you." },
      { number: "34", text: "Be not therefore solicitous for tomorrow; for the morrow will be solicitous for itself. Sufficient for the day is the evil thereof." },
    ],
    full_text:
      "Therefore I say to you, be not solicitous for your life, what you shall eat, nor for your body, what you shall put on. Is not the life more than the meat: and the body more than the raiment?\n\nBehold the birds of the air, for they neither sow, nor do they reap, nor gather into barns: and your heavenly Father feedeth them. Are not you of much more value than they?\n\nAnd which of you by taking thought, can add to his stature one cubit?\n\nAnd for raiment why are you solicitous? Consider the lilies of the field, how they grow: they labour not, neither do they spin. But I say to you, that not even Solomon in all his glory was arrayed as one of these.\n\nSeek ye therefore first the kingdom of God, and his justice, and all these things shall be added unto you.\n\nBe not therefore solicitous for tomorrow; for the morrow will be solicitous for itself. Sufficient for the day is the evil thereof.",
    translation: "Douay-Rheims",
    themes: ["trust", "comfort"],
    tags: ["anxiety", "worry", "money", "future", "tomorrow", "providence", "lilies", "birds", "sermon-on-the-mount"],
    when_to_use:
      "When the worry-loop is running — bills, future, what-if. Christ's direct counter to anxious thinking, given in the Sermon on the Mount.",
    reflection_prompt:
      "What are you anxious about today that the lilies of the field would find absurd?",
    deeper:
      "Christ spoke this to ordinary people worrying about food, money, and tomorrow — the same loops that run in you. He doesn't shame the worry; he points at the birds and the wildflowers and says you matter more than they do, and look how they are kept. You are allowed to live just today.",
  },

  {
    id: "be-not-afraid-isaiah",
    title: "Fear not, for I am with thee",
    citation: "Isaiah 41:10, 13",
    verses: [
      { number: "10", text: "Fear not, for I am with thee: turn not aside, for I am thy God: I have strengthened thee, and have helped thee, and the right hand of my just one hath upheld thee." },
      { number: "13", text: "For I am the Lord thy God, who take thee by the hand, and say to thee: Fear not, I have helped thee." },
    ],
    full_text:
      "Fear not, for I am with thee: turn not aside, for I am thy God: I have strengthened thee, and have helped thee, and the right hand of my just one hath upheld thee.\n\nFor I am the Lord thy God, who take thee by the hand, and say to thee: Fear not, I have helped thee.",
    translation: "Douay-Rheims",
    themes: ["comfort", "trust"],
    tags: ["fear", "afraid", "alone", "strength", "isaiah", "hand", "prophet"],
    when_to_use:
      "When fear is the loudest thing in the room. Two verses, repeatable in a single breath.",
    reflection_prompt:
      "When you imagine God taking you by the hand right now — where is He leading?",
    deeper:
      "These words were first spoken to people in exile who had lost nearly everything and were afraid of what came next. God's answer to their fear wasn't a plan or an explanation — it was his presence: I am with thee, I take thee by the hand. Fear doesn't disqualify you from that promise; it's exactly who the promise is for.",
  },

  {
    id: "cast-your-cares-1-peter",
    title: "Cast all your care upon him",
    citation: "1 Peter 5:6–7",
    verses: [
      { number: "6", text: "Be you humbled therefore under the mighty hand of God, that he may exalt you in the time of visitation:" },
      { number: "7", text: "Casting all your care upon him, for he hath care of you." },
    ],
    full_text:
      "Be you humbled therefore under the mighty hand of God, that he may exalt you in the time of visitation:\n\nCasting all your care upon him, for he hath care of you.",
    translation: "Douay-Rheims",
    themes: ["trust", "surrender"],
    tags: ["care", "worry", "anxiety", "humility", "trust", "peter", "epistle"],
    when_to_use:
      "When you keep taking back the worry you said you handed over. The 'casting' is active — it's something you do, not just feel.",
    reflection_prompt:
      "Name one specific worry you can cast on Him right now. What would 'casting' actually look like for that worry?",
    deeper:
      "Peter knew panic from the inside — he's the one who sank in the waves and wept at the cock-crow. When he says cast your care, it's a man who was carried through his own worst nights passing on what held him. God isn't merely tolerating your worries; he has care of you, personally.",
  },

  {
    id: "all-things-work-for-good",
    title: "All things work together unto good",
    citation: "Romans 8:28, 35, 38–39",
    verses: [
      { number: "28", text: "And we know that to them that love God, all things work together unto good, to such as, according to his purpose, are called to be saints." },
      { number: "35", text: "Who then shall separate us from the love of Christ? Shall tribulation? Or distress? Or famine? Or nakedness? Or danger? Or persecution? Or the sword?" },
      { number: "38", text: "For I am sure that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, nor might," },
      { number: "39", text: "Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord." },
    ],
    full_text:
      "And we know that to them that love God, all things work together unto good, to such as, according to his purpose, are called to be saints.\n\nWho then shall separate us from the love of Christ? Shall tribulation? Or distress? Or famine? Or nakedness? Or danger? Or persecution? Or the sword?\n\nFor I am sure that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, nor might, Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.",
    translation: "Douay-Rheims",
    themes: ["trust", "hope"],
    tags: ["romans", "paul", "providence", "suffering", "separation", "love-of-god", "epistle"],
    when_to_use:
      "When the situation makes no sense — illness, betrayal, loss with no apparent purpose. Paul's letter to the early Roman Christians under persecution: nothing separates you from Him.",
    reflection_prompt:
      "What in your life right now feels like it cannot possibly 'work together unto good'? Sit with that one.",
    deeper:
      "Paul wrote this to people burying friends under persecution, so it isn't a tidy answer — it's a defiance. He lists everything that seems final, death first, and says none of it can pry you out of the love of God. Whoever you're grieving was held by that same love, and so are you.",
  },

  {
    id: "beatitudes",
    title: "The Beatitudes",
    citation: "Matthew 5:3–10",
    verses: [
      { number: "3", text: "Blessed are the poor in spirit: for theirs is the kingdom of heaven." },
      { number: "4", text: "Blessed are the meek: for they shall possess the land." },
      { number: "5", text: "Blessed are they that mourn: for they shall be comforted." },
      { number: "6", text: "Blessed are they that hunger and thirst after justice: for they shall have their fill." },
      { number: "7", text: "Blessed are the merciful: for they shall obtain mercy." },
      { number: "8", text: "Blessed are the clean of heart: for they shall see God." },
      { number: "9", text: "Blessed are the peacemakers: for they shall be called children of God." },
      { number: "10", text: "Blessed are they that suffer persecution for justice' sake: for theirs is the kingdom of heaven." },
    ],
    full_text:
      "Blessed are the poor in spirit: for theirs is the kingdom of heaven.\n\nBlessed are the meek: for they shall possess the land.\n\nBlessed are they that mourn: for they shall be comforted.\n\nBlessed are they that hunger and thirst after justice: for they shall have their fill.\n\nBlessed are the merciful: for they shall obtain mercy.\n\nBlessed are the clean of heart: for they shall see God.\n\nBlessed are the peacemakers: for they shall be called children of God.\n\nBlessed are they that suffer persecution for justice' sake: for theirs is the kingdom of heaven.",
    translation: "Douay-Rheims",
    themes: ["suffering", "hope", "mercy"],
    tags: ["beatitudes", "sermon-on-the-mount", "blessed", "poor", "mourn", "meek", "merciful", "persecution", "peacemaker"],
    when_to_use:
      "When the world's value system is exhausting you. Christ's full inversion of who counts as blessed — slow read, one line at a time.",
    reflection_prompt:
      "Which beatitude do you most resist? That's usually the one He's pointing at.",
    deeper:
      "'Blessed are they that mourn' — Christ puts the grieving among the blessed of his kingdom, not among the failing. Mourning is not weak faith; it's love telling the truth about what was lost. And the comfort he promises has no deadline attached.",
  },

  {
    id: "woman-caught-in-adultery",
    title: "Let him without sin cast the first stone",
    citation: "John 8:3–11 (selected)",
    verses: [
      { number: "3", text: "And the scribes and the Pharisees bring unto him a woman taken in adultery: and they set her in the midst," },
      { number: "5", text: "Now Moses in the law commanded us to stone such a one. But what sayest thou?" },
      { number: "6", text: "And this they said tempting him, that they might accuse him. But Jesus bowing himself down, wrote with his finger on the ground." },
      { number: "7", text: "When therefore they continued asking him, he lifted up himself, and said to them: He that is without sin among you, let him first cast a stone at her." },
      { number: "9", text: "But they hearing this, went out one by one, beginning at the eldest. And Jesus alone remained, and the woman standing in the midst." },
      { number: "10", text: "Then Jesus lifting up himself, said to her: Woman, where are they that accused thee? Hath no man condemned thee?" },
      { number: "11", text: "Who said: No man, Lord. And Jesus said: Neither will I condemn thee. Go, and now sin no more." },
    ],
    full_text:
      "And the scribes and the Pharisees bring unto him a woman taken in adultery: and they set her in the midst, Now Moses in the law commanded us to stone such a one. But what sayest thou?\n\nAnd this they said tempting him, that they might accuse him. But Jesus bowing himself down, wrote with his finger on the ground. When therefore they continued asking him, he lifted up himself, and said to them: He that is without sin among you, let him first cast a stone at her.\n\nBut they hearing this, went out one by one, beginning at the eldest. And Jesus alone remained, and the woman standing in the midst.\n\nThen Jesus lifting up himself, said to her: Woman, where are they that accused thee? Hath no man condemned thee?\n\nWho said: No man, Lord. And Jesus said: Neither will I condemn thee. Go, and now sin no more.",
    translation: "Douay-Rheims",
    themes: ["mercy", "conversion"],
    tags: ["adultery", "shame", "judgment", "mercy", "sin", "stones", "accusation", "addiction", "secret"],
    when_to_use:
      "When you've been caught — by someone else, or by yourself — and the shame is loud. Christ's response, line by line.",
    reflection_prompt:
      "Whose voice are you hearing as the accuser right now? Is it actually Christ's voice, or something else dressed up as His?",
  },

  {
    id: "gethsemane",
    title: "Not my will, but thine",
    citation: "Luke 22:39–46 (selected)",
    verses: [
      { number: "41", text: "And he was withdrawn away from them a stone's cast; and kneeling down, he prayed," },
      { number: "42", text: "Saying: Father, if thou wilt, remove this chalice from me: but yet not my will, but thine be done." },
      { number: "43", text: "And there appeared to him an angel from heaven, strengthening him. And being in an agony, he prayed the longer." },
      { number: "44", text: "And his sweat became as drops of blood, trickling down upon the ground." },
    ],
    full_text:
      "And he was withdrawn away from them a stone's cast; and kneeling down, he prayed, Saying: Father, if thou wilt, remove this chalice from me: but yet not my will, but thine be done.\n\nAnd there appeared to him an angel from heaven, strengthening him. And being in an agony, he prayed the longer. And his sweat became as drops of blood, trickling down upon the ground.",
    translation: "Douay-Rheims",
    themes: ["surrender", "suffering"],
    season: "lent",
    tags: ["gethsemane", "agony", "garden", "passion", "will", "surrender", "chalice", "suffering", "before-the-cross"],
    when_to_use:
      "When God is asking something of you that you don't want to do. Christ's own prayer in His own hour of dread. He asked to be spared too.",
    reflection_prompt:
      "What is the chalice in front of you right now? What does 'not my will but thine' mean for that specific cup?",
  },

  {
    id: "mary-fiat",
    title: "Behold the handmaid of the Lord",
    citation: "Luke 1:26–38 (selected)",
    verses: [
      { number: "28", text: "And the angel being come in, said unto her: Hail, full of grace, the Lord is with thee: blessed art thou among women." },
      { number: "30", text: "And the angel said to her: Fear not, Mary, for thou hast found grace with God." },
      { number: "31", text: "Behold thou shalt conceive in thy womb, and shalt bring forth a son; and thou shalt call his name Jesus." },
      { number: "37", text: "Because no word shall be impossible with God." },
      { number: "38", text: "And Mary said: Behold the handmaid of the Lord; be it done to me according to thy word. And the angel departed from her." },
    ],
    full_text:
      "And the angel being come in, said unto her: Hail, full of grace, the Lord is with thee: blessed art thou among women.\n\nAnd the angel said to her: Fear not, Mary, for thou hast found grace with God. Behold thou shalt conceive in thy womb, and shalt bring forth a son; and thou shalt call his name Jesus.\n\nBecause no word shall be impossible with God.\n\nAnd Mary said: Behold the handmaid of the Lord; be it done to me according to thy word. And the angel departed from her.",
    translation: "Douay-Rheims",
    themes: ["surrender", "trust", "discernment"],
    season: "advent",
    tags: ["mary", "annunciation", "fiat", "gabriel", "yes", "marian", "advent", "pregnancy", "vocation"],
    when_to_use:
      "When you're being asked to say yes to something bigger than you can plan for. Mary said yes in five words.",
    reflection_prompt:
      "What is being asked of you right now that requires a 'be it done to me'?",
  },

  {
    id: "doubting-thomas",
    title: "Blessed are they that have not seen",
    citation: "John 20:24–29 (selected)",
    verses: [
      { number: "25", text: "The other disciples therefore said to him: We have seen the Lord. But he said to them: Except I shall see in his hands the print of the nails, and put my finger into the place of the nails, and put my hand into his side, I will not believe." },
      { number: "27", text: "Then he saith to Thomas: Put in thy finger hither, and see my hands; and bring hither thy hand, and put it into my side; and be not faithless, but believing." },
      { number: "28", text: "Thomas answered, and said to him: My Lord, and my God." },
      { number: "29", text: "Jesus saith to him: Because thou hast seen me, Thomas, thou hast believed: blessed are they that have not seen, and have believed." },
    ],
    full_text:
      "The other disciples therefore said to him: We have seen the Lord. But he said to them: Except I shall see in his hands the print of the nails, and put my finger into the place of the nails, and put my hand into his side, I will not believe.\n\nThen he saith to Thomas: Put in thy finger hither, and see my hands; and bring hither thy hand, and put it into my side; and be not faithless, but believing.\n\nThomas answered, and said to him: My Lord, and my God.\n\nJesus saith to him: Because thou hast seen me, Thomas, thou hast believed: blessed are they that have not seen, and have believed.",
    translation: "Douay-Rheims",
    themes: ["hope", "conversion"],
    season: "easter",
    tags: ["thomas", "doubt", "faith", "resurrection", "wounds", "easter", "belief"],
    when_to_use:
      "When you are doubting and the Church says 'blessed are they who have not seen and yet believed.' Christ met Thomas with His wounds first.",
    reflection_prompt:
      "What is one specific thing you are doubting right now? Tell Him so.",
  },

  {
    id: "road-to-emmaus",
    title: "Did not our hearts burn within us?",
    citation: "Luke 24:13–32 (selected)",
    verses: [
      { number: "15", text: "And it came to pass, that while they talked and reasoned with themselves, Jesus himself also drawing near, went with them." },
      { number: "16", text: "But their eyes were held, that they should not know him." },
      { number: "25", text: "Then he said to them: O foolish, and slow of heart to believe in all things which the prophets have spoken." },
      { number: "29", text: "But they constrained him; saying: Stay with us, because it is towards evening, and the day is now far spent. And he went in with them." },
      { number: "30", text: "And it came to pass, whilst he was at table with them, he took bread, and blessed, and brake, and gave to them." },
      { number: "31", text: "And their eyes were opened, and they knew him: and he vanished out of their sight." },
      { number: "32", text: "And they said one to the other: Was not our heart burning within us, whilst he spoke in the way, and opened to us the scriptures?" },
    ],
    full_text:
      "And it came to pass, that while they talked and reasoned with themselves, Jesus himself also drawing near, went with them. But their eyes were held, that they should not know him.\n\nThen he said to them: O foolish, and slow of heart to believe in all things which the prophets have spoken.\n\nBut they constrained him; saying: Stay with us, because it is towards evening, and the day is now far spent. And he went in with them.\n\nAnd it came to pass, whilst he was at table with them, he took bread, and blessed, and brake, and gave to them. And their eyes were opened, and they knew him: and he vanished out of their sight.\n\nAnd they said one to the other: Was not our heart burning within us, whilst he spoke in the way, and opened to us the scriptures?",
    translation: "Douay-Rheims",
    themes: ["hope", "discernment"],
    season: "easter",
    tags: ["emmaus", "resurrection", "easter", "eucharist", "stranger", "walking", "discernment", "burning"],
    when_to_use:
      "When God has been walking with you and you didn't recognize Him until later. Look back at the last week — where might He have been?",
    reflection_prompt:
      "When was the last time your heart 'burned within you' over something you read or heard? What were you doing?",
  },

  {
    id: "bartimaeus",
    title: "What wilt thou that I do to thee?",
    citation: "Mark 10:46–52",
    verses: [
      { number: "46", text: "And they came to Jericho: and as he went out of Jericho, with his disciples, and a very great multitude, Bartimeus the blind man, the son of Timeus, sat by the way side begging." },
      { number: "47", text: "Who when he had heard, that it was Jesus of Nazareth, began to cry out, and to say: Jesus son of David, have mercy on me." },
      { number: "48", text: "And many rebuked him, that he might hold his peace; but he cried a great deal the more: Son of David, have mercy on me." },
      { number: "49", text: "And Jesus, standing still, commanded him to be called. And they call the blind man, saying to him: Be of better comfort: arise, he calleth thee." },
      { number: "50", text: "Who casting off his garment leaped up, and came to him." },
      { number: "51", text: "And Jesus answering, said to him: What wilt thou that I should do to thee? And the blind man said to him: Rabboni, that I may see." },
      { number: "52", text: "And Jesus saith to him: Go thy way, thy faith hath made thee whole. And immediately he saw, and followed him in the way." },
    ],
    full_text:
      "And they came to Jericho: and as he went out of Jericho, with his disciples, and a very great multitude, Bartimeus the blind man, the son of Timeus, sat by the way side begging. Who when he had heard, that it was Jesus of Nazareth, began to cry out, and to say: Jesus son of David, have mercy on me. And many rebuked him, that he might hold his peace; but he cried a great deal the more: Son of David, have mercy on me.\n\nAnd Jesus, standing still, commanded him to be called. And they call the blind man, saying to him: Be of better comfort: arise, he calleth thee. Who casting off his garment leaped up, and came to him.\n\nAnd Jesus answering, said to him: What wilt thou that I should do to thee? And the blind man said to him: Rabboni, that I may see. And Jesus saith to him: Go thy way, thy faith hath made thee whole. And immediately he saw, and followed him in the way.",
    translation: "Douay-Rheims",
    themes: ["healing", "mercy", "discernment"],
    tags: ["bartimaeus", "blind", "healing", "mercy", "what-do-you-want", "ask"],
    when_to_use:
      "When you've been crying out and feel ignored. Bartimaeus shouted louder when they told him to be quiet. Christ asks: 'What do you want?'",
    reflection_prompt:
      "If Christ asked you that question right now — 'What wilt thou that I should do to thee?' — what would you say? Be specific.",
  },

  {
    id: "zacchaeus",
    title: "Today salvation has come to this house",
    citation: "Luke 19:1–10",
    verses: [
      { number: "1", text: "And entering in, he walked through Jericho." },
      { number: "2", text: "And behold, there was a man named Zacheus, who was the chief of the publicans, and he was rich." },
      { number: "3", text: "And he sought to see Jesus who he was, and he could not for the crowd, because he was low of stature." },
      { number: "4", text: "And running before, he climbed up into a sycamore tree, that he might see him; for he was to pass that way." },
      { number: "5", text: "And when Jesus was come to the place, looking up, he saw him, and said to him: Zacheus, make haste and come down; for this day I must abide in thy house." },
      { number: "6", text: "And he made haste and came down; and received him with joy." },
      { number: "8", text: "But Zacheus standing, said to the Lord: Behold, Lord, the half of my goods I give to the poor; and if I have wronged any man of any thing, I restore him fourfold." },
      { number: "9", text: "Jesus said to him: This day is salvation come to this house, because he also is a son of Abraham." },
      { number: "10", text: "For the Son of man is come to seek, and to save that which was lost." },
    ],
    full_text:
      "And entering in, he walked through Jericho. And behold, there was a man named Zacheus, who was the chief of the publicans, and he was rich. And he sought to see Jesus who he was, and he could not for the crowd, because he was low of stature.\n\nAnd running before, he climbed up into a sycamore tree, that he might see him; for he was to pass that way. And when Jesus was come to the place, looking up, he saw him, and said to him: Zacheus, make haste and come down; for this day I must abide in thy house.\n\nAnd he made haste and came down; and received him with joy.\n\nBut Zacheus standing, said to the Lord: Behold, Lord, the half of my goods I give to the poor; and if I have wronged any man of any thing, I restore him fourfold.\n\nJesus said to him: This day is salvation come to this house, because he also is a son of Abraham. For the Son of man is come to seek, and to save that which was lost.",
    translation: "Douay-Rheims",
    themes: ["conversion", "mercy"],
    tags: ["zacchaeus", "tax-collector", "conversion", "rich", "publican", "sycamore", "save-the-lost"],
    when_to_use:
      "When you have done damage that requires more than apology — restitution, change. Zacchaeus didn't just feel sorry; he paid back fourfold.",
    reflection_prompt:
      "Is there someone you've wronged whose 'fourfold' is sitting unaddressed? What would the first step toward making it right look like?",
  },

  {
    id: "the-good-thief",
    title: "Today thou shalt be with me in paradise",
    citation: "Luke 23:39–43",
    verses: [
      { number: "39", text: "And one of those robbers who were hanged, blasphemed him, saying: If thou be Christ, save thyself and us." },
      { number: "40", text: "But the other answering, rebuked him, saying: Neither dost thou fear God, seeing thou art under the same condemnation?" },
      { number: "41", text: "And we indeed justly, for we receive the due reward of our deeds; but this man hath done no evil." },
      { number: "42", text: "And he said to Jesus: Lord, remember me when thou shalt come into thy kingdom." },
      { number: "43", text: "And Jesus said to him: Amen I say to thee, this day thou shalt be with me in paradise." },
    ],
    full_text:
      "And one of those robbers who were hanged, blasphemed him, saying: If thou be Christ, save thyself and us. But the other answering, rebuked him, saying: Neither dost thou fear God, seeing thou art under the same condemnation? And we indeed justly, for we receive the due reward of our deeds; but this man hath done no evil.\n\nAnd he said to Jesus: Lord, remember me when thou shalt come into thy kingdom. And Jesus said to him: Amen I say to thee, this day thou shalt be with me in paradise.",
    translation: "Douay-Rheims",
    themes: ["mercy", "hope", "conversion"],
    season: "lent",
    tags: ["thief", "criminal", "cross", "paradise", "last-minute", "deathbed", "remember-me", "passion"],
    when_to_use:
      "When you think it's too late — too late for change, too late for forgiveness, too late for grace. The man dying next to Christ was saved with one sentence.",
    reflection_prompt:
      "What's your version of 'Lord, remember me'? Say it now.",
  },

  {
    id: "be-still-psalm-46",
    title: "Be still, and know that I am God",
    citation: "Psalm 46 (Vulgate 45):10–11",
    verses: [
      { number: "10", text: "Be still and see that I am God; I will be exalted among the nations, and I will be exalted in the earth." },
      { number: "11", text: "The Lord of armies is with us: the God of Jacob is our protector." },
    ],
    full_text:
      "Be still and see that I am God; I will be exalted among the nations, and I will be exalted in the earth.\n\nThe Lord of armies is with us: the God of Jacob is our protector.",
    translation: "Douay-Rheims",
    themes: ["trust", "discernment"],
    tags: ["be-still", "silence", "stillness", "presence", "anxiety", "noise", "racing-thoughts", "psalm"],
    when_to_use:
      "When the noise inside is louder than the noise outside. Two verses. Read them. Then sit for sixty seconds without reading anything else.",
    reflection_prompt:
      "After you sat still — what came up?",
    deeper:
      "In the psalm, 'be still' isn't spoken into a quiet room — it's spoken into uproar, nations raging, mountains shaking. Stillness in Scripture was never about perfect conditions. It's about who God is in the middle of them, which means you can find it in the middle of your noise too.",
  },

  {
    id: "the-word-became-flesh",
    title: "The Word was made flesh",
    citation: "John 1:1–5, 14",
    verses: [
      { number: "1", text: "In the beginning was the Word, and the Word was with God, and the Word was God." },
      { number: "2", text: "The same was in the beginning with God." },
      { number: "3", text: "All things were made by him: and without him was made nothing that was made." },
      { number: "4", text: "In him was life, and the life was the light of men." },
      { number: "5", text: "And the light shineth in darkness, and the darkness did not comprehend it." },
      { number: "14", text: "And the Word was made flesh, and dwelt among us, (and we saw his glory, the glory as it were of the only begotten of the Father,) full of grace and truth." },
    ],
    full_text:
      "In the beginning was the Word, and the Word was with God, and the Word was God. The same was in the beginning with God. All things were made by him: and without him was made nothing that was made.\n\nIn him was life, and the life was the light of men. And the light shineth in darkness, and the darkness did not comprehend it.\n\nAnd the Word was made flesh, and dwelt among us, (and we saw his glory, the glory as it were of the only begotten of the Father,) full of grace and truth.",
    translation: "Douay-Rheims",
    themes: ["hope", "comfort"],
    season: "christmas",
    tags: ["word", "logos", "incarnation", "christmas", "light", "darkness", "john", "prologue"],
    when_to_use:
      "Christmas season. Also any time you need to remember that the light shines in the darkness and the darkness has not overcome it.",
    reflection_prompt:
      "Where is the darkness in your life right now? Read verse 5 again with that in mind.",
  },

  {
    id: "the-greatest-commandment",
    title: "Love the Lord thy God",
    citation: "Mark 12:28–31",
    verses: [
      { number: "28", text: "And there came one of the scribes that had heard them reasoning together, and seeing that he had answered them well, asked him which was the first commandment of all." },
      { number: "29", text: "And Jesus answered him: The first commandment of all is, Hear, O Israel: the Lord thy God is one God." },
      { number: "30", text: "And thou shalt love the Lord thy God, with thy whole heart, and with thy whole soul, and with thy whole mind, and with thy whole strength. This is the first commandment." },
      { number: "31", text: "And the second is like to it: Thou shalt love thy neighbour as thyself. There is no other commandment greater than these." },
    ],
    full_text:
      "And there came one of the scribes that had heard them reasoning together, and seeing that he had answered them well, asked him which was the first commandment of all.\n\nAnd Jesus answered him: The first commandment of all is, Hear, O Israel: the Lord thy God is one God. And thou shalt love the Lord thy God, with thy whole heart, and with thy whole soul, and with thy whole mind, and with thy whole strength. This is the first commandment.\n\nAnd the second is like to it: Thou shalt love thy neighbour as thyself. There is no other commandment greater than these.",
    translation: "Douay-Rheims",
    themes: ["discernment", "conversion"],
    tags: ["commandment", "love", "neighbor", "shema", "greatest", "two-commandments"],
    when_to_use:
      "When everything feels complicated and you need a north star. Two commandments. The whole Law hangs on them.",
    reflection_prompt:
      "Which of the two are you better at right now — loving God, or loving your neighbor? What does the harder one need from you this week?",
  },

  {
    id: "john-14-27",
    title: "Peace I leave with you",
    citation: "John 14:27",
    verses: [
      { number: "27", text: "Peace I leave with you, my peace I give unto you: not as the world giveth, do I give unto you. Let not your heart be troubled, nor let it be afraid." },
    ],
    full_text:
      "Peace I leave with you, my peace I give unto you: not as the world giveth, do I give unto you. Let not your heart be troubled, nor let it be afraid.",
    translation: "Douay-Rheims",
    themes: ["comfort", "trust"],
    tags: ["peace", "troubled", "afraid", "anxiety", "farewell", "last-supper", "heart"],
    when_to_use:
      "When your heart is troubled and the world's version of calm isn't holding. One verse from the Last Supper — Christ's own peace, given, not earned.",
    reflection_prompt:
      "What would 'not as the world giveth' peace actually feel like in your body right now?",
    deeper:
      "Christ said this on the last night of his life, hours from Gethsemane — hardly a calm evening. The peace he gives isn't the world's kind, which depends on things going well. His holds when nothing is going well, and it's given, not earned.",
  },

  {
    id: "psalm-34-brokenhearted",
    title: "The Lord is nigh to the contrite heart",
    citation: "Psalm 34 (Vulgate 33):18–19",
    verses: [
      { number: "18", text: "The Lord is nigh unto them that are of a contrite heart: and he will save the humble of spirit." },
      { number: "19", text: "Many are the afflictions of the just; but out of them all will the Lord deliver them." },
    ],
    full_text:
      "The Lord is nigh unto them that are of a contrite heart: and he will save the humble of spirit.\n\nMany are the afflictions of the just; but out of them all will the Lord deliver them.",
    translation: "Douay-Rheims",
    themes: ["comfort", "suffering", "healing"],
    tags: ["brokenhearted", "contrite", "grief", "affliction", "near", "deliver", "psalm", "humble"],
    when_to_use:
      "When your heart is actually broken — grief, loss, the crushed feeling. He is not far from that; He is nearest exactly there.",
    reflection_prompt:
      "Where does the brokenness sit right now? Tell Him where it is, in plain words.",
    deeper:
      "The psalmist doesn't say the Lord is near to those who have moved on — he says near to the broken heart, the crushed spirit. Grief isn't a place God waits for you to leave; it's a place where he draws especially close. You don't have to be finished grieving to be held.",
  },

  {
    id: "isaiah-43-called-by-name",
    title: "I have called thee by thy name",
    citation: "Isaiah 43:1–2",
    verses: [
      { number: "1", text: "And now thus saith the Lord that created thee, O Jacob, and formed thee, O Israel: Fear not, for I have redeemed thee, and called thee by thy name: thou art mine." },
      { number: "2", text: "When thou shalt pass through the waters, I will be with thee, and the rivers shall not cover thee: when thou shalt walk in the fire, thou shalt not be burnt, and the flames shall not burn in thee:" },
    ],
    full_text:
      "And now thus saith the Lord that created thee, O Jacob, and formed thee, O Israel: Fear not, for I have redeemed thee, and called thee by thy name: thou art mine.\n\nWhen thou shalt pass through the waters, I will be with thee, and the rivers shall not cover thee: when thou shalt walk in the fire, thou shalt not be burnt, and the flames shall not burn in thee:",
    translation: "Douay-Rheims",
    themes: ["comfort", "trust"],
    tags: ["fear", "name", "waters", "fire", "redeemed", "belonging", "isaiah", "identity", "overwhelmed"],
    when_to_use:
      "When you feel anonymous in your suffering — one more case, one more statistic. He calls you by name. The waters and the fire are named too, and neither gets the last word.",
    reflection_prompt:
      "'Thou art mine.' What in you resists believing that today?",
  },

  {
    id: "lamentations-new-every-morning",
    title: "His mercies are new every morning",
    citation: "Lamentations 3:22–26",
    verses: [
      { number: "22", text: "Heth. The mercies of the Lord that we are not consumed: because his commiserations have not failed." },
      { number: "23", text: "Heth. They are new every morning, great is thy faithfulness." },
      { number: "24", text: "Heth. The Lord is my portion, said my soul: therefore will I wait for him." },
      { number: "25", text: "Teth. The Lord is good to them that hope in him, to the soul that seeketh him." },
      { number: "26", text: "Teth. It is good to wait with silence for the salvation of God." },
    ],
    full_text:
      "Heth. The mercies of the Lord that we are not consumed: because his commiserations have not failed. Heth. They are new every morning, great is thy faithfulness.\n\nHeth. The Lord is my portion, said my soul: therefore will I wait for him.\n\nTeth. The Lord is good to them that hope in him, to the soul that seeketh him. Teth. It is good to wait with silence for the salvation of God.",
    translation: "Douay-Rheims",
    themes: ["mercy", "hope"],
    tags: ["morning", "mercies", "faithfulness", "new-day", "relapse", "start-over", "waiting", "lamentations", "one-day-at-a-time"],
    when_to_use:
      "For the morning after — the day you have to start again. Written from the ruins of Jerusalem: the mercies did not run out overnight. They restock at dawn.",
    reflection_prompt:
      "What does 'new every morning' mean for whatever happened yesterday?",
    deeper:
      "These lines were written in the ruins of Jerusalem by a man who had watched everything fall — and in the small hours, ruins are what most things look like. He found the mercies had not run out; they restock at dawn. However tonight goes, morning comes with new supply.",
  },

  {
    id: "micah-depths-of-the-sea",
    title: "He will cast all our sins into the sea",
    citation: "Micah 7:18–19",
    verses: [
      { number: "18", text: "Who is a God like to thee, who takest away iniquity, and passest by the sin of the remnant of thy inheritance? he will send his fury in no more, because he delighteth in mercy." },
      { number: "19", text: "He will turn again, and have mercy on us: he will put away our iniquities: and he will cast all our sins into the bottom of the sea." },
    ],
    full_text:
      "Who is a God like to thee, who takest away iniquity, and passest by the sin of the remnant of thy inheritance? he will send his fury in no more, because he delighteth in mercy.\n\nHe will turn again, and have mercy on us: he will put away our iniquities: and he will cast all our sins into the bottom of the sea.",
    translation: "Douay-Rheims",
    themes: ["mercy", "conversion"],
    tags: ["sins", "sea", "forgiveness", "confession", "past", "iniquity", "micah", "delighteth-in-mercy", "shame"],
    when_to_use:
      "When you keep diving back down for sins already confessed and absolved. He threw them in the sea. He delights in mercy — it's not reluctant with Him.",
    reflection_prompt:
      "Which sin do you keep retrieving from the bottom of the sea? What would it take to leave it there?",
  },

  {
    id: "philippians-4-peace",
    title: "The peace of God, which surpasseth all understanding",
    citation: "Philippians 4:6–7",
    verses: [
      { number: "6", text: "Be nothing solicitous; but in every thing, by prayer and supplication, with thanksgiving, let your petitions be made known to God." },
      { number: "7", text: "And the peace of God, which surpasseth all understanding, keep your hearts and minds in Christ Jesus." },
    ],
    full_text:
      "Be nothing solicitous; but in every thing, by prayer and supplication, with thanksgiving, let your petitions be made known to God.\n\nAnd the peace of God, which surpasseth all understanding, keep your hearts and minds in Christ Jesus.",
    translation: "Douay-Rheims",
    themes: ["trust", "comfort"],
    tags: ["anxiety", "worry", "prayer", "petition", "peace", "philippians", "paul", "racing-thoughts", "thanksgiving"],
    when_to_use:
      "When anxiety wants to be managed and Paul offers a different move: hand the specific worry to God, with thanks attached. Written from a prison cell.",
    reflection_prompt:
      "Turn your loudest worry into one sentence of petition. What is it?",
    deeper:
      "Paul wrote this from a prison cell, so the peace he describes was tested somewhere anxiety had every right to win. He doesn't ask you to stop feeling the worry — only to hand the specific thing over, in plain words. The calm isn't something you manufacture; it's something kept for you.",
  },

  {
    id: "proverbs-3-trust",
    title: "Lean not upon thy own prudence",
    citation: "Proverbs 3:5–6",
    verses: [
      { number: "5", text: "Have confidence in the Lord with all thy heart, and lean not upon thy own prudence." },
      { number: "6", text: "In all thy ways think on him, and he will direct thy steps." },
    ],
    full_text:
      "Have confidence in the Lord with all thy heart, and lean not upon thy own prudence.\n\nIn all thy ways think on him, and he will direct thy steps.",
    translation: "Douay-Rheims",
    themes: ["trust", "discernment", "surrender"],
    tags: ["trust", "confidence", "decisions", "control", "self-reliance", "direction", "proverbs", "steps"],
    when_to_use:
      "When you've been white-knuckling it on your own judgment and it isn't working. Recovery language before recovery existed: stop leaning on your own prudence.",
    reflection_prompt:
      "Where are you currently leaning hardest on your own prudence? How is that going, honestly?",
  },

  {
    id: "jeremiah-29-thoughts-of-peace",
    title: "Thoughts of peace, and not of affliction",
    citation: "Jeremiah 29:11–12",
    verses: [
      { number: "11", text: "For I know the thoughts that I think towards you, saith the Lord, thoughts of peace, and not of affliction, to give you an end and patience." },
      { number: "12", text: "And you shall call upon me, and you shall go: and you shall pray to me, and I will hear you." },
    ],
    full_text:
      "For I know the thoughts that I think towards you, saith the Lord, thoughts of peace, and not of affliction, to give you an end and patience.\n\nAnd you shall call upon me, and you shall go: and you shall pray to me, and I will hear you.",
    translation: "Douay-Rheims",
    themes: ["hope", "trust"],
    tags: ["future", "plans", "peace", "exile", "jeremiah", "waiting", "purpose", "despair"],
    when_to_use:
      "When you can't see any future worth having. Spoken to a people in exile who would wait seventy years — God's thoughts toward you are peace, even mid-exile.",
    reflection_prompt:
      "If God's thoughts toward you are 'thoughts of peace' — what does that contradict in how you talk to yourself?",
  },

  {
    id: "grace-is-sufficient",
    title: "My grace is sufficient for thee",
    citation: "2 Corinthians 12:8–10",
    verses: [
      { number: "8", text: "For which thing thrice I besought the Lord, that it might depart from me." },
      { number: "9", text: "And he said to me: My grace is sufficient for thee; for power is made perfect in infirmity. Gladly therefore will I glory in my infirmities, that the power of Christ may dwell in me." },
      { number: "10", text: "For which cause I please myself in my infirmities, in reproaches, in necessities, in persecutions, in distresses, for Christ. For when I am weak, then am I powerful." },
    ],
    full_text:
      "For which thing thrice I besought the Lord, that it might depart from me.\n\nAnd he said to me: My grace is sufficient for thee; for power is made perfect in infirmity. Gladly therefore will I glory in my infirmities, that the power of Christ may dwell in me.\n\nFor which cause I please myself in my infirmities, in reproaches, in necessities, in persecutions, in distresses, for Christ. For when I am weak, then am I powerful.",
    translation: "Douay-Rheims",
    themes: ["suffering", "hope"],
    tags: ["thorn", "weakness", "grace", "infirmity", "chronic", "unanswered-prayer", "paul", "strength", "addiction"],
    when_to_use:
      "When you've begged God to take the thing away — the craving, the illness, the weakness — and it's still there. Paul asked three times. The answer he got is the answer you have.",
    reflection_prompt:
      "What is your thorn? Can you hear 'my grace is sufficient' over it — and what changes if you do?",
  },

  {
    id: "inward-man-renewed",
    title: "The inward man is renewed day by day",
    citation: "2 Corinthians 4:16–18",
    verses: [
      { number: "16", text: "For which cause we faint not; but though our outward man is corrupted, yet the inward man is renewed day by day." },
      { number: "17", text: "For that which is at present momentary and light of our tribulation, worketh for us above measure exceedingly an eternal weight of glory." },
      { number: "18", text: "While we look not at the things which are seen, but at the things which are not seen. For the things which are seen, are temporal; but the things which are not seen, are eternal." },
    ],
    full_text:
      "For which cause we faint not; but though our outward man is corrupted, yet the inward man is renewed day by day.\n\nFor that which is at present momentary and light of our tribulation, worketh for us above measure exceedingly an eternal weight of glory.\n\nWhile we look not at the things which are seen, but at the things which are not seen. For the things which are seen, are temporal; but the things which are not seen, are eternal.",
    translation: "Douay-Rheims",
    themes: ["suffering", "hope"],
    tags: ["renewal", "day-by-day", "tribulation", "eternal", "illness", "aging", "body", "perspective", "glory"],
    when_to_use:
      "When the body or the circumstances are failing and it feels like the whole self is going down with them. The outward and the inward are not on the same trajectory.",
    reflection_prompt:
      "What in you is being renewed right now, even while something else is wearing out?",
  },

  {
    id: "tribulation-worketh-patience",
    title: "Tribulation worketh patience",
    citation: "Romans 5:3–5",
    verses: [
      { number: "3", text: "And not only so; but we glory also in tribulations, knowing that tribulation worketh patience;" },
      { number: "4", text: "And patience trial; and trial hope;" },
      { number: "5", text: "And hope confoundeth not: because the charity of God is poured forth in our hearts, by the Holy Ghost, who is given to us." },
    ],
    full_text:
      "And not only so; but we glory also in tribulations, knowing that tribulation worketh patience; And patience trial; and trial hope;\n\nAnd hope confoundeth not: because the charity of God is poured forth in our hearts, by the Holy Ghost, who is given to us.",
    translation: "Douay-Rheims",
    themes: ["suffering", "hope"],
    tags: ["tribulation", "patience", "endurance", "hope", "chain", "romans", "paul", "process", "recovery"],
    when_to_use:
      "When the suffering feels pointless. Paul traces the chain link by link — tribulation, patience, trial, hope — and hope does not disappoint.",
    reflection_prompt:
      "Where are you on that chain right now — tribulation, patience, trial, or hope?",
  },

  {
    id: "god-of-hope",
    title: "Now the God of hope fill you",
    citation: "Romans 15:13",
    verses: [
      { number: "13", text: "Now the God of hope fill you with all joy and peace in believing; that you may abound in hope, and in the power of the Holy Ghost." },
    ],
    full_text:
      "Now the God of hope fill you with all joy and peace in believing; that you may abound in hope, and in the power of the Holy Ghost.",
    translation: "Douay-Rheims",
    themes: ["hope"],
    tags: ["hope", "joy", "peace", "blessing", "holy-ghost", "romans", "benediction", "empty"],
    when_to_use:
      "When you have no hope of your own to work with. This is a blessing, not an instruction — hope here is something God fills, not something you manufacture.",
    reflection_prompt:
      "Read it as a prayer said over you. What would 'abounding in hope' look like in your week?",
  },

  {
    id: "psalm-27-expect-the-lord",
    title: "Expect the Lord, do manfully",
    citation: "Psalm 27 (Vulgate 26):13–14",
    verses: [
      { number: "13", text: "I believe to see the good things of the Lord in the land of the living." },
      { number: "14", text: "Expect the Lord, do manfully, and let thy heart take courage, and wait thou for the Lord." },
    ],
    full_text:
      "I believe to see the good things of the Lord in the land of the living.\n\nExpect the Lord, do manfully, and let thy heart take courage, and wait thou for the Lord.",
    translation: "Douay-Rheims",
    themes: ["hope", "trust"],
    tags: ["wait", "courage", "land-of-the-living", "expect", "psalm", "perseverance", "this-life"],
    when_to_use:
      "When you've quietly decided the good things are for other people, or for heaven only. 'In the land of the living' — this life. Wait for Him here.",
    reflection_prompt:
      "What good thing have you stopped expecting to see in this life? Name it, then read verse 14 again.",
  },

  {
    id: "james-ask-for-wisdom",
    title: "If any of you want wisdom",
    citation: "James 1:5–6",
    verses: [
      { number: "5", text: "But if any of you want wisdom, let him ask of God, who giveth to all men abundantly, and upbraideth not; and it shall be given him." },
      { number: "6", text: "But let him ask in faith, nothing wavering. For he that wavereth is like a wave of the sea, which is moved and carried about by the wind." },
    ],
    full_text:
      "But if any of you want wisdom, let him ask of God, who giveth to all men abundantly, and upbraideth not; and it shall be given him.\n\nBut let him ask in faith, nothing wavering. For he that wavereth is like a wave of the sea, which is moved and carried about by the wind.",
    translation: "Douay-Rheims",
    themes: ["discernment"],
    tags: ["wisdom", "ask", "decision", "confusion", "james", "upbraideth-not", "guidance", "crossroads"],
    when_to_use:
      "When you don't know what to do and you're embarrassed to still not know. 'Upbraideth not' — He doesn't scold you for asking. So ask.",
    reflection_prompt:
      "What decision are you facing that you haven't actually asked God about yet — directly, in words?",
  },

  {
    id: "psalm-25-shew-me-thy-ways",
    title: "Shew, O Lord, thy ways to me",
    citation: "Psalm 25 (Vulgate 24):4–5",
    verses: [
      { number: "4", text: "Let all them be confounded that act unjust things without cause. Shew, O Lord, thy ways to me, and teach me thy paths." },
      { number: "5", text: "Direct me in thy truth, and teach me; for thou art God my Saviour; and on thee have I waited all the day long." },
    ],
    full_text:
      "Let all them be confounded that act unjust things without cause. Shew, O Lord, thy ways to me, and teach me thy paths.\n\nDirect me in thy truth, and teach me; for thou art God my Saviour; and on thee have I waited all the day long.",
    translation: "Douay-Rheims",
    themes: ["discernment", "trust"],
    tags: ["ways", "paths", "teach", "direction", "psalm", "guidance", "waiting", "lost"],
    when_to_use:
      "The discernment prayer at its simplest: show me, teach me, direct me. Pray it slowly when the way forward is fogged in.",
    reflection_prompt:
      "If He showed you His path for the next month only — not the next decade — what do you suspect the first step is?",
  },

  {
    id: "elijah-gentle-air",
    title: "A whistling of a gentle air",
    citation: "1 Kings 19:11–13",
    verses: [
      { number: "11", text: "And he said to him: Go forth, and stand upon the mount before the Lord: and behold the Lord passeth, and a great and strong wind before the Lord over throwing the mountains, and breaking the rocks in pieces: the Lord is not in the wind, and after the wind an earthquake: the Lord is not in the earthquake." },
      { number: "12", text: "And after the earthquake a fire: the Lord is not in the fire, and after the fire a whistling of a gentle air." },
      { number: "13", text: "And when Elias heard it, he covered his face with his mantle, and coming forth stood in the entering in of the cave, and behold a voice unto him, saying: What dost thou here, Elias? And he answered:" },
    ],
    full_text:
      "And he said to him: Go forth, and stand upon the mount before the Lord: and behold the Lord passeth, and a great and strong wind before the Lord over throwing the mountains, and breaking the rocks in pieces: the Lord is not in the wind, and after the wind an earthquake: the Lord is not in the earthquake.\n\nAnd after the earthquake a fire: the Lord is not in the fire, and after the fire a whistling of a gentle air.\n\nAnd when Elias heard it, he covered his face with his mantle, and coming forth stood in the entering in of the cave, and behold a voice unto him, saying: What dost thou here, Elias? And he answered:",
    translation: "Douay-Rheims",
    themes: ["discernment"],
    tags: ["elijah", "still-small-voice", "silence", "wind", "earthquake", "fire", "cave", "listening", "burnout"],
    when_to_use:
      "When you've been waiting for God in the dramatic — the sign, the breakthrough, the earthquake — and hearing nothing. Elijah found Him in a whisper of air. Get quiet enough to notice.",
    reflection_prompt:
      "'What dost thou here?' If God asked you that today, what's your honest answer?",
    deeper:
      "Elijah reached that cave worn out and wanting to quit — a prophet, and still that empty. God let the wind, the earthquake, and the fire pass, and came instead as a whisper of air. If your inner world is loud right now, you're in good company, and the whisper still comes.",
  },

  {
    id: "take-up-thy-cross",
    title: "Take up his cross, and follow me",
    citation: "Matthew 16:24–25",
    verses: [
      { number: "24", text: "Then Jesus said to his disciples: If any man will come after me, let him deny himself, and take up his cross, and follow me." },
      { number: "25", text: "For he that will save his life, shall lose it: and he that shall lose his life for my sake, shall find it." },
    ],
    full_text:
      "Then Jesus said to his disciples: If any man will come after me, let him deny himself, and take up his cross, and follow me.\n\nFor he that will save his life, shall lose it: and he that shall lose his life for my sake, shall find it.",
    translation: "Douay-Rheims",
    themes: ["surrender", "conversion"],
    tags: ["cross", "deny", "follow", "discipleship", "cost", "lose-your-life", "self-denial", "sacrifice"],
    when_to_use:
      "When the sobriety, the forgiveness, the vocation — whatever He's asking — costs more than you budgeted. He named the cost up front: a cross, carried daily.",
    reflection_prompt:
      "What part of your life are you trying to 'save' that might need losing?",
  },

  {
    id: "christ-liveth-in-me",
    title: "I live, now not I",
    citation: "Galatians 2:19–20",
    verses: [
      { number: "19", text: "For I, through the law, am dead to the law, that I may live to God: with Christ I am nailed to the cross." },
      { number: "20", text: "And I live, now not I; but Christ liveth in me. And that I live now in the flesh: I live in the faith of the Son of God, who loved me, and delivered himself for me." },
    ],
    full_text:
      "For I, through the law, am dead to the law, that I may live to God: with Christ I am nailed to the cross.\n\nAnd I live, now not I; but Christ liveth in me. And that I live now in the flesh: I live in the faith of the Son of God, who loved me, and delivered himself for me.",
    translation: "Douay-Rheims",
    themes: ["surrender", "conversion"],
    tags: ["galatians", "new-life", "identity", "christ-in-me", "old-self", "paul", "crucified", "who-loved-me"],
    when_to_use:
      "When the old identity — the addict, the failure, the person you were — keeps claiming to be the real you. Paul's answer: that man was crucified. Someone else lives here now.",
    reflection_prompt:
      "'Who loved me, and delivered himself for me.' Paul says it in the singular — for me. Can you?",
  },

  {
    id: "into-thy-hands",
    title: "Into thy hands I commend my spirit",
    citation: "Luke 23:44–46",
    verses: [
      { number: "44", text: "And it was almost the sixth hour; and there was darkness over all the earth until the ninth hour." },
      { number: "45", text: "And the sun was darkened, and the veil of the temple was rent in the midst." },
      { number: "46", text: "And Jesus crying out with a loud voice, said: Father, into thy hands I commend my spirit. And saying this, he gave up the ghost." },
    ],
    full_text:
      "And it was almost the sixth hour; and there was darkness over all the earth until the ninth hour. And the sun was darkened, and the veil of the temple was rent in the midst.\n\nAnd Jesus crying out with a loud voice, said: Father, into thy hands I commend my spirit. And saying this, he gave up the ghost.",
    translation: "Douay-Rheims",
    themes: ["surrender", "suffering"],
    season: "lent",
    tags: ["cross", "passion", "last-words", "commend", "hands", "darkness", "death", "letting-go", "compline"],
    when_to_use:
      "For the moment there is nothing left to do but hand it over. Christ's final prayer from the cross — the Church still prays it every night at Compline.",
    reflection_prompt:
      "What would you place in His hands tonight if you prayed this line and meant it?",
    deeper:
      "This is the prayer the whole Church says every night at Compline — Christ's own last words, borrowed for bedtime. Sleep is a small nightly practice of the same trust: letting go of what you cannot hold overnight. Whatever is unfinished can sit in his hands until morning.",
  },

  {
    id: "psalm-147-broken-heart",
    title: "He healeth the broken of heart",
    citation: "Psalm 147 (Vulgate 146):2–4",
    verses: [
      { number: "2", text: "The Lord buildeth up Jerusalem: he will gather together the dispersed of Israel." },
      { number: "3", text: "Who healeth the broken of heart, and bindeth up their bruises." },
      { number: "4", text: "Who telleth the number of the stars: and calleth them all by their names." },
    ],
    full_text:
      "The Lord buildeth up Jerusalem: he will gather together the dispersed of Israel.\n\nWho healeth the broken of heart, and bindeth up their bruises.\n\nWho telleth the number of the stars: and calleth them all by their names.",
    translation: "Douay-Rheims",
    themes: ["healing", "comfort"],
    tags: ["broken-heart", "bruises", "stars", "healing", "grief", "psalm", "bind-up", "rebuild"],
    when_to_use:
      "When the wound is emotional and no one can see it. The same God who numbers the stars binds up bruises — the scale runs both directions.",
    reflection_prompt:
      "Which bruise needs binding first? He works one wound at a time.",
    deeper:
      "The same God who counts the stars and calls each by name bends down to bind up bruises no one else can see. Your loss isn't too small for that scale, and it isn't too big for it either. Binding takes time — the psalm knows that — and he stays for all of it.",
  },

  {
    id: "ezekiel-heart-of-flesh",
    title: "A new heart, and a new spirit",
    citation: "Ezekiel 36:26–27",
    verses: [
      { number: "26", text: "And I will give you a new heart, and put a new spirit within you: and I will take away the stony heart out of your flesh, and will give you a heart of flesh." },
      { number: "27", text: "And I will put my spirit in the midst of you: and I will cause you to walk in my commandments, and to keep my judgments, and do them." },
    ],
    full_text:
      "And I will give you a new heart, and put a new spirit within you: and I will take away the stony heart out of your flesh, and will give you a heart of flesh.\n\nAnd I will put my spirit in the midst of you: and I will cause you to walk in my commandments, and to keep my judgments, and do them.",
    translation: "Douay-Rheims",
    themes: ["healing", "conversion"],
    tags: ["new-heart", "stony-heart", "spirit", "ezekiel", "numbness", "change", "transplant", "promise"],
    when_to_use:
      "When you've gone numb — when the heart feels like stone and you can't make yourself feel what you should. Notice every verb is His: I will give, I will take away, I will put. The transplant is His work.",
    reflection_prompt:
      "Where has your heart gone stony — and when did you first notice?",
  },

  {
    id: "cleansing-of-the-leper",
    title: "I will, be thou made clean",
    citation: "Matthew 8:1–3",
    verses: [
      { number: "1", text: "And when he was come down from the mountain, great multitudes followed him:" },
      { number: "2", text: "And behold a leper came and adored him, saying: Lord, if thou wilt, thou canst make me clean." },
      { number: "3", text: "And Jesus stretching forth his hand, touched him, saying: I will, be thou made clean. And forthwith his leprosy was cleansed." },
    ],
    full_text:
      "And when he was come down from the mountain, great multitudes followed him:\n\nAnd behold a leper came and adored him, saying: Lord, if thou wilt, thou canst make me clean.\n\nAnd Jesus stretching forth his hand, touched him, saying: I will, be thou made clean. And forthwith his leprosy was cleansed.",
    translation: "Douay-Rheims",
    themes: ["healing", "mercy"],
    tags: ["leper", "clean", "touch", "untouchable", "shame", "if-thou-wilt", "healing", "outcast"],
    when_to_use:
      "When you feel untouchable — contagious with whatever you're carrying. The leper asked 'if thou wilt.' Christ touched him first, then spoke: I will.",
    reflection_prompt:
      "What do you believe Christ is unwilling to touch in you? Read verse 3 again.",
  },

  {
    id: "joel-rend-your-hearts",
    title: "Rend your hearts, and not your garments",
    citation: "Joel 2:12–13",
    verses: [
      { number: "12", text: "Now therefore saith the Lord: Be converted to me with all your heart, in fasting, and in weeping, and in mourning." },
      { number: "13", text: "And rend your hearts, and not your garments, and turn to the Lord your God: for he is gracious and merciful, patient and rich in mercy, and ready to repent of the evil." },
    ],
    full_text:
      "Now therefore saith the Lord: Be converted to me with all your heart, in fasting, and in weeping, and in mourning.\n\nAnd rend your hearts, and not your garments, and turn to the Lord your God: for he is gracious and merciful, patient and rich in mercy, and ready to repent of the evil.",
    translation: "Douay-Rheims",
    themes: ["conversion", "mercy"],
    season: "lent",
    tags: ["repentance", "return", "ash-wednesday", "lent", "hearts", "fasting", "joel", "turn", "rich-in-mercy"],
    when_to_use:
      "The Ash Wednesday reading. When you're tempted to perform repentance — the visible gesture — instead of the interior turn. He wants the heart, torn open.",
    reflection_prompt:
      "What's the difference, for you, between rending the garment and rending the heart?",
  },

  {
    id: "new-creature",
    title: "In Christ a new creature",
    citation: "2 Corinthians 5:17",
    verses: [
      { number: "17", text: "If then any be in Christ a new creature, the old things are passed away, behold all things are made new." },
    ],
    full_text:
      "If then any be in Christ a new creature, the old things are passed away, behold all things are made new.",
    translation: "Douay-Rheims",
    themes: ["conversion", "hope"],
    tags: ["new-creature", "new-creation", "old-things", "fresh-start", "baptism", "identity", "paul", "recovery"],
    when_to_use:
      "When the past keeps introducing you by your old name. One verse to memorize for those moments: the old things are passed away.",
    reflection_prompt:
      "Which 'old thing' still feels present tense? What would it mean to file it under 'passed away'?",
  },

  {
    id: "in-all-things-give-thanks",
    title: "In all things give thanks",
    citation: "1 Thessalonians 5:16–18",
    verses: [
      { number: "16", text: "Always rejoice." },
      { number: "17", text: "Pray without ceasing." },
      { number: "18", text: "In all things give thanks; for this is the will of God in Christ Jesus concerning you all." },
    ],
    full_text:
      "Always rejoice.\n\nPray without ceasing.\n\nIn all things give thanks; for this is the will of God in Christ Jesus concerning you all.",
    translation: "Douay-Rheims",
    themes: ["thanksgiving"],
    tags: ["gratitude", "rejoice", "pray-without-ceasing", "thanks", "thessalonians", "will-of-god", "daily-practice"],
    when_to_use:
      "The shortest rule of life in the New Testament — nine words in Greek, three commands. 'In all things' does not mean all things are good; it means gratitude is still possible inside them.",
    reflection_prompt:
      "Name three things from today — including one from the hard part of the day.",
  },

  {
    id: "ten-lepers",
    title: "Where are the nine?",
    citation: "Luke 17:15–19",
    verses: [
      { number: "15", text: "And one of them, when he saw that he was made clean, went back, with a loud voice glorifying God." },
      { number: "16", text: "And he fell on his face before his feet, giving thanks: and this was a Samaritan." },
      { number: "17", text: "And Jesus answering, said, Were not ten made clean? and where are the nine?" },
      { number: "18", text: "There is no one found to return and give glory to God, but this stranger." },
      { number: "19", text: "And he said to him: Arise, go thy way; for thy faith hath made thee whole." },
    ],
    full_text:
      "And one of them, when he saw that he was made clean, went back, with a loud voice glorifying God. And he fell on his face before his feet, giving thanks: and this was a Samaritan.\n\nAnd Jesus answering, said, Were not ten made clean? and where are the nine?\n\nThere is no one found to return and give glory to God, but this stranger.\n\nAnd he said to him: Arise, go thy way; for thy faith hath made thee whole.",
    translation: "Douay-Rheims",
    themes: ["thanksgiving", "healing"],
    tags: ["lepers", "gratitude", "return", "samaritan", "nine", "thanks", "healing", "whole"],
    when_to_use:
      "When a prayer got answered and you moved straight on to the next request. Ten were healed; one came back. Be the one.",
    reflection_prompt:
      "What answered prayer have you never gone back to say thank you for? Go back now.",
  },
];

/* ────────────────────────────────────────────────────────────────────
   CONVENIENCE LOOKUPS
   ──────────────────────────────────────────────────────────────────── */

export function getPassageById(id: string): ScripturePassage | undefined {
  return PASSAGES.find((p) => p.id === id);
}

export function getPassagesByTheme(theme: ScriptureTheme): ScripturePassage[] {
  return PASSAGES.filter((p) => p.themes.includes(theme));
}

export function getPassagesBySeason(season: ScriptureLiturgicalSeason): ScripturePassage[] {
  return PASSAGES.filter((p) => p.season === season);
}

/**
 * Pick one passage deterministically based on the date. Uses a simple
 * hash of the calendar date so each day surfaces a consistent reading
 * regardless of how many users hit the page.
 *
 * Liturgical-season passages are weighted in during their season.
 */
export function getPassageForDate(
  date: Date,
  season?: ScriptureLiturgicalSeason
): ScripturePassage {
  // If we're in a season AND there's at least one season-specific
  // passage, rotate within that subset 4 out of every 7 days; rotate
  // the general set the other 3.
  const seasonPassages = season ? getPassagesBySeason(season) : [];
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );

  if (seasonPassages.length > 0 && dayOfYear % 7 < 4) {
    return seasonPassages[dayOfYear % seasonPassages.length];
  }
  return PASSAGES[dayOfYear % PASSAGES.length];
}

export const THEME_LABELS: Record<ScriptureTheme, string> = {
  comfort: "Comfort",
  mercy: "Mercy",
  trust: "Trust",
  suffering: "Suffering",
  hope: "Hope",
  discernment: "Discernment",
  surrender: "Surrender",
  healing: "Healing",
  conversion: "Conversion",
  thanksgiving: "Thanksgiving",
};

export const THEME_BLURBS: Record<ScriptureTheme, string> = {
  comfort: "For the moments that need the Shepherd more than the teacher.",
  mercy: "When you've been caught, by yourself or by someone else.",
  trust: "For the worry-loop. The future. The not-knowing.",
  suffering: "When the cup will not pass from you.",
  hope: "When the tomb feels permanent.",
  discernment: "For the decisions where peace is the compass.",
  surrender: "When the answer is 'not my will, but Thine.'",
  healing: "Christ's encounters with the sick and the broken.",
  conversion: "The moments of turning. The first step back.",
  thanksgiving: "For when the gift needs naming.",
};
