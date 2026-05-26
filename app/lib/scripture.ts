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
