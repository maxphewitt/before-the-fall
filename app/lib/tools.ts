/**
 * Single source of truth for the six Tier 1 urge-control / distress-tolerance
 * exercises rendered at /tools.
 *
 * Content lifted directly from the matching atomic notes in the Vault:
 *   - 04 - Clinical & Therapeutic/Urge Surfing.md
 *   - 04 - Clinical & Therapeutic/5-4-3-2-1 Grounding.md
 *   - 04 - Clinical & Therapeutic/Box Breathing.md
 *   - 04 - Clinical & Therapeutic/CBT Thought Record.md
 *   - 04 - Clinical & Therapeutic/TIPP — Distress Tolerance.md
 *   - 04 - Clinical & Therapeutic/STOP Skill.md
 *
 * All citations are peer-reviewed per the Evidence Rule. All exercises
 * are DRAFT v1 — closed beta may see this content; PUBLIC LAUNCH MAY NOT,
 * per the Launch Gates, until the clinical advisor signs each one off
 * (CLINICALLY-REVIEWED tag). When a clinician edit lands in the Vault,
 * mirror it here.
 */

export type ExerciseStep = {
  heading?: string;
  body: string;
};

export type Exercise = {
  slug: string;
  name: string;
  tagline: string;
  whenToUse: string;
  estimatedTime?: string;
  instructionsHeader: string;
  instructions: ExerciseStep[];
  instructionsNote?: string;
  mechanism: string;
  source: string;
  related: string[]; // other slugs
};

