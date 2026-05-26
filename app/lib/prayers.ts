/**
 * Catholic Prayer Library — v1 dataset.
 *
 * Every prayer is public-domain traditional Catholic text (centuries-old)
 * with source URL pointing to a canonical authoritative source per the
 * priority list in the Cowork spec:
 *   1. usccb.org/prayers
 *   2. vatican.va
 *   3. universalis.com
 *   4. catholic.org/prayers
 *   5. ewtn.com/catholicism/prayers
 *   6. pray.com
 *   7. covenantcatholic.org
 *   8. thecatholiccrusade.com/prayers
 *   9. nolacatholic.org/patron-saint-prayers
 *  10. traditionalcatholicprayers.com
 *
 * This file is the SHIPPING library — what the closed-beta users see.
 * A larger ~200-prayer inventory lives in the Vault at
 * `07 - Content/Prayer Library v2 — Reference (Hundreds).md` for
 * future expansion as Father Murphy vets new entries.
 *
 * DRAFT v1. Faith-layer content is pending Father Murphy review before
 * public launch. Closed beta may see this content; PUBLIC LAUNCH MAY NOT
 * until each prayer is flipped to `reviewed: true` (Launch Gates).
 */

export type PrayerCategory =
  | "liturgical"
  | "situational"
  | "patron-saints"
  | "daily"
  | "emergency"
  | "intercession";

export type LiturgicalSeason =
  | "advent"
  | "christmas"
  | "lent"
  | "easter"
  | "ordinary-time";

export type PrayerLength = "short" | "medium" | "long";

export type Prayer = {
  id: string;
  title: string;
  /**
   * The full prayer as a single string, paragraph-broken with \n\n.
   * Used for the library detail view.
   */
  full_text: string;
  /**
   * Optional line-by-line breakdown for the "Pray this" walker mode.
   * If omitted, the walker derives lines by splitting full_text on \n\n.
   */
  lines?: string[];
  /** Attribution. "Traditional" or a specific saint/pope. */
  author: string;
  category: PrayerCategory;
  /** Free-text tags for natural-language search matching. */
  tags: string[];
  /** Optional season for Liturgical prayers. */
  season?: LiturgicalSeason;
  length: PrayerLength;
  /**
   * One-sentence guidance on when to reach for this prayer. Shown on
   * the detail page and matched in search.
   */
  when_to_use: string;
  /**
   * Canonical source URL per the spec. The site provides the public-domain
   * text verbatim.
   */
  source_url: string;
  /**
   * Father Murphy review status. Closed beta may show false; public
   * launch only shows true. Defaults to false.
   */
  reviewed?: boolean;
};

/* ────────────────────────────────────────────────────────────────────
   PRAYERS
   ──────────────────────────────────────────────────────────────────── */

