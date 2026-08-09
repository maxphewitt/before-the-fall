/**
 * Start Here (2026-08-09) — the front-door orientation module, one track
 * per path, pinned on Home for every new account until completed. Layout
 * and every content decision: vault note "2026-08-09 Start Here Module —
 * Layout (rev. 5)" + the handoff Session Log. Key decisions (Max):
 *
 *   - Same name both paths: "Start Here". Pinned hero card, NEVER a gate.
 *   - NO quizzes — orientation, not a course; always revisitable.
 *   - Sessions unlock sequentially; progress in start_here_progress
 *     (scripts/task-54-start-here.sql).
 *   - SHIP GATE: this module describes support groups, live group
 *     sessions, teaching videos, and the redesigned Intentions (7-day
 *     lifespan, group-first, cross-community sourcing) in the PRESENT
 *     tense. It must not go live before those features do.
 *
 * Sourcing:
 *   - Catholic scriptures are CITATIONS ONLY, resolved to our
 *     self-hosted Douay-Rheims at render time via lib/scriptureCitation
 *     (same pattern as Liturgy of the Hours). All 21 citations were
 *     machine-verified against public/bible/dra/*.json on 2026-08-09.
 *   - The single Fr. Ripperger quote in Catholic session 2 was verified
 *     verbatim against "Pastoral Theology and the Philosophy of Man"
 *     (sensustraditionis.org PDF, read 2026-08-09). Do not add other
 *     Ripperger quotes — summarize only. No generational-spirits
 *     material, no deliverance/binding prayers, ever (layout §2 S6).
 *   - Aquinas is summarized, never quoted, with ST citations in text.
 *   - Secular readings: passages copied verbatim from the vetted
 *     monthlyWisdom.ts (Enchiridion 1 & 5; Meditations IV "Take away
 *     thy opinion" / "The universe is transformation") are trusted.
 *     EVERY OTHER PASSAGE must be verified against a printed
 *     public-domain edition before launch (standing wisdom-library
 *     rule): Aristotle NE II/VIII/IX (Ross), James Principles ch. IV,
 *     Epictetus Enchiridion 34 + Discourses II (Carter/Long), Seneca
 *     Letters I/VIII/XIII (Gummere), Aurelius Meditations IV retreat +
 *     Book V morning (Long), Thoreau Walden, Emerson "Friendship".
 *     The Emerson "Finish each day" Journals passage has DEBATED
 *     provenance — verify or swap before launch.
 *   - Session 1 teaching[0] is FOUNDER_NOTE_PLACEHOLDER on both tracks:
 *     Max writes the founder's note himself; the render layer hides the
 *     placeholder until then (see /start-here/[n]/page.tsx).
 *
 * All content DRAFT pending Fr. Murphy (Catholic) + clinician review.
 */

export type StartHereTrack = "catholic" | "secular";

/** Catholic sessions carry Scripture as citations; text resolved at render. */
export type StartHereScripture = { citation: string; context: string };

/** Secular sessions carry vetted public-domain text inline. */
export type StartHereReading = { ref: string; text: string; context: string };

export type CatholicStartHereSession = {
  n: number;
  title: string;
  scriptures: StartHereScripture[];
  teaching: string[];
  aspiration: string;
  closingPrayer: string;
};

export type SecularStartHereSession = {
  n: number;
  title: string;
  readings: StartHereReading[];
  teaching: string[];
  practice: string;
  closingThought: string;
};

export const FOUNDER_NOTE_PLACEHOLDER = "[FOUNDER_NOTE_PLACEHOLDER]";

export function startHereTrackForRole(role: string | null): StartHereTrack {
  return role === "secular" ? "secular" : "catholic";
}

