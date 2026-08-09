/**
 * Novenas — nine-day prayer journeys for the Catholic Path (2026-07-06).
 *
 * Each novena helps a person surrender a problem to God, ask for mercy, or
 * pray through a specific struggle. Vetted list + approval/copyright research:
 * vault 07 - Content / "2026-07-06 Novenas — Vetted List for Prayer Module".
 *
 * DEFENSIBLE-CLAIMS RULES (do not break):
 *  - Every novena is ultimately addressed to God; saints/angels/Mary are
 *    intercessors. `addressedTo` / `intercessor` keep that clear.
 *  - Do NOT call popular novena texts "Church-approved prayers." `approvalNote`
 *    uses precise language ("Servant of God", "Venerable", "approved private
 *    revelation", "a widely-prayed devotion").
 *  - `textStatus` gates shippability:
 *      "public-domain" — traditional prayers, free to reproduce.
 *      "original"      — our own faithful composition, ours to ship; pending
 *                        Fr. Murphy's review like the rest of the Catholic Path.
 *      "permission-pending" — the authentic text is under copyright; we ship an
 *                        original placeholder now and must license/replace the
 *                        real text before public launch. Grep "permission-pending"
 *                        as a launch gate. See vault: 06 - Operations /
 *                        "Pre-Launch — Novena & Prayer Copyright Permissions".
 *
 * All content here is DRAFT v1, pending Fr. Murphy sign-off before public launch.
 */

export type NovenaTextStatus = "public-domain" | "original" | "permission-pending";

export type NovenaDay = {
  day: number; // 1..9
  title: string;
  /** Lines shown for the day, in order. May include the refrain / closing prayers. */
  body: string[];
};

export type Novena = {
  id: string;
  title: string;
  /** Who the prayer is ultimately addressed to, e.g. "Jesus" or "God, through St. Jude". */
  addressedTo: string;
  /** The intercessor invoked, if any (a saint, angel, or Mary). */
  intercessor?: string;
  author?: string;
  /** Precise, defensible one-liner on origin/approval status. */
  approvalNote: string;
  /** What it's for — shown on the detail page. */
  summary: string;
  /** Struggle themes this novena serves (free text, for grouping/recommending). */
  themes: string[];
  textStatus: NovenaTextStatus;
  /** A short line repeated each day (e.g. the Surrender refrain), if any. */
  refrain?: string;
  /** The prayer prayed 3x on the beads, if different from `refrain` (e.g. the full Hail Mary). Defaults to refrain. */
  repeatedPrayer?: string;
  days: NovenaDay[];
};

const GLORY_BE =
  "Glory be to the Father, and to the Son, and to the Holy Spirit: as it was in the beginning, is now, and ever shall be, world without end. Amen.";

