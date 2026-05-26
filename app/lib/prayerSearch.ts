/**
 * Prayer search — keyword + tag matching with synonym expansion.
 *
 * Pure function. Takes a user's plain-language query and returns the
 * top-ranked prayers from the static library. No LLM call, no network,
 * no cost per query.
 *
 * Scoring weights (per match):
 *   - tag exact match               : 8
 *   - tag substring match           : 4
 *   - when_to_use match             : 3
 *   - title match                   : 5
 *   - full_text match               : 1
 *   - category match                : 2
 *
 * Synonyms expand the query before scoring. e.g. user types "I am
 * anxious about a job interview" → tokens [anxious, job, interview]
 * expand to include [anxiety, worry, fear, nervous, work, employment,
 * meeting]. So a prayer tagged 'anxiety' OR 'work' hits.
 *
 * Returns the matches sorted by score descending, capped at `limit`.
 */

import { PRAYERS, type Prayer } from "./prayers";

const STOPWORDS = new Set([
  "i", "am", "a", "an", "the", "of", "to", "for", "in", "on", "at",
  "and", "or", "but", "is", "are", "was", "were", "be", "been", "being",
  "with", "about", "this", "that", "these", "those", "have", "has",
  "had", "my", "me", "we", "our", "us", "they", "them", "their",
  "do", "does", "did", "you", "your", "it", "its", "as", "from",
  "by", "if", "so", "not", "no", "yes", "what", "when", "where",
  "why", "how", "can", "could", "would", "should", "will",
]);

/**
 * Maps a single token to a set of related tokens (including itself).
 * Used for query expansion so users can type natural language and still
 * match the prayer tags we wrote.
 */