export const CATHOLIC_START_HERE: CatholicStartHereSession[] = [
  {
    n: 1,
    title: "Why We Built This",
    scriptures: [],
    teaching: [
      FOUNDER_NOTE_PLACEHOLDER,
      "Here is what this app is: a place to build a new life one practiced day at a time. The Church's whole toolbox is open here, prayer, Scripture, the Rosary, honest journaling, practical skills, and a community of people walking the same road. Nothing in it is decoration; every piece exists because it helps somebody keep going.",
      "And here is what this app is not, said out loud in session one: it is not a replacement for therapy, medication, your doctor, confession, or the Eucharist. If a professional is part of your care, keep them. If the sacraments are not yet part of your life, this app will keep pointing you toward them, because it cannot substitute for them either.",
      "Now the positive claim. Faith is not therapy, but it works on the front end of the problem in a way nothing else does: every practice here aims at weakening the impulse to sin before it becomes an act. That matters for your mind and not only your soul, because sin carries consequences, the broken trust, the hidden account, the morning-after shame, and those consequences are fuel for the very anxiety and depression you are fighting.",
      "Weaken the impulse and you can cut off the supply line: fewer falls, fewer consequences, less self-sabotage feeding the spiral. The Church has always taught that sin wounds the one who commits it, and that repeated sin engenders vice (CCC 1865). Grace works on the cause while therapy works on the wound, and you want both.",
      "One promise before anything else: there is no shame here. Missed days are not debts, and nobody is keeping a ledger against you. Coming back is the whole practice, and you can come back as many times as it takes.",
    ],
    aspiration: "Lord Jesus, I am here; begin with me today.",
    closingPrayer:
      "Lord Jesus, You know exactly why I opened this app, even the parts I have not said out loud. I am not asking You to fix everything tonight; I am asking You to start. Weaken in me what keeps pulling me down, strengthen what is trying to live, and teach me to come back to You without shame every single time. I put this whole road, however long it turns out to be, into Your hands. Amen.",
  },
  {
    n: 2,
    title: "Why Faith Belongs in This Fight",
    scriptures: [
      {
        citation: "Philippians 4:6-7",
        context:
          "Paul does not say your circumstances will change first; he says bring everything to God by prayer, and the peace of God will stand guard over your heart and mind. This is the verse the whole session rests on: prayer as the Church's time-tested response to an anxious heart.",
      },
      {
        citation: "Matthew 6:25-34",
        context:
          "Jesus speaks directly to people who worry about tomorrow, which is most of us. He does not shame the worrier; He redirects the attention, one day at a time, toward a Father who already knows what you need.",
      },
      {
        citation: "1 Peter 5:7",
        context:
          "Peter's instruction is almost a physical action: take the anxiety and cast it onto God, because He cares for you. You were never meant to carry it alone, and handing it over is not weakness but obedience.",
      },
    ],
    teaching: [
      "Session 1 made a claim: grace works on the cause while therapy works on the wound. This session is the proof, and it starts with a principle Saint Thomas Aquinas built on throughout his theology: grace does not tear down nature, it builds on it and brings it to completion (Summa Theologiae I, q. 1, a. 8). Faith and mental-health care are not rivals fighting over you; they are two helps aimed at the same person.",
      "A priest who has spent his life at the intersection of psychology and the spiritual life puts it plainly: \"While one must have mental health in order to advance spiritually, nevertheless, psychology cannot be substituted for pastoral theology.\" (Fr. Chad Ripperger, Pastoral Theology and the Philosophy of Man.) Mental health and spiritual health are distinct, and each supports the other. Neither one can do the other's job.",
      "That framework is the mechanism behind Session 1's supply-line teaching. The tradition describes sin's wounds precisely: a darkened intellect, a weakened will, appetites pulling out of order. The life of grace, the sacraments, steady prayer, the devotions in this app, works to re-order the very faculties the impulse runs on, which is why a serious spiritual life can change what happens before the urge ever wins.",
      "And for the anxious heart specifically, the Church's oldest remedy is trust in Providence. Aquinas treats hope as a real virtue, a settled leaning on God for what we cannot secure ourselves (Summa Theologiae II-II, q. 17). Philippians 4:6-7 is that virtue in practice: bring the need to God, and the peace that follows is His guard posted over your mind.",
      "None of this replaces professional care, and this app will never suggest it does. If you have a therapist or a doctor, faith is not their competitor; it is working a different part of the same field. Take the help on both fronts, because that is what the Church herself tells you to do.",
    ],
    aspiration: "Jesus, I cast this anxiety on You; guard my heart and my mind.",
    closingPrayer:
      "Father, You made both my soul and my mind, and You are not confused about where one ends and the other begins. Thank You that I do not have to choose between Your grace and honest help for my mental health, because both are Your gifts. Build Your grace on everything true in me, guard my heart with Your peace, and teach me to cast every anxiety on You, today and tomorrow and the day after that. Amen.",
  },
  {
    n: 3,
    title: "What Prayer Actually Is (and Why We Pray to God)",
    scriptures: [
      {
        citation: "Matthew 6:5-8",
        context:
          "Right before teaching the Our Father, Jesus clears away two wrong pictures of prayer: performing for an audience, and piling up words to wear God down. Your Father already knows what you need, He says, which raises the honest question this session answers: then why tell Him at all?",
      },
      {
        citation: "Luke 11:9-13",
        context:
          "Ask, seek, knock: Jesus commands the very asking that can feel pointless to a beginner. The picture He chooses is a father who gives good things to children who ask, which means the asking itself is part of how the gift arrives.",
      },
      {
        citation: "Psalm 61:9",
        context:
          "The psalmist's instruction is startlingly simple: pour out your hearts before Him, for God is our helper. Not polished hearts, not corrected hearts, poured-out ones. That is the whole posture this session is teaching.",
      },
    ],
    teaching: [
      "Almost every beginner carries the same embarrassed question: if God already knows everything, why tell Him? It feels like delivering a report to someone who wrote it. The question deserves a real answer, and the Church has one.",
      "Saint Thomas Aquinas answers it directly: prayer does not inform God of anything, and it does not change His mind (Summa Theologiae II-II, q. 83, a. 2). Rather, God has willed from all eternity that some goods be given through our asking. Prayer is how we are made ready to receive them; the change happens in the one praying.",
      "That reframe matters for how you use this app. Prayer is not a mood you wait for; it is the virtue of religion in action, a practice like any practice, which grows stronger with repetition. That is exactly why it belongs in a habit app, and why a two-minute prayer on a bad day counts completely.",
      "And here is the permission most beginners need: honesty is prayer. \"I don't want to be here\" is a prayer if you say it to God. The Psalms are full of complaint, exhaustion, and fear addressed to God by name, and the Church has prayed them daily for millennia; you do not have to clean up before you speak.",
    ],
    aspiration: "Lord, teach me to pray; I will start by telling You the truth.",
    closingPrayer:
      "Father, You knew every word of this prayer before I opened my mouth, and You wanted to hear it anyway. Teach me that prayer is not a performance and not a report, but the way You have chosen to make me ready for what You want to give. When I have no polished words, receive the poured-out ones. And when I do not want to pray at all, let me at least tell You that, because even that is prayer. Amen.",
  },
  {
    n: 4,
    title: "What We Can Ask For, and How",
    scriptures: [
      {
        citation: "Luke 18:1-8",
        context:
          "Jesus tells this parable, Luke says, so that we would pray always and not lose heart. The widow wins not by strength but by refusing to stop showing up. Persistence in prayer is not nagging God; it is the shape faith takes over time.",
      },
      {
        citation: "James 1:5-6",
        context:
          "James says to ask God, who gives to all abundantly and does not reproach the asker. Read that twice: God does not roll His eyes at your request. Ask in faith, and let the asking itself steady you.",
      },
      {
        citation: "Matthew 7:7-11",
        context:
          "Ask, and it shall be given: Jesus grounds the promise in the character of a Father who gives good things. If flawed human fathers know how to give good gifts to their children, how much more the One who invented fatherhood.",
      },
    ],
    teaching: [
      "So what are you actually allowed to ask God for? Aquinas gives a freeing answer: anything you may lawfully desire (Summa Theologiae II-II, q. 83, a. 6). That includes temporal things, the job, the health, the strength to get through Tuesday, insofar as they help you toward home. God is not offended by small requests.",
      "How to ask: honestly, persistently, and with open hands. Honestly, because God is not fooled by the edited version. Persistently, like the widow, because Jesus told that story precisely so we would not quit. And with open hands, because \"Thy will be done\" is not resignation; it is trust with the outcome unclenched.",
      "If you want a simple shape to start with, try four movements: praise, sorrow, thanks, ask. Tell God something true about who He is, name what you regret, thank Him for one concrete thing, then make your requests plainly. These are training wheels, not a law; set them aside the moment prayer starts flowing without them.",
      "One more thing, faced head-on: sometimes the answer is no, or not yet, and that can hurt. The tradition's answer is that a request is sometimes denied so that something greater can be granted, and that the asking was never wasted, because it did its work in you. You will not always see this in the moment. Keep asking anyway; that is what faith looks like from the inside.",
    ],
    aspiration: "Father, I ask with open hands; Thy will be done.",
    closingPrayer:
      "Father, You told me to ask, so I am asking, plainly and without the edits. You know the things I want and the things I need, and You know better than I do where those lists differ. Give me the persistence of the widow, the confidence of a child asking a good father, and the open hands that can receive a different answer than the one I wanted. Nothing I bring You honestly is ever wasted. Amen.",
  },
  {
    n: 5,
    title: "Why Catholics Pray to Saints and Mary",
    scriptures: [
      {
        citation: "Revelation 5:8",
        context:
          "John sees the elders in heaven holding bowls of incense, which are the prayers of the saints. Heaven is not sealed off from the prayers of earth; the two are in living contact. That picture is the foundation for everything this session explains.",
      },
      {
        citation: "James 5:16",
        context:
          "Pray for one another, James says, because the fervent prayer of a just man avails much. Asking a holy friend to pray for you is plain Scripture. The saints are simply those friends who have finished the race.",
      },
      {
        citation: "John 2:1-11",
        context:
          "At Cana, Mary notices the shortage before anyone asks her, brings it to her Son, and then tells the servants to do whatever He tells them. She never points to herself. That is her whole pattern, and it is why Catholics are unafraid to ask for her prayers.",
      },
    ],
    teaching: [
      "Let the objection be stated fairly, because it is a serious one: isn't praying to saints worshipping creatures? If it were, it would be idolatry, and the Church would be right to forbid it. The answer hangs on a distinction the tradition has held for centuries.",
      "Aquinas lays it out cleanly (Summa Theologiae II-II, q. 103): worship in the strict sense, called latria, belongs to God alone and to no creature ever. The honor given to the saints, called dulia, is the reverence owed to holy friends of God, a different kind of thing entirely. Mary receives hyperdulia, above the other saints and infinitely below God. Catholics do not worship Mary; let that be said plainly.",
      "So what does \"praying to\" a saint actually mean? Exactly what asking a friend to pray for you means (Summa Theologiae II-II, q. 83, a. 11). James 5:16 says the fervent prayer of a just person avails much, and the saints are the just made perfect; asking their intercession is that verse taken seriously, not a detour around God, since every prayer still ends in Him.",
      "Cana shows you Mary's pattern in one scene: she notices the need, she brings it to her Son, and her only recorded command in all of Scripture is \"do whatever He tells you.\" A mother like that is safe to talk to. That is why this app has a Rosary tab, and why generations of struggling people have worn out their beads: the Rosary is a long walk through the life of Christ, holding His mother's hand.",
    ],
    aspiration: "Holy Mary, pray for me, and lead me to do whatever He tells me.",
    closingPrayer:
      "Lord Jesus, You alone are God, and You alone receive my worship. Thank You for not sending me into this fight alone: for Your mother, who notices what is running short before I say it, and for the saints, who fought their own battles and now pray for mine. Teach me to lean on their friendship the way I would lean on any strong friend. And let every one of those friendships end where they all point, in You. Amen.",
  },
  {
    n: 6,
    title: "Guarding the Heart",
    scriptures: [
      {
        citation: "Hebrews 3:12-13",
        context:
          "Notice carefully what does the hardening in this passage: the deceitfulness of sin. Not a demon, not a curse, sin itself, working through repetition and self-deception. The remedy Hebrews prescribes is just as ordinary: daily encouragement, so that no one drifts alone.",
      },
      {
        citation: "Ephesians 4:18-19",
        context:
          "Paul describes a darkening that happens by degrees: understanding dimmed, the heart's sensitivity worn down, until what once stung barely registers. This is a description of what repeated, unrepented sin does from the inside. It is also, read in reverse, a map back out.",
      },
      {
        citation: "1 Peter 5:8-9",
        context:
          "Peter is sober but not panicked: be vigilant, because the enemy is real, and resist him, steadfast in the faith. He tells you to resist, which means resistance works. The instruction assumes you can win.",
      },
    ],
    teaching: [
      "This session covers ground the Church insists on treating soberly: the reality of spiritual danger, and its actual limits. Both halves matter. Fear thrives on vagueness, so we are going to be precise.",
      "Start with the limits, because they are stronger than most people think. Saint Thomas teaches that demons cannot touch your intellect or your will directly; no created spirit can (Summa Theologiae I, q. 111; De Malo, q. 16). They can work only on the outer layers, the body, the senses, the imagination, the passions, and only indirectly and resistibly. Nothing can make you consent; your will has one Lord, and it is not the enemy.",
      "So who hardens a heart? Scripture's answer is uncomfortable and freeing at once: the person does, through repeated consent, and the instrument is the deceitfulness of sin itself (Hebrews 3:13). Unrepented habitual sin darkens the understanding and stiffens the will as a natural effect, the way a callus forms, and it weakens the ordinary protections at the same time (CCC 1865). Drift does not just leave a gap; sin deceives and slowly hardens, and while the enemy exploits the drift, the drift is ours to stop.",
      "Now the paragraph this session cannot be allowed to skip, so read it slowly: mental illness is not demonic. The Church herself distinguishes psychological illness from spiritual affliction (CCC 1673), and exorcists themselves send the people who come to them to doctors first, because most of what they see is medical, not spiritual. Depression, anxiety, OCD, addiction: these call for doctors, therapists, and medicine, working alongside prayer. Nothing in this session is about your diagnosis.",
      "Here is the hopeful part, and it is the whole point: the protections are ordinary, free, and already in your hands. Staying close to God through prayer, the sacraments, honest confession, and the encouragement of other people is the Church's sufficient, everyday defense (CCC 2851); there is no secret technique you are missing. Resist, steadfast in the faith, as Peter says. Keep showing up, and the drift never gets its foothold.",
    ],
    aspiration: "Lord, keep me close; a heart near You does not harden.",
    closingPrayer:
      "Lord God, You are stronger than everything that opposes You, and my will answers to no one but You. Keep me honest about sin's slow deceit, quick to turn back when I drift, and free of every fear You never asked me to carry. Thank You that Your protections are ordinary and already mine: prayer, Your sacraments, Your people. I will stay close to You, and that is enough. Amen.",
  },
  {
    n: 7,
    title: "Write It Down",
    scriptures: [
      {
        citation: "Psalm 138:23-24",
        context:
          "The psalmist volunteers for examination: search me, prove me, see whether there is a crooked way in me. That is journaling before paper was cheap. Writing honestly is how you cooperate with the God who already sees.",
      },
      {
        citation: "Lamentations 3:40",
        context:
          "This one verse is the whole session: search your ways, seek, and return to the Lord. Examination is never the end point; it is the turn-around. You look at the record so you can come home wiser.",
      },
    ],
    teaching: [
      "The Church has been telling people to write it down for a very long time: Augustine's Confessions is the first great journal, a man narrating his own compulsions and his way out, addressed to God, and the Ignatian Examen has walked Catholics through a daily review for four centuries. The modern research agrees with the ancient practice: self-monitoring is one of the most consistently effective behavior-change techniques in the research literature (Harkin et al., 2016), and expressive writing aids emotional processing (Pennebaker). This app's journaling is the old tradition with better tooling.",
      "The Field Journal is your urge log, and it works like this: an urge hits, you log it. You capture the context, your HALT state (Hungry, Angry, Anxious, Lonely, Tired, Restless, or Steady), the intensity, and the outcome. There are three outcomes: Stood firm; Stepped away, which is a win, because fleeing the near occasion is ancient Catholic advice; and Gave in, and naming it is the work.",
      "Here is the core promise: logging earns the same whether you stood firm or gave in. Honesty over outcome, always, because the entry after a fall is worth more than silence after a win. What saves you is the map: your contexts, your states, your hours, and the if-then plans the app builds from your own data, with a weekly debrief that turns seven days into one honest look.",
      "The Journal is the private room: daily entries, reflections, Bible notes, intentions. One fact stated plainly: your entries are encrypted, between you and God; nobody reads them and nobody mines them. Use the Field Journal when something hit you; use the Journal when something is on you.",
      "Alongside the journals sit six skills, each one a door to knock on at a particular moment. STOP puts a half-second pause between urge and action, and that gap is the intervention; Urge Surfing rides the wave instead of obeying it, since urges typically peak and fall within twenty to thirty minutes (Marlatt); Box Breathing is the body's brake pedal, about ninety seconds of slow, square breathing. 5-4-3-2-1 Grounding walks you back into the present one sense at a time; TIPP is the physical reset for when thinking-based tools feel impossible; the Thought Record writes the thought down and makes it defend itself against the evidence (Beck). Each tool walks you through itself the first time, and none of them competes with your Rosary: grace builds on nature, and the Church has been running behavior change for two thousand years, examination of conscience, custody of the eyes, fleeing occasions.",
      "So here is the recap, the three things worth leaving with. When the urge is hot, go body-first: STOP, Urge Surfing, Box Breathing, or TIPP; when a thought will not let go, use 5-4-3-2-1 Grounding or the Thought Record; when something hit you, log it in the Field Journal, and when something is on you, write in the Journal. The three outcomes are Stood firm, Stepped away, and Gave in, and logging earns the same for all three, because honesty is the whole game. And your Journal is encrypted: between you and God, nobody reads it, nobody mines it.",
    ],
    aspiration: "Search me, O God; I am ready to look at what You already see.",
    closingPrayer:
      "Lord, You have searched me and known me, and still You invite me to do the searching too, with You beside me. Give me the honesty to log the fall as faithfully as the victory, because You work with the truth and never with the edited version. Make my writing an examen: a search of my ways that always ends in returning to You. And when the record shows a pattern I did not want to see, let it become the map You use to lead me out. Amen.",
  },
  {
    n: 8,
    title: "You Won't Walk Alone",
    scriptures: [
      {
        citation: "Ecclesiastes 4:9-12",
        context:
          "The Preacher's arithmetic is blunt: two are better than one, because when one falls, the other is there to lift him up, and woe to the one who falls alone. Every struggle in this app is easier to survive in company. That is not sentiment; it is the design.",
      },
      {
        citation: "Galatians 6:2",
        context:
          "Bear one another's burdens, Paul says, and so fulfil the law of Christ. Carrying someone else's weight is not extra credit in the Christian life; it is the law of the house. Here, that starts with praying for a stranger's intention.",
      },
      {
        citation: "Hebrews 10:24-25",
        context:
          "The instruction is practical: consider one another, spur one another toward love and good works, and do not abandon the assembly. Isolation is named as the danger and gathering as the remedy. This session shows you every room this app keeps open for you.",
      },
    ],
    teaching: [
      "Isolation is where the enemy of every struggle does its best work. Shame grows in the dark, urges feel bigger alone at two in the morning, and despair is most persuasive with no witnesses. Scripture's answer, from Ecclesiastes to Hebrews, is stubbornly the same: one another.",
      "Start with Intentions, the wall where this community prays for each other. You post anonymously, no names ever, and your support group is your first circle of prayer: its intentions come to you first. Each intention stays on the board for a week, with the newest surfacing at the top, and when your community's list runs short, the platform brings you intentions from the wider family, so no one goes unprayed-for. You can mark \"I prayed\" once per intention, and everything on the wall is moderated and safety-scanned before it appears.",
      "Then there is the rhythm of praying together at scale: seasonal challenges and the monthly Pray Together devotion, the whole app praying the same thing in the same season. The monthly learning module comes with a knowledge leaderboard, and it measures knowledge only: never streaks, never prayer counts. Your prayer life is not a scoreboard here.",
      "Support groups are moderated group chats organized by the struggle, same sins, same anxieties, same griefs, so nobody is the only one in the room. They are anonymous-first and moderated for safety. There is a particular relief in reading your own exact battle in someone else's words.",
      "Group sessions are platform-wide live events hosted by a faith-guided licensed therapist, on a recurring rhythm: the whole community in one guided session. To repeat Session 1's line, this is not individual therapy and does not replace it. It is the community learning together from someone trained to teach.",
      "Finally, the teaching videos: Fr. Murphy and special guests on turning back to God, why Reconciliation matters and what actually happens in the confessional, how to pray, and learning the Church from the inside. You will find them in the Videos module. Between the wall, the groups, the sessions, and the videos, the door out of isolation is genuinely open; the only step left is walking through it.",
    ],
    aspiration: "Lord, teach me to carry someone today, and to let myself be carried.",
    closingPrayer:
      "Father, You did not build me to fight alone, and You have filled this road with companions I have not met yet. Give me the small courage to post the honest intention, to pray for a stranger's, and to walk into a room of people who carry what I carry. Let me bear someone else's burden this week, and let someone bear mine, and in that exchange let us both find You. Amen.",
  },
  {
    n: 9,
    title: "Your Path From Here",
    scriptures: [
      {
        citation: "Philippians 1:6",
        context:
          "Paul's confidence is not in the Philippians; it is in the One who began the good work in them and will see it through. The same holds for whatever has begun in you across these nine sessions. You are not the only one working on you, and the other Worker does not quit.",
      },
    ],
    teaching: [
      "You have finished the orientation; here is everything now in your hands, in one pass. Daily habits and completions to build the practiced day; the Rosary and the Seven Sorrows; Daily Scripture and the full Bible with highlights and notes; the Liturgy of the Hours; the Prayer Library and its novenas. The Field Journal and the Journal you know from Session 7. And the Check-In, which works exactly like this app's one promise: if you drift, we do not count the days, we just say welcome back.",
      "Now the most important tool, which is not in the app at all. The Parish Finder will locate a real parish near you, more than 13,000 of them, by location or ZIP; your location is used once and never stored. The app is scaffolding; the sacraments live at a real altar. Find the Mass times, find the confession times, and walk in; if it has been years, the Reconciliation teaching video and the Confession-prep card are your on-ramp.",
      "Beyond that, four habits that outgrow any app. Go to Mass even when it feels mechanical; grace does not require your enthusiasm to work. Go to confession regularly, not just after falls, and consider a spiritual director or a trusted priest: \"Father, do you have time to talk?\" is the whole script. Then join something at the parish that puts you in a pew next to people, because this app succeeds when it makes itself less necessary.",
      "One word about vows, because someday you may feel the pull to promise God something big. A vow is a promise made to God and taken with total seriousness; the tradition asks for deliberation, a better good, and wise counsel (Summa Theologiae II-II, q. 88). That is sacred ground, so walk it with a priest first; you will find no vow templates here on day nine. Until then, a private intention is the honest first step.",
      "That is the whole tour, and here is the whole assignment: pick one habit for tomorrow. Not five, not a new life overnight, one. He who began a good work in you will finish it; your part is one faithful day, and then another. Start tomorrow, start small, and we will be here the whole way.",
    ],
    aspiration: "Lord, You began this; I will bring You one faithful day at a time.",
    closingPrayer:
      "Lord Jesus, nine sessions ago I walked in carrying more than I said out loud, and You met me anyway. Thank You for every tool now in my hands, and for the Church waiting past the edge of this screen, with a real altar and a real confessional and real people. I am not asking to be finished; You have promised to handle the finishing. I am asking for tomorrow: one habit, kept once, offered to You. Amen.",
  },
];