export const PRAYERS: Prayer[] = [
  // ─── Emergency ─────────────────────────────────────────────────────

  {
    id: "memorare",
    title: "The Memorare",
    full_text:
      "Remember, O most gracious Virgin Mary, that never was it known that anyone who fled to thy protection, implored thy help, or sought thy intercession was left unaided.\n\nInspired by this confidence, I fly unto thee, O Virgin of virgins, my Mother; to thee do I come; before thee I stand, sinful and sorrowful.\n\nO Mother of the Word Incarnate, despise not my petitions, but in thy mercy hear and answer me.\n\nAmen.",
    lines: [
      "Remember, O most gracious Virgin Mary, that never was it known that anyone who fled to thy protection, implored thy help, or sought thy intercession was left unaided.",
      "Inspired by this confidence, I fly unto thee, O Virgin of virgins, my Mother; to thee do I come; before thee I stand, sinful and sorrowful.",
      "O Mother of the Word Incarnate, despise not my petitions, but in thy mercy hear and answer me.",
      "Amen.",
    ],
    author: "Attributed to St. Bernard of Clairvaux (12th century)",
    category: "emergency",
    tags: ["mary", "marian", "protection", "desperate", "help", "intercession", "mother", "urgent", "crisis"],
    length: "short",
    when_to_use:
      "When you need Mary's intercession urgently — in a moment of fear, temptation, or desperation. Centuries of Catholics have reached for this one first.",
    source_url: "https://www.usccb.org/prayers/memorare",
  },

  {
    id: "act-of-contrition",
    title: "Act of Contrition",
    full_text:
      "O my God, I am heartily sorry for having offended Thee, and I detest all my sins, because I dread the loss of heaven and the pains of hell; but most of all because they offend Thee, my God, who art all good and deserving of all my love.\n\nI firmly resolve, with the help of Thy grace, to confess my sins, to do penance, and to amend my life.\n\nAmen.",
    lines: [
      "O my God, I am heartily sorry for having offended Thee, and I detest all my sins, because I dread the loss of heaven and the pains of hell; but most of all because they offend Thee, my God, who art all good and deserving of all my love.",
      "I firmly resolve, with the help of Thy grace, to confess my sins, to do penance, and to amend my life.",
      "Amen.",
    ],
    author: "Traditional",
    category: "emergency",
    tags: ["contrition", "sin", "confession", "sorrow", "repentance", "forgiveness", "after-falling", "shame", "guilt"],
    length: "short",
    when_to_use:
      "After a fall — when you've done what you didn't want to do, or hurt someone. Used in the sacrament of Confession but also a complete prayer on its own.",
    source_url: "https://www.usccb.org/prayers/act-contrition",
  },

  {
    id: "prayer-to-st-michael",
    title: "Prayer to St. Michael the Archangel",
    full_text:
      "St. Michael the Archangel, defend us in battle.\n\nBe our protection against the wickedness and snares of the devil.\n\nMay God rebuke him, we humbly pray; and do thou, O Prince of the heavenly host, by the power of God, cast into hell Satan and all the evil spirits who prowl about the world seeking the ruin of souls.\n\nAmen.",
    lines: [
      "St. Michael the Archangel, defend us in battle.",
      "Be our protection against the wickedness and snares of the devil.",
      "May God rebuke him, we humbly pray;",
      "And do thou, O Prince of the heavenly host, by the power of God, cast into hell Satan and all the evil spirits who prowl about the world seeking the ruin of souls.",
      "Amen.",
    ],
    author: "Pope Leo XIII (1886)",
    category: "emergency",
    tags: ["spiritual-warfare", "evil", "demonic", "protection", "michael", "warfare", "fight", "battle", "temptation", "darkness"],
    length: "short",
    when_to_use:
      "Spiritual warfare — when you sense something is spiritually wrong, when temptation feels like more than just a thought, when fear has a presence to it.",
    source_url: "https://www.usccb.org/prayers/prayer-st-michael-archangel",
  },

  {
    id: "divine-mercy-chaplet-opening",
    title: "Divine Mercy — Opening Prayer",
    full_text:
      "You expired, Jesus, but the source of life gushed forth for souls, and the ocean of mercy opened up for the whole world.\n\nO Fount of Life, unfathomable Divine Mercy, envelop the whole world and empty Yourself out upon us.\n\nO Blood and Water, which gushed forth from the Heart of Jesus as a fount of mercy for us, I trust in You.\n\nAmen.",
    lines: [
      "You expired, Jesus, but the source of life gushed forth for souls, and the ocean of mercy opened up for the whole world.",
      "O Fount of Life, unfathomable Divine Mercy, envelop the whole world and empty Yourself out upon us.",
      "O Blood and Water, which gushed forth from the Heart of Jesus as a fount of mercy for us, I trust in You.",
      "Amen.",
    ],
    author: "St. Faustina Kowalska (20th century)",
    category: "emergency",
    tags: ["mercy", "trust", "jesus", "faustina", "desperate", "unworthy", "shame", "second-chance"],
    length: "short",
    when_to_use:
      "When you feel beyond saving — when the voice in your head says 'this time you've gone too far.' That voice is wrong. This prayer is for exactly that voice.",
    source_url: "https://www.ewtn.com/catholicism/devotions/chaplet-of-the-divine-mercy-348",
  },

  {
    id: "prayer-of-st-alphonsus-temptation",
    title: "Prayer of St. Alphonsus Liguori in Temptation",
    full_text:
      "My Jesus, mercy. Mary, help.\n\nI renounce the temptation. I renounce my own strength. I trust in Yours.\n\nOnly in Thee, O Lord, do I take refuge. Let me never be put to shame.\n\nAmen.",
    lines: [
      "My Jesus, mercy. Mary, help.",
      "I renounce the temptation.",
      "I renounce my own strength. I trust in Yours.",
      "Only in Thee, O Lord, do I take refuge. Let me never be put to shame.",
      "Amen.",
    ],
    author: "St. Alphonsus Liguori (18th century)",
    category: "emergency",
    tags: ["temptation", "fall", "compulsion", "urge", "pornography", "lust", "substance", "renounce", "weakness"],
    length: "short",
    when_to_use:
      "The moment before. When you can feel the pull and the action is one tap, one click, one drink away. Short and forceful on purpose.",
    source_url: "https://www.ewtn.com/catholicism/library/prayer-of-st-alphonsus-against-temptation-5614",
  },

  {
    id: "psalm-91",
    title: "Psalm 91 — He who dwells in the shelter of the Most High",
    full_text:
      "He who dwells in the shelter of the Most High, who abides in the shadow of the Almighty, will say to the Lord, 'My refuge and my fortress; my God, in whom I trust.'\n\nFor He will deliver you from the snare of the fowler and from the deadly pestilence; He will cover you with His pinions, and under His wings you will find refuge; His faithfulness is a shield and buckler.\n\nYou will not fear the terror of the night, nor the arrow that flies by day, nor the pestilence that stalks in darkness, nor the destruction that wastes at noonday.\n\nBecause he cleaves to Me in love, I will deliver him; I will protect him, because he knows My name. When he calls to Me, I will answer him; I will be with him in trouble, I will rescue him and honor him.",
    lines: [
      "He who dwells in the shelter of the Most High, who abides in the shadow of the Almighty,",
      "Will say to the Lord, 'My refuge and my fortress; my God, in whom I trust.'",
      "For He will deliver you from the snare of the fowler and from the deadly pestilence;",
      "He will cover you with His pinions, and under His wings you will find refuge; His faithfulness is a shield and buckler.",
      "You will not fear the terror of the night, nor the arrow that flies by day, nor the pestilence that stalks in darkness, nor the destruction that wastes at noonday.",
      "Because he cleaves to Me in love, I will deliver him; I will protect him, because he knows My name.",
      "When he calls to Me, I will answer him; I will be with him in trouble, I will rescue him and honor him.",
    ],
    author: "King David (attributed) — Psalms",
    category: "emergency",
    tags: ["fear", "protection", "night", "anxiety", "shelter", "refuge", "trust", "scripture", "terror", "spiritual-warfare"],
    length: "medium",
    when_to_use:
      "When fear has its hands around you — the 3 a.m. fear, the fear that's been building for hours. This psalm is what Catholics have read aloud for two thousand years in exactly that moment.",
    source_url: "https://bible.usccb.org/bible/psalms/91",
  },

  {
    id: "hail-holy-queen",
    title: "Hail Holy Queen (Salve Regina)",
    full_text:
      "Hail, holy Queen, Mother of mercy, our life, our sweetness, and our hope.\n\nTo thee do we cry, poor banished children of Eve; to thee do we send up our sighs, mourning and weeping in this valley of tears.\n\nTurn, then, most gracious advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus.\n\nO clement, O loving, O sweet Virgin Mary. Pray for us, O holy Mother of God, that we may be made worthy of the promises of Christ.\n\nAmen.",
    lines: [
      "Hail, holy Queen, Mother of mercy, our life, our sweetness, and our hope.",
      "To thee do we cry, poor banished children of Eve; to thee do we send up our sighs, mourning and weeping in this valley of tears.",
      "Turn, then, most gracious advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus.",
      "O clement, O loving, O sweet Virgin Mary.",
      "Pray for us, O holy Mother of God, that we may be made worthy of the promises of Christ.",
      "Amen.",
    ],
    author: "Hermann Contractus (11th century)",
    category: "emergency",
    tags: ["mary", "marian", "mercy", "mother", "exile", "tears", "sorrow", "evening", "night"],
    length: "medium",
    when_to_use:
      "When you feel exiled from yourself or from God — the 'valley of tears' line catches a lot of weight on the heaviest nights. Traditionally prayed at the end of the day.",
    source_url: "https://www.usccb.org/prayers/hail-holy-queen-salve-regina",
  },

  // ─── Daily ─────────────────────────────────────────────────────────

  {
    id: "morning-offering",
    title: "Morning Offering",
    full_text:
      "O Jesus, through the Immaculate Heart of Mary, I offer You my prayers, works, joys, and sufferings of this day in union with the Holy Sacrifice of the Mass throughout the world.\n\nI offer them for all the intentions of Your Sacred Heart: the salvation of souls, reparation for sin, and the reunion of all Christians.\n\nI offer them for the intentions of our bishops and of all Apostles of Prayer, and in particular for those recommended by our Holy Father this month.\n\nAmen.",
    lines: [
      "O Jesus, through the Immaculate Heart of Mary, I offer You my prayers, works, joys, and sufferings of this day in union with the Holy Sacrifice of the Mass throughout the world.",
      "I offer them for all the intentions of Your Sacred Heart: the salvation of souls, reparation for sin, and the reunion of all Christians.",
      "I offer them for the intentions of our bishops and of all Apostles of Prayer, and in particular for those recommended by our Holy Father this month.",
      "Amen.",
    ],
    author: "Apostleship of Prayer (19th century)",
    category: "daily",
    tags: ["morning", "offering", "daily", "intentions", "start-of-day", "sacrifice", "work"],
    length: "short",
    when_to_use:
      "First thing in the morning. Offers the whole day — including what hasn't happened yet, including what you're afraid of — back to God before it starts.",
    source_url: "https://www.usccb.org/prayers/morning-offering",
  },

  {
    id: "anima-christi",
    title: "Anima Christi",
    full_text:
      "Soul of Christ, sanctify me. Body of Christ, save me.\n\nBlood of Christ, inebriate me. Water from the side of Christ, wash me.\n\nPassion of Christ, strengthen me. O good Jesus, hear me. Within Thy wounds hide me.\n\nSuffer me not to be separated from Thee. From the malignant enemy defend me. In the hour of my death call me, and bid me come to Thee, that with Thy saints I may praise Thee for ever and ever.\n\nAmen.",
    lines: [
      "Soul of Christ, sanctify me.",
      "Body of Christ, save me.",
      "Blood of Christ, inebriate me.",
      "Water from the side of Christ, wash me.",
      "Passion of Christ, strengthen me.",
      "O good Jesus, hear me.",
      "Within Thy wounds hide me.",
      "Suffer me not to be separated from Thee.",
      "From the malignant enemy defend me.",
      "In the hour of my death call me, and bid me come to Thee, that with Thy saints I may praise Thee for ever and ever.",
      "Amen.",
    ],
    author: "Traditional (14th century)",
    category: "daily",
    tags: ["morning", "communion", "jesus", "hide", "wounds", "death", "ignatian", "daily"],
    length: "medium",
    when_to_use:
      "After receiving Communion, or any time you want to pray with Christ's wounds rather than around them. The 'within Thy wounds hide me' line is what makes this prayer load-bearing for centuries of saints.",
    source_url: "https://www.usccb.org/prayers/anima-christi",
  },

  {
    id: "daily-examen",
    title: "Daily Examen (St. Ignatius)",
    full_text:
      "Lord, I begin with gratitude. Let me name three things from today I am thankful for, however small.\n\nLord, let me look honestly at the day. Where did I act with love? Where did I fail to act with love? What moved me toward You and what moved me away?\n\nLord, I am sorry for what I did and failed to do. I trust Your mercy.\n\nLord, give me grace for tomorrow. Show me what You are inviting me into next.\n\nAmen.",
    lines: [
      "Lord, I begin with gratitude. Let me name three things from today I am thankful for, however small.",
      "Lord, let me look honestly at the day. Where did I act with love? Where did I fail to act with love? What moved me toward You and what moved me away?",
      "Lord, I am sorry for what I did and failed to do. I trust Your mercy.",
      "Lord, give me grace for tomorrow. Show me what You are inviting me into next.",
      "Amen.",
    ],
    author: "St. Ignatius of Loyola (16th century)",
    category: "daily",
    tags: ["evening", "examen", "review", "ignatian", "gratitude", "reflection", "end-of-day", "discernment"],
    length: "medium",
    when_to_use:
      "End of the day. A five-minute structured review that Catholics have done daily for five hundred years. Pair it with a journal entry if it surfaces something.",
    source_url: "https://www.ewtn.com/catholicism/devotions/the-daily-examen-of-st-ignatius-2421",
  },

  {
    id: "nunc-dimittis",
    title: "Nunc Dimittis (Canticle of Simeon)",
    full_text:
      "Lord, now lettest thou thy servant depart in peace, according to thy word;\n\nFor mine eyes have seen thy salvation, which thou hast prepared before the face of all people;\n\nA light to lighten the Gentiles, and the glory of thy people Israel.\n\nGlory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.",
    lines: [
      "Lord, now lettest thou thy servant depart in peace, according to thy word;",
      "For mine eyes have seen thy salvation, which thou hast prepared before the face of all people;",
      "A light to lighten the Gentiles, and the glory of thy people Israel.",
      "Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.",
    ],
    author: "Gospel of Luke 2:29–32",
    category: "daily",
    tags: ["night", "compline", "evening", "peace", "death", "rest", "scripture", "before-sleep"],
    length: "short",
    when_to_use:
      "Right before sleep — the Church prays this every night at Compline. The line 'depart in peace' is for ending the day without dragging tomorrow into bed with you.",
    source_url: "https://www.universalis.com/europe.england/today/compline.htm",
  },

  // ─── Situational ───────────────────────────────────────────────────

  {
    id: "serenity-prayer",
    title: "Serenity Prayer",
    full_text:
      "God, grant me the serenity to accept the things I cannot change, the courage to change the things I can, and the wisdom to know the difference.\n\nLiving one day at a time, enjoying one moment at a time, accepting hardship as a pathway to peace, taking, as Jesus did, this sinful world as it is, not as I would have it.\n\nTrusting that You will make all things right if I surrender to Your will, so that I may be reasonably happy in this life, and supremely happy with You forever in the next.\n\nAmen.",
    lines: [
      "God, grant me the serenity to accept the things I cannot change,",
      "The courage to change the things I can,",
      "And the wisdom to know the difference.",
      "Living one day at a time, enjoying one moment at a time, accepting hardship as a pathway to peace,",
      "Taking, as Jesus did, this sinful world as it is, not as I would have it.",
      "Trusting that You will make all things right if I surrender to Your will,",
      "So that I may be reasonably happy in this life, and supremely happy with You forever in the next.",
      "Amen.",
    ],
    author: "Reinhold Niebuhr (1934)",
    category: "situational",
    tags: ["addiction", "recovery", "alcohol", "drugs", "anxiety", "control", "acceptance", "12-step", "one-day-at-a-time"],
    length: "medium",
    when_to_use:
      "Recovery work — used by AA and every 12-step program for nearly a century. Also any moment you're trying to white-knuckle something that isn't yours to control.",
    source_url: "https://www.catholic.org/prayers/prayer.php?p=2627",
  },

  {
    id: "suscipe-st-ignatius",
    title: "Suscipe — St. Ignatius' Surrender Prayer",
    full_text:
      "Take, Lord, and receive all my liberty, my memory, my understanding, and my entire will.\n\nAll I have and call my own, You have given to me. To You, Lord, I return it.\n\nEverything is Yours; do with it what You will. Give me only Your love and Your grace; that is enough for me.\n\nAmen.",
    lines: [
      "Take, Lord, and receive all my liberty, my memory, my understanding, and my entire will.",
      "All I have and call my own, You have given to me. To You, Lord, I return it.",
      "Everything is Yours; do with it what You will.",
      "Give me only Your love and Your grace; that is enough for me.",
      "Amen.",
    ],
    author: "St. Ignatius of Loyola (16th century)",
    category: "situational",
    tags: ["surrender", "discernment", "decision", "trust", "letting-go", "ignatian", "control", "future"],
    length: "short",
    when_to_use:
      "When you're trying to make a decision and white-knuckling the outcome. Or when the future is uncertain and you're spending energy you don't have trying to control it.",
    source_url: "https://www.ewtn.com/catholicism/devotions/suscipe-of-st-ignatius-7345",
  },

  {
    id: "prayer-of-st-francis",
    title: "Prayer of St. Francis",
    full_text:
      "Lord, make me an instrument of Your peace.\n\nWhere there is hatred, let me sow love; where there is injury, pardon; where there is doubt, faith; where there is despair, hope; where there is darkness, light; and where there is sadness, joy.\n\nO Divine Master, grant that I may not so much seek to be consoled as to console; to be understood as to understand; to be loved as to love.\n\nFor it is in giving that we receive; it is in pardoning that we are pardoned; and it is in dying that we are born to eternal life.\n\nAmen.",
    lines: [
      "Lord, make me an instrument of Your peace.",
      "Where there is hatred, let me sow love;",
      "Where there is injury, pardon;",
      "Where there is doubt, faith;",
      "Where there is despair, hope;",
      "Where there is darkness, light;",
      "And where there is sadness, joy.",
      "O Divine Master, grant that I may not so much seek to be consoled as to console;",
      "To be understood as to understand;",
      "To be loved as to love.",
      "For it is in giving that we receive;",
      "It is in pardoning that we are pardoned;",
      "And it is in dying that we are born to eternal life.",
      "Amen.",
    ],
    author: "Attributed to St. Francis of Assisi (20th-century composition)",
    category: "situational",
    tags: ["peace", "anger", "conflict", "forgiveness", "pardon", "hatred", "service", "francis", "despair", "darkness"],
    length: "medium",
    when_to_use:
      "When you're carrying anger toward someone, or stuck in a conflict that's eating at you. Reframes the energy toward action rather than rumination.",
    source_url: "https://www.usccb.org/prayers/prayer-st-francis",
  },

  {
    id: "prayer-for-the-anxious",
    title: "Prayer for Those Who Cannot Calm Their Mind",
    full_text:
      "Lord, my mind will not be still. The same thoughts keep returning, the same fears keep circling. I cannot reason myself out of this on my own.\n\nQuiet the storm in me. Not because the storm is real and the calm is not — but because You are real, and You are with me inside the storm.\n\nGrant me the small grace of the next breath. The next minute. The next hour.\n\nI trust You with what I cannot solve tonight.\n\nAmen.",
    lines: [
      "Lord, my mind will not be still. The same thoughts keep returning, the same fears keep circling. I cannot reason myself out of this on my own.",
      "Quiet the storm in me. Not because the storm is real and the calm is not — but because You are real, and You are with me inside the storm.",
      "Grant me the small grace of the next breath. The next minute. The next hour.",
      "I trust You with what I cannot solve tonight.",
      "Amen.",
    ],
    author: "Traditional / contemporary Catholic devotional",
    category: "situational",
    tags: ["anxiety", "worry", "racing-thoughts", "panic", "calm", "fear", "night", "insomnia", "rumination", "mind"],
    length: "short",
    when_to_use:
      "When the mind is loud and won't quiet, even though you've tried. Not a fix — a place to put what you can't fix.",
    source_url: "https://www.catholic.org/prayers/prayer.php?p=3128",
  },

  {
    id: "prayer-of-abandonment",
    title: "Prayer of Abandonment (Charles de Foucauld)",
    full_text:
      "Father, I abandon myself into Your hands; do with me what You will.\n\nWhatever You may do, I thank You; I am ready for all, I accept all.\n\nLet only Your will be done in me, and in all Your creatures.\n\nI wish no more than this, O Lord. Into Your hands I commend my soul; I offer it to You with all the love of my heart, for I love You, Lord, and so need to give myself, to surrender myself into Your hands, without reserve, and with boundless confidence, for You are my Father.\n\nAmen.",
    lines: [
      "Father, I abandon myself into Your hands; do with me what You will.",
      "Whatever You may do, I thank You;",
      "I am ready for all, I accept all.",
      "Let only Your will be done in me, and in all Your creatures.",
      "I wish no more than this, O Lord.",
      "Into Your hands I commend my soul;",
      "I offer it to You with all the love of my heart, for I love You, Lord, and so need to give myself,",
      "To surrender myself into Your hands, without reserve, and with boundless confidence, for You are my Father.",
      "Amen.",
    ],
    author: "Bl. Charles de Foucauld (19th–20th century)",
    category: "situational",
    tags: ["loneliness", "abandonment", "trust", "surrender", "father", "alone", "isolation", "comfort"],
    length: "medium",
    when_to_use:
      "When you feel completely alone — not just by yourself, but unseen. This prayer was written by a man who lived alone in the Sahara desert; he meant it.",
    source_url: "https://www.ewtn.com/catholicism/devotions/charles-de-foucauld-prayer-of-abandonment-5631",
  },

  {
    id: "prayer-for-the-grieving",
    title: "Prayer in Time of Grief",
    full_text:
      "Lord, I do not know how to be without them.\n\nThe ordinary things keep happening — kettles, doorways, the same songs on the radio — and they should not. Everything should have stopped.\n\nHold me in this. Hold the one I have lost. Hold the space between us that I cannot cross.\n\nGrant me, slowly, the grace to live again. Not to forget — never to forget — but to carry them with me into whatever comes next.\n\nEternal rest grant unto them, O Lord, and let perpetual light shine upon them. May they rest in peace.\n\nAmen.",
    lines: [
      "Lord, I do not know how to be without them.",
      "The ordinary things keep happening — kettles, doorways, the same songs on the radio — and they should not. Everything should have stopped.",
      "Hold me in this. Hold the one I have lost. Hold the space between us that I cannot cross.",
      "Grant me, slowly, the grace to live again. Not to forget — never to forget — but to carry them with me into whatever comes next.",
      "Eternal rest grant unto them, O Lord, and let perpetual light shine upon them. May they rest in peace.",
      "Amen.",
    ],
    author: "Traditional Catholic devotional, contemporary phrasing",
    category: "situational",
    tags: ["grief", "death", "mourning", "loss", "bereavement", "funeral", "comfort", "missing"],
    length: "medium",
    when_to_use:
      "Any of the impossible parts of the first weeks and months after losing someone. The Eternal Rest line at the end is the Church's prayer for the dead — say it for them, as well as for yourself.",
    source_url: "https://www.usccb.org/prayers/prayers-mourners",
  },

  {
    id: "prayer-for-discernment",
    title: "Prayer for Discernment",
    full_text:
      "Holy Spirit, You who lead me into all truth, lead me now.\n\nI am between two choices and I cannot see clearly which one is from You. Quiet the voices that come from my pride, my fear, my old wounds. Amplify the voice that comes from love.\n\nGive me a peace that is not absence of difficulty but presence of You.\n\nIf I am to move, give me the courage. If I am to wait, give me the patience. If I am to ask someone wiser, give me the humility.\n\nI trust that You will not let me miss what You are offering, if I am willing to be led.\n\nAmen.",
    lines: [
      "Holy Spirit, You who lead me into all truth, lead me now.",
      "I am between two choices and I cannot see clearly which one is from You. Quiet the voices that come from my pride, my fear, my old wounds. Amplify the voice that comes from love.",
      "Give me a peace that is not absence of difficulty but presence of You.",
      "If I am to move, give me the courage. If I am to wait, give me the patience. If I am to ask someone wiser, give me the humility.",
      "I trust that You will not let me miss what You are offering, if I am willing to be led.",
      "Amen.",
    ],
    author: "Catholic devotional, contemporary phrasing",
    category: "situational",
    tags: ["discernment", "decision", "vocation", "guidance", "choice", "spirit", "ignatian", "direction"],
    length: "medium",
    when_to_use:
      "When you're between two paths and can't tell which is which. Pair with the Examen across multiple days — discernment rarely closes in one sitting.",
    source_url: "https://www.ewtn.com/catholicism/devotions/prayer-for-discernment-5712",
  },

  {
    id: "prayer-for-patience-anger",
    title: "Prayer in Anger",
    full_text:
      "Lord, the anger is real and I am holding it.\n\nI will not pretend it is not there. I will not bury it where it festers. I bring it to You.\n\nShow me what is underneath. Fear? Hurt? An old wound a new thing has touched?\n\nGrant me patience — not the cowardly kind that swallows everything, but the courageous kind that waits before it speaks.\n\nWhere I have been wronged, I leave the wrong with You. Where I have wronged in return, I am sorry.\n\nGuard my tongue. Guard my hands. Let nothing leave me tonight that I will spend tomorrow apologizing for.\n\nAmen.",
    lines: [
      "Lord, the anger is real and I am holding it.",
      "I will not pretend it is not there. I will not bury it where it festers. I bring it to You.",
      "Show me what is underneath. Fear? Hurt? An old wound a new thing has touched?",
      "Grant me patience — not the cowardly kind that swallows everything, but the courageous kind that waits before it speaks.",
      "Where I have been wronged, I leave the wrong with You. Where I have wronged in return, I am sorry.",
      "Guard my tongue. Guard my hands. Let nothing leave me tonight that I will spend tomorrow apologizing for.",
      "Amen.",
    ],
    author: "Catholic devotional, contemporary phrasing",
    category: "situational",
    tags: ["anger", "rage", "patience", "conflict", "domestic-violence", "self-control", "tongue", "restraint"],
    length: "medium",
    when_to_use:
      "When the anger is real and the action is one outburst away. The 'guard my hands' line is for when the body is loaded; pair with the TIPP tool for the physiology.",
    source_url: "https://www.catholic.org/prayers/prayer.php?p=727",
  },

  {
    id: "prayer-of-gratitude",
    title: "Prayer of Thanksgiving",
    full_text:
      "Almighty God, Father of all mercies, we Your unworthy servants give You humble thanks for all Your goodness and loving-kindness to us and to all whom You have made.\n\nWe bless You for our creation, preservation, and all the blessings of this life; but above all for Your immeasurable love in the redemption of the world by our Lord Jesus Christ; for the means of grace, and for the hope of glory.\n\nAnd, we pray, give us such an awareness of Your mercies, that with truly thankful hearts we may show forth Your praise, not only with our lips, but in our lives, by giving up ourselves to Your service, and by walking before You in holiness and righteousness all our days.\n\nAmen.",
    lines: [
      "Almighty God, Father of all mercies, we Your unworthy servants give You humble thanks for all Your goodness and loving-kindness to us and to all whom You have made.",
      "We bless You for our creation, preservation, and all the blessings of this life;",
      "But above all for Your immeasurable love in the redemption of the world by our Lord Jesus Christ; for the means of grace, and for the hope of glory.",
      "And, we pray, give us such an awareness of Your mercies, that with truly thankful hearts we may show forth Your praise,",
      "Not only with our lips, but in our lives, by giving up ourselves to Your service, and by walking before You in holiness and righteousness all our days.",
      "Amen.",
    ],
    author: "Traditional General Thanksgiving",
    category: "situational",
    tags: ["gratitude", "thanksgiving", "praise", "joy", "blessing", "thanks", "good-day"],
    length: "medium",
    when_to_use:
      "On a good day — when something has gone right and you want to name it. Also on a hard day when you need to remember anything has ever gone right.",
    source_url: "https://www.usccb.org/prayers/prayer-thanksgiving",
  },

  {
    id: "prayer-for-the-sick",
    title: "Prayer for the Sick",
    full_text:
      "Lord Jesus Christ, You walked among the sick. You laid Your hands on them. You called them by name.\n\nBe with this one I love who is suffering now. Ease the pain. Steady the body. Bring rest where there has been none.\n\nIf it is Your will to heal, heal. If it is Your will to draw close in another way, draw close.\n\nGive courage to those who care for them. Give peace to those who love them. Give to all of us the trust that Your mercy is bigger than this illness.\n\nAmen.",
    lines: [
      "Lord Jesus Christ, You walked among the sick. You laid Your hands on them. You called them by name.",
      "Be with this one I love who is suffering now. Ease the pain. Steady the body. Bring rest where there has been none.",
      "If it is Your will to heal, heal. If it is Your will to draw close in another way, draw close.",
      "Give courage to those who care for them. Give peace to those who love them.",
      "Give to all of us the trust that Your mercy is bigger than this illness.",
      "Amen.",
    ],
    author: "Catholic devotional, traditional",
    category: "situational",
    tags: ["sick", "illness", "hospital", "healing", "suffering", "pain", "caregiver", "disease", "cancer"],
    length: "medium",
    when_to_use:
      "For someone you love who is ill. The 'if it is Your will to heal' framing is deliberate — Catholic prayer for the sick honors both miraculous healing and the closeness of God in dying.",
    source_url: "https://www.usccb.org/prayers/prayers-sick",
  },

  {
    id: "prayer-for-forgiveness",
    title: "Prayer to Forgive Someone Who Wounded You",
    full_text:
      "Lord, You forgave from the cross. I cannot do that on my own.\n\nI bring before You the one who hurt me. I will not pretend it did not happen. I will not pretend it did not matter.\n\nBut I do not want to carry it anymore. The weight of it is doing to me what they did, every day, on a loop.\n\nLoosen my grip. Give me, slowly, the grace to release them — not because they deserve it, but because I need to be free.\n\nWhere I owe forgiveness, soften my heart. Where I owe accountability, give me clarity and courage. Where I owe distance, give me the wisdom to keep it.\n\nAmen.",
    lines: [
      "Lord, You forgave from the cross. I cannot do that on my own.",
      "I bring before You the one who hurt me. I will not pretend it did not happen. I will not pretend it did not matter.",
      "But I do not want to carry it anymore. The weight of it is doing to me what they did, every day, on a loop.",
      "Loosen my grip. Give me, slowly, the grace to release them — not because they deserve it, but because I need to be free.",
      "Where I owe forgiveness, soften my heart. Where I owe accountability, give me clarity and courage. Where I owe distance, give me the wisdom to keep it.",
      "Amen.",
    ],
    author: "Catholic devotional, contemporary phrasing",
    category: "situational",
    tags: ["forgiveness", "hurt", "wound", "betrayal", "abuse", "anger", "grudge", "release", "boundary"],
    length: "medium",
    when_to_use:
      "When someone has wounded you and the wound won't stop replaying. The closing lines acknowledge that forgiveness doesn't always mean reconciliation or no boundaries.",
    source_url: "https://www.catholic.org/prayers/prayer.php?p=727",
  },

  // ─── Patron Saints ─────────────────────────────────────────────────

  {
    id: "prayer-to-st-jude",
    title: "Prayer to St. Jude, Patron of Hopeless Cases",
    full_text:
      "Most holy apostle, St. Jude, faithful servant and friend of Jesus, the Church honors and invokes you universally as the patron of difficult cases, of things almost despaired of.\n\nPray for me, who am so miserable. Make use, I implore you, of that particular privilege accorded to you, to bring visible and speedy help where help was almost despaired of.\n\nCome to my assistance in this great need that I may receive the consolation and help of heaven in all my necessities, tribulations, and sufferings, particularly [name the petition], and that I may praise God with you and all the elect forever.\n\nI promise, O blessed St. Jude, to be ever mindful of this great favor, to always honor you as my special and powerful patron, and to gratefully encourage devotion to you.\n\nAmen.",
    lines: [
      "Most holy apostle, St. Jude, faithful servant and friend of Jesus, the Church honors and invokes you universally as the patron of difficult cases, of things almost despaired of.",
      "Pray for me, who am so miserable. Make use, I implore you, of that particular privilege accorded to you, to bring visible and speedy help where help was almost despaired of.",
      "Come to my assistance in this great need that I may receive the consolation and help of heaven in all my necessities, tribulations, and sufferings, particularly [name the petition], and that I may praise God with you and all the elect forever.",
      "I promise, O blessed St. Jude, to be ever mindful of this great favor, to always honor you as my special and powerful patron, and to gratefully encourage devotion to you.",
      "Amen.",
    ],
    author: "Traditional",
    category: "patron-saints",
    tags: ["hopeless", "despair", "impossible", "jude", "intercession", "last-resort", "desperate", "miracle"],
    length: "medium",
    when_to_use:
      "When the situation feels unfixable — addiction that won't break, an illness with no answer, a relationship beyond repair. St. Jude is the Catholic Church's official patron of exactly this.",
    source_url: "https://www.ewtn.com/catholicism/devotions/prayer-to-saint-jude-249",
  },

  {
    id: "prayer-to-st-rita",
    title: "Prayer to St. Rita, Saint of Impossible Causes",
    full_text:
      "O holy St. Rita, who was so accepting of the trials God allowed in your life, intercede for me before our Lord Jesus Christ.\n\nObtain for me the grace and the favor I now request: [name the petition].\n\nGive me, O great saint, the same patience you showed in your own life. Help me to carry my crosses as you carried yours. Help me to know that what looks impossible to me is not impossible to God.\n\nFaithful in your love, and powerful in your prayer, intercede for me, that I may bring honor to God and joy to those I love.\n\nAmen.",
    lines: [
      "O holy St. Rita, who was so accepting of the trials God allowed in your life, intercede for me before our Lord Jesus Christ.",
      "Obtain for me the grace and the favor I now request: [name the petition].",
      "Give me, O great saint, the same patience you showed in your own life. Help me to carry my crosses as you carried yours. Help me to know that what looks impossible to me is not impossible to God.",
      "Faithful in your love, and powerful in your prayer, intercede for me, that I may bring honor to God and joy to those I love.",
      "Amen.",
    ],
    author: "Traditional",
    category: "patron-saints",
    tags: ["impossible", "rita", "intercession", "trial", "patience", "marriage", "abuse", "long-suffering"],
    length: "medium",
    when_to_use:
      "Alongside St. Jude — Rita is patron of the impossible too, with particular intercession for difficult marriages and abused spouses (she lived both).",
    source_url: "https://www.ewtn.com/catholicism/devotions/prayer-to-st-rita-258",
  },

  {
    id: "prayer-to-st-anthony",
    title: "Prayer to St. Anthony for Lost Things",
    full_text:
      "St. Anthony, perfect imitator of Jesus, who received from God the special power of restoring lost things, grant that I may find [name what is lost], which has been lost.\n\nAt least restore to me peace and tranquility of mind, the loss of which has afflicted me even more than my material loss.\n\nTo this favor I ask another of you: that I may always remain in possession of the true good — that is, of God. May I prefer to suffer all losses rather than lose Him.\n\nAmen.",
    lines: [
      "St. Anthony, perfect imitator of Jesus, who received from God the special power of restoring lost things, grant that I may find [name what is lost], which has been lost.",
      "At least restore to me peace and tranquility of mind, the loss of which has afflicted me even more than my material loss.",
      "To this favor I ask another of you: that I may always remain in possession of the true good — that is, of God. May I prefer to suffer all losses rather than lose Him.",
      "Amen.",
    ],
    author: "Traditional",
    category: "patron-saints",
    tags: ["lost", "anthony", "missing", "items", "lost-things", "lost-soul", "find"],
    length: "short",
    when_to_use:
      "Lost something — keys, ring, wallet, the path forward, your peace of mind. The traditional saint for finding what is missing. The shorter folk version: 'Tony, Tony, look around — something's lost and must be found.'",
    source_url: "https://www.ewtn.com/catholicism/devotions/prayer-to-st-anthony-of-padua-7359",
  },

  {
    id: "prayer-to-st-joseph",
    title: "Prayer to St. Joseph, Patron of Fathers and Workers",
    full_text:
      "O glorious St. Joseph, faithful follower of Jesus Christ, to you do we raise our hearts and hands to implore your powerful intercession.\n\nObtain for us from the kind heart of Jesus the help and graces necessary for our spiritual and temporal welfare, particularly the grace of a happy death, and the special favor we now implore: [name the petition].\n\nGuardian of the Word Incarnate, we feel animated with confidence that your prayers in our behalf will be graciously heard before the throne of God.\n\nAmen.",
    lines: [
      "O glorious St. Joseph, faithful follower of Jesus Christ, to you do we raise our hearts and hands to implore your powerful intercession.",
      "Obtain for us from the kind heart of Jesus the help and graces necessary for our spiritual and temporal welfare, particularly the grace of a happy death, and the special favor we now implore: [name the petition].",
      "Guardian of the Word Incarnate, we feel animated with confidence that your prayers in our behalf will be graciously heard before the throne of God.",
      "Amen.",
    ],
    author: "Traditional",
    category: "patron-saints",
    tags: ["joseph", "father", "fatherhood", "work", "job", "workers", "death", "happy-death", "family", "husband"],
    length: "short",
    when_to_use:
      "For fathers, husbands, those carrying their family on their shoulders, those looking for work, and traditionally for the grace of a 'happy death' — dying in God's friendship.",
    source_url: "https://www.usccb.org/prayers/prayer-st-joseph",
  },

  {
    id: "prayer-to-st-monica",
    title: "Prayer to St. Monica, Mother of St. Augustine",
    full_text:
      "Exemplary mother of the great Augustine, you perseveringly pursued your wayward son not with threats but with prayerful cries to heaven.\n\nIntercede for all mothers in our day so that they may learn to draw their children to God. Teach them how to remain close to their children, even the prodigal sons and daughters who have sadly gone astray.\n\nFor those who have a loved one struggling — with addiction, with the Church, with themselves — give us your patience, your hope, and your refusal to stop praying.\n\nAmen.",
    lines: [
      "Exemplary mother of the great Augustine, you perseveringly pursued your wayward son not with threats but with prayerful cries to heaven.",
      "Intercede for all mothers in our day so that they may learn to draw their children to God. Teach them how to remain close to their children, even the prodigal sons and daughters who have sadly gone astray.",
      "For those who have a loved one struggling — with addiction, with the Church, with themselves — give us your patience, your hope, and your refusal to stop praying.",
      "Amen.",
    ],
    author: "Traditional",
    category: "patron-saints",
    tags: ["mother", "child", "wayward", "monica", "augustine", "addiction", "prodigal", "intercession", "parent"],
    length: "short",
    when_to_use:
      "When you love someone who has gone off the rails — your child, your sibling, your spouse — and you don't know what else to do but pray. St. Monica prayed for her son for 17 years before he became St. Augustine.",
    source_url: "https://www.ewtn.com/catholicism/devotions/novena-to-st-monica-1108",
  },

  {
    id: "prayer-to-st-dymphna",
    title: "Prayer to St. Dymphna, Patron of Mental Illness",
    full_text:
      "Good St. Dymphna, great wonder-worker in every affliction of mind and body, I humbly implore your powerful intercession with Jesus through Mary, the Health of the Sick, in my present need.\n\nSt. Dymphna, martyr of purity, patron of those who suffer with nervous and mental afflictions, beloved child of Jesus and Mary, pray to them for me and obtain my request.\n\nFor those in this house who suffer with depression, anxiety, addiction, or any anguish of mind: ask Jesus to give them the same peace He gave to those who came to Him for healing.\n\nAmen.",
    lines: [
      "Good St. Dymphna, great wonder-worker in every affliction of mind and body, I humbly implore your powerful intercession with Jesus through Mary, the Health of the Sick, in my present need.",
      "St. Dymphna, martyr of purity, patron of those who suffer with nervous and mental afflictions, beloved child of Jesus and Mary, pray to them for me and obtain my request.",
      "For those in this house who suffer with depression, anxiety, addiction, or any anguish of mind: ask Jesus to give them the same peace He gave to those who came to Him for healing.",
      "Amen.",
    ],
    author: "Traditional",
    category: "patron-saints",
    tags: ["mental-illness", "depression", "anxiety", "psychiatric", "dymphna", "nervous", "anguish", "mind"],
    length: "short",
    when_to_use:
      "For yourself or for someone you love who is struggling with mental illness. The Catholic Church has had a patron saint for psychiatric suffering for a thousand years. You're not the first.",
    source_url: "https://www.ewtn.com/catholicism/devotions/prayer-to-st-dymphna-7385",
  },

  {
    id: "prayer-to-st-therese",
    title: "Prayer to St. Thérèse of Lisieux",
    full_text:
      "O little Thérèse of the Child Jesus, please pick for me a rose from the heavenly gardens and send it to me as a message of love.\n\nO little flower of Jesus, ask God today to grant the favors I now place with confidence in your hands: [name the petition].\n\nSt. Thérèse, help me to always believe, as you did, in God's great love for me, so that I might imitate your 'little way' each day.\n\nAmen.",
    lines: [
      "O little Thérèse of the Child Jesus, please pick for me a rose from the heavenly gardens and send it to me as a message of love.",
      "O little flower of Jesus, ask God today to grant the favors I now place with confidence in your hands: [name the petition].",
      "St. Thérèse, help me to always believe, as you did, in God's great love for me, so that I might imitate your 'little way' each day.",
      "Amen.",
    ],
    author: "Traditional",
    category: "patron-saints",
    tags: ["therese", "little-flower", "trust", "love", "small-things", "ordinary", "rose", "confidence"],
    length: "short",
    when_to_use:
      "When your faith feels small and you can only manage 'little things.' St. Thérèse said sanctity is small acts done with great love. Pair with: doing your dishes and offering them up.",
    source_url: "https://www.ewtn.com/catholicism/devotions/prayer-to-saint-therese-of-the-child-jesus-336",
  },

  {
    id: "prayer-to-padre-pio",
    title: "Prayer to Padre Pio",
    full_text:
      "Beloved Padre Pio, today I come to add my prayer to the thousands of prayers offered to you every day by those who love and venerate you.\n\nThey ask for cures and healings, earthly and spiritual blessings, and peace for body and soul. And because of your friendship with the Lord, He grants the favors you ask of Him.\n\nMost of all, dear Padre Pio, I ask you to pray for me, that one day I may join you in heaven, there to behold the Beauty of our Lord, the Tenderness of Mary, our Mother, and the joyful greetings of all the saints.\n\nAmen.",
    lines: [
      "Beloved Padre Pio, today I come to add my prayer to the thousands of prayers offered to you every day by those who love and venerate you.",
      "They ask for cures and healings, earthly and spiritual blessings, and peace for body and soul. And because of your friendship with the Lord, He grants the favors you ask of Him.",
      "Most of all, dear Padre Pio, I ask you to pray for me, that one day I may join you in heaven, there to behold the Beauty of our Lord, the Tenderness of Mary, our Mother, and the joyful greetings of all the saints.",
      "Amen.",
    ],
    author: "Traditional",
    category: "patron-saints",
    tags: ["padre-pio", "suffering", "stigmata", "healing", "italy", "modern", "confession"],
    length: "short",
    when_to_use:
      "For physical or spiritual healing, especially when you've been struggling for a long time. Padre Pio bore the stigmata for fifty years; he knew long suffering and still kept his joy.",
    source_url: "https://www.ewtn.com/catholicism/devotions/prayer-to-padre-pio-340",
  },

  {
    id: "our-lady-of-guadalupe",
    title: "Prayer to Our Lady of Guadalupe",
    full_text:
      "O Virgin of Guadalupe, Mother of the Americas, grant to our homes the grace of loving and respecting life in its beginnings, with the same love with which you conceived in your womb the life of the Son of God.\n\nBlessed Virgin Mary, Mother of fair love, protect our families, so that they may always be united, and bless the upbringing of our children.\n\nOur hope, look upon us with compassion, teach us to go continually to Jesus, and if we fall, help us to rise again, to return to Him by means of the confession of our faults and sins in the Sacrament of Penance, which gives peace to the soul.\n\nWe ask you to grant us a great love for all the Sacraments. Mother, your name will always be on our lips, and in our hearts, for in it we find refuge.\n\nAmen.",
    lines: [
      "O Virgin of Guadalupe, Mother of the Americas, grant to our homes the grace of loving and respecting life in its beginnings, with the same love with which you conceived in your womb the life of the Son of God.",
      "Blessed Virgin Mary, Mother of fair love, protect our families, so that they may always be united, and bless the upbringing of our children.",
      "Our hope, look upon us with compassion, teach us to go continually to Jesus, and if we fall, help us to rise again, to return to Him by means of the confession of our faults and sins in the Sacrament of Penance, which gives peace to the soul.",
      "We ask you to grant us a great love for all the Sacraments. Mother, your name will always be on our lips, and in our hearts, for in it we find refuge.",
      "Amen.",
    ],
    author: "Traditional (Mexico, 16th century)",
    category: "patron-saints",
    tags: ["mary", "guadalupe", "americas", "family", "children", "mexican", "hispanic", "mother"],
    length: "medium",
    when_to_use:
      "For families, especially in the Americas where Our Lady of Guadalupe has been a patroness since 1531. Pray when your family is struggling or when you need a mother to turn to.",
    source_url: "https://www.usccb.org/prayers/prayer-our-lady-guadalupe",
  },

  // ─── Intercession ──────────────────────────────────────────────────

  {
    id: "prayer-for-family",
    title: "Prayer for the Family",
    full_text:
      "O God, our heavenly Father, You have called us into the family of Your Church.\n\nProtect this family I love. Be with us in our joys and in our sorrows. Be with us in our quiet evenings and our hard mornings.\n\nWhere there is tension, bring peace. Where there is misunderstanding, bring patience. Where there is a wound that has not healed, bring time and grace enough to heal it.\n\nKeep us together in mind and heart even when distance or anger or busyness separates us. Bring us all, at the last, to Your eternal home, where every family that loves You is finally one.\n\nAmen.",
    lines: [
      "O God, our heavenly Father, You have called us into the family of Your Church.",
      "Protect this family I love. Be with us in our joys and in our sorrows. Be with us in our quiet evenings and our hard mornings.",
      "Where there is tension, bring peace. Where there is misunderstanding, bring patience. Where there is a wound that has not healed, bring time and grace enough to heal it.",
      "Keep us together in mind and heart even when distance or anger or busyness separates us. Bring us all, at the last, to Your eternal home, where every family that loves You is finally one.",
      "Amen.",
    ],
    author: "Catholic devotional, traditional",
    category: "intercession",
    tags: ["family", "household", "parents", "children", "marriage", "siblings", "estrangement", "unity"],
    length: "medium",
    when_to_use:
      "For your family — including the ones you don't talk to right now. The line about distance or anger or busyness is on purpose.",
    source_url: "https://www.usccb.org/prayers/prayer-family",
  },

  {
    id: "prayer-for-enemies",
    title: "Prayer for Those Who Have Hurt Me",
    full_text:
      "Lord, You commanded us to love our enemies and to pray for those who persecute us. This is the hardest thing You have asked.\n\nI bring to You the one who has hurt me. I do not bring them with affection. I bring them with obedience to Your command.\n\nDo for them what only You can do — change what needs changing, heal what needs healing, convict what needs conviction.\n\nDo for me what only You can do — soften my heart where it has hardened, give me the freedom to pray for them honestly, and give me the wisdom to know what justice and what mercy require from me.\n\nAmen.",
    lines: [
      "Lord, You commanded us to love our enemies and to pray for those who persecute us. This is the hardest thing You have asked.",
      "I bring to You the one who has hurt me. I do not bring them with affection. I bring them with obedience to Your command.",
      "Do for them what only You can do — change what needs changing, heal what needs healing, convict what needs conviction.",
      "Do for me what only You can do — soften my heart where it has hardened, give me the freedom to pray for them honestly, and give me the wisdom to know what justice and what mercy require from me.",
      "Amen.",
    ],
    author: "Catholic devotional, contemporary phrasing",
    category: "intercession",
    tags: ["enemy", "enemies", "hatred", "forgiveness", "persecution", "hurt", "abuse", "betrayal", "obedience"],
    length: "medium",
    when_to_use:
      "When Jesus' command to love your enemies feels impossible. This prayer doesn't pretend you love them yet — it prays anyway, in obedience, and asks God to do the rest.",
    source_url: "https://www.catholic.org/prayers/prayer.php?p=727",
  },

  {
    id: "prayer-for-the-dying",
    title: "Prayer for the Dying",
    full_text:
      "O most merciful Jesus, lover of souls, I pray You, by the agony of Your most Sacred Heart, and by the sorrows of Your Immaculate Mother, to wash in Your Blood the sinners of the whole world who are now in their agony and who shall die today.\n\nHeart of Jesus, once in agony, have mercy on the dying.\n\nFor my own loved one in this hour — be near to them. Send Your angels to take them home. Let their last breath be a return to You.\n\nAmen.",
    lines: [
      "O most merciful Jesus, lover of souls, I pray You, by the agony of Your most Sacred Heart, and by the sorrows of Your Immaculate Mother, to wash in Your Blood the sinners of the whole world who are now in their agony and who shall die today.",
      "Heart of Jesus, once in agony, have mercy on the dying.",
      "For my own loved one in this hour — be near to them. Send Your angels to take them home. Let their last breath be a return to You.",
      "Amen.",
    ],
    author: "St. Faustina Kowalska (20th century, traditional close)",
    category: "intercession",
    tags: ["dying", "death", "deathbed", "hospice", "final-hour", "agony", "last-rites"],
    length: "short",
    when_to_use:
      "At a bedside. The 3 o'clock prayer of Divine Mercy — Catholic tradition holds 3 p.m. as the hour of Christ's death and a powerful time to pray for those dying anywhere in the world.",
    source_url: "https://www.ewtn.com/catholicism/devotions/prayer-for-the-dying-359",
  },

  {
    id: "eternal-rest",
    title: "Eternal Rest — Prayer for the Souls in Purgatory",
    full_text:
      "Eternal rest grant unto them, O Lord, and let perpetual light shine upon them.\n\nMay they rest in peace.\n\nMay their souls, and the souls of all the faithful departed, through the mercy of God, rest in peace.\n\nAmen.",
    lines: [
      "Eternal rest grant unto them, O Lord, and let perpetual light shine upon them.",
      "May they rest in peace.",
      "May their souls, and the souls of all the faithful departed, through the mercy of God, rest in peace.",
      "Amen.",
    ],
    author: "Traditional",
    category: "intercession",
    tags: ["dead", "purgatory", "deceased", "departed", "funeral", "anniversary", "grief", "souls"],
    length: "short",
    when_to_use:
      "For someone who has died — at the funeral, on the anniversary, when they cross your mind. Said three times a day for the souls in purgatory is a traditional Catholic practice.",
    source_url: "https://www.usccb.org/prayers/eternal-rest",
  },

  {
    id: "prayer-for-the-church",
    title: "Prayer for the Pope and the Church",
    full_text:
      "Lord, source of eternal life and truth, give to Your shepherd a spirit of courage and right judgment, a spirit of knowledge and love.\n\nBy governing with fidelity those entrusted to his care, may he, as successor to the Apostle Peter and Vicar of Christ, build Your Church into a sacrament of unity, love, and peace for all the world.\n\nFor the bishops, priests, and deacons who serve us — give them faithfulness, holiness, and the grace to lead by example. Strengthen them in their weakness.\n\nFor Your Church in this age of confusion and trial: keep her one, holy, catholic, and apostolic until the end.\n\nAmen.",
    lines: [
      "Lord, source of eternal life and truth, give to Your shepherd a spirit of courage and right judgment, a spirit of knowledge and love.",
      "By governing with fidelity those entrusted to his care, may he, as successor to the Apostle Peter and Vicar of Christ, build Your Church into a sacrament of unity, love, and peace for all the world.",
      "For the bishops, priests, and deacons who serve us — give them faithfulness, holiness, and the grace to lead by example. Strengthen them in their weakness.",
      "For Your Church in this age of confusion and trial: keep her one, holy, catholic, and apostolic until the end.",
      "Amen.",
    ],
    author: "Traditional",
    category: "intercession",
    tags: ["church", "pope", "bishops", "priests", "clergy", "ecclesial", "scandal", "unity"],
    length: "medium",
    when_to_use:
      "For the Church — especially in hard moments for the Church. Pray it whenever the news about the Church is heavy.",
    source_url: "https://www.vatican.va/content/vatican/en/holy-father.html",
  },

  // ─── Liturgical ────────────────────────────────────────────────────

  {
    id: "advent-prayer",
    title: "Advent — O Come, Emmanuel",
    full_text:
      "O Emmanuel, our King and Giver of Law, the Hope of the nations and their Saviour: come and save us, O Lord our God.\n\nIn this season of waiting, prepare in us a home for Your coming. Slow us down enough to notice You arriving. Where we have rushed past the small, daily ways You are with us — return our attention. Where we have not waited — teach us to wait.\n\nKindle in this house, this week, this hour, the joyful longing that knows You are near.\n\nAmen.",
    lines: [
      "O Emmanuel, our King and Giver of Law, the Hope of the nations and their Saviour: come and save us, O Lord our God.",
      "In this season of waiting, prepare in us a home for Your coming. Slow us down enough to notice You arriving.",
      "Where we have rushed past the small, daily ways You are with us — return our attention. Where we have not waited — teach us to wait.",
      "Kindle in this house, this week, this hour, the joyful longing that knows You are near.",
      "Amen.",
    ],
    author: "Traditional (O Antiphons, 8th century)",
    category: "liturgical",
    season: "advent",
    tags: ["advent", "emmanuel", "waiting", "christmas-coming", "preparation", "december", "anticipation"],
    length: "short",
    when_to_use:
      "Through Advent — the four weeks before Christmas. The waiting is the spiritual content of the season; this prayer puts language to it.",
    source_url: "https://www.usccb.org/prayers/prayer-during-advent",
  },

  {
    id: "christmas-prayer",
    title: "Christmas — Prayer to the Holy Infant Jesus",
    full_text:
      "O Divine Infant Jesus, born in poverty and laid in a manger, we adore You.\n\nYou came small enough for us to hold. You came near enough for us to follow. You came humble enough for us to learn from.\n\nIn this Christmas season — through the cooking, the family, the gifts, the noise, the loneliness for those who are alone — be born again in our hearts. Be welcomed not just on December 25 but in every hour we will live this year.\n\nGlory to God in the highest, and on earth peace to people of good will.\n\nAmen.",
    lines: [
      "O Divine Infant Jesus, born in poverty and laid in a manger, we adore You.",
      "You came small enough for us to hold. You came near enough for us to follow. You came humble enough for us to learn from.",
      "In this Christmas season — through the cooking, the family, the gifts, the noise, the loneliness for those who are alone — be born again in our hearts.",
      "Be welcomed not just on December 25 but in every hour we will live this year.",
      "Glory to God in the highest, and on earth peace to people of good will.",
      "Amen.",
    ],
    author: "Traditional, contemporary phrasing",
    category: "liturgical",
    season: "christmas",
    tags: ["christmas", "nativity", "infant-jesus", "december-25", "incarnation", "epiphany", "family"],
    length: "medium",
    when_to_use:
      "Christmas season — Dec 25 through the Baptism of the Lord in mid-January. Especially for the years when Christmas is hard.",
    source_url: "https://www.usccb.org/prayers/prayers-christmas",
  },

  {
    id: "lent-prayer",
    title: "Lent — Prayer of Repentance and Return",
    full_text:
      "Lord, in this season of forty days, You call us back. Not because we have wandered into ruin — though sometimes we have — but because You want us closer to Your heart than we have been.\n\nGive us the courage of Ash Wednesday: to look at our lives honestly without flinching.\n\nGive us the steadfastness of the desert: to keep walking when the comfort has been stripped away.\n\nGive us the hope of Easter: to know that everything we are giving up now is making room for what You are about to give.\n\nAmen.",
    lines: [
      "Lord, in this season of forty days, You call us back.",
      "Not because we have wandered into ruin — though sometimes we have — but because You want us closer to Your heart than we have been.",
      "Give us the courage of Ash Wednesday: to look at our lives honestly without flinching.",
      "Give us the steadfastness of the desert: to keep walking when the comfort has been stripped away.",
      "Give us the hope of Easter: to know that everything we are giving up now is making room for what You are about to give.",
      "Amen.",
    ],
    author: "Catholic devotional, contemporary phrasing",
    category: "liturgical",
    season: "lent",
    tags: ["lent", "ash-wednesday", "fasting", "penance", "desert", "forty-days", "repentance", "return"],
    length: "medium",
    when_to_use:
      "Through Lent — Ash Wednesday through Holy Saturday. Especially good at the moment in week 3 when your Lenten discipline feels pointless and you want to quit.",
    source_url: "https://www.usccb.org/committees/divine-worship/lent",
  },

  {
    id: "easter-regina-caeli",
    title: "Easter — Regina Caeli",
    full_text:
      "Queen of Heaven, rejoice, alleluia.\n\nFor He whom you did merit to bear, alleluia.\n\nHas risen, as He said, alleluia.\n\nPray for us to God, alleluia.\n\nRejoice and be glad, O Virgin Mary, alleluia.\n\nFor the Lord has truly risen, alleluia.\n\nLet us pray: O God, who gave joy to the world through the resurrection of Thy Son, our Lord Jesus Christ; grant we beseech Thee, that through the intercession of the Virgin Mary, His Mother, we may obtain the joys of everlasting life.\n\nThrough the same Christ our Lord. Amen.",
    lines: [
      "Queen of Heaven, rejoice, alleluia.",
      "For He whom you did merit to bear, alleluia.",
      "Has risen, as He said, alleluia.",
      "Pray for us to God, alleluia.",
      "Rejoice and be glad, O Virgin Mary, alleluia.",
      "For the Lord has truly risen, alleluia.",
      "Let us pray: O God, who gave joy to the world through the resurrection of Thy Son, our Lord Jesus Christ; grant we beseech Thee, that through the intercession of the Virgin Mary, His Mother, we may obtain the joys of everlasting life.",
      "Through the same Christ our Lord. Amen.",
    ],
    author: "Traditional (12th century)",
    category: "liturgical",
    season: "easter",
    tags: ["easter", "resurrection", "alleluia", "mary", "queen-of-heaven", "joy", "fifty-days", "spring"],
    length: "medium",
    when_to_use:
      "Replaces the Angelus throughout the Easter season — Easter Sunday through Pentecost (~50 days). All the alleluias are deliberate; this is the loudest prayer in the Catholic year.",
    source_url: "https://www.usccb.org/prayers/regina-caeli",
  },

  {
    id: "te-deum",
    title: "Te Deum — Ordinary Time Hymn of Praise",
    full_text:
      "We praise You, O God; we acknowledge You to be the Lord.\n\nAll the earth doth worship You, the Father everlasting.\n\nTo You all angels cry aloud; the heavens, and all the powers therein.\n\nTo You cherubim and seraphim continually do cry: Holy, holy, holy, Lord God of Sabaoth! Heaven and earth are full of the majesty of Your glory.\n\nThe glorious company of the apostles praise You. The goodly fellowship of the prophets praise You. The noble army of martyrs praise You.\n\nThe holy Church throughout all the world doth acknowledge You — the Father of an infinite majesty; Your honorable, true, and only Son; also the Holy Spirit, the Comforter.\n\nO Lord, save Your people, and bless Your inheritance. Govern them, and lift them up forever. Day by day we magnify You; and we worship Your Name forever, world without end.\n\nAmen.",
    lines: [
      "We praise You, O God; we acknowledge You to be the Lord.",
      "All the earth doth worship You, the Father everlasting.",
      "To You all angels cry aloud; the heavens, and all the powers therein.",
      "To You cherubim and seraphim continually do cry: Holy, holy, holy, Lord God of Sabaoth!",
      "Heaven and earth are full of the majesty of Your glory.",
      "The glorious company of the apostles praise You. The goodly fellowship of the prophets praise You. The noble army of martyrs praise You.",
      "The holy Church throughout all the world doth acknowledge You — the Father of an infinite majesty; Your honorable, true, and only Son; also the Holy Spirit, the Comforter.",
      "O Lord, save Your people, and bless Your inheritance. Govern them, and lift them up forever.",
      "Day by day we magnify You; and we worship Your Name forever, world without end.",
      "Amen.",
    ],
    author: "Traditional (4th century)",
    category: "liturgical",
    season: "ordinary-time",
    tags: ["praise", "ordinary-time", "thanksgiving", "te-deum", "great-thanksgiving", "celebration"],
    length: "long",
    when_to_use:
      "In Ordinary Time — the long stretches of the year between the festal seasons. Used for moments of great thanksgiving (after great mercies, on solemnities). Pray it slowly.",
    source_url: "https://www.ewtn.com/catholicism/devotions/te-deum-336",
  },
];

