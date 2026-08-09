/**
 * Monthly wisdom modules (2026-07-21) — the secular mirror of the monthly
 * devotions' learning module ("Learn Together" ↔ Walk Together's "Pray
 * Together"). One topic per month, taught through 1–2 philosophers/poets.
 *
 * Rules: NO religion, NO spirituality (Max's standing rule). All passages
 * are public domain (PD translations: Long's Aurelius, Carter's Epictetus,
 * Gummere's Seneca). DRAFT v1 — single session per month; deepen like
 * July's devotion module once Max approves the direction. Verify passage
 * wording against printed PD editions before launch.
 *
 * Reuses the ModuleSession shape from monthlyDevotions so the walker
 * mechanics stay identical; `prayer`/`closingPrayer` fields carry the
 * "practice" and "closing thought" (the secular walker relabels them).
 */

import type { ModuleSession } from "./monthlyDevotions";

export type MonthlyWisdom = {
  month: number; // 1-12
  topic: string;
  monthLabel: string;
  philosophers: string[];
  session: ModuleSession;
  /** Full 4-week module (one session per week). If absent, the single
   * `session` is used — same deepen-later pattern as monthlyDevotions. */
  sessions?: ModuleSession[];
};

/** The month's sessions: the 4-week module when authored, else the one. */
export function wisdomSessions(w: MonthlyWisdom): ModuleSession[] {
  return w.sessions && w.sessions.length > 0 ? w.sessions : [w.session];
}