export const NOVENAS: Novena[] = [
  {
    id: "surrender",
    title: "Surrender Novena",
    addressedTo: "Jesus",
    author: "Servant of God Fr. Dolindo Ruotolo",
    approvalNote:
      "A widely-prayed devotion by Servant of God Fr. Dolindo Ruotolo. Pope Francis praised the devotion in a 2021 private letter. Not a formally approved text.",
    summary:
      "Nine days of letting go — handing your worries, one by one, to Jesus, and letting Him carry what you cannot.",
    themes: ["surrender", "anxiety", "trust", "hopelessness", "control"],
    textStatus: "permission-pending",
    refrain: "O Jesus, I surrender myself to You, take care of everything.",
    days: [
      {
        day: 1,
        title: "The first letting-go",
        body: [
          "Bring the heaviest thing you are carrying today and set it, in your mind, at the feet of Jesus.",
          "You do not have to fix it this minute. You only have to hand it over.",
          "Pray slowly, three times: O Jesus, I surrender myself to You, take care of everything.",
          GLORY_BE,
        ],
      },
      {
        day: 2,
        title: "Loosening my grip",
        body: [
          "Notice where you are still gripping — the outcome you are trying to force, the fear you keep rehearsing.",
          "Open your hands, literally, and breathe. What you release, He receives.",
          "Pray slowly, three times: O Jesus, I surrender myself to You, take care of everything.",
          GLORY_BE,
        ],
      },
      {
        day: 3,
        title: "Trust over understanding",
        body: [
          "You may not see how this resolves. Surrender is trusting the One who does.",
          "Tell Him honestly what you cannot understand, and then leave it with Him.",
          "Pray slowly, three times: O Jesus, I surrender myself to You, take care of everything.",
          GLORY_BE,
        ],
      },
      {
        day: 4,
        title: "The worry that returns",
        body: [
          "When the same worry circles back — as it will — this is not failure. Simply hand it over again.",
          "A hundred surrenders in one day are still surrender.",
          "Pray slowly, three times: O Jesus, I surrender myself to You, take care of everything.",
          GLORY_BE,
        ],
      },
      {
        day: 5,
        title: "Peace in the meantime",
        body: [
          "Ask for the peace that does not depend on things being resolved yet.",
          "Rest in this moment, which is the only one He is asking of you.",
          "Pray slowly, three times: O Jesus, I surrender myself to You, take care of everything.",
          GLORY_BE,
        ],
      },
      {
        day: 6,
        title: "For someone I love",
        body: [
          "Bring a person you are anxious for. You cannot carry them; He can.",
          "Entrust them, by name, to His care.",
          "Pray slowly, three times: O Jesus, I surrender myself to You, take care of everything.",
          GLORY_BE,
        ],
      },
      {
        day: 7,
        title: "Letting Him work",
        body: [
          "Surrender is not doing nothing; it is stopping the anxious striving that shuts Him out.",
          "Make room today for Him to act in ways you did not plan.",
          "Pray slowly, three times: O Jesus, I surrender myself to You, take care of everything.",
          GLORY_BE,
        ],
      },
      {
        day: 8,
        title: "Gratitude before the answer",
        body: [
          "Thank Him now — not because it is fixed, but because you are not carrying it alone.",
          "Name one small mercy from these days.",
          "Pray slowly, three times: O Jesus, I surrender myself to You, take care of everything.",
          GLORY_BE,
        ],
      },
      {
        day: 9,
        title: "Into His hands",
        body: [
          "On this last day, place the whole matter — and yourself — into His hands, and leave it there.",
          "Whatever comes, you have handed it to the One who loves you.",
          "Pray slowly, three times: O Jesus, I surrender myself to You, take care of everything.",
          GLORY_BE,
        ],
      },
    ],
  },
  {
    id: "divine-mercy",
    title: "Divine Mercy Novena",
    addressedTo: "Jesus (Divine Mercy)",
    author: "From the Diary of St. Faustina Kowalska",
    approvalNote: "An approved private revelation given to St. Faustina Kowalska (canonized 2000). The traditional daily intentions here are paraphrased in our own words; the official Diary translation is under copyright.",
    summary: "Over nine days we entrust ourselves and others to the mercy of Jesus, carrying a different group of souls to His Heart each day. It is a prayer of trust for anyone weighed down by shame, grief, or despair.",
    themes: ["mercy", "despair", "shame", "grief", "trust"],
    textStatus: "permission-pending",
    refrain: "Jesus, I trust in You.",
    days: [
      { day: 1, title: "All Humanity, Especially Sinners", body: ["Today we bring You the whole human family, and above all those who have wandered far.", "No sin is deeper than Your mercy, and no heart is beyond Your reach.", "Gather every wounded soul, including our own, into the shelter of Your Heart.", "Jesus, I trust in You."] },
      { day: 2, title: "Priests and Religious", body: ["Today we entrust to You those who have given their lives to Your service.", "Strengthen priests and religious who pour themselves out for others.", "Let Your mercy be their rest when they grow weary.", "Jesus, I trust in You."] },
      { day: 3, title: "All Devout and Faithful Souls", body: ["Today we lift up all who strive to love You faithfully each day.", "Comfort those who carry hidden burdens while remaining steady in prayer.", "May Your mercy sustain them when their own strength runs out.", "Jesus, I trust in You."] },
      { day: 4, title: "Those Who Do Not Yet Know You", body: ["Today we bring You those who have not yet come to believe.", "You desire that none be lost, and You knock gently at every door.", "Open hearts that are searching, and meet them where they are.", "Jesus, I trust in You."] },
      { day: 5, title: "Those Separated From the Church", body: ["Today we entrust to You all who have drifted from the community of faith.", "You are the shepherd who leaves the ninety-nine to seek the one.", "Draw them home with a tenderness that heals old wounds.", "Jesus, I trust in You."] },
      { day: 6, title: "The Gentle and Little Ones", body: ["Today we bring You the meek, the humble, and the hearts of children.", "In their gentleness Your own likeness shines most clearly.", "Protect the vulnerable and let their trust teach us how to pray.", "Jesus, I trust in You."] },
      { day: 7, title: "Those Who Honor Your Mercy", body: ["Today we lift up all who venerate and spread devotion to Your mercy.", "May those who trust in You become a light for the discouraged.", "Keep them close, that mercy given may become mercy shared.", "Jesus, I trust in You."] },
      { day: 8, title: "The Souls in Purgatory", body: ["Today we entrust to You the souls being purified in Your love.", "Refresh them and hasten the day they see You face to face.", "May our prayer be a comfort to those we can no longer see.", "Jesus, I trust in You."] },
      { day: 9, title: "The Lukewarm and Weary Hearts", body: ["Today we bring You those whose faith has grown cold or tired.", "Where love has dimmed to a flicker, breathe on the embers again.", "Warm every heart that feels distant, including our own.", "Jesus, I trust in You."] },
    ],
  },
  {
    id: "st-michael",
    title: "Novena to St. Michael the Archangel",
    addressedTo: "God, through St. Michael the Archangel",
    intercessor: "St. Michael the Archangel",
    approvalNote: "Anchored by the Leonine Prayer to St. Michael, composed by Pope Leo XIII (1886) and in the public domain; the nine-day arrangement is a traditional devotion.",
    summary: "Nine days asking God, through the intercession of St. Michael, for protection, courage, and strength against temptation and fear. Each day closes with the traditional Leonine prayer.",
    themes: ["temptation", "spiritual-warfare", "protection", "fear"],
    textStatus: "public-domain",
    refrain: "St. Michael the Archangel, defend us in battle.",
    days: [
      { day: 1, title: "Under God's Protection", body: ["Lord, You place Your angels to guard us on all our ways.", "Through St. Michael, shield us today from all that would harm body and soul.", "Saint Michael the Archangel, defend us in battle. Be our defense against the wickedness and snares of the devil.", "May God rebuke him, we humbly pray; and do thou, O Prince of the heavenly host, by the power of God, cast into hell Satan and all the evil spirits who prowl about the world seeking the ruin of souls. Amen."] },
      { day: 2, title: "Strength in Temptation", body: ["Lord, when temptation presses close, remind us that we are not alone.", "Send St. Michael to stand beside us in the moment of struggle.", "Saint Michael the Archangel, defend us in battle. Be our defense against the wickedness and snares of the devil.", "May God rebuke him, we humbly pray; and do thou, O Prince of the heavenly host, by the power of God, cast into hell Satan and all the evil spirits who prowl about the world seeking the ruin of souls. Amen."] },
      { day: 3, title: "Courage Over Fear", body: ["Lord, You tell us again and again: do not be afraid.", "Through St. Michael, replace our fear with quiet, steady courage.", "Saint Michael the Archangel, defend us in battle. Be our defense against the wickedness and snares of the devil.", "May God rebuke him, we humbly pray; and do thou, O Prince of the heavenly host, by the power of God, cast into hell Satan and all the evil spirits who prowl about the world seeking the ruin of souls. Amen."] },
      { day: 4, title: "Guarding the Mind", body: ["Lord, our thoughts can become a battlefield of worry and dread.", "Through St. Michael, guard the doorway of our minds this day.", "Saint Michael the Archangel, defend us in battle. Be our defense against the wickedness and snares of the devil.", "May God rebuke him, we humbly pray; and do thou, O Prince of the heavenly host, by the power of God, cast into hell Satan and all the evil spirits who prowl about the world seeking the ruin of souls. Amen."] },
      { day: 5, title: "Protection for the Vulnerable", body: ["Lord, we pray for all who feel weak, exposed, or unprotected today.", "Through St. Michael, cover them and us with Your care.", "Saint Michael the Archangel, defend us in battle. Be our defense against the wickedness and snares of the devil.", "May God rebuke him, we humbly pray; and do thou, O Prince of the heavenly host, by the power of God, cast into hell Satan and all the evil spirits who prowl about the world seeking the ruin of souls. Amen."] },
      { day: 6, title: "Choosing the Good", body: ["Lord, help us to say yes to what is good and no to what wounds us.", "Through St. Michael, give us clarity to choose the better path.", "Saint Michael the Archangel, defend us in battle. Be our defense against the wickedness and snares of the devil.", "May God rebuke him, we humbly pray; and do thou, O Prince of the heavenly host, by the power of God, cast into hell Satan and all the evil spirits who prowl about the world seeking the ruin of souls. Amen."] },
      { day: 7, title: "Peace After the Struggle", body: ["Lord, after every battle You offer the gift of peace.", "Through St. Michael, lead us into rest when the fighting is done.", "Saint Michael the Archangel, defend us in battle. Be our defense against the wickedness and snares of the devil.", "May God rebuke him, we humbly pray; and do thou, O Prince of the heavenly host, by the power of God, cast into hell Satan and all the evil spirits who prowl about the world seeking the ruin of souls. Amen."] },
      { day: 8, title: "Standing for Others", body: ["Lord, teach us to defend the weak as St. Michael defends us.", "Through his intercession, make us instruments of Your protection.", "Saint Michael the Archangel, defend us in battle. Be our defense against the wickedness and snares of the devil.", "May God rebuke him, we humbly pray; and do thou, O Prince of the heavenly host, by the power of God, cast into hell Satan and all the evil spirits who prowl about the world seeking the ruin of souls. Amen."] },
      { day: 9, title: "Trust in Final Victory", body: ["Lord, in the end Your light overcomes every darkness.", "Through St. Michael, hold us firm in hope until that day.", "Saint Michael the Archangel, defend us in battle. Be our defense against the wickedness and snares of the devil.", "May God rebuke him, we humbly pray; and do thou, O Prince of the heavenly host, by the power of God, cast into hell Satan and all the evil spirits who prowl about the world seeking the ruin of souls. Amen."] },
    ],
  },
  {
    id: "holy-spirit",
    title: "Novena to the Holy Spirit",
    addressedTo: "The Holy Spirit",
    approvalNote: "The original novena, the nine days the Apostles and Mary prayed between the Ascension and Pentecost. Pope Leo XIII decreed an annual novena to the Holy Spirit for the whole Church (1897).",
    summary: "The oldest novena of all, praying as the first disciples did while they waited for Pentecost. Over nine days we ask for the seven gifts of the Spirit and for guidance when we feel lost.",
    themes: ["discernment", "strength", "guidance", "lost"],
    textStatus: "public-domain",
    refrain: "Come, Holy Spirit, and renew my heart.",
    days: [
      { day: 1, title: "Waiting With Open Hands", body: ["Come, Holy Spirit, fill the hearts of your faithful and kindle in them the fire of your love.", "Like the first disciples, we wait in stillness for You to come.", "We bring You our empty hands and our willingness to be led.", GLORY_BE] },
      { day: 2, title: "The Gift of Wisdom", body: ["Come, Holy Spirit, fill the hearts of your faithful and kindle in them the fire of your love.", "Give us wisdom to see our lives as You see them.", "Help us to treasure what truly lasts and to release what does not.", GLORY_BE] },
      { day: 3, title: "The Gift of Understanding", body: ["Come, Holy Spirit, fill the hearts of your faithful and kindle in them the fire of your love.", "Deepen our understanding of Your truth and Your love for us.", "Where we are confused, bring light; where we are anxious, bring clarity.", GLORY_BE] },
      { day: 4, title: "The Gift of Counsel", body: ["Come, Holy Spirit, fill the hearts of your faithful and kindle in them the fire of your love.", "When we do not know which way to turn, be our counsel.", "Guide our decisions gently, one honest step at a time.", GLORY_BE] },
      { day: 5, title: "The Gift of Fortitude", body: ["Come, Holy Spirit, fill the hearts of your faithful and kindle in them the fire of your love.", "Give us fortitude to carry what today is asking of us.", "Strengthen us to keep going when we feel we cannot.", GLORY_BE] },
      { day: 6, title: "The Gift of Knowledge", body: ["Come, Holy Spirit, fill the hearts of your faithful and kindle in them the fire of your love.", "Teach us to know You in the ordinary moments of our day.", "Let us see Your fingerprints on the world and on our own story.", GLORY_BE] },
      { day: 7, title: "The Gift of Piety", body: ["Come, Holy Spirit, fill the hearts of your faithful and kindle in them the fire of your love.", "Fill us with piety, a warm and childlike trust in God as our Father.", "Draw us to prayer not from fear but from love.", GLORY_BE] },
      { day: 8, title: "The Gift of Holy Fear", body: ["Come, Holy Spirit, fill the hearts of your faithful and kindle in them the fire of your love.", "Give us holy reverence, a wonder at how greatly we are loved.", "Let this awe keep us humble and close to Your heart.", GLORY_BE] },
      { day: 9, title: "Pentecost of the Heart", body: ["Come, Holy Spirit, fill the hearts of your faithful and kindle in them the fire of your love.", "As You came upon the disciples, come now upon us.", "Send forth Your Spirit and renew the face of our lives.", GLORY_BE] },
    ],
  },
  {
    id: "sacred-heart",
    title: "Novena to the Sacred Heart of Jesus",
    addressedTo: "The Sacred Heart of Jesus",
    approvalNote: "A devotion rooted in the apparitions to St. Margaret Mary Alacoque (canonized 1920); the Feast of the Sacred Heart is celebrated by the universal Church.",
    summary: "Nine days resting in the personal, merciful love of the Heart of Jesus. A gentle prayer for anyone who feels unloved, unworthy, or in need of consolation.",
    themes: ["mercy", "consolation", "feeling-unloved", "trust"],
    textStatus: "original",
    refrain: "Sacred Heart of Jesus, I place my trust in You.",
    days: [
      { day: 1, title: "A Heart That Loves You", body: ["Sacred Heart of Jesus, You love each person by name, and that includes me.", "Before I did anything to earn it, You already loved me.", "Let me rest today in the simple truth that I am wanted.", GLORY_BE] },
      { day: 2, title: "Received As I Am", body: ["Sacred Heart of Jesus, You welcome me without demanding I first be perfect.", "I do not have to clean myself up before coming to You.", "I come as I am, and You receive me gladly.", GLORY_BE] },
      { day: 3, title: "Mercy Deeper Than My Failures", body: ["Sacred Heart of Jesus, Your mercy runs deeper than anything I have done.", "Where I carry regret, You offer a fresh beginning.", "Help me to forgive myself as You have already forgiven me.", GLORY_BE] },
      { day: 4, title: "Consolation in Sorrow", body: ["Sacred Heart of Jesus, You know grief from the inside.", "When my own heart aches, You do not look away.", "Be near me in my sadness and let me feel that I am not alone.", GLORY_BE] },
      { day: 5, title: "Rest for the Weary", body: ["Sacred Heart of Jesus, You invite the tired to come and find rest.", "I lay down the weight I have been carrying for too long.", "Teach me the gentleness and humility that give peace.", GLORY_BE] },
      { day: 6, title: "Trusting Your Love", body: ["Sacred Heart of Jesus, help me to trust that Your love does not run out.", "When my feelings say I am unlovable, let Your word be louder.", "I choose today to lean on Your love rather than my mood.", GLORY_BE] },
      { day: 7, title: "A Home for My Heart", body: ["Sacred Heart of Jesus, Your open Heart is a shelter I can return to.", "In every storm there is a place for me to hide in You.", "Make my restless heart at home in Yours.", GLORY_BE] },
      { day: 8, title: "Learning to Love Again", body: ["Sacred Heart of Jesus, having received Your love, help me to give it away.", "Soften whatever in me has grown hard or afraid.", "Let Your love flow through me to the people around me.", GLORY_BE] },
      { day: 9, title: "Entrusted to Your Heart", body: ["Sacred Heart of Jesus, I place my whole self and all I love into You.", "My past, my present, and my worries about tomorrow are safe with You.", "I trust that You will care for me tenderly to the end.", GLORY_BE] },
    ],
  },
  {
    id: "st-dymphna",
    title: "Novena to St. Dymphna",
    addressedTo: "God, through St. Dymphna",
    intercessor: "St. Dymphna",
    approvalNote: "St. Dymphna is honored as a patron of those with mental and emotional afflictions; her veneration is long-standing (her life story is preserved as tradition).",
    summary: "A tender nine-day prayer with St. Dymphna, long honored as a companion to those who struggle with anxiety, depression, and a troubled mind. A gentle asking for peace of heart.",
    themes: ["anxiety", "depression", "mental-distress", "peace"],
    textStatus: "original",
    refrain: "St. Dymphna, pray for all who are troubled in mind.",
    days: [
      { day: 1, title: "Bringing You My Troubled Mind", body: ["Loving God, through St. Dymphna I bring You a mind that will not quiet down.", "You are not frightened by my anxious thoughts.", "Help me to hand them to You, one by one, today.", GLORY_BE] },
      { day: 2, title: "Company in the Darkness", body: ["Loving God, when heaviness settles over me, remind me I am not alone.", "St. Dymphna understands sorrow and stays close to the suffering.", "Sit with me in the dark places until the light returns.", GLORY_BE] },
      { day: 3, title: "One Breath at a Time", body: ["Loving God, You ask me only for this present moment, not the whole future.", "Through St. Dymphna, teach me to breathe slowly and stay here with You.", "Free me from the fear of what tomorrow might bring.", GLORY_BE] },
      { day: 4, title: "Gentle With Myself", body: ["Loving God, help me to treat myself with the kindness You show me.", "Through St. Dymphna, quiet the harsh voice that says I am a burden.", "Let me receive Your patience and offer it to myself.", GLORY_BE] },
      { day: 5, title: "Peace in the Storm", body: ["Loving God, when my emotions rise like a storm, You remain steady.", "Through St. Dymphna, speak calm into my restless heart.", "Anchor me to Your peace that the storm cannot take away.", GLORY_BE] },
      { day: 6, title: "Strength to Ask for Help", body: ["Loving God, You often send Your care through other people.", "Through St. Dymphna, give me courage to reach out and not hide.", "Bless those who walk with me, and lead me to the help I need.", GLORY_BE] },
      { day: 7, title: "Small Signs of Hope", body: ["Loving God, open my eyes to the small mercies I might overlook.", "Through St. Dymphna, help me notice one good thing today.", "Let quiet hope take root, even if only a little.", GLORY_BE] },
      { day: 8, title: "Held Through the Night", body: ["Loving God, the nights can feel long when the mind will not rest.", "Through St. Dymphna, watch over me while I sleep and while I wake.", "Carry me until morning and its new mercies.", GLORY_BE] },
      { day: 9, title: "Peace of Heart", body: ["Loving God, more than any single outcome, I ask for peace of heart.", "Through St. Dymphna, settle what is anxious and heal what is wounded.", "Whatever this day holds, let me rest in the certainty of Your love.", GLORY_BE] },
    ],
  },
  {
    id: "undoer-of-knots",
    title: "Novena to Our Lady, Undoer of Knots",
    addressedTo: "God, through the Blessed Virgin Mary",
    intercessor: "Our Lady, Undoer of Knots",
    approvalNote: "A Marian devotion promoted by Pope Francis; the nine-day form is a popular devotion.",
    summary: "Nine days of naming the tangled knots in our lives and entrusting them, through Mary, to God who patiently unties what we cannot. A prayer of surrender for impossible-seeming problems.",
    themes: ["surrender", "impossible-problems", "anxiety", "tangled-situations"],
    textStatus: "original",
    refrain: "Mary, Undoer of Knots, pray for me.",
    days: [
      { day: 1, title: "Naming the Knots", body: ["Loving God, I come with the knots that have tangled my life.", "Through Mary, I dare to name them honestly before You.", "What I cannot loosen on my own, I place into Your patient hands.", GLORY_BE] },
      { day: 2, title: "The Knot of Worry", body: ["Loving God, worry has wound itself tightly around my heart.", "Through Mary, help me loosen my grip and trust Your care.", "Take the thread of my anxiety and gently begin to untie it.", GLORY_BE] },
      { day: 3, title: "The Knot of Old Wounds", body: ["Loving God, some knots were tied long ago by pain I did not choose.", "Through Mary, bring Your healing to the tangled places of my past.", "Free me from what still binds me so I can move forward.", GLORY_BE] },
      { day: 4, title: "The Knot in a Relationship", body: ["Loving God, a relationship I care about has become tangled and strained.", "Through Mary, soften hearts and open the way to understanding.", "Untie what pride and hurt have knotted between us.", GLORY_BE] },
      { day: 5, title: "The Knot That Feels Impossible", body: ["Loving God, there is a problem I cannot see any way through.", "Through Mary, I remember that nothing is impossible for You.", "I surrender the outcome and trust You to work in the dark.", GLORY_BE] },
      { day: 6, title: "Patience While You Work", body: ["Loving God, You untie knots slowly and with great care.", "Through Mary, give me patience to wait without pulling the threads tighter.", "Help me to trust the timing that I cannot control.", GLORY_BE] },
      { day: 7, title: "Letting Go of Control", body: ["Loving God, so often I make the knots tighter by trying to fix everything.", "Through Mary, teach me the freedom of open hands.", "I let go, and I let You be God.", GLORY_BE] },
      { day: 8, title: "Knots for Others", body: ["Loving God, I bring You the tangled struggles of the people I love.", "Through Mary, reach into their situations where I cannot.", "Untie their burdens as tenderly as You untie my own.", GLORY_BE] },
      { day: 9, title: "A Ribbon Made Smooth", body: ["Loving God, thank You for patiently working even when I could not see it.", "Through Mary, I entrust the final outcome entirely to You.", "Whatever comes, I trust that Your hands are smoothing the ribbon of my life.", GLORY_BE] },
    ],
  },
  {
    id: "st-jude",
    title: "Novena to St. Jude",
    addressedTo: "God, through St. Jude",
    intercessor: "St. Jude Thaddeus",
    approvalNote: "St. Jude, an Apostle, is honored by long tradition as a patron of desperate and hopeless causes; the nine-day form is a popular devotion.",
    summary: "Nine days of persevering in hope with St. Jude, the Apostle long invoked in causes that seem beyond help.",
    themes: ["hopelessness", "despair", "impossible-causes", "perseverance"],
    textStatus: "original",
    refrain: "St. Jude, faithful Apostle, pray for me in my need.",
    days: [
      { day: 1, title: "Coming as I am", body: ["God, I come to You today without pretending I have it all together.", "The weight I carry feels heavier than I can name.", "St. Jude, you are called the friend of hopeless cases, so I bring mine to you.", "Help me simply begin, trusting that I have been heard.", GLORY_BE] },
      { day: 2, title: "When it feels hopeless", body: ["Lord, there are situations in my life that seem to have no way forward.", "I have run out of my own answers, and that frightens me.", "St. Jude, you did not abandon Christ even when everything looked lost.", "Ask God to keep a small light burning in me tonight.", GLORY_BE] },
      { day: 3, title: "Naming the burden", body: ["God, You already know the need I hold in my heart.", "Today I place it into words and lay it before You honestly.", "St. Jude, carry this intention with me, that I may not carry it alone.", "Teach me that naming my pain is the first step of trust.", GLORY_BE] },
      { day: 4, title: "Hope beyond feeling", body: ["Lord, my feelings tell me nothing will change, but feelings are not the whole truth.", "Hope is a decision I can make even when my heart is tired.", "St. Jude, help me choose hope one more time today.", "Remind me that You have brought light out of many long nights.", GLORY_BE] },
      { day: 5, title: "Perseverance", body: ["God, teach me to keep going when the road is long.", "I do not need to solve everything today; I only need to take the next step.", "St. Jude, you persevered in faith to the very end.", "Give me the quiet courage to try again tomorrow.", GLORY_BE] },
      { day: 6, title: "Trusting God's timing", body: ["Lord, I want answers now, but Your timing is wiser than mine.", "Help me release my grip on how and when things should change.", "St. Jude, ask that I may wait without despairing.", "Let me rest in the truth that I am not forgotten.", GLORY_BE] },
      { day: 7, title: "Not alone", body: ["God, remind me that I do not face this in isolation.", "You are near, and the whole company of heaven prays with me.", "St. Jude, stand beside me as a faithful friend in this need.", "Let me feel, even a little, that I am held.", GLORY_BE] },
      { day: 8, title: "Gratitude in the waiting", body: ["Lord, before I see the outcome, I choose to give thanks.", "There are small mercies today that I too easily overlook.", "St. Jude, help me notice the goodness already present in my life.", "Gratitude softens fear and makes room for peace.", GLORY_BE] },
      { day: 9, title: "Entrusting the outcome", body: ["God, I have brought my need before You for nine days.", "Whatever comes, I place the outcome gently into Your hands.", "St. Jude, thank you for accompanying me through this novena.", "Give me a heart that trusts, and peace that does not depend on circumstances.", GLORY_BE] },
    ],
  },
  {
    id: "st-rita",
    title: "Novena to St. Rita of Cascia",
    addressedTo: "God, through St. Rita",
    intercessor: "St. Rita of Cascia",
    approvalNote: "St. Rita of Cascia (canonized 1900) is honored as a patron of impossible causes and of those enduring difficult relationships and suffering; the nine-day form is a popular devotion.",
    summary: "Nine days with St. Rita of Cascia, who knew hard marriages, loss, and long suffering, for those facing what seems impossible.",
    themes: ["impossible-causes", "relationships", "suffering", "endurance"],
    textStatus: "original",
    refrain: "St. Rita, patron of the impossible, pray for me.",
    days: [
      { day: 1, title: "Bringing the impossible", body: ["God, some things in my life feel truly beyond repair.", "I hardly know how to hope for them anymore.", "St. Rita, you are honored as a patron of impossible causes.", "Help me offer even my discouragement to God today.", GLORY_BE] },
      { day: 2, title: "Wounded relationships", body: ["Lord, there are relationships in my life that ache with hurt.", "I carry words that were said and words left unspoken.", "St. Rita, you endured a difficult marriage with patience and love.", "Ask God to bring healing where I cannot reach.", GLORY_BE] },
      { day: 3, title: "Learning to forgive", body: ["God, forgiveness feels far heavier than I expected.", "I do not want bitterness to take root in me.", "St. Rita, you chose peace over revenge in your own grief.", "Give me the grace to loosen my grip, even a little.", GLORY_BE] },
      { day: 4, title: "In the midst of suffering", body: ["Lord, I am tired of hurting, and I long for relief.", "Teach me that pain does not mean You have left me.", "St. Rita, you carried real suffering without losing your faith.", "Stay with me until this passes, and help me not lose heart.", GLORY_BE] },
      { day: 5, title: "Endurance", body: ["God, give me strength to endure what I cannot yet change.", "Let me hold on gently rather than grasp in fear.", "St. Rita, your long patience shows me that endurance is a kind of love.", "Help me last through this day, and then the next.", GLORY_BE] },
      { day: 6, title: "Trust amid uncertainty", body: ["Lord, I cannot see how this will turn out.", "Help me trust You in the space between the prayer and the answer.", "St. Rita, you trusted God through years of waiting.", "Steady my heart so I do not run ahead of grace.", GLORY_BE] },
      { day: 7, title: "Peace within", body: ["God, so much around me is unsettled, but You can settle my soul.", "Let Your peace reach the places that are still anxious.", "St. Rita, you found inner peace even without outer calm.", "Teach me to rest in You before anything is resolved.", GLORY_BE] },
      { day: 8, title: "Hope reawakened", body: ["Lord, gently wake the hope that has grown quiet in me.", "Show me that new life can come even from hard ground.", "St. Rita, your life reminds me that God works beyond what I can see.", "Let a little courage return to my heart today.", GLORY_BE] },
      { day: 9, title: "Placing it in God's hands", body: ["God, I have carried this need to You across these nine days.", "Now I entrust it, and the people within it, to Your care.", "St. Rita, thank you for walking this path with me.", "Whatever unfolds, let me stay close to You in trust and peace.", GLORY_BE] },
    ],
  },
  {
    id: "st-monica",
    title: "Novena to St. Monica",
    addressedTo: "God, through St. Monica",
    intercessor: "St. Monica",
    approvalNote: "St. Monica (canonized; d. 387) prayed many years for her son Augustine; she is honored as a patron of mothers and of those who love someone struggling with addiction.",
    summary: "Nine days with St. Monica, who prayed for years for her son, for anyone aching over a loved one lost to addiction or straying from the good.",
    themes: ["loved-ones-addiction", "patience", "perseverance", "grief"],
    textStatus: "original",
    refrain: "St. Monica, patient in prayer, intercede for the one I love.",
    days: [
      { day: 1, title: "The one I love", body: ["God, I carry someone in my heart who is struggling, and it hurts.", "I cannot fix them, and that helplessness is hard to bear.", "St. Monica, you prayed for a son far from the good for many years.", "Help me bring my loved one before God without despairing.", GLORY_BE] },
      { day: 2, title: "Patience over time", body: ["Lord, I want change to come quickly, but I know it may take time.", "Teach me a patience that does not give up.", "St. Monica, your prayers stretched across many long years.", "Give me the endurance to keep loving and keep praying.", GLORY_BE] },
      { day: 3, title: "Releasing control", body: ["God, I cannot walk this road for the person I love.", "Help me let go of the need to control an outcome I cannot force.", "St. Monica, you entrusted your son to God again and again.", "Teach me to hand over what was never mine to carry alone.", GLORY_BE] },
      { day: 4, title: "Carrying grief", body: ["Lord, there is a grief in loving someone who is suffering.", "I mourn the person I remember and the future I hoped for them.", "St. Monica, you wept real tears over your child.", "Hold my sorrow, and let it be a form of love, not despair.", GLORY_BE] },
      { day: 5, title: "Caring for myself", body: ["God, I cannot pour from an empty heart.", "Remind me that caring for myself is not abandoning them.", "St. Monica, even in your worry you kept your own faith alive.", "Help me find rest, support, and steadiness so I can keep loving well.", GLORY_BE] },
      { day: 6, title: "Not carrying it alone", body: ["Lord, I was never meant to carry this burden by myself.", "Lead me to the people and help I need along the way.", "St. Monica, you leaned on your faith and community in your worry.", "Let me accept support without shame.", GLORY_BE] },
      { day: 7, title: "Hope for change", body: ["God, no heart is beyond the reach of Your grace.", "Keep hope alive in me even when I see little progress.", "St. Monica, your long prayer was answered in ways you could not foresee.", "Help me believe that good is still possible for the one I love.", GLORY_BE] },
      { day: 8, title: "Praying with love, not fear", body: ["Lord, so often my prayers are shaped by fear.", "Teach me to pray for my loved one out of love and trust.", "St. Monica, your prayers flowed from a deep and steady love.", "Let peace, not panic, be the ground of my prayer.", GLORY_BE] },
      { day: 9, title: "Entrusting them to God", body: ["God, I have prayed for the one I love across these nine days.", "I place them, and my worry for them, into Your faithful hands.", "St. Monica, thank you for teaching me to persevere in hope.", "Whatever the road ahead, keep us both within Your care.", GLORY_BE] },
    ],
  },
  {
    id: "matt-talbot",
    title: "Novena to Venerable Matt Talbot",
    addressedTo: "God, through the intercession of Venerable Matt Talbot",
    intercessor: "Venerable Matt Talbot",
    approvalNote: "Matt Talbot (declared Venerable in 1975) is a recovered alcoholic invoked by many for sobriety and freedom from addiction. He is styled Venerable, not Saint; his cause continues.",
    summary: "Nine days with Venerable Matt Talbot, a recovered alcoholic, for anyone seeking sobriety one day at a time, leaning on grace and free of shame.",
    themes: ["addiction", "sobriety", "urges", "recovery"],
    textStatus: "original",
    refrain: "Venerable Matt Talbot, who found freedom in grace, pray for me.",
    days: [
      { day: 1, title: "One day at a time", body: ["God, I do not have to conquer my whole life today.", "I ask only for the grace to stay steady for these next hours.", "Venerable Matt Talbot, you rebuilt your life one day at a time.", "Walk with me through today, and let tomorrow wait.", GLORY_BE] },
      { day: 2, title: "Leaning on grace", body: ["Lord, I have learned that willpower alone is not enough.", "I need a strength greater than my own to hold on.", "Venerable Matt Talbot, you found freedom by depending on God, not yourself.", "Fill the empty places in me with Your quiet grace.", GLORY_BE] },
      { day: 3, title: "When the urge comes", body: ["God, when the craving rises, be nearer to me than the urge.", "Help me pause, breathe, and let the wave pass.", "Venerable Matt Talbot, you knew the pull of the very thing I face.", "Give me strength for this moment, and it will be enough.", GLORY_BE] },
      { day: 4, title: "Without shame", body: ["Lord, shame tells me I am beyond help, but that is a lie.", "You see me with love, not disgust.", "Venerable Matt Talbot, you carried your past with humility, not despair.", "Let me hold my story honestly and gently, in Your mercy.", GLORY_BE] },
      { day: 5, title: "If I slip", body: ["God, a fall is not the end of the road.", "If I stumble, help me get up again without drowning in guilt.", "Venerable Matt Talbot, your path was one of perseverance, not perfection.", "Teach me that starting again is itself a kind of courage.", GLORY_BE] },
      { day: 6, title: "Rebuilding, brick by brick", body: ["Lord, recovery is slow work, and I am often impatient.", "Help me trust the small, faithful steps that rebuild a life.", "Venerable Matt Talbot, you found new purpose in ordinary days.", "Bless the quiet progress I cannot always see.", GLORY_BE] },
      { day: 7, title: "New habits, new heart", body: ["God, replace what harmed me with things that heal.", "Fill the space that addiction once occupied with good and steady rhythms.", "Venerable Matt Talbot, prayer and simple discipline became your strength.", "Help me build a life that supports my freedom.", GLORY_BE] },
      { day: 8, title: "Gratitude and dignity", body: ["Lord, help me see the dignity You never stopped seeing in me.", "I give thanks for every day of freedom, however hard-won.", "Venerable Matt Talbot, you lived with quiet gratitude for grace received.", "Let thankfulness steady me on the road ahead.", GLORY_BE] },
      { day: 9, title: "Continuing the journey", body: ["God, I have prayed for freedom across these nine days.", "I ask You to keep walking with me long after this novena ends.", "Venerable Matt Talbot, thank you for showing that recovery is possible.", "One day at a time, and with Your grace, let me keep going.", GLORY_BE] },
    ],
  },
  {
    id: "maximilian-kolbe",
    title: "Novena to St. Maximilian Kolbe",
    addressedTo: "God, through St. Maximilian Kolbe",
    intercessor: "St. Maximilian Kolbe",
    approvalNote: "St. Maximilian Kolbe (canonized 1982), who gave his life for another at Auschwitz, is invoked by many for freedom from addictions, including drug addiction.",
    summary: "Nine days with St. Maximilian Kolbe, who laid down his life in love, for those seeking freedom from addiction and the courage to be free.",
    themes: ["addiction", "self-gift", "freedom", "courage"],
    textStatus: "original",
    refrain: "St. Maximilian Kolbe, who chose love unto the end, pray for me.",
    days: [
      { day: 1, title: "Longing to be free", body: ["God, I am tired of being held captive by what harms me.", "Deep down I long for the freedom You made me for.", "St. Maximilian Kolbe, you knew that true freedom lives in love.", "Awaken in me the desire and hope to be free.", GLORY_BE] },
      { day: 2, title: "Breaking the chains", body: ["Lord, there are chains around me that I cannot break by force.", "Only Your grace can loosen what binds me most tightly.", "St. Maximilian Kolbe, no prison could imprison your spirit.", "Set me free from the inside, where the real chains are.", GLORY_BE] },
      { day: 3, title: "Courage for today", body: ["God, freedom asks for a courage I do not always feel.", "Give me the small, real bravery to make the next right choice.", "St. Maximilian Kolbe, your courage was quiet and complete.", "Strengthen me to face this day without hiding.", GLORY_BE] },
      { day: 4, title: "Love that gives", body: ["Lord, my struggle has often turned me inward on myself.", "Teach me that love poured out is part of my healing.", "St. Maximilian Kolbe, you gave your very life for another.", "Help me look beyond myself and love, even in small ways.", GLORY_BE] },
      { day: 5, title: "Trusting Mary's help", body: ["God, St. Maximilian entrusted everything to Your care through Mary.", "Help me place my struggle in gentle and trusting hands.", "St. Maximilian Kolbe, you leaned entirely on grace, not on your own strength.", "Teach me to surrender what I cannot manage alone.", GLORY_BE] },
      { day: 6, title: "Hope in the darkness", body: ["Lord, even in the darkest places, hope can still shine.", "St. Maximilian carried light into a place of great cruelty.", "St. Maximilian Kolbe, remind me that no darkness is final.", "Keep a steady hope alive in me tonight.", GLORY_BE] },
      { day: 7, title: "Reclaiming my dignity", body: ["God, addiction tried to tell me I am worthless, but You say otherwise.", "You made me in Your image, and nothing can erase that worth.", "St. Maximilian Kolbe, you saw the dignity of every person, even in hell on earth.", "Help me see myself as You see me.", GLORY_BE] },
      { day: 8, title: "A life given back", body: ["Lord, take my recovered days and make them fruitful.", "Let the freedom I receive become a gift to others.", "St. Maximilian Kolbe, your self-gift still bears fruit today.", "Help me offer my life, healed and whole, back to You.", GLORY_BE] },
      { day: 9, title: "Free to love", body: ["God, I have prayed for freedom across these nine days.", "Lead me not only out of bondage but into a life of love.", "St. Maximilian Kolbe, thank you for showing what real freedom looks like.", "Keep me walking toward the freedom for which You created me.", GLORY_BE] },
    ],
  },
  {
    id: "perpetual-help",
    title: "Novena to Our Lady of Perpetual Help",
    addressedTo: "God, through the Blessed Virgin Mary",
    intercessor: "Our Lady of Perpetual Help",
    approvalNote: "A long-standing Redemptorist devotion to Mary under the title Our Lady of Perpetual Help, whose icon was entrusted to the Redemptorists by Pope Pius IX (1866).",
    summary: "Nine days turning to Mary under her title of Perpetual Help, a refuge for those who feel helpless, abandoned, or overwhelmed by crisis.",
    themes: ["helplessness", "crisis", "abandonment", "refuge"],
    textStatus: "original",
    refrain: "Our Lady of Perpetual Help, mother of the helpless, pray for us.",
    days: [
      { day: 1, title: "Turning to a mother", body: ["God, when I feel small and overwhelmed, I turn toward a mother's care.", "Mary, you are called Our Lady of Perpetual Help for good reason.", "Bring my need before your Son, whom you know so well.", "Help me begin these days trusting that I am not turned away.", GLORY_BE] },
      { day: 2, title: "When I feel helpless", body: ["Lord, there are moments when I do not know what to do.", "The helplessness itself can feel like drowning.", "Our Lady of Perpetual Help, stay near me in this powerlessness.", "Remind me that admitting I need help is not weakness but wisdom.", GLORY_BE] },
      { day: 3, title: "In the middle of crisis", body: ["God, everything feels urgent and unsteady right now.", "Be my calm in the middle of this storm.", "Our Lady of Perpetual Help, you stood faithfully through your own sorrows.", "Steady my breathing and my heart in this hard hour.", GLORY_BE] },
      { day: 4, title: "When I feel abandoned", body: ["Lord, sometimes it feels as though no one is near.", "Meet me in this loneliness with Your quiet presence.", "Our Lady of Perpetual Help, a mother does not abandon her child.", "Help me feel that I am seen and held, even now.", GLORY_BE] },
      { day: 5, title: "A refuge to run to", body: ["God, You are a shelter I can always run to.", "Let me hide my fear in Your steadfast love.", "Our Lady of Perpetual Help, lead me to the refuge of your Son.", "Give me a safe place to rest, at least for tonight.", GLORY_BE] },
      { day: 6, title: "Laying down the weight", body: ["Lord, I have been carrying so much for so long.", "Help me set this burden down at Your feet.", "Our Lady of Perpetual Help, take my worries into your gentle keeping.", "Let my shoulders and my mind find some relief.", GLORY_BE] },
      { day: 7, title: "Trusting a mother's care", body: ["God, teach me the trust of a child held safely.", "I do not have to understand everything to be cared for.", "Our Lady of Perpetual Help, hold me close as your own.", "Let me rest in the assurance that I am loved.", GLORY_BE] },
      { day: 8, title: "Hope returning", body: ["Lord, let a little light break through the heaviness.", "Even in crisis, You are quietly at work.", "Our Lady of Perpetual Help, help me look for the mercy that is near.", "Awaken in me the hope that this will not last forever.", GLORY_BE] },
      { day: 9, title: "Held in perpetual help", body: ["God, I have brought my helplessness to You these nine days.", "I trust that Your help is truly perpetual and never runs out.", "Our Lady of Perpetual Help, thank you for your constant care.", "Keep me in your maternal help all the days of my life.", GLORY_BE] },
    ],
  },
  {
    id: "st-therese",
    title: "Novena to St. Thérèse of Lisieux",
    addressedTo: "God, through St. Thérèse of Lisieux",
    intercessor: "St. Thérèse of Lisieux",
    approvalNote: "St. Thérèse of Lisieux (canonized 1925, a Doctor of the Church) taught the 'little way' of childlike trust in God; the nine-day form is a popular devotion.",
    summary: "Nine days with the Little Flower, learning her small path of trust when the heart is anxious or weary.",
    themes: ["trust", "anxiety", "little-way", "scrupulosity"],
    textStatus: "original",
    refrain: "St. Thérèse, teach me your little way of trust.",
    days: [
      { day: 1, title: "Becoming Small", body: ["Lord, Thérèse discovered that You love the small and the weak.", "I do not need to be great to come to You today.", "Let me approach You simply, as a child approaches a loving parent.", "Teach me that my littleness is a place You gladly fill.", GLORY_BE] },
      { day: 2, title: "Small Things, Great Love", body: ["Thérèse offered ordinary days to You with quiet love.", "Help me to do the next small thing well, without straining for the extraordinary.", "A kind word, a patient breath, an honest effort can be given to You.", "Show me that love, not achievement, makes a day holy.", GLORY_BE] },
      { day: 3, title: "Surrendering My Anxiety", body: ["God, my worries can feel larger than I am.", "With Thérèse I want to hand them to You, one at a time.", "You already know what troubles me before I name it.", "Help me to loosen my grip and let You carry what I cannot.", GLORY_BE] },
      { day: 4, title: "A Good Father", body: ["Thérèse trusted You as a Father who delights in His children.", "When my mind expects disappointment, remind me of Your tenderness.", "You are not waiting to catch me out; You are waiting to hold me.", "Let me rest in the truth that I am loved before I earn anything.", GLORY_BE] },
      { day: 5, title: "I Need Not Be Perfect", body: ["Lord, the fear of getting it wrong can weigh heavily on me.", "Thérèse learned that You are pleased by trust, not by flawlessness.", "When scruples whisper that I am never enough, quiet them with Your mercy.", "Help me to offer my imperfect self and trust that You receive it gladly.", GLORY_BE] },
      { day: 6, title: "Confidence in Mercy", body: ["Thérèse threw herself into Your arms with bold confidence.", "Let me stop measuring my worthiness and simply trust Your goodness.", "Your mercy is not something I must deserve, but something You long to give.", "Grow in me a peaceful confidence that does not depend on my feelings.", GLORY_BE] },
      { day: 7, title: "The Little Way Each Day", body: ["This path is walked one small step at a time.", "Help me not to look too far ahead, but to trust You for today.", "With Thérèse, let me turn each small difficulty into a small act of love.", "Keep me faithful in little things, and leave the rest to You.", GLORY_BE] },
      { day: 8, title: "Trusting in the Dark", body: ["Thérèse knew days when heaven felt silent, yet she kept trusting.", "When I cannot feel Your nearness, remind me that You are still here.", "Faith is not the absence of darkness but trust that outlasts it.", "Hold my hand through what I do not understand.", GLORY_BE] },
      { day: 9, title: "Hope for What Is to Come", body: ["God, Thérèse looked toward You with a heart full of hope.", "Let me carry from this novena a gentler, more trusting heart.", "Whatever I have asked, I place into Your loving hands.", "St. Thérèse, keep teaching me your little way of trust, all my days.", GLORY_BE] },
    ],
  },
  {
    id: "st-joseph",
    title: "Novena to St. Joseph",
    addressedTo: "God, through St. Joseph",
    intercessor: "St. Joseph",
    approvalNote: "St. Joseph, foster-father of Jesus, is honored by the universal Church as protector and provider; the nine-day form is a popular devotion.",
    summary: "Nine days under the care of St. Joseph, seeking his quiet protection, provision, and peace of heart.",
    themes: ["protection", "provision", "fear", "fatherhood", "temptation"],
    textStatus: "original",
    refrain: "St. Joseph, guardian and protector, pray for me.",
    days: [
      { day: 1, title: "Under Your Protection", body: ["Lord, You entrusted Your Son to the care of Joseph.", "I ask, through him, for the shelter of Your protection today.", "Guard my heart and mind from the fears that would overwhelm me.", "Let me feel safe under the watch of so faithful a guardian.", GLORY_BE] },
      { day: 2, title: "Quiet Trust in Providence", body: ["Joseph trusted You even when the road ahead was unclear.", "Help me to trust that You are providing, even when I cannot see how.", "Calm the part of me that must control every outcome.", "Teach me Joseph's quiet confidence in Your care.", GLORY_BE] },
      { day: 3, title: "Provision for Real Needs", body: ["God, You know the true needs I carry today.", "Through Joseph the worker, I ask for what is genuinely needed.", "Provide for my body, my mind, and those who depend on me.", "Help me to receive Your provision with gratitude and open hands.", GLORY_BE] },
      { day: 4, title: "Guardian in Temptation", body: ["When I am tempted or tested, be near me, Lord.", "St. Joseph, model of steadiness, stand between me and harm.", "Give me strength to turn away from what would wound my peace.", "Let me not face temptation alone, but under a protector's care.", GLORY_BE] },
      { day: 5, title: "Silent Obedience", body: ["Joseph obeyed without needing many words.", "Help me to trust Your guidance even before I fully understand it.", "Quiet my restless questioning and steady my heart.", "Teach me to act in faith, one obedient step at a time.", GLORY_BE] },
      { day: 6, title: "A Peaceful Heart", body: ["Lord, Joseph's home was a place of peace.", "Make my own heart a quieter dwelling for You.", "Loosen the tension I carry in my body and my thoughts.", "Where there is agitation, let Your peace gently settle.", GLORY_BE] },
      { day: 7, title: "Fatherly Care", body: ["Through Joseph's fatherhood, teach me what steadfast love looks like.", "For all who long for a father's care, be that presence, Lord.", "Heal the places in me that ache from love withheld.", "Let me know I am watched over by a Father who never leaves.", GLORY_BE] },
      { day: 8, title: "Guardian of a Peaceful Rest", body: ["Joseph is honored as the guardian of a peaceful passing.", "Free me from the fear of what I cannot control.", "Teach me to place tomorrow, and the end of all my days, in Your hands.", "Let me rest tonight in trust rather than dread.", GLORY_BE] },
      { day: 9, title: "Rest in His Care", body: ["God, at the close of this novena I lay my burdens down.", "I entrust to Joseph all that I have prayed for these nine days.", "Let me carry forward a calmer, more trusting heart.", "St. Joseph, guardian and protector, keep praying for me.", GLORY_BE] },
    ],
  },
  {
    id: "our-lady-of-sorrows",
    title: "Novena to Our Lady of Sorrows",
    addressedTo: "God, through the Blessed Virgin Mary",
    intercessor: "Our Lady of Sorrows",
    approvalNote: "A devotion to Mary under her title of Our Lady of Sorrows, whose Seven Sorrows have long been honored in the Church; the nine-day form is a popular devotion.",
    summary: "Nine days beside the Mother of Sorrows, who understands grief and stays close to those who mourn.",
    themes: ["grief", "loss", "suffering", "consolation"],
    textStatus: "original",
    refrain: "Mother of Sorrows, stay with me in my grief.",
    days: [
      { day: 1, title: "You Who Understand Grief", body: ["Lord, Mary knew the weight of sorrow in her own heart.", "Through her, I bring You the grief I am carrying now.", "I do not have to explain it well; You already understand.", "Let me feel that I am not alone in what I mourn.", GLORY_BE] },
      { day: 2, title: "A Mother Who Wept", body: ["Mary stood at the cross and let herself weep.", "Teach me that tears are not weakness but a form of love.", "When sorrow rises, help me not to run from it.", "Stay with me, Mother, as one who has wept before.", GLORY_BE] },
      { day: 3, title: "Carrying Loss", body: ["Some days the loss feels too heavy to carry, Lord.", "Mary carried her sorrow without letting go of faith.", "Help me to keep going, even when grief slows my steps.", "Share the weight I cannot bear on my own.", GLORY_BE] },
      { day: 4, title: "Not Alone in Sorrow", body: ["In my loneliest hours, remind me that I am accompanied.", "Mary was present when others fled; she does not flee from me.", "Let me sense her nearness when the house feels empty.", "You are close to the brokenhearted, and so is she.", GLORY_BE] },
      { day: 5, title: "Tears as Prayer", body: ["Lord, sometimes I have no words, only tears.", "Receive my tears as a prayer You understand.", "Mary, present my grief to your Son when I cannot speak.", "Let even my sorrow become a way of drawing near to You.", GLORY_BE] },
      { day: 6, title: "Tenderness in Suffering", body: ["Where grief has made me raw, be gentle with me, Lord.", "Mary, wrap your maternal tenderness around my wounded heart.", "Let me be patient with myself as I heal.", "There is no timeline You demand of a grieving soul.", GLORY_BE] },
      { day: 7, title: "Faith at the Foot of the Cross", body: ["Mary stayed at the cross when all seemed lost.", "Help me to hold on to faith even when I do not feel it.", "You are present in the darkness, though I cannot yet see the dawn.", "Keep me standing, as she stood, in trust.", GLORY_BE] },
      { day: 8, title: "Comfort for the Mourning", body: ["Lord, You promised comfort to those who mourn.", "Through Mary's care, let that comfort reach me.", "Ease the ache, even a little, and give me rest tonight.", "Let consolation come in whatever form You choose.", GLORY_BE] },
      { day: 9, title: "Hope Beyond the Cross", body: ["The sorrow of the cross was not the end of the story.", "Mary's grief opened into the joy of resurrection.", "Give me hope that my grief, too, is held within Your greater story.", "Mother of Sorrows, stay with me until joy returns.", GLORY_BE] },
    ],
  },
  {
    id: "st-augustine",
    title: "Novena to St. Augustine",
    addressedTo: "God, through St. Augustine",
    intercessor: "St. Augustine of Hippo",
    approvalNote: "St. Augustine of Hippo (a Father and Doctor of the Church) turned from a life of compulsion to God; the nine-day form is a popular devotion.",
    summary: "Nine days with St. Augustine, who knew restlessness and compulsion, and found freedom and rest in God.",
    themes: ["conversion", "compulsion", "restlessness", "urges"],
    textStatus: "original",
    refrain: "St. Augustine, who found rest in God, pray for me.",
    days: [
      { day: 1, title: "The Restless Heart", body: ["Lord, Augustine said our hearts are restless until they rest in You.", "I know that restlessness; I feel it drive me toward things that do not satisfy.", "Meet me in that longing rather than in shame.", "Draw my restless heart gently toward its true home in You.", GLORY_BE] },
      { day: 2, title: "Honesty Without Shame", body: ["Augustine told You the truth about his struggles, plainly.", "Help me to be honest with You about my own compulsions.", "You are not shocked by me, and You do not turn away.", "Let me bring what I hide into Your patient, healing light.", GLORY_BE] },
      { day: 3, title: "Asking for Freedom", body: ["God, I long to be free, yet feel bound by habit.", "With Augustine, I ask for freedom and self-mastery, gently and honestly.", "You do not despise a will that is still learning to choose the good.", "Strengthen the small yes I can offer You today.", GLORY_BE] },
      { day: 4, title: "Conversion Is Possible", body: ["Augustine's life shows that no one is beyond Your reach.", "When I doubt that I can change, remind me of Your grace.", "Conversion is Your work in me, not a burden I carry alone.", "Let me trust that You are already at work, even now.", GLORY_BE] },
      { day: 5, title: "One Step at a Time", body: ["Lord, I do not have to conquer everything today.", "Help me to take the next right step, and then the one after.", "When I stumble, let me rise without despair.", "Progress, not perfection, is what You ask of me now.", GLORY_BE] },
      { day: 6, title: "Renewing the Mind", body: ["Augustine found that old patterns of thought slowly gave way.", "Renew my mind where it runs in familiar, unhelpful grooves.", "Fill the space compulsion once occupied with something good.", "Teach me to reach for You when the old urge stirs.", GLORY_BE] },
      { day: 7, title: "Gratitude for Grace", body: ["For every small victory, Lord, I give You thanks.", "Augustine credited his freedom entirely to Your mercy.", "Let gratitude, not guilt, be the tone of my heart.", "Thank You for staying with me through every setback.", GLORY_BE] },
      { day: 8, title: "Late Have I Loved You", body: ["Augustine mourned the time lost, then rejoiced to be found.", "Let me not dwell on wasted days, but welcome this fresh beginning.", "It is never too late to turn toward Your love.", "Help me to love You now, wholeheartedly, from this day on.", GLORY_BE] },
      { day: 9, title: "Resting in God", body: ["At last, Lord, teach my heart to rest in You.", "Let the striving quiet and the compulsion loosen its hold.", "I place all I have prayed for into Your faithful hands.", "St. Augustine, who found rest in God, keep praying for me.", GLORY_BE] },
    ],
  },
  {
    id: "st-peregrine",
    title: "Novena to St. Peregrine",
    addressedTo: "God, through St. Peregrine",
    intercessor: "St. Peregrine",
    approvalNote: "St. Peregrine (canonized 1726) is honored as a patron of the sick, especially those facing cancer; the nine-day form is a popular devotion.",
    summary: "Nine days with St. Peregrine, companion of the sick, praying for strength, peace, and courage alongside good medical care.",
    themes: ["illness", "serious-illness", "suffering", "hope", "loved-ones-illness"],
    textStatus: "original",
    refrain: "St. Peregrine, companion of the sick, pray for us.",
    days: [
      { day: 1, title: "Facing Illness with Trust", body: ["Lord, illness has entered my life, and I bring it to You.", "I do not ask to be spared every hardship, but to be held through it.", "Walk this road with me, as You walked with St. Peregrine.", "Let this prayer accompany, and never replace, the care of my doctors and nurses.", GLORY_BE] },
      { day: 2, title: "When the Body Is Afraid", body: ["God, my body and my mind can be gripped by fear.", "Meet me in that fear with Your steadying peace.", "Help me to breathe, to rest, and to trust one moment at a time.", "St. Peregrine, who knew bodily suffering, stay close to me.", GLORY_BE] },
      { day: 3, title: "Strength for Treatment", body: ["Lord, give me strength for the treatment and care ahead.", "Bless the hands of those who tend to me with skill and kindness.", "Grant courage for hard days and gratitude for good ones.", "Let me cooperate with my care, trusting You are present in it.", GLORY_BE] },
      { day: 4, title: "Praying for a Loved One", body: ["God, I hold before You someone I love who is ill.", "Give them strength, comfort, and peace in body and spirit.", "Sustain those who care for them, and support their doctors' work.", "St. Peregrine, be a companion to them as they suffer.", GLORY_BE] },
      { day: 5, title: "Peace Amid Uncertainty", body: ["So much is unknown, Lord, and uncertainty is heavy to carry.", "Grant me a peace that does not depend on having answers.", "Help me not to borrow tomorrow's fears into today.", "Steady my heart when the future feels unclear.", GLORY_BE] },
      { day: 6, title: "Courage in Weakness", body: ["When I feel weak, remind me that courage is not the absence of fear.", "Give me the quiet bravery to face each day as it comes.", "You are strong in my weakness, and Your grace is enough.", "St. Peregrine, obtain for me the courage I need.", GLORY_BE] },
      { day: 7, title: "Surrender of the Outcome", body: ["Lord, I cannot control what lies ahead, and I lay it down.", "I entrust the outcome to Your wisdom and love.", "Whatever comes, let me not face it separated from You.", "Teach me to keep trusting, whether the road is short or long.", GLORY_BE] },
      { day: 8, title: "Comfort for the Suffering", body: ["You are near to all who suffer, Lord; be near to me and mine.", "Ease pain where You will, and give rest to the weary.", "Let no one bearing illness feel forgotten or alone.", "St. Peregrine, comforter of the sick, intercede for us.", GLORY_BE] },
      { day: 9, title: "Hope That Holds", body: ["God, I ask not for certainty but for hope that holds.", "Whatever this illness brings, let me remain anchored in Your love.", "I place myself, and all I love, into Your gentle keeping.", "St. Peregrine, companion of the sick, keep praying for us.", GLORY_BE] },
    ],
  },
  {
    id: "immaculate-heart",
    title: "Novena to the Immaculate Heart of Mary",
    addressedTo: "God, through the Blessed Virgin Mary",
    intercessor: "the Immaculate Heart of Mary",
    approvalNote: "A devotion to the Immaculate Heart of Mary, long honored in the Church and associated with the approved apparitions at Fatima; the nine-day form is a popular devotion.",
    summary: "Nine days seeking refuge and peace in the Immaculate Heart of Mary, a gentle shelter for the anxious heart.",
    themes: ["refuge", "trust", "consolation", "peace"],
    textStatus: "original",
    refrain: "Immaculate Heart of Mary, be my refuge and my peace.",
    days: [
      { day: 1, title: "Taking Refuge", body: ["Lord, when the world feels overwhelming, I need a safe place.", "Through Mary's Immaculate Heart, I take refuge in You.", "Let me shelter there as a child hides close to a mother.", "Immaculate Heart of Mary, be my refuge today.", GLORY_BE] },
      { day: 2, title: "A Heart That Trusted", body: ["Mary trusted You even when she did not understand.", "Teach me her gentle yes in my own uncertainty.", "Help me to trust that You are working for my good.", "Let her trusting heart shape my anxious one.", GLORY_BE] },
      { day: 3, title: "Consolation", body: ["God, Mary knows how to console a troubled heart.", "Send me Your comfort through her maternal care.", "Where I am discouraged, lift me gently.", "Let me feel that I am not carrying this alone.", GLORY_BE] },
      { day: 4, title: "Peace of Heart", body: ["Lord, I long for a peace the world cannot give.", "Still the storms within me as You once stilled the sea.", "Immaculate Heart of Mary, be my peace tonight.", "Let calm settle over my thoughts and my body.", GLORY_BE] },
      { day: 5, title: "Entrusting Myself", body: ["I place myself entirely into Your hands, Lord.", "Through Mary's heart, I offer all that I am and all that I fear.", "Take my worries and hold them for me.", "Let me rest in the safety of being fully known and fully loved.", GLORY_BE] },
      { day: 6, title: "Entrusting Those I Love", body: ["God, I bring before You the people I love and worry for.", "Into Mary's Immaculate Heart I entrust each of them by name.", "Guard them where I cannot, and give me peace about them.", "Let me love them freely, without the weight of fear.", GLORY_BE] },
      { day: 7, title: "A Gentle Refuge in Temptation", body: ["When I am tempted or troubled, let me run to this refuge.", "Mary's heart is a shelter, not a place of judgment.", "Help me to seek You quickly, before the storm grows.", "Immaculate Heart of Mary, keep me safe.", GLORY_BE] },
      { day: 8, title: "Renewed in Peace", body: ["Lord, let this devotion leave me quieter within.", "Renew in me the peace that comes from trusting You.", "Where anxiety ruled, let gentleness begin to grow.", "Thank You for the refuge of Mary's caring heart.", GLORY_BE] },
      { day: 9, title: "Hope in Her Heart", body: ["God, I close this novena with hope rather than dread.", "I place all I have prayed for into Mary's Immaculate Heart.", "Let me carry her peace with me into the days ahead.", "Immaculate Heart of Mary, be my refuge and my peace, always.", GLORY_BE] },
    ],
  },
  {
    id: "three-hail-marys",
    title: "Three Hail Marys Novena",
    addressedTo: "God, through the Blessed Virgin Mary",
    intercessor: "the Blessed Virgin Mary",
    approvalNote: "A traditional devotion of praying three Hail Marys each day, long recommended by saints for purity and protection. The Hail Mary is a public-domain prayer.",
    summary: "A simple traditional novena: each day a short intention followed by three Hail Marys, for purity, protection, and trust.",
    themes: ["purity", "protection", "temptation", "trust"],
    textStatus: "public-domain",
    refrain: "Hail Mary, full of grace.",
    repeatedPrayer: "Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.",
    days: [
      { day: 1, title: "Purity of Heart", body: ["Today I ask, through Mary, for purity of heart and clear intentions.", "Pray three Hail Marys:", "Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.", GLORY_BE] },
      { day: 2, title: "Protection", body: ["Today I ask, through Mary, for protection in body, mind, and soul.", "Pray three Hail Marys:", "Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.", GLORY_BE] },
      { day: 3, title: "Trust", body: ["Today I ask, through Mary, for a deeper trust in God's care.", "Pray three Hail Marys:", "Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.", GLORY_BE] },
      { day: 4, title: "Strength in Temptation", body: ["Today I ask, through Mary, for strength to resist temptation.", "Pray three Hail Marys:", "Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.", GLORY_BE] },
      { day: 5, title: "Peace of Mind", body: ["Today I ask, through Mary, for peace amid my worries.", "Pray three Hail Marys:", "Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.", GLORY_BE] },
      { day: 6, title: "Guidance", body: ["Today I ask, through Mary, for guidance in the choices before me.", "Pray three Hail Marys:", "Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.", GLORY_BE] },
      { day: 7, title: "Gratitude", body: ["Today I ask, through Mary, for a grateful and humble heart.", "Pray three Hail Marys:", "Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.", GLORY_BE] },
      { day: 8, title: "Perseverance", body: ["Today I ask, through Mary, for perseverance in doing good.", "Pray three Hail Marys:", "Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.", GLORY_BE] },
      { day: 9, title: "Entrusting All to Mary", body: ["Today I entrust, through Mary, all my intentions to God.", "Pray three Hail Marys:", "Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.", GLORY_BE] },
    ],
  },
];