export const EXERCISES: Exercise[] = [
  {
    slug: "stop",
    name: "STOP",
    tagline: "The half-second between urge and action.",
    whenToUse:
      "In the half-second between an urge and an action. When you can feel yourself about to do the thing.",
    estimatedTime: "30 seconds to 2 minutes.",
    instructionsHeader: "The acronym",
    instructions: [
      { heading: "S — Stop", body: "Freeze. Don't move. Don't reach. Don't speak." },
      { heading: "T — Take a step back", body: "Mentally or literally. A foot of distance from whatever's in front of you." },
      { heading: "O — Observe", body: "What's happening, inside and outside. No judgment, no action." },
      { heading: "P — Proceed mindfully", body: "Next move on purpose, not on autopilot." },
    ],
    mechanism:
      "The deliberate insertion of a gap between stimulus and response. The urge wants action inside the half-second. STOP buys the time to choose differently. Often, on its own, the difference between a relapse and a near miss.",
    source:
      "Linehan, M. M. (2014). DBT Skills Training Manual, Second Edition. Guilford Press. STOP is a crisis-survival skill within the DBT distress-tolerance module.",
    related: ["tipp", "urge-surfing"],
  },
  {
    slug: "urge-surfing",
    name: "Urge Surfing",
    tagline: "Ride the wave. It crests and falls.",
    whenToUse:
      "When you feel an urge to do something you don't want to do — a compulsion, a craving, the itch you know will hurt later.",
    estimatedTime: "5–15 minutes. Long enough for the urge to crest and fall.",
    instructionsHeader: "How it works",
    instructions: [
      {
        heading: "Notice",
        body: "Name the urge without acting on it. Where do you feel it in the body? Tightness, heat, restlessness?",
      },
      {
        heading: "Stay with it",
        body: "Don't fight it, don't feed it. Watch it like a wave from the shore — it's rising.",
      },
      {
        heading: "Wait for the crest",
        body: "Urges peak. The intensity at minute three is not the intensity at minute fifteen.",
      },
      {
        heading: "Watch it fall",
        body: "On the other side of the peak, the pull weakens on its own. You don't have to do anything to make it leave.",
      },
    ],
    mechanism:
      "Research from Marlatt and Gordon found that urges follow a predictable rise-and-fall arc, generally peaking within 20–30 minutes. The instinct to act is strongest at the peak; delaying action through the peak reliably decreases intensity. Repeated practice strengthens the learning, reducing the frequency and intensity of urges over time.",
    source:
      "Marlatt, G. A., & Gordon, J. R. (1985). Relapse Prevention: Maintenance Strategies in the Treatment of Addictive Behaviors. Guilford Press. Updated in Marlatt & Donovan (2005), 2nd ed.",
    related: ["stop", "tipp"],
  },
  {
    slug: "box-breathing",
    name: "Box Breathing",
    tagline: "Four counts in, four held, four out, four held.",
    whenToUse:
      "Heart racing, breath shallow, panic response building. Powerful in the first 90 seconds of acute stress.",
    estimatedTime: "1–2 minutes for four rounds.",
    instructionsHeader: "The rhythm",
    instructions: [
      { heading: "In", body: "Breathe in for 4 counts." },
      { heading: "Hold", body: "Hold for 4 counts." },
      { heading: "Out", body: "Breathe out for 4 counts." },
      { heading: "Hold", body: "Hold for 4 counts." },
    ],
    instructionsNote:
      "Do four rounds. If four counts feels too long, start with three or two. Rhythm matters more than the number.",
    mechanism:
      "Slow, paced breathing activates the parasympathetic branch of the autonomic nervous system, lowering heart rate and reducing physiological symptoms of acute stress. The equal-count structure interrupts panic spirals while physiology shifts.",
    source:
      "Codified for clinical use by Mark Divine; studied in physiological-stress research; endorsed by the American Institute of Stress; used in U.S. military performance training. Mechanism aligns with vagal-tone research from Porges (Polyvagal Theory, 2011).",
    related: ["grounding", "tipp"],
  },
  {
    slug: "grounding",
    name: "5-4-3-2-1 Grounding",
    tagline: "Pull yourself back into the present, one sense at a time.",
    whenToUse:
      "When the mind is racing, when a memory or thought has pulled you out of the present, when dissociation is starting.",
    estimatedTime: "2–4 minutes.",
    instructionsHeader: "The script",
    instructions: [
      { heading: "5", body: "Find five things you can SEE." },
      { heading: "4", body: "Find four things you can FEEL." },
      { heading: "3", body: "Find three things you can HEAR." },
      { heading: "2", body: "Find two things you can SMELL." },
      { heading: "1", body: "Find one thing you can TASTE." },
    ],
    mechanism:
      "Grounding redirects attention to present-moment sensory input, which can help interrupt anxious or intrusive thought loops. It's commonly used in the early stages of dissociation, panic, or an intrusive memory. It's a widely taught coping skill rather than a clinically validated standalone protocol — and if it isn't helping in the moment, it's completely fine to stop and try something else.",
    source:
      "A widely used variant of sensory grounding from trauma-informed practice. The sensory-questioning approach is published by the U.S. Department of Veterans Affairs' National Center for PTSD; the specific 5-4-3-2-1 count is a clinical mnemonic rather than the product of a single primary study.",
    related: ["box-breathing", "tipp"],
  },
  {
    slug: "tipp",
    name: "TIPP",
    tagline: "Physical reset when thinking-based tools feel impossible.",
    whenToUse:
      "When emotional intensity is so high that thinking-based exercises (like the Thought Record) feel impossible. TIPP is a physical reset, not a cognitive one.",
    estimatedTime: "2–5 minutes.",
    instructionsHeader: "The four tools",
    instructions: [
      {
        heading: "T — Temperature",
        body: "Splash cold water on your face. Or hold ice in each hand for 30 seconds. Or press a cold pack against your forehead or cheekbones. Triggers the mammalian dive reflex, which slows the heart rate.",
      },
      {
        heading: "I — Intense exercise",
        body: "30–60 seconds of all-out movement. Burpees, stairs, jumping jacks, push-ups until you can't. Spends the adrenaline.",
      },
      {
        heading: "P — Paced breathing",
        body: "Slow your exhale until it is twice as long as the inhale. Inhale four, exhale eight. Two minutes.",
      },
      {
        heading: "P — Paired muscle relaxation",
        body: "On each exhale, deliberately release a muscle group. Hands, shoulders, jaw. Notice the difference between tense and released.",
      },
    ],
    mechanism:
      "TIPP works on physiology before psychology. In acute arousal, no cognitive reframing will land. Directly manipulating temperature, exertion, and breathing lowers physiological intensity to a level where higher-order tools become accessible.",
    source:
      "Linehan, M. M. (2014). DBT Skills Training Manual, Second Edition. Guilford Press. TIPP is the standard distress-tolerance acronym in Dialectical Behavior Therapy.",
    related: ["stop", "thought-record", "box-breathing"],
  },
  {
    slug: "thought-record",
    name: "CBT Thought Record",
    tagline: "Examine the thought instead of obeying it.",
    whenToUse:
      "When a thought is hooking you — \"I'm a failure,\" \"This will never get better,\" \"I always do this\" — and shifting your mood, feeding the urge.",
    estimatedTime: "10–20 minutes the first time. Faster with practice.",
    instructionsHeader: "The seven columns",
    instructions: [
      { heading: "1. Situation", body: "What happened? Where, who, what?" },
      { heading: "2. Automatic thought", body: "What went through your mind, word for word?" },
      { heading: "3. Emotion", body: "What was felt? Rate it 0–100." },
      { heading: "4. Evidence FOR the thought", body: "Concrete facts that support it." },
      { heading: "5. Evidence AGAINST the thought", body: "Concrete facts that contradict it." },
      { heading: "6. Balanced thought", body: "A more accurate version. Not a positive lie — a truer story." },
      { heading: "7. Re-rate the emotion", body: "0–100. Most people see a 20–40 point drop just from doing this." },
    ],
    mechanism:
      "The hook of an automatic thought is its assumed truth. Forcing evaluation against evidence — instead of accepting the thought as fact — is the core mechanism of CBT. Sustained practice changes patterns, not just one moment's emotion.",
    source:
      "Beck, A. T. (1979). Cognitive Therapy of Depression. Guilford. Burns, D. (1980). Feeling Good: The New Mood Therapy. Updated method in Beck Institute training materials, 2020. The seven-column thought-record format is the clinical standard.",
    related: ["tipp", "stop"],
  },
];

export function getExerciseBySlug(slug: string): Exercise | undefined {
  return EXERCISES.find((e) => e.slug === slug);
}