const SYNONYMS: Record<string, string[]> = {
  anxious: ["anxiety", "worry", "fear", "nervous", "panic"],
  anxiety: ["anxious", "worry", "fear", "nervous", "panic"],
  worried: ["worry", "anxious", "anxiety", "fear"],
  worry: ["anxious", "anxiety", "fear", "nervous"],
  scared: ["fear", "terror", "afraid", "anxious"],
  afraid: ["fear", "terror", "scared", "anxious"],
  fear: ["afraid", "scared", "terror", "anxious"],
  panic: ["anxiety", "anxious", "fear", "racing-thoughts"],

  angry: ["anger", "rage", "furious"],
  anger: ["angry", "rage", "furious", "patience"],
  rage: ["anger", "angry", "furious"],
  furious: ["anger", "rage"],

  sad: ["grief", "sorrow", "depression", "darkness", "mourning"],
  grief: ["mourning", "loss", "death", "bereavement", "sad"],
  grieving: ["grief", "mourning", "loss", "death", "bereavement"],
  mourning: ["grief", "loss", "death", "bereavement"],
  loss: ["grief", "death", "bereavement", "mourning"],
  depressed: ["depression", "sad", "darkness", "mental-illness"],
  depression: ["depressed", "sad", "darkness", "mental-illness"],

  alone: ["loneliness", "isolation", "abandoned", "abandonment"],
  lonely: ["loneliness", "alone", "isolation"],
  loneliness: ["alone", "isolation", "abandonment"],
  isolated: ["loneliness", "alone", "isolation"],
  abandoned: ["abandonment", "alone", "loneliness"],

  temptation: ["tempted", "urge", "fall", "lust", "compulsion"],
  tempted: ["temptation", "urge", "fall"],
  urge: ["temptation", "compulsion", "tempted"],
  compulsion: ["urge", "temptation", "addiction"],
  porn: ["pornography", "lust", "temptation"],
  pornography: ["porn", "lust", "temptation"],
  lust: ["pornography", "porn", "temptation"],

  drinking: ["alcohol", "addiction", "drunk"],
  drunk: ["alcohol", "drinking", "addiction"],
  alcohol: ["drinking", "drunk", "addiction", "recovery"],
  drugs: ["addiction", "substance", "recovery"],
  addicted: ["addiction", "recovery", "substance"],
  addiction: ["addicted", "recovery", "substance", "alcohol", "drugs"],
  recovery: ["addiction", "addicted", "sober", "12-step"],

  sick: ["illness", "disease", "hospital", "healing", "pain"],
  ill: ["sick", "illness", "disease", "hospital", "healing"],
  illness: ["sick", "ill", "disease", "hospital", "healing"],
  cancer: ["illness", "disease", "sick", "healing", "suffering"],
  hospital: ["sick", "illness", "healing", "suffering"],
  pain: ["suffering", "sick", "illness", "healing"],
  suffering: ["pain", "sick", "illness", "trial"],

  dying: ["death", "deathbed", "hospice", "final-hour"],
  death: ["dying", "deceased", "departed", "grief"],
  dead: ["death", "deceased", "departed", "grief"],
  funeral: ["death", "grief", "deceased", "departed", "mourning"],

  forgive: ["forgiveness", "pardon", "mercy"],
  forgiveness: ["forgive", "pardon", "mercy"],
  hurt: ["wound", "betrayal", "abuse", "pain"],
  wound: ["hurt", "betrayal", "pain"],
  betrayed: ["betrayal", "hurt", "wound"],

  job: ["work", "employment", "career"],
  work: ["job", "employment", "career", "workers"],
  unemployed: ["work", "job", "employment"],
  interview: ["work", "job", "anxiety", "discernment"],

  decision: ["discernment", "choice", "guidance"],
  decide: ["decision", "discernment", "choice", "guidance"],
  choose: ["decision", "choice", "discernment"],
  guidance: ["discernment", "decision", "spirit", "direction"],
  direction: ["guidance", "discernment", "decision"],

  family: ["household", "parents", "children", "siblings"],
  parent: ["father", "mother", "family", "children"],
  child: ["children", "family", "parent"],
  children: ["family", "parent", "child"],
  mother: ["mary", "marian", "parent", "family"],
  father: ["joseph", "parent", "family"],
  spouse: ["marriage", "husband", "wife", "family"],
  husband: ["marriage", "spouse", "family"],
  wife: ["marriage", "spouse", "family"],
  marriage: ["spouse", "husband", "wife", "family"],
  divorce: ["marriage", "spouse", "family", "grief"],

  lost: ["lost-things", "missing", "find", "anthony"],
  missing: ["lost", "lost-things", "find"],

  hopeless: ["despair", "impossible", "jude", "last-resort"],
  despair: ["hopeless", "darkness", "impossible"],
  impossible: ["hopeless", "despair", "jude", "rita"],
  desperate: ["urgent", "crisis", "help", "hopeless"],

  mental: ["mental-illness", "mind", "psychiatric"],
  insomnia: ["night", "anxiety", "rumination", "sleep"],
  sleep: ["night", "compline", "rest", "before-sleep"],
  night: ["insomnia", "compline", "sleep", "before-sleep"],

  morning: ["start-of-day", "daily"],
  evening: ["end-of-day", "compline", "daily"],

  thankful: ["gratitude", "thanksgiving", "praise"],
  grateful: ["gratitude", "thanksgiving", "praise"],
  thanks: ["gratitude", "thanksgiving", "praise"],

  enemy: ["enemies", "hatred", "persecution", "betrayal"],
  enemies: ["enemy", "hatred", "persecution"],
  hate: ["hatred", "enemy", "anger"],
  hatred: ["enemy", "hate", "anger"],

  guilt: ["shame", "sin", "contrition", "confession"],
  shame: ["guilt", "sin", "contrition", "unworthy"],
  unworthy: ["shame", "guilt", "mercy", "second-chance"],

  pope: ["church", "bishop", "clergy", "ecclesial"],
  priest: ["church", "clergy", "ecclesial", "confession"],
  church: ["pope", "bishop", "priest", "clergy", "ecclesial"],

  patient: ["patience", "wait", "anger"],
  patience: ["patient", "wait", "anger", "long-suffering"],
};

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function expand(tokens: string[]): Set<string> {
  const set = new Set<string>();
  for (const t of tokens) {
    set.add(t);
    const syns = SYNONYMS[t];
    if (syns) for (const s of syns) set.add(s);
  }
  return set;
}

function tokenInString(token: string, text: string): boolean {
  const lower = text.toLowerCase();
  // Direct substring is generous enough for the small library.
  return lower.includes(token);
}

function scorePrayer(prayer: Prayer, tokens: Set<string>): number {
  let score = 0;
  const tags = prayer.tags.map((t) => t.toLowerCase());

  for (const token of tokens) {
    if (tags.includes(token)) {
      score += 8;
    } else if (tags.some((tag) => tag.includes(token) || token.includes(tag))) {
      score += 4;
    }
    if (tokenInString(token, prayer.when_to_use)) score += 3;
    if (tokenInString(token, prayer.title)) score += 5;
    if (tokenInString(token, prayer.full_text)) score += 1;
    if (token === prayer.category) score += 2;
  }

  return score;
}

export type PrayerSearchResult = {
  prayer: Prayer;
  score: number;
};

export function searchPrayers(
  query: string,
  limit: number = 12
): PrayerSearchResult[] {
  const trimmed = query.trim();
  if (trimmed.length === 0) return [];

  const tokens = expand(tokenize(trimmed));
  if (tokens.size === 0) return [];

  const scored: PrayerSearchResult[] = PRAYERS
    .map((p) => ({ prayer: p, score: scorePrayer(p, tokens) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}