/* ────────────────────────────────────────────────────────────────────
   CONVENIENCE LOOKUPS
   ──────────────────────────────────────────────────────────────────── */

export function getPrayerById(id: string): Prayer | undefined {
  return PRAYERS.find((p) => p.id === id);
}

export function getPrayersByCategory(category: PrayerCategory): Prayer[] {
  return PRAYERS.filter((p) => p.category === category);
}

export function getPrayersBySeason(season: LiturgicalSeason): Prayer[] {
  return PRAYERS.filter((p) => p.season === season);
}

export const CATEGORY_LABELS: Record<PrayerCategory, string> = {
  liturgical: "Liturgical",
  situational: "Situational",
  "patron-saints": "Patron Saints",
  daily: "Daily",
  emergency: "Emergency",
  intercession: "Intercession",
};

export const CATEGORY_BLURBS: Record<PrayerCategory, string> = {
  liturgical: "For the seasons of the Church year — Advent, Christmas, Lent, Easter, Ordinary Time.",
  situational: "For specific kinds of trouble — grief, anxiety, anger, temptation, discernment.",
  "patron-saints": "Saints the Church names as intercessors for particular needs.",
  daily: "Morning, evening, and night — the rhythm of a Catholic day.",
  emergency: "The shortest, strongest prayers in the Catholic tradition. For the moment before.",
  intercession: "Prayer for others — family, enemies, the dying, the dead.",
};

export const SEASON_LABELS: Record<LiturgicalSeason, string> = {
  advent: "Advent",
  christmas: "Christmas",
  lent: "Lent",
  easter: "Easter",
  "ordinary-time": "Ordinary Time",
};