export const SECULAR_START_HERE: SecularStartHereSession[] = [
  {
    n: 1,
    title: "Why We Built This",
    readings: [],
    teaching: [
      FOUNDER_NOTE_PLACEHOLDER,
      "Here is what this app is: a place to build a new life one practiced day at a time, with a toolbox of evidence-based skills, a library of the most durable practical wisdom human beings have written down, and a community walking the same road. And here is what it is not, said out loud on day one: it is not a replacement for therapy, medication, or a doctor. If you are working with a professional, keep working with them. If you are not and you need one, we will help you find one before this module is over.",
      "Now the claim that everything else here is built on. Every practice in this app aims at one target: weakening the impulse before it becomes an act. Not managing the fallout afterward — getting upstream of the act itself, where the fight is actually winnable.",
      "Why does that matter for your mind and not just your behavior? Because acting on the impulse creates consequences — the broken trust, the hidden thing, the morning-after shame — and those consequences are fuel for the very anxiety and depression you are fighting. Weaken the impulse and you cut the supply line: fewer falls, fewer consequences, less self-sabotage feeding the spiral.",
      "This is also why practice and therapy are partners, not rivals. Practice works on the cause; therapy works on the wound. You want both, and nothing in this app will ever suggest otherwise.",
      "One promise before you go: there is no shame here. Missed days are not debts, and nobody is keeping a ledger of your failures. Coming back is the whole practice — every single time.",
    ],
    practice: "Today I start where I am, honestly, and without shame.",
    closingThought:
      "You did not land here because everything is fine, and you do not have to pretend it is. The plan is simple and old: weaken the impulse before it becomes an act, practice daily, and let the consequences that used to feed the spiral quietly dry up. Get professional help for the wound while you practice on the cause. And when you miss a day — you will — come back. Coming back is the whole practice.",
  },
  {
    n: 2,
    title: "Why Practice Beats Willpower",
    readings: [
      {
        ref: "Aristotle — Nicomachean Ethics, Book II (trans. W. D. Ross)",
        text: "We become just by doing just acts, temperate by doing temperate acts, brave by doing brave acts. It makes no small difference, then, whether we form habits of one kind or of another from our very youth; it makes a very great difference, or rather all the difference.",
        context:
          "Twenty-three centuries ago Aristotle settled the question this session asks: character is not something you have, it is something you build, and the bricks are repeated acts.",
      },
      {
        ref: "Epictetus — Discourses, Book II (trans. George Long)",
        text: "Every habit and faculty is maintained and increased by the corresponding actions: the habit of walking by walking, the habit of running by running.",
        context:
          "Habits are not character verdicts; they are muscles. Whatever is practiced grows — which is warning and hope in the same sentence.",
      },
      {
        ref: "William James — The Principles of Psychology, ch. IV (1890)",
        text: "Could the young but realize how soon they will become mere walking bundles of habits, they would give more heed to their conduct while in the plastic state. We are spinning our own fates, good or evil, and never to be undone. Every smallest stroke of virtue or of vice leaves its never so little scar.",
        context:
          "James, the father of American psychology, wrote the chapter that made habit a scientific subject. His point cuts both ways: every repetition counts, including the ones nobody sees.",
      },
    ],
    teaching: [
      "Session 1 made a claim: these practices can weaken the impulse before it becomes an act. This session is the proof. Willpower — gritting your teeth in the moment of temptation — fails for a structural reason: the moment the urge is strongest is exactly the moment your strength is lowest. Practice moves the fight to earlier in the day, when you are strong and the urge is not even in the room.",
      "Aristotle saw the mechanism first. You do not become brave by feeling brave; you become brave by doing brave acts until bravery is what your hands do on their own. The self you are trying to become is not found or willed into existence — it is rehearsed.",
      "Epictetus adds the warning hidden inside the hope: every habit grows by its own repetitions, including the bad ones. Practice avoidance and avoidance strengthens. Practice the pause, the walk, the honest log — and those strengthen instead. The machinery does not care which way you run it; you choose the direction.",
      "William James put it in the language of the nervous system: we are spinning our own fates, and every smallest stroke counts. The rep you did alone in your kitchen at 11 p.m., when nobody saw and nothing was at stake — that one counted too. The research on behavior change has consistently backed him up: small actions repeated daily outperform heroic bursts of resolve.",
      "So this app will never ask you for heroics. It will ask you for repetitions — small, daily, countable. A missed day is not a verdict on your character; it is one rep skipped in a long training program, and the next rep is available tomorrow morning.",
    ],
    practice: "Today I will do one small practice as a repetition, not a test of willpower.",
    closingThought:
      "The people you admire for their discipline are not gritting their teeth harder than you; they trained earlier than you, that is all. Aristotle, Epictetus, and James — separated by centuries — all found the same law: whatever is practiced grows. Starting today, you are practicing on purpose. One rep at a time, in the plastic state, spinning your own fate the direction you choose.",
  },
  {
    n: 3,
    title: "The Mind: You Are Not Your Thoughts",
    readings: [
      {
        ref: "Epictetus — Enchiridion, ch. 1 (trans. Elizabeth Carter)",
        text: "Some things are in our control and others not. Things in our control are opinion, pursuit, desire, aversion, and, in a word, whatever are our own actions. Things not in our control are body, property, reputation, command, and, in one word, whatever are not our own actions.",
        context:
          "Epictetus, born enslaved, opened his handbook with the single most useful sorting exercise ever written: peace begins where you stop spending strength on what was never yours to steer.",
      },
      {
        ref: "Epictetus — Enchiridion, ch. 5 (trans. Elizabeth Carter)",
        text: "Men are disturbed, not by things, but by the principles and notions which they form concerning things. When therefore we are hindered, or disturbed, or grieved, let us never attribute it to others, but to ourselves — that is, to our own principles.",
        context:
          "The event and the story we tell about the event are two different things. Only the second one is in our hands, and that is where the work is.",
      },
    ],
    teaching: [
      "Two sentences from a former slave, nineteen centuries old, and they carry this whole session. First: some things are in your control and most things are not. Second: what disturbs you is almost never the event itself — it is the story you form about the event. The event happened once; the story has been running on repeat ever since.",
      "Here is what that means for you specifically: you are not your thoughts. Thoughts arrive uninvited — the craving, the dread, the replay of the worst thing you ever did. Their arrival is not in your control, and it is not your fault. What happens next is in your control: whether the thought gets believed, fed, and furnished a room.",
      "The Stoics called the arriving thought an impression, and their whole method was to inspect it at the door before letting it in. Is it true? Is it useful? Is it even yours, or just an old habit wearing your voice? Most painful thoughts cannot survive three honest questions.",
      "Notice how much of a hard day is commentary rather than event. The conversation took two minutes; the replay has taken two days. The verdict you are dreading has not been issued by anyone but you. Only one of those things is actually happening right now.",
      "You will meet a tool later in this module — the Thought Record — that is built on exactly this move: write the thought down and make it defend itself against evidence. For now, the practice is simpler. Once today, catch one painful thought and inspect it at the door. Not suppress — inspect.",
    ],
    practice: "The thought may arrive; I decide whether it gets a room.",
    closingThought:
      "The urge will keep knocking, and the dark story will keep arriving — that part was never in your control and never will be. But between the knock and the door there is a space, and the space belongs to you. That space is where every tool in this app operates, and it is where your new life gets built. You are not your thoughts. You are the one inspecting them.",
  },
  {
    n: 4,
    title: "The Body: Riding the Wave",
    readings: [
      {
        ref: "Epictetus — Enchiridion, ch. 34 (trans. Elizabeth Carter)",
        text: "If you are struck by the appearance of any promised pleasure, guard yourself against being hurried away by it; but let the affair wait your leisure, and procure yourself some delay.",
        context:
          "Epictetus' whole tactic against the urge is the pause. The impulse demands now, and nearly all of its power lives in that word.",
      },
      {
        ref: "Seneca — Letters to Lucilius, VIII (trans. Richard Gummere)",
        text: "Hold fast to this sound and wholesome rule of life: indulge the body only so far as is needful for good health.",
        context:
          "The body is a good servant and a poor master. Seneca's rule is not punishment but right ordering — the body served well, not obeyed blindly.",
      },
      {
        ref: "Marcus Aurelius — Meditations, Book V (trans. George Long)",
        text: "In the morning when thou risest unwillingly, let this thought be present: I am rising to the work of a human being. Why then am I dissatisfied if I am going to do the things for which I exist and for which I was brought into the world?",
        context:
          "Discipline is decided in small bodily moments — the alarm, the first urge, the open fridge. Aurelius fought the blanket like everyone else, and wrote down how he won.",
      },
    ],
    teaching: [
      "An urge is not a command, and it is not a permanent state. It is a wave: it rises, it peaks, and — if it is not fed — it falls. Researchers studying cravings, most famously G. Alan Marlatt, found that an urge that is not acted on typically crests and subsides on its own, often within twenty to thirty minutes. The urge does not know this about itself. Now you do.",
      "The urge's entire argument is about immediacy. It never says 'sometime this week'; it says now, and it says now is unbearable. But the peak is the lie. Ten minutes of delay does not defeat the urge by force — it simply outlives the crest. Epictetus said it in five words: procure yourself some delay.",
      "Here is why this session is about the body and not the mind: when an urge is peaking, your body is flooded and your reasoning is largely offline. Trying to think your way through the peak is bringing an essay to a fire. What works at the peak is body-first: slow the breath, cool the skin, ground the senses, move.",
      "That is what the body-first tools in your kit are for. Box Breathing is the brake pedal — about ninety seconds of slowed breathing that tells your nervous system the emergency is over. 5-4-3-2-1 Grounding walks you back into the present one sense at a time. TIPP is the full physical reset for the moments when even those feel impossible. You will get the complete field guide to all of them in Session 6.",
      "Seneca supplies the standing policy behind the tactics: the body is a good servant and a poor master. Its needs — food, sleep, movement — are real and should be honored generously. Its demands are proposals, not commands. Confusing the two is how a comfort becomes a captor.",
      "The practice is one deliberate delay. When the impulse says now, answer: after ten minutes, if I still want to. Then make the ten minutes easy — walk, breathe, call someone. Count every delay as a rep, because it is one.",
    ],
    practice: "The urge is a wave; I can outlast a wave.",
    closingThought:
      "You have lost to the wave before, at its peak, when it swore it would never end. It was lying about that, and now you have the numbers: it crests and falls, usually inside half an hour, when it is not fed. Your job is not to defeat the wave — it is to still be standing when it passes. Ten minutes, body first, every delay a rep. That is the whole fight, and it is winnable.",
  },
  {
    n: 5,
    title: "Guarding the Mind",
    readings: [
      {
        ref: "Marcus Aurelius — Meditations, Book IV (trans. George Long)",
        text: "The universe is transformation: life is opinion.",
        context:
          "Seven words carrying an idea Aurelius returns to throughout the Meditations: the mind takes on the character of what it habitually dwells on. What you rehearse, you become.",
      },
      {
        ref: "Marcus Aurelius — Meditations, Book IV (trans. George Long)",
        text: "Take away thy opinion, and then there is taken away the complaint, 'I have been harmed.' Take away the complaint, 'I have been harmed,' and the harm is taken away.",
        context:
          "Between the event and the suffering sits a judgment, and the judgment is removable. This is the daily maintenance work of a guarded mind.",
      },
      {
        ref: "Seneca — Letters to Lucilius, XIII (trans. Richard Gummere)",
        text: "There are more things likely to frighten us than there are to crush us; we suffer more often in imagination than in reality. Some things torment us more than they ought; some torment us before they ought; and some torment us when they ought not to torment us at all.",
        context:
          "Seneca's audit of a ruminating mind, two thousand years early. Most of what torments you is rehearsal for a performance that never opens.",
      },
    ],
    teaching: [
      "Session 2 taught you that whatever is practiced grows. Here is the uncomfortable extension: that law applies to thinking too. Attention and consent carve channels. Every time you give a thought your full attention and your agreement, you deepen the groove it runs in — and the mind, as Aurelius kept telling himself, takes on the character of what it habitually dwells on.",
      "This is why rumination is not harmless brooding. Replaying the failure, rehearsing the catastrophe, arguing with someone who is not in the room — these are repetitions, and repetitions are training. Rumination rehearses despair the way practice rehearses skill. Seneca's audit still holds: most of that suffering is imagination, running drills for a disaster that never arrives.",
      "Isolation is the second hazard, because it hardens the loop. A dark thought kept private goes unchallenged, and unchallenged thoughts calcify into facts. The channel deepens fastest in an empty room.",
      "The counter to both is honest naming. Say the true thing — out loud to a person, or in writing to yourself — and the loop breaks, because a named thought can be inspected at the door and a secret one cannot. That is the whole logic of the journals you will meet in the next session.",
      "Two things must be said plainly here. First: struggling with dark or looping thoughts is not weakness — it is one of the most common human experiences there is, and every thinker quoted in this module fought it. Second: none of this replaces professional care. If the dark thoughts are heavy, persistent, or frightening, talking to a therapist or doctor is not the backup plan — it is the strong move, and this app will keep saying so.",
    ],
    practice: "What I rehearse, I become — so today I will rehearse on purpose.",
    closingThought:
      "Your mind is being trained all day, every day, by whatever gets your attention and your consent. Rumination trains despair; isolation seals the room; naming breaks the seal. An emperor managing a plague and a philosopher managing an empire's politics both learned to guard the mind by watching what they let it rehearse — and both wrote it down, which is exactly where this module goes next. Guard the door. And when the weight is too much for these tools, say so to a professional; that is guarding the mind too.",
  },
  {
    n: 6,
    title: "Write It Down",
    readings: [
      {
        ref: "Marcus Aurelius — Meditations, Book IV (trans. George Long)",
        text: "Men seek retreats for themselves, houses in the country, sea-shores, and mountains. But this is altogether a mark of the most common sort of men, for it is in thy power whenever thou shalt choose to retire into thyself.",
        context:
          "The Meditations were never meant to be read by anyone. They are the private notebook of the most powerful man alive, writing himself sane at night, under pressure that would flatten most of us — the original proof that writing it down works.",
      },
      {
        ref: "Ralph Waldo Emerson — Journals",
        text: "Finish each day and be done with it. You have done what you could; some blunders and absurdities no doubt crept in; forget them as soon as you can. Tomorrow is a new day; begin it well and serenely.",
        context:
          "Emerson kept a journal his whole life, and this is his instruction for closing it each night: count the day honestly, then actually close the ledger. It is the spirit behind your weekly debrief.",
      },
    ],
    teaching: [
      "Marcus Aurelius ran an empire through plague and war, and the tool he used to stay sane was a private notebook. He was not writing for readers; he was writing himself steady under pressure — the archetype for everything in this session. Modern research agrees with the emperor: self-monitoring is one of the most consistently effective behavior-change techniques in the literature (Harkin et al., 2016), and expressive writing aids emotional processing (Pennebaker). Writing it down is not a nicety. It is a mechanism.",
      "Your first instrument is the Field Journal — the urge log. An urge hits: log it. You capture the context, your HALT state (Hungry, Angry, Anxious, Lonely, Tired, Restless, or Steady), the intensity, and the outcome. There are exactly three outcomes, by name: \"Stood firm\", \"Stepped away\" — a full win; leaving the room is an ancient and honorable move — and \"Gave in\", and naming it is the work.",
      "Now the rule that makes the Field Journal safe to be honest in: logging earns the same whether you stood firm or gave in. Honesty over outcome, always — the entry after a fall is worth more than silence after a win, because the map is what saves you. Over weeks, your entries become a pattern map of your own contexts, states, and hours, the app builds if-then plans from your own data, and the weekly debrief turns seven days into one honest look — Emerson's nightly ledger, at weekly scale.",
      "Your second instrument is the Journal — the private room. Daily entries, reflections, whatever is weighing on you. And the privacy fact, stated plainly: entries are encrypted; nobody reads it, nobody mines it. It is yours the way Marcus' notebook was his. The split is simple: Field Journal when something hit you; Journal when something is on you.",
      "Between the two journals sits the skills toolbox — six tools, and here is which door to knock on when. STOP is the half-second pause between urge and action (from DBT — Linehan); the gap is the intervention. Urge Surfing rides the wave you learned in Session 4 — urges peak and fall within twenty to thirty minutes (Marlatt); ride instead of obey. Box Breathing is the body's brake pedal, about ninety seconds. 5-4-3-2-1 Grounding walks you back into the present one sense at a time. TIPP is the physical reset for when thinking-based tools feel impossible. And the Thought Record makes a thought defend itself against evidence (Beck) — it is Epictetus from Session 3, with a worksheet. Each tool walks you through itself the first time.",
      "The recap, because these three facts matter most: which tool for which moment — body-first tools (Box Breathing, 5-4-3-2-1, TIPP) when you are flooded, STOP and Urge Surfing at the moment of urge, the Thought Record when the story needs interrogating. The three outcomes are \"Stood firm\", \"Stepped away\", and \"Gave in\" — and logging earns the same for all three. And your Journal is encrypted: nobody reads it, nobody mines it.",
    ],
    practice: "Next urge, next weight on my chest — I write it down before I decide anything.",
    closingThought:
      "A Roman emperor with the world on his shoulders and a lifelong journaler in a Concord farmhouse both reached the same conclusion: the unwritten day runs you, and the written day starts answering to you. Your Field Journal maps the urges; your Journal holds what is heavier; six tools cover the moments in between. Be honest in the log especially when it went badly — that entry is the valuable one. The map is what saves you, and only you can draw it.",
  },
  {
    n: 7,
    title: "You Won't Walk Alone",
    readings: [
      {
        ref: "Aristotle — Nicomachean Ethics, Book VIII (trans. W. D. Ross)",
        text: "Without friends no one would choose to live, though he had all other goods.",
        context:
          "Aristotle puts friendship above wealth and power in the ranking of what a life needs. Recovery and connection rise and fall together, and he saw it twenty-three centuries ago.",
      },
      {
        ref: "Aristotle — Nicomachean Ethics, Book IX (trans. W. D. Ross)",
        text: "The friend is another self.",
        context:
          "The truest friendship, Aristotle says, is wanting the good for the other as if for yourself. Being known that way is also how we come to know ourselves.",
      },
      {
        ref: "Ralph Waldo Emerson — Friendship (1841)",
        text: "A friend is one before whom I may think aloud.",
        context:
          "Isolation lets the worst thoughts go unchallenged. Emerson names the alternative: one person before whom the unedited mind is safe to speak.",
      },
    ],
    teaching: [
      "Session 5 named isolation as the place where dark thoughts calcify — where every struggle does its best work on you. The oldest practical wisdom and the newest research converge on the same answer: one another. Aristotle ranked friendship as the one good a flourishing life cannot do without, and nothing about being anonymous behind a screen exempts you from that law. So this app is built so that you never have to walk it alone.",
      "It starts small: as you work through readings and collections, you can leave an anonymous reflection, and you will see the reflections of others walking the same material — proof, in their own words, that someone is walking this too. Reflections fade after seven days, so the wall you are reading is always present tense: the people beside you are beside you now, not two years ago.",
      "Each month the whole community learns together. Learn Together runs a monthly arc — one topic, taught through one or two of the thinkers you have been meeting in this module — and a knowledge leaderboard goes with it. Knowledge only, and that is deliberate: we will never rank your streaks, your struggles, or your private work. The only scoreboard here is what you have learned.",
      "For the heavier lifting, there are support groups: moderated group chats organized by the shared struggle — the same urges, the same anxieties, the same griefs — so that nobody is ever the only one in the room. They are anonymous-first and moderated for safety. Emerson's definition is the design brief: a place where you may think aloud.",
      "There are also group sessions — live events hosted by a licensed therapist, on a recurring rhythm, with the whole community in one guided session. One line from Session 1 bears repeating here: these are real, professionally led sessions, but they are not individual therapy, and they do not replace it. And in the Learning Videos module, you will find teaching from secular experts — clinicians, researchers, and educators — going deeper on the skills this module introduced.",
    ],
    practice: "This week I will say one true thing where another person can hear it.",
    closingThought:
      "Every struggle in your life has told you the same lie: that you are the only one, and that saying it out loud would prove it. Aristotle called the friend another self; Emerson called the friend the one before whom you may think aloud — and both were describing the exact thing isolation takes from you first. The reflections, the groups, the live sessions: they all exist to put you back in a room with people who know the road. You will not walk this alone unless you insist on it.",
  },
  {
    n: 8,
    title: "Your Path From Here",
    readings: [
      {
        ref: "Seneca — Letters to Lucilius, I (trans. Richard Gummere)",
        text: "While we are postponing, life speeds by. Nothing is ours except time. Hold every hour in your grasp; lay hold of today's task, and you will not need to depend so much upon tomorrow's.",
        context:
          "The first letter Seneca wrote his friend is about the only resource that cannot be refunded. Orientation is over; today's task is waiting.",
      },
      {
        ref: "Henry David Thoreau — Walden (1854)",
        text: "I went to the woods because I wished to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach, and not, when I came to die, discover that I had not lived.",
        context:
          "Thoreau ran the experiment this whole module has been proposing: strip life to what is essential, face it honestly, and live it on purpose. Your version does not require a pond.",
      },
      {
        ref: "Henry David Thoreau — Walden (1854)",
        text: "The sun is but a morning star.",
        context:
          "The last line of Walden, built for anyone starting over: even the brightest thing you have seen so far is only the beginning of light.",
      },
    ],
    teaching: [
      "Here is your toolbox in one pass. Daily habits and completions are the spine — the small repetitions from Session 2, counted. The tools from Session 6 are on call for the hard moments. The wisdom library holds the thinkers you have met here, and many more, sorted by what you are facing. The Field Journal and Journal you know. And the Check-In is the front door each day — and if you drift, we do not count the days; we just say welcome back.",
      "The app also points beyond itself, because it is scaffolding, not the building. The Meetings & Support Finder helps you locate real-world meetings and support options near you — recovery meetings, support communities, help lines — because a room full of people who understand is a tool no app replaces.",
      "Three real-world moves matter more than anything on this screen. First: if you do not have a therapist, find one — the app works alongside professional care, never instead of it, and the finder can help you start. Second: make one real-world commitment that puts you in a room with people, on a schedule. Third — the hardest and the most powerful: tell one person the truth about what you are fighting. One person. Everything in the research and everything in this module says secrecy feeds the spiral and honesty starves it.",
      "Then there is one private move: a written commitment. Not a promise to anyone else — a page in your encrypted Journal titled \"Who I'm becoming\", in your own words, describing the person these practices are building. You will revisit it, revise it, and watch it stop being aspirational. It seeds the values work you will meet later in the app.",
      "And now the last instruction of this module, and it is deliberately small: pick one habit for tomorrow. Not five. One. Seneca's first letter to his friend was about exactly this — stop postponing, lay hold of today's task — and twenty centuries have not improved on the advice. The oak falls to little strokes; tomorrow morning is stroke one.",
    ],
    practice: "One habit, chosen tonight, done tomorrow.",
    closingThought:
      "Orientation is over; the practice begins in the morning. You know the plan now: weaken the impulse upstream, ride the wave, inspect the thought at the door, write it down, and stay in rooms with people who know the road — with professional care alongside all of it, not beneath it. Write down who you are becoming, tell one person the truth, and pick one habit for tomorrow. However bright or dark the story so far has been, it was only the opening pages. The sun is but a morning star.",
  },
];

export function getCatholicStartHereSession(n: number): CatholicStartHereSession | undefined {
  return CATHOLIC_START_HERE.find((s) => s.n === n);
}

export function getSecularStartHereSession(n: number): SecularStartHereSession | undefined {
  return SECULAR_START_HERE.find((s) => s.n === n);
}

export function startHereSessionCount(track: StartHereTrack): number {
  return track === "catholic" ? CATHOLIC_START_HERE.length : SECULAR_START_HERE.length;
}