/**
 * Per-tool research citations, surfaced as "Research behind this method"
 * on each tool page. Every DOI/link here was verified against publisher
 * records (CrossRef) and confirmed to resolve (2026-06-16). Where a tool
 * rests on a foundational textbook rather than a single trial, the book
 * is cited without implying a peer-reviewed efficacy trial exists for
 * that specific acronym. See docs/TOOL-RESEARCH-VERIFICATION.md.
 */
export type ResearchRef = {
  citation: string;
  url?: string;
  note: string;
};

export const TOOL_RESEARCH: Record<string, ResearchRef[]> = {
  stop: [
    {
      citation: "Linehan, M. M. (2015). DBT Skills Training Manual (2nd ed.). Guilford Press.",
      url: "https://www.guilford.com/books/DBT-Skills-Training-Manual/Marsha-Linehan/9781462516995",
      note: "STOP is a crisis-survival skill within the DBT distress-tolerance module.",
    },
  ],
  "urge-surfing": [
    {
      citation:
        "Bowen, S., et al. (2009). Mindfulness-Based Relapse Prevention for Substance Use Disorders: A Pilot Efficacy Trial. Substance Abuse, 30(4), 295–305.",
      url: "https://doi.org/10.1080/08897070903250084",
      note: "First RCT of MBRP; urge surfing changed the relationship to cravings and reduced relapse vs. standard care.",
    },
    {
      citation:
        "Marlatt, G. A., & Donovan, D. M. (Eds.). (2005). Relapse Prevention (2nd ed.). Guilford Press.",
      url: "https://www.guilford.com/books/Relapse-Prevention/Marlatt-Donovan/9781593856410",
      note: "Foundational relapse-prevention text where urge surfing originates.",
    },
  ],
  "box-breathing": [
    {
      citation:
        "Zaccaro, A., et al. (2018). How breath-control can change your life: A systematic review on psycho-physiological correlates of slow breathing. Frontiers in Human Neuroscience, 12, 353.",
      url: "https://doi.org/10.3389/fnhum.2018.00353",
      note: "Systematic review: slow, paced breathing shifts the autonomic system toward calm (vagal tone).",
    },
    {
      citation:
        "Ma, X., et al. (2017). The effect of diaphragmatic breathing on attention, negative affect and stress in healthy adults. Frontiers in Psychology, 8, 874.",
      url: "https://doi.org/10.3389/fpsyg.2017.00874",
      note: "Randomized trial: slow diaphragmatic breathing lowered cortisol and negative affect.",
    },
  ],
  grounding: [
    {
      citation:
        "U.S. Department of Veterans Affairs, National Center for PTSD — grounding guidance ('Strategies: PTSD in Others').",
      url: "https://www.ptsd.va.gov/professional/treat/care/toolkits/police/managingStrategies.asp",
      note: "Authoritative clinical description of sensory grounding: redirecting attention to the present to override intrusive internal stimuli. Also notes grounding can be counterproductive for some — stop if distress worsens.",
    },
    {
      citation:
        "Brand, B. L., et al. (2025). A randomized controlled trial assists individuals with complex trauma and dissociation in Finding Solid Ground. Psychological Trauma (APA).",
      url: "https://pubmed.ncbi.nlm.nih.gov/40014495/",
      note: "RCT support for a program teaching grounding and emotion-regulation skills in trauma-related dissociation — at the program level, not for 5-4-3-2-1 used alone or as a one-off.",
    },
    {
      citation:
        "Wolpe, J. (1969). The Practice of Behavior Therapy. (Subjective Units of Distress Scale.)",
      url: "https://en.wikipedia.org/wiki/Subjective_units_of_distress_scale",
      note: "Origin of the 0–10 distress rating behind the optional before/after check — a self-monitoring aid, not a clinical outcome measure.",
    },
  ],
  tipp: [
    {
      citation: "Linehan, M. M. (2015). DBT Skills Training Manual (2nd ed.). Guilford Press.",
      url: "https://www.guilford.com/books/DBT-Skills-Training-Manual/Marsha-Linehan/9781462516995",
      note: "TIPP (Temperature, Intense exercise, Paced breathing, Paired muscle relaxation) is the DBT distress-tolerance skill set for high arousal.",
    },
    {
      citation:
        "Zaccaro, A., et al. (2018). Slow breathing and psycho-physiological state. Frontiers in Human Neuroscience, 12, 353.",
      url: "https://doi.org/10.3389/fnhum.2018.00353",
      note: "Evidence base for the paced-breathing component of TIPP.",
    },
  ],
  "thought-record": [
    {
      citation: "Beck, A. T. (1979). Cognitive Therapy of Depression. Guilford Press.",
      note: "Origin of the cognitive-restructuring method the thought record operationalizes.",
    },
    {
      citation: "Burns, D. D. (1980). Feeling Good: The New Mood Therapy. William Morrow.",
      note: "Popularized the daily thought record / seven-column format in self-help practice.",
    },
  ],
};

export function getResearchForSlug(slug: string): ResearchRef[] {
  return TOOL_RESEARCH[slug] ?? [];
}