export const MONTHLY_WISDOM: MonthlyWisdom[] = [
  {
    month: 7,
    topic: "What Is in Our Control",
    monthLabel: "July — What Is in Our Control",
    philosophers: ["Epictetus", "Marcus Aurelius"],
    session: {
      n: 1,
      title: "The Line Between Ours and Not Ours",
      scriptures: [
        {
          ref: "Epictetus — Enchiridion, ch. 1 (trans. Elizabeth Carter)",
          text: "Some things are in our control and others not. Things in our control are opinion, pursuit, desire, aversion, and, in a word, whatever are our own actions. Things not in our control are body, property, reputation, command, and, in one word, whatever are not our own actions.",
          context: "This single distinction is the heart of the month's topic. Epictetus, born enslaved, spent his life teaching that peace begins where we stop spending strength on what was never ours to steer.",
        },
        {
          ref: "Epictetus — Enchiridion, ch. 5 (trans. Elizabeth Carter)",
          text: "Men are disturbed, not by things, but by the principles and notions which they form concerning things.",
          context: "The event and the story we tell about the event are two different things. Only the second one is in our hands, and that is where the work is.",
        },
        {
          ref: "Marcus Aurelius — Meditations, Book VII (trans. George Long)",
          text: "Let not future things disturb thee, for thou wilt come to them, if it shall be necessary, having with thee the same reason which now thou usest for present things.",
          context: "A Roman emperor writing privately to himself lands on the same rule as a former slave: the future is not carried today. You will meet it with the same mind that is handling this moment.",
        },
      ],
      teaching: [
        "Epictetus opens his handbook with a sorting exercise: some things are up to us, most things are not. Our opinions, choices, and efforts are ours; other people's actions, the past, the outcome of tomorrow are not. Most exhaustion comes from working the wrong side of that line.",
        "This is not resignation. The point is concentration: when you stop hauling what cannot be moved, your strength returns for what can. A craving cannot be wished away, but the next ten minutes can be chosen. Another person's opinion cannot be controlled, but your honesty can.",
        "Marcus Aurelius practiced the same sorting under pressure — plague, war, betrayal — by writing it down nightly. His journal survived him by eighteen centuries, which says something about how repeatable the practice is: name what is yours, do that, and let the rest be weather.",
        "Try it plainly this month. When something knots your chest, ask one question: is this mine to act on, or mine to endure? If it is yours, take the smallest next action. If it is not, notice the story you are telling about it — that story, at least, is yours to revise.",
      ],
      prayer: "Today I will spend my strength only on what is mine: my choices, my effort, my honesty.",
      closingPrayer: "This month I am learning the oldest sorting exercise there is: what is mine, and what is not. I cannot choose what arrives — the craving, the memory, the other person's choice. I can choose the next ten minutes, the honest word, the small effort repeated. Let me put my strength there, and let the rest be weather passing through.",
      quiz: [
        { q: "According to Epictetus, which of these IS in our control?", options: ["Our reputation", "Other people's choices", "Our own opinions and actions", "What happens tomorrow"], answer: 2 },
        { q: "Epictetus says men are disturbed not by things, but by…", options: ["The notions they form concerning things", "The size of their misfortunes", "The actions of their enemies", "The shortness of life"], answer: 0 },
        { q: "What does Marcus Aurelius say about future things?", options: ["They should be planned in detail tonight", "They will never arrive", "They are punishments", "You will meet them with the same reason you use for present things"], answer: 3 },
        { q: "The teaching's one question for a knotted chest is:", options: ["Whose fault is this?", "Is this mine to act on, or mine to endure?", "How do I make this stop immediately?", "What would others think?"], answer: 1 },
      ],
    },
    // Four weeks: the line → the mind → the body & impulse → attention.
    sessions: [
      {
        n: 1,
        title: "Week 1 — The Line Between Ours and Not Ours",
        scriptures: [
          {
            ref: "Epictetus — Enchiridion, ch. 1 (trans. Elizabeth Carter)",
            text: "Some things are in our control and others not. Things in our control are opinion, pursuit, desire, aversion, and, in a word, whatever are our own actions. Things not in our control are body, property, reputation, command, and, in one word, whatever are not our own actions.",
            context: "This single distinction is the heart of the month. Epictetus, born enslaved, spent his life teaching that peace begins where we stop spending strength on what was never ours to steer.",
          },
          {
            ref: "Epictetus — Enchiridion, ch. 5 (trans. Elizabeth Carter)",
            text: "Men are disturbed, not by things, but by the principles and notions which they form concerning things.",
            context: "The event and the story we tell about the event are two different things. Only the second one is in our hands, and that is where the work is.",
          },
          {
            ref: "Marcus Aurelius — Meditations, Book VII (trans. George Long)",
            text: "Let not future things disturb thee, for thou wilt come to them, if it shall be necessary, having with thee the same reason which now thou usest for present things.",
            context: "A Roman emperor writing privately to himself lands on the same rule as a former slave: the future is not carried today. You will meet it with the same mind that is handling this moment.",
          },
        ],
        teaching: [
          "Epictetus opens his handbook with a sorting exercise: some things are up to us, most things are not. Our opinions, choices, and efforts are ours; other people's actions, the past, the outcome of tomorrow are not. Most exhaustion comes from working the wrong side of that line.",
          "This is not resignation. The point is concentration: when you stop hauling what cannot be moved, your strength returns for what can. A craving cannot be wished away, but the next ten minutes can be chosen.",
          "Marcus Aurelius practiced the same sorting under pressure — plague, war, betrayal — by writing it down nightly. Name what is yours, do that, and let the rest be weather.",
          "This week, when something knots your chest, ask one question: is this mine to act on, or mine to endure? If it is yours, take the smallest next action. If it is not, notice the story you are telling about it — that story, at least, is yours to revise.",
        ],
        prayer: "Today I will spend my strength only on what is mine: my choices, my effort, my honesty.",
        closingPrayer: "This week I am learning the oldest sorting exercise there is: what is mine, and what is not. I cannot choose what arrives — the craving, the memory, the other person's choice. I can choose the next ten minutes, the honest word, the small effort repeated. Let me put my strength there, and let the rest be weather passing through.",
        quiz: [
          { q: "According to Epictetus, which of these IS in our control?", options: ["Our reputation", "What happens tomorrow", "Other people's choices", "Our own opinions and actions"], answer: 3 },
          { q: "Epictetus says men are disturbed not by things, but by…", options: ["The notions they form concerning things", "The size of their misfortunes", "The actions of their enemies", "The shortness of life"], answer: 0 },
          { q: "What does Marcus Aurelius say about future things?", options: ["They should be planned in detail tonight", "They will never arrive", "You will meet them with the same reason you use for present things", "They are punishments"], answer: 2 },
          { q: "The week's one question for a knotted chest is:", options: ["Whose fault is this?", "Is this mine to act on, or mine to endure?", "How do I make this stop immediately?", "What would others think?"], answer: 1 },
        ],
      },
      {
        n: 2,
        title: "Week 2 — The Mind: Choosing the Story",
        scriptures: [
          {
            ref: "Marcus Aurelius — Meditations, Book IV (trans. George Long)",
            text: "Take away thy opinion, and then there is taken away the complaint, 'I have been harmed.' Take away the complaint, 'I have been harmed,' and the harm is taken away.",
            context: "Week two moves inside the head. Aurelius' claim is precise: between the event and the suffering sits a judgment, and the judgment is removable.",
          },
          {
            ref: "Epictetus — Enchiridion, ch. 20 (trans. Elizabeth Carter)",
            text: "Remember, that not he who gives ill language or a blow insults, but the principle which represents these things as insulting. When, therefore, anyone provokes you, be assured that it is your own opinion which provokes you.",
            context: "The insult needs your signature before it can injure. Epictetus moves the fight from the other person's mouth to your own desk, where you can actually win it.",
          },
          {
            ref: "Marcus Aurelius — Meditations, Book IV (trans. George Long)",
            text: "The universe is transformation: life is opinion.",
            context: "Seven words that summarize the week. The world will keep changing; the quality of your life rides on the opinions you form about it.",
          },
        ],
        teaching: [
          "Thoughts arrive uninvited; that part is not in your control. What happens next is: whether the thought gets believed, fed, and furnished a room. The Stoics called the arriving thought an impression and insisted on inspecting it at the door.",
          "This is the ancestor of the modern thought record. Write the thought down, ask what the evidence is, ask what you would tell a friend who thought it. The Thought Record tool in your kit is Epictetus with a worksheet.",
          "Notice how much daily pain is commentary rather than event: the replayed conversation, the imagined verdict, the forecast of failure. The event took one minute; the commentary has been running for days. Only one of those is happening now.",
          "This week's practice: once a day, catch one painful thought and inspect it at the door. Not suppress — inspect. Is it true? Is it useful? Is it even yours, or just a habit wearing your voice?",
        ],
        prayer: "The thought may arrive; I decide whether it gets a room.",
        closingPrayer: "This week I am learning that the harm and the opinion travel together, and the opinion is mine to examine. The universe will keep transforming; my commentary is the part I hold. One thought a day, met at the door, asked for its evidence. That is how the mind becomes a safer place to live.",
        quiz: [
          { q: "Aurelius says when you take away the opinion 'I have been harmed'…", options: ["The harm is taken away", "The harm doubles", "The memory disappears", "Others apologize"], answer: 0 },
          { q: "Epictetus says what actually provokes you is…", options: ["The insult itself", "Bad luck", "The other person's tone", "Your own opinion of it"], answer: 3 },
          { q: "'The universe is transformation: life is…'", options: ["Suffering", "Opinion", "Chance", "Struggle"], answer: 1 },
          { q: "The week's practice is to catch one painful thought and…", options: ["Suppress it", "Share it online", "Inspect it at the door for evidence", "Act on it quickly"], answer: 2 },
        ],
      },
      {
        n: 3,
        title: "Week 3 — The Body and the Impulse",
        scriptures: [
          {
            ref: "Epictetus — Enchiridion, ch. 34 (trans. Elizabeth Carter)",
            text: "If you are struck by the appearance of any promised pleasure, guard yourself against being hurried away by it; but let the affair wait your leisure, and procure yourself some delay.",
            context: "Week three is about urges. Epictetus' whole tactic is the pause: the impulse demands now, and nearly all of its power lives in that word.",
          },
          {
            ref: "Seneca — Letters to Lucilius, VIII (trans. Richard Gummere)",
            text: "Hold fast to this sound and wholesome rule of life: indulge the body only so far as is needful for good health.",
            context: "The body is a good servant and a poor master. Seneca's rule is not punishment but right ordering — the body served well, not obeyed blindly.",
          },
          {
            ref: "Marcus Aurelius — Meditations, Book V (trans. George Long)",
            text: "In the morning when thou risest unwillingly, let this thought be present: I am rising to the work of a human being.",
            context: "Discipline is decided in small bodily moments — the alarm, the first urge, the open fridge. Aurelius fought the blanket like everyone else, and wrote down how he won.",
          },
        ],
        teaching: [
          "An urge is a wave: it rises, peaks, and — if not fed — falls. The Stoics knew this eighteen centuries before the science measured it. 'Procure yourself some delay' is urge surfing in a toga.",
          "The delay works because the impulse's argument is entirely about immediacy. Ten minutes of waiting does not defeat the urge by force; it simply outlives the peak. The Urge Surfing tool in your kit walks exactly this.",
          "Seneca's rule reorders the household: the body's needs are real and honored — food, sleep, movement — but its demands are proposals, not commands. Confusing the two is how a comfort becomes a captor.",
          "This week, practice one deliberate delay a day. When the impulse says now, answer: after ten minutes, if you still want to. Then make the ten minutes easy — walk, breathe, call someone. Count every delay as a rep.",
        ],
        prayer: "The urge is a wave; I can outlast a wave.",
        closingPrayer: "This week I am practicing the oldest trick against impulse: the pause. The wave rises and insists on now, and I answer with ten minutes. My body is a good servant that deserves care, not a master that dictates terms. Every delay is a repetition, and every repetition is mine.",
        quiz: [
          { q: "Epictetus' tactic against a promised pleasure is to…", options: ["Argue with it loudly", "Give in once to release it", "Procure yourself some delay", "Pretend it isn't there"], answer: 2 },
          { q: "Seneca says to indulge the body…", options: ["Only so far as is needful for good health", "Never", "Whenever it asks", "Only on holidays"], answer: 0 },
          { q: "The teaching describes an urge as…", options: ["A permanent state", "A command", "A moral failure", "A wave that rises, peaks, and falls"], answer: 3 },
          { q: "The week's daily practice is…", options: ["Fasting", "One deliberate ten-minute delay", "Cold showers", "Avoiding all pleasure"], answer: 1 },
        ],
      },
      {
        n: 4,
        title: "Week 4 — Attention on What Matters",
        scriptures: [
          {
            ref: "Seneca — On the Shortness of Life (trans. Aubrey Stewart)",
            text: "It is not that we have a short space of time, but that we waste much of it. Life is long enough for the highest achievements, were it all well invested.",
            context: "The final week turns to attention — the one resource behind all the others. Seneca's audit finds the shortage is not in the hours but in where they go.",
          },
          {
            ref: "Marcus Aurelius — Meditations, Book II (trans. George Long)",
            text: "Do the things external which fall upon thee distract thee? Give thyself time to learn something new and good, and cease to be whirled around.",
            context: "Being whirled around is not a modern invention; only the notifications are new. The remedy was already old in Rome: choose one good thing and give it real time.",
          },
          {
            ref: "Marcus Aurelius — Meditations, Book II (trans. George Long)",
            text: "Since it is possible that thou mayest depart from life this very moment, regulate every act and thought accordingly.",
            context: "Not morbid — clarifying. The shortness of the ride is exactly what makes the trivial trivial and the important urgent.",
          },
        ],
        teaching: [
          "Everything this month funnels here: the sorted line, the inspected thought, the delayed impulse all exist to free your attention — and attention, spent, is simply what your life was.",
          "Seneca's accounting is uncomfortable on purpose. Add up the hours given to the scroll, the replay, the dread rehearsal, and the 'short' life turns out to have been long and mostly donated to things that would not mourn you.",
          "Aurelius' remedy is positive, not just restrictive: learn something new and good. Attention is trained by giving it a worthy object, the way this month's readings have been one. The whirling stops when something heavier anchors you.",
          "Last practice of the month: each morning, name the one thing today that actually matters — a person, a task, a promise kept. Give it the first and best hour you have. Let the whirl fight over what is left.",
        ],
        prayer: "First hour to what matters; the whirl gets the leftovers.",
        closingPrayer: "This month I sorted what is mine, inspected my thoughts at the door, outlasted the wave, and now I choose where the attention goes. The hours were never short — they were scattered. One thing that matters, named each morning and served first. That is a life being well invested, one day at a time.",
        quiz: [
          { q: "Seneca says our time is…", options: ["Truly too short for anything", "Beyond our control entirely", "Endless", "Long enough, were it well invested"], answer: 3 },
          { q: "Aurelius' remedy for being whirled around is…", options: ["Giving time to learn something new and good", "More rest", "Avoiding all people", "Working faster"], answer: 0 },
          { q: "Remembering life's shortness is meant to be…", options: ["Morbid", "Frightening", "Clarifying about what matters", "Ignored"], answer: 2 },
          { q: "The final practice is to give the first and best hour to…", options: ["Email", "The one thing that actually matters today", "The news", "Whatever arrives first"], answer: 1 },
        ],
      },
    ],
  },
  {
    month: 1,
    topic: "Starting Again",
    monthLabel: "January — Starting Again",
    philosophers: ["Seneca", "Benjamin Franklin"],
    session: {
      n: 1,
      title: "Lay Hold of Today",
      scriptures: [
        {
          ref: "Seneca — Letters to Lucilius, I (trans. Richard Gummere)",
          text: "While we are postponing, life speeds by. Nothing is ours except time. Hold every hour in your grasp; lay hold of today's task, and you will not need to depend so much upon tomorrow's.",
          context: "January's topic is the honest restart. Seneca's first letter is about the only resource that cannot be refunded — and the habit of spending it on postponement.",
        },
        {
          ref: "Benjamin Franklin — Poor Richard's Almanack",
          text: "Little strokes fell great oaks. Lost time is never found again.",
          context: "Franklin built a printing empire and a nation's civic life out of small repeated efforts. The oak does not fall to one swing, and neither does an old habit.",
        },
        {
          ref: "Ralph Waldo Emerson — Journals",
          text: "Finish each day and be done with it. You have done what you could; some blunders and absurdities no doubt crept in; forget them as soon as you can. Tomorrow is a new day; begin it well and serenely.",
          context: "A restart needs a clean cut with yesterday. Emerson's advice is a nightly practice: close the ledger honestly, then actually close it.",
        },
      ],
      teaching: [
        "Every January the same trap opens: the plan so ambitious it collapses by February. The old writers went the other way — Seneca counts hours, Franklin counts strokes. Small, held, today.",
        "A restart after a fall works the same. The instinct is to promise something enormous to make up for it. The evidence — and the philosophers — say the opposite: shrink the promise until it cannot be broken today, then keep it today only.",
        "Emerson adds the missing piece: a shutdown ritual. Blunders crept in; note them without ceremony and be done. Carrying yesterday's failure into today is just postponement wearing a costume.",
        "This month, pick one stroke — one small daily act — and count nothing else. Let the oak worry about itself.",
      ],
      prayer: "One small stroke today, kept.",
      closingPrayer: "This month I am practicing the honest restart: not the enormous promise, but the small one kept today. Yesterday is closed and counted; tomorrow can depend on itself. I have this hour in my grasp, and one stroke to make.",
      quiz: [
        { q: "Seneca says nothing is ours except…", options: ["Time", "Reputation", "Property", "Friends"], answer: 0 },
        { q: "Franklin's image for persistence is…", options: ["A river cutting stone", "Bricks in a wall", "A candle in the wind", "Little strokes felling great oaks"], answer: 3 },
        { q: "Emerson's advice for ending a day with blunders in it:", options: ["Review each one at length", "Finish the day, be done with it, and begin tomorrow serenely", "Promise twice as much tomorrow", "Tell no one"], answer: 1 },
      ],
    },
  },
  {
    month: 2,
    topic: "Friendship & Connection",
    monthLabel: "February — Friendship & Connection",
    philosophers: ["Aristotle", "Ralph Waldo Emerson"],
    session: {
      n: 1,
      title: "The Friend as a Second Self",
      scriptures: [
        {
          ref: "Aristotle — Nicomachean Ethics, Book VIII (trans. W. D. Ross)",
          text: "Without friends no one would choose to live, though he had all other goods.",
          context: "Aristotle puts friendship above wealth and power in the ranking of what a life needs. February's topic is why recovery and connection rise and fall together.",
        },
        {
          ref: "Aristotle — Nicomachean Ethics, Book IX (trans. W. D. Ross)",
          text: "The friend is another self.",
          context: "The truest friendship, Aristotle says, is wanting the good for the other as if for yourself. Being known that way is also how we come to know ourselves.",
        },
        {
          ref: "Ralph Waldo Emerson — Friendship (1841)",
          text: "A friend is one before whom I may think aloud.",
          context: "Isolation lets the worst thoughts go unchallenged. Emerson names the alternative: one person before whom the unedited mind is safe to speak.",
        },
      ],
      teaching: [
        "Isolation is where struggles compound; every tradition of practical wisdom converges on this. Aristotle, writing four centuries before the common era, ranked friendship as the one good a flourishing life cannot do without.",
        "His test for real friendship is direction of care: wanting the other's good for their own sake. Fair-weather company wants your usefulness or your fun. A second self wants your Tuesday-afternoon honesty.",
        "Emerson's line is a practical instruction: find the person before whom you may think aloud, and be that person for someone. Half of what festers in silence dissolves when spoken to a steady face.",
        "This month, invest in one such friendship deliberately — a call kept weekly, a walk, an honest answer to 'how are you' — and notice what it changes.",
      ],
      prayer: "One honest conversation this week, kept like an appointment.",
      closingPrayer: "This month I am treating connection as a need, not a luxury. One person before whom I can think aloud; one person whose good I want plainly. Half of what weighs on me shrinks when it is spoken — let me speak it, and let me be safe to speak to.",
      quiz: [
        { q: "Aristotle says without friends no one would choose to live, even with…", options: ["A long life", "Great courage", "All other goods", "Wisdom"], answer: 2 },
        { q: "Aristotle calls the true friend…", options: ["A useful ally", "A rare luxury", "Another self", "A mirror of flattery"], answer: 2 },
        { q: "Emerson defines a friend as one before whom you may…", options: ["Think aloud", "Stay silent", "Prove yourself", "Hide your worst"], answer: 0 },
      ],
    },
  },
  {
    month: 3,
    topic: "Discipline & Practice",
    monthLabel: "March — Discipline & Practice",
    philosophers: ["Epictetus"],
    session: {
      n: 1,
      title: "Nothing Great Is Created Suddenly",
      scriptures: [
        {
          ref: "Epictetus — Discourses, Book I (trans. George Long)",
          text: "No great thing is created suddenly, any more than a bunch of grapes or a fig. If you tell me that you desire a fig, I answer you that there must be time. Let it first blossom, then bear fruit, then ripen.",
          context: "March's topic is the unglamorous middle of any change. Epictetus reaches for a fig tree: no stage can be skipped, and no stage is wasted.",
        },
        {
          ref: "Epictetus — Discourses, Book II (trans. George Long)",
          text: "Every habit and faculty is maintained and increased by the corresponding actions: the habit of walking by walking, the habit of running by running.",
          context: "Habits are not character verdicts; they are muscles. Whatever is practiced grows — which is warning and hope in the same sentence.",
        },
        {
          ref: "Epictetus — Enchiridion, ch. 51 (trans. Elizabeth Carter)",
          text: "How long, then, will you put off thinking yourself worthy of the highest improvements? You are no longer a boy, but a grown man. Let whatever appears to be the best be to you an inviolable law.",
          context: "At some point rehearsal ends. Epictetus' push is not shame but promotion: you are ready to live by what you already know is best.",
        },
      ],
      teaching: [
        "Epictetus taught in a rented hall to students who wanted transformation by the weekend. His answer was agricultural: blossom, fruit, ripen. Time is an ingredient, not an obstacle.",
        "His second observation is the mechanism: every habit grows by its own repetitions. Practice avoidance and avoidance strengthens. Practice the small return — the walk, the call, the honest log — and that strengthens instead.",
        "The third passage is the graduation speech. Knowing better is a phase, not a home. Whatever you already know is best — sleep, honesty, the meeting, the walk — promote it from good idea to standing law.",
        "This month, choose the one 'best thing' you keep negotiating with, and stop negotiating. Not forever; for March.",
      ],
      prayer: "What I know is best, I will treat as law today.",
      closingPrayer: "This month I am done negotiating with what I already know. Growth keeps fig-tree time — blossom, fruit, ripen — and every repetition is a vote for the person I am becoming. One practice, kept daily, without debate. That is the whole assignment.",
      quiz: [
        { q: "Epictetus says no great thing is created…", options: ["Without wealth", "Twice", "Alone", "Suddenly"], answer: 3 },
        { q: "Every habit is maintained and increased by…", options: ["Willpower alone", "The corresponding actions", "Public promises", "Rest"], answer: 1 },
        { q: "What should 'whatever appears to be best' become?", options: ["A topic to study", "A secret", "A yearly goal", "An inviolable law"], answer: 3 },
      ],
    },
  },
  {
    month: 4,
    topic: "Renewal",
    monthLabel: "April — Renewal",
    philosophers: ["Henry David Thoreau"],
    session: {
      n: 1,
      title: "Live Deliberately",
      scriptures: [
        {
          ref: "Henry David Thoreau — Walden (1854)",
          text: "I went to the woods because I wished to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach, and not, when I came to die, discover that I had not lived.",
          context: "April's topic is renewal — not as a mood but as a decision about what is essential. Thoreau moved to a pond to run the experiment on himself.",
        },
        {
          ref: "Henry David Thoreau — Walden (1854)",
          text: "If one advances confidently in the direction of his dreams, and endeavors to live the life which he has imagined, he will meet with a success unexpected in common hours.",
          context: "Renewal has a direction, not just a feeling. Thoreau's promise is specific: move toward the imagined life and the ground shifts to meet you.",
        },
        {
          ref: "Henry David Thoreau — Walden (1854)",
          text: "The sun is but a morning star.",
          context: "The last line of Walden. Even the brightest thing you have seen so far is only the beginning of light — a sentence built for anyone starting over.",
        },
      ],
      teaching: [
        "Thoreau's experiment was subtraction: strip life to the essential facts and see what remains true. Renewal usually begins the same way — not by adding a program but by removing what buries you.",
        "Deliberately is the load-bearing word. Days default to reaction; a deliberate day has one or two chosen things at its center. Choose them the night before and the morning stops being an ambush.",
        "His promise about dreams is not magic; it is compounding. Advance confidently — small daily moves in one direction — and doors open in 'common hours,' the unremarkable Tuesdays where life actually happens.",
        "And when the past argues that your light is spent, Walden's closing line answers: the sun is but a morning star. This month, subtract one buried-alive thing and add one deliberate one.",
      ],
      prayer: "Today: one thing removed that buries me, one thing chosen that renews me.",
      closingPrayer: "This month I am running Thoreau's experiment at my own scale: fewer things, chosen deliberately, faced honestly. The direction matters more than the speed, and the common hours are where it compounds. Whatever has come before — the sun is but a morning star.",
      quiz: [
        { q: "Thoreau went to the woods to…", options: ["Live deliberately and front the essential facts of life", "Escape people forever", "Get rich from farming", "Write a bestseller"], answer: 0 },
        { q: "Advancing confidently toward the imagined life brings success…", options: ["Immediately", "Only with luck", "Unexpected in common hours", "Never"], answer: 2 },
        { q: "Walden's final line calls the sun…", options: ["A dying fire", "But a morning star", "The eye of heaven", "A distant lamp"], answer: 1 },
      ],
    },
  },
  {
    month: 5,
    topic: "Courage",
    monthLabel: "May — Courage",
    philosophers: ["Frederick Douglass", "William Ernest Henley"],
    session: {
      n: 1,
      title: "No Struggle, No Progress",
      scriptures: [
        {
          ref: "Frederick Douglass — West India Emancipation speech (1857)",
          text: "If there is no struggle, there is no progress. Those who profess to favor freedom, and yet deprecate agitation, are men who want crops without plowing up the ground.",
          context: "May's topic is courage as Douglass lived it — a man who taught himself to read in slavery and out-argued a nation. Struggle is not the enemy of progress; it is the price of it.",
        },
        {
          ref: "Frederick Douglass — West India Emancipation speech (1857)",
          text: "Power concedes nothing without a demand. It never did and it never will.",
          context: "What holds you also holds its ground until demanded of. That is true of institutions and, quietly, of habits: nothing yields to wishing.",
        },
        {
          ref: "William Ernest Henley — Invictus (1888)",
          text: "In the fell clutch of circumstance I have not winced nor cried aloud. Under the bludgeonings of chance my head is bloody, but unbowed. … I am the master of my fate: I am the captain of my soul.",
          context: "Henley wrote this from a hospital bed after losing a leg. The poem is not about winning; it is about remaining unbowed while losing badly — which is most of what courage is.",
        },
      ],
      teaching: [
        "Courage gets pictured as fearlessness; the record says otherwise. Douglass was afraid and acted anyway; Henley was maimed and wrote anyway. Courage is motion with the fear still on board.",
        "Douglass' farming image cuts through self-help fog: crops require plowed ground. If a change costs no discomfort, it probably was not the change that was needed.",
        "'Power concedes nothing without a demand' applies inward too. The habit, the dread, the avoidance — none of them retire voluntarily. The demand is daily and specific: today I do the hard, plain thing.",
        "Henley finishes the lesson: courage does not require an unbloodied head, only an unbowed one. This month, name the plowing you have been avoiding and put one blade in the ground.",
      ],
      prayer: "Afraid is allowed. Unbowed is the assignment.",
      closingPrayer: "This month I am learning courage from people who had reasons to quit and did not. Struggle is the price of progress, not a sign I am failing. What holds me concedes nothing without a demand — so today I demand one plain, hard thing of it, and keep my head unbowed.",
      quiz: [
        { q: "Douglass says those who want progress without struggle want…", options: ["Crops without plowing the ground", "Rain without clouds", "Wages without work", "Harvest without seed"], answer: 0 },
        { q: "According to Douglass, power concedes nothing without…", options: ["Time", "Permission", "Patience", "A demand"], answer: 3 },
        { q: "In Invictus, Henley's head is…", options: ["Bowed but clean", "Bloody, but unbowed", "Crowned", "Turned away"], answer: 1 },
      ],
    },
  },
  {
    month: 6,
    topic: "Stillness",
    monthLabel: "June — Stillness",
    philosophers: ["Marcus Aurelius", "Walt Whitman"],
    session: {
      n: 1,
      title: "The Retreat Into Yourself",
      scriptures: [
        {
          ref: "Marcus Aurelius — Meditations, Book IV (trans. George Long)",
          text: "Men seek retreats for themselves, houses in the country, sea-shores, and mountains. But this is altogether a mark of the most common sort of men, for it is in thy power whenever thou shalt choose to retire into thyself.",
          context: "June's topic is stillness you can reach without a vacation. The emperor with the least free time in the world kept a retreat behind his own forehead.",
        },
        {
          ref: "Marcus Aurelius — Meditations, Book VIII (trans. George Long)",
          text: "Do not disturb thyself by thinking of the whole of thy life. On every occasion ask thyself, What is there in this which is intolerable and past bearing?",
          context: "Racing thoughts bundle every future problem into one crushing weight. The practice is unbundling: this hour, examined alone, is almost always bearable.",
        },
        {
          ref: "Walt Whitman — Song of Myself (1855)",
          text: "I exist as I am, that is enough. If no other in the world be aware, I sit content; and if each and all be aware, I sit content.",
          context: "Stillness has a second enemy besides noise: the audience in your head. Whitman dismisses it in two lines — existence does not require witnesses.",
        },
      ],
      teaching: [
        "Aurelius' observation embarrasses every escape fantasy: the country house does not quiet the mind that comes along to it. The only retreat always in reach is the pause — breath, attention, a short return to yourself.",
        "His unbundling question is a tool, not poetry. Anxiety works wholesale; peace works retail. Ask of this single hour: what here is actually past bearing? The honest answer, hour by hour, is almost always nothing.",
        "Whitman closes the loop on self-consciousness. Much mental noise is performance review — imagining watchers and their verdicts. 'I exist as I am, that is enough' is the resignation letter from that job.",
        "This month, practice the two-minute retreat: stop, breathe slowly, ask the unbundling question, and return. No mountain required.",
      ],
      prayer: "This hour, taken alone, is bearable — and it is the only one I am in.",
      closingPrayer: "This month I am building the retreat I can reach from anywhere: the pause, the slow breath, the single hour examined honestly. The whole of life is not mine to carry today, and no audience is grading me. I exist as I am; for these two minutes, that is enough.",
      quiz: [
        { q: "Where does Marcus Aurelius say the real retreat is?", options: ["The sea-shore", "The mountains", "Within yourself", "The country house"], answer: 2 },
        { q: "His remedy for racing thoughts is to ask…", options: ["Who caused this?", "When will it end?", "What in this is intolerable and past bearing?", "Why me?"], answer: 2 },
        { q: "Whitman sits content whether or not…", options: ["Anyone in the world is aware of him", "He is wealthy", "The weather is fair", "His work is finished"], answer: 0 },
      ],
    },
  },
  {
    month: 8,
    topic: "Self-Trust",
    monthLabel: "August — Self-Trust",
    philosophers: ["Ralph Waldo Emerson", "Walt Whitman"],
    session: {
      n: 1,
      title: "The Iron String",
      scriptures: [
        {
          ref: "Ralph Waldo Emerson — Self-Reliance (1841)",
          text: "Trust thyself: every heart vibrates to that iron string.",
          context: "August's topic is rebuilding trust with yourself after it has been broken — the quiet damage every relapse and broken promise leaves behind.",
        },
        {
          ref: "Ralph Waldo Emerson — Self-Reliance (1841)",
          text: "Insist on yourself; never imitate. Nothing can bring you peace but yourself.",
          context: "Borrowed standards guarantee borrowed verdicts. Emerson's insistence is that your recovery, pace, and path do not need to look like anyone else's.",
        },
        {
          ref: "Walt Whitman — Song of Myself (1855)",
          text: "I am larger, better than I thought; I did not know I held so much goodness.",
          context: "Whitman wrote the counter-voice to shame. Self-trust begins with entertaining the possibility that the harshest account of you is not the accurate one.",
        },
      ],
      teaching: [
        "Self-trust is not self-esteem talk; it is a ledger. Every kept promise to yourself is a deposit, every broken one a withdrawal. After enough withdrawals the account feels closed — but ledgers reopen the same way they emptied: one small deposit at a time.",
        "Emerson's advice is to shrink the comparison radius. Imitating someone else's recovery, timeline, or personality means grading yourself with a borrowed rubric. Insist on your own.",
        "Whitman supplies the evidence problem: most people systematically underestimate their own goodness because failure is memorable and decency is quiet. 'I did not know I held so much goodness' is a finding, not a boast.",
        "This month, make yourself one micro-promise a day — so small it is unbreakable — and keep it. Watch the ledger change.",
      ],
      prayer: "One small promise to myself today, kept in full.",
      closingPrayer: "This month I am rebuilding an account I thought was closed. Trust returns the way it left: one kept promise at a time, graded by my own rubric and nobody else's. I may be larger and better than I thought — this month I collect the evidence.",
      quiz: [
        { q: "Emerson says every heart vibrates to…", options: ["A silver bell", "The crowd's applause", "A distant drum", "That iron string"], answer: 3 },
        { q: "According to Emerson, peace can be brought to you by…", options: ["Success", "Nothing but yourself", "Others' approval", "Good fortune"], answer: 1 },
        { q: "Whitman discovered he held more of what than he thought?", options: ["Talent", "Memory", "Ambition", "Goodness"], answer: 3 },
      ],
    },
  },
  {
    month: 9,
    topic: "Grief & Loss",
    monthLabel: "September — Grief & Loss",
    philosophers: ["Seneca", "Henry Wadsworth Longfellow"],
    session: {
      n: 1,
      title: "Weep, But Do Not Wail Forever",
      scriptures: [
        {
          ref: "Seneca — Letters to Lucilius, LXIII (trans. Richard Gummere)",
          text: "Let not the eyes be dry when we have lost a friend, nor let them overflow. We may weep, but we must not wail. Let us see to it that the recollection of those whom we have lost becomes a pleasant memory to us.",
          context: "September's topic is grief without instructions to 'get over it.' Seneca — writing to a grieving friend — permits the tears and points past them.",
        },
        {
          ref: "Seneca — Letters to Lucilius, LXIII (trans. Richard Gummere)",
          text: "He whom you loved is not lost outright; the greater part of him remains — the time you had, the things he said, all that he was to you. What was given is not taken away.",
          context: "Grief counts only what is missing. Seneca's arithmetic includes what cannot be repossessed: everything the years already gave.",
        },
        {
          ref: "Henry Wadsworth Longfellow — A Psalm of Life (1838)",
          text: "Let us, then, be up and doing, with a heart for any fate; still achieving, still pursuing, learn to labor and to wait.",
          context: "Longfellow wrote this after losing his young wife. It is not denial; it is the discovery that motion and mourning can share the same body.",
        },
      ],
      teaching: [
        "Seneca's letter to Lucilius is startlingly modern: cry, and do not let anyone shame the crying — but do not build a residence inside it. Both the dry eye and the drowning one lose the person twice.",
        "His accounting move is the useful one. Loss subtracts a future, but it cannot subtract a past: the conversations happened, the love was real, the years are yours. Grief that only counts the missing column is doing half the math.",
        "Longfellow, who knew loss young, offers the other half of the practice: labor and wait. Not 'move on' — move while it hurts, at whatever pace the day allows, and let time do its slow share.",
        "If this month finds you grieving, the assignment is small: one pleasant recollection allowed in daily, on purpose, alongside the tears it may bring.",
      ],
      prayer: "What was given is not taken away.",
      closingPrayer: "This month I am letting grief keep honest books: the missing counted, and the given counted too. I may weep without apology and move without guilt — labor and wait, both at once. What the years gave me is mine, and no loss can repossess it.",
      quiz: [
        { q: "Seneca's counsel on tears is…", options: ["Weep, but do not wail", "Never weep", "Weep only alone", "Weep once, then forget"], answer: 0 },
        { q: "What does Seneca say cannot be taken away?", options: ["Future plans", "Property", "What was already given — the time and love you had", "Health"], answer: 2 },
        { q: "Longfellow's twin instruction is to learn to…", options: ["Forget and move on", "Labor and to wait", "Watch and pray", "Win and rest"], answer: 1 },
      ],
    },
  },
  {
    month: 10,
    topic: "Adversity",
    monthLabel: "October — Adversity",
    philosophers: ["Marcus Aurelius", "Rudyard Kipling"],
    session: {
      n: 1,
      title: "The Obstacle Helps Us on the Road",
      scriptures: [
        {
          ref: "Marcus Aurelius — Meditations, Book V (trans. George Long)",
          text: "The mind converts and turns to its own purpose every hindrance to its activity; and that which is an obstacle on the road helps us on this road.",
          context: "October's topic is what to do with what you cannot avoid. Aurelius' claim is radical: the obstacle is not blocking the training — it is the training.",
        },
        {
          ref: "Rudyard Kipling — If— (1910)",
          text: "If you can meet with Triumph and Disaster and treat those two impostors just the same … yours is the Earth and everything that's in it.",
          context: "Kipling names both extremes impostors. The bad day lies about being permanent; the good day lies about being permanent too.",
        },
        {
          ref: "Rudyard Kipling — If— (1910)",
          text: "If you can watch the things you gave your life to, broken, and stoop and build 'em up with worn-out tools…",
          context: "The hardest line in the poem is a rebuild instruction: the tools are worn, the work is stooped, and it counts anyway.",
        },
      ],
      teaching: [
        "Aurelius wrote his obstacle line while running an empire through plague and war — this is field-tested, not decorative. The mind's one superpower is conversion: every blocked road becomes material for patience, ingenuity, or honesty.",
        "Kipling's 'two impostors' guard against both ditches. Disaster says you are ruined; triumph says you are finished growing. Treating both as passing visitors keeps you walking.",
        "The stooping verse is for anyone who has watched their own work — sobriety, marriage, savings, health — broken. The poem does not promise new tools. Worn-out tools, stooped posture, rebuilt anyway.",
        "This month, take your current obstacle and ask Aurelius' question of it: what is this specifically training? Then let it.",
      ],
      prayer: "This obstacle is the exercise, not the interruption.",
      closingPrayer: "This month I am practicing conversion: every hindrance turned to some purpose, every impostor — triumph or disaster — shown the door by morning. If what I built lies broken, I stoop and build again with the tools I have. The obstacle on the road is helping me on this road.",
      quiz: [
        { q: "Aurelius says the obstacle on the road…", options: ["Helps us on this road", "Ends the journey", "Should be ignored", "Proves the road was wrong"], answer: 0 },
        { q: "Kipling calls Triumph and Disaster…", options: ["Two teachers", "Two judges", "Two seasons", "Two impostors"], answer: 3 },
        { q: "What tools does Kipling's rebuilder use?", options: ["Brand new ones", "Worn-out tools", "Borrowed ones", "No tools"], answer: 1 },
      ],
    },
  },
  {
    month: 11,
    topic: "Gratitude",
    monthLabel: "November — Gratitude",
    philosophers: ["Seneca", "Marcus Aurelius"],
    session: {
      n: 1,
      title: "Counting What Is Already Yours",
      scriptures: [
        {
          ref: "Seneca — Letters to Lucilius, XV (trans. Richard Gummere)",
          text: "Do you ask what is the proper limit to wealth? It is, first, to have what is necessary, and second, to have what is enough.",
          context: "November's topic is gratitude as arithmetic. Seneca — one of Rome's richest men — kept auditing the difference between necessary, enough, and endless.",
        },
        {
          ref: "Marcus Aurelius — Meditations, Book VII (trans. George Long)",
          text: "Think not so much of what thou hast not as of what thou hast: but of the things which thou hast, select the best, and then reflect how eagerly they would have been sought if thou hadst them not.",
          context: "The emperor's gratitude exercise is specific: pick your best things and imagine wanting them. It reverses the mind's default of only wanting what is missing.",
        },
        {
          ref: "Walt Whitman — Song of Myself (1855)",
          text: "I exist as I am, that is enough.",
          context: "Gratitude eventually reaches the self: not everything about you is a renovation project. Some of it is already enough.",
        },
      ],
      teaching: [
        "The craving mind and the ungrateful mind are the same mind: both stare exclusively at what is absent. Every philosopher in this module attacks that stare from a different angle.",
        "Aurelius' exercise deserves actual practice, not admiration. Tonight: name three things you have, and imagine the version of you that lost them begging to have them back. Warmth returns to ordinary things fast.",
        "Seneca's audit — necessary, enough, endless — applies beyond money: approval, achievement, even recovery milestones can turn into endless. 'Enough' is a decision, not an amount.",
        "This month, keep the shortest journal there is: one line, nightly, of something that would be eagerly sought if it were gone.",
      ],
      prayer: "Tonight, one line: something I would beg to have back if it were gone.",
      closingPrayer: "This month I am retraining the stare — away from the missing column, toward what is already in my hands. Necessary, then enough; and enough is a decision I can make tonight. What I have, I will hold like something I once begged for.",
      quiz: [
        { q: "Seneca's two-part limit to wealth is having what is necessary and what is…", options: ["Impressive", "Inherited", "Enough", "Hidden"], answer: 2 },
        { q: "Aurelius says to select your best things and reflect on…", options: ["Their price", "Who gave them", "How eagerly they'd be sought if you lacked them", "How long they'll last"], answer: 2 },
        { q: "The suggested nightly practice is…", options: ["One line of gratitude", "An hour of review", "A list of failures", "A letter to the past"], answer: 0 },
      ],
    },
  },
  {
    month: 12,
    topic: "Hope & Endurance",
    monthLabel: "December — Hope & Endurance",
    philosophers: ["Emily Dickinson", "Henry Wadsworth Longfellow"],
    session: {
      n: 1,
      title: "The Thing With Feathers",
      scriptures: [
        {
          ref: "Emily Dickinson — 'Hope' is the thing with feathers (c. 1861)",
          text: "'Hope' is the thing with feathers that perches in the soul, and sings the tune without the words, and never stops at all.",
          context: "December's topic is hope in the dark end of the year. Dickinson's hope is not loud optimism; it is a small persistent bird that stays through the storm.",
        },
        {
          ref: "Emily Dickinson — 'Hope' is the thing with feathers (c. 1861)",
          text: "And sweetest in the gale is heard; and sore must be the storm that could abash the little bird that kept so many warm.",
          context: "The bird sings loudest precisely when the weather is worst. Hope's strange mechanics: it is most audible in the gale.",
        },
        {
          ref: "Henry Wadsworth Longfellow — A Psalm of Life (1838)",
          text: "Lives of great men all remind us we can make our lives sublime, and, departing, leave behind us footprints on the sands of time.",
          context: "Endurance is not just surviving the dark month; it leaves a track someone else can follow. Longfellow widens hope from a feeling to a legacy.",
        },
      ],
      teaching: [
        "December is the hardest month for many people here — short days, long memories, loud expectations. Dickinson's image is built for it: hope does not require your effort or even your words; it perches and sings on its own.",
        "Notice her forecast: sweetest in the gale. The testimony of most people who endure a terrible season is exactly this — some small stubborn tune kept going underneath, unearned.",
        "Longfellow converts endurance into direction. Making it through the dark leaves footprints, and someone behind you — a child, a friend, a stranger in a meeting — will walk easier for the track you left.",
        "This month's assignment is gentle: do not manufacture cheerfulness. Just refuse to evict the bird — keep the routines, keep the people, keep the one line of gratitude — and let it sing through the gale.",
      ],
      prayer: "I will not evict the bird. The routines stay, the people stay, the tune stays.",
      closingPrayer: "This month I am asking less of myself, not more: not manufactured cheer, only endurance with the door left open. Hope perches and sings without my help, sweetest in the gale. I will keep walking, and the footprints will be there for whoever comes behind me.",
      quiz: [
        { q: "Dickinson's hope perches in the soul and…", options: ["Waits silently", "Demands feeding", "Flies away in storms", "Sings the tune without the words"], answer: 3 },
        { q: "When is the bird's song sweetest?", options: ["In the morning", "In the gale", "In springtime", "When praised"], answer: 1 },
        { q: "Longfellow says enduring lives leave behind…", options: ["Monuments", "Fortunes", "Regrets", "Footprints on the sands of time"], answer: 3 },
      ],
    },
  },
];

export function currentMonthlyWisdom(d: Date = new Date()): MonthlyWisdom {
  const m = d.getMonth() + 1;
  return (
    MONTHLY_WISDOM.find((x) => x.month === m) ??
    MONTHLY_WISDOM.find((x) => x.month === 7)!
  );
}

/** Leaderboard/period key, namespaced so it never collides with the
 * Catholic module's periods in the shared quiz tables. */
export function wisdomPeriodKey(d: Date = new Date()): string {
  return `wisdom-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