export function getNovenaById(id: string): Novena | undefined {
  return NOVENAS.find((n) => n.id === id);
}

export type NovenaDayScreens = {
  /** Reflective lines for the "Reflect" screen. */
  meditation: string[];
  /** The prayer prayed 3x on the beads. */
  prayer: string;
  repeat: number;
  /** Closing prayer line(s) shown before Amen (e.g. the Glory Be). */
  closing: string[];
};

/**
 * Split a novena day into the interactive walker's screens: the meditation
 * to read, the short prayer to pray 3x on beads, and the closing prayer.
 * Instruction lines ("Pray slowly, three times:", "Pray three Hail Marys:")
 * and the repeated prayer / Glory Be are pulled out of the meditation so they
 * aren't shown twice.
 */
export function novenaDayScreens(novena: Novena, day: NovenaDay): NovenaDayScreens {
  const prayer = novena.repeatedPrayer ?? novena.refrain ?? "";
  const meditation: string[] = [];
  const closing: string[] = [];
  for (const line of day.body) {
    if (line === GLORY_BE) {
      closing.push(line);
      continue;
    }
    if (line.startsWith("Pray slowly") || line.startsWith("Pray three Hail Marys")) continue;
    if (prayer && line === prayer) continue;
    meditation.push(line);
  }
  return { meditation, prayer, repeat: 3, closing };
}
