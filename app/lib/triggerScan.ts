import {
  PATTERNS,
  type TriggerCategory,
  type Severity,
  maxSeverity,
} from "./triggerPatterns";

/**
 * Result of scanning a journal entry. Plaintext is NOT included — only
 * the category labels and severity. The matched plaintext stays in the
 * encrypted entry; an admin must decrypt-on-view to see it.
 */
export type ScanResult = {
  hit: boolean;
  matchCount: number;
  categories: TriggerCategory[];
  severity: Severity;
};

const EMPTY_RESULT: ScanResult = {
  hit: false,
  matchCount: 0,
  categories: [],
  severity: "low",
};

/**
 * Normalize the input before matching:
 *   - lowercase
 *   - replace non-word characters with spaces (so "kill, myself" matches "kill myself")
 *   - collapse whitespace
 *
 * Then we check each pattern phrase with word-boundary regex against the
 * normalized text. Word boundaries prevent "cutter" from matching "cut"
 * but the phrase "cut myself" will still match "I cut, myself again."
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegex(phrase: string): string {
  return phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Scan an entry for trigger patterns. Returns the aggregate hit info
 * (categories, severity, count) but never returns the matched substrings —
 * the platform's encryption-at-rest posture means the plaintext stays
 * inside the encrypted entry and is only decryptable by an admin who
 * triggers a logged decrypt event.
 *
 * The scanner is intentionally conservative. False positives are an
 * acceptable cost; false negatives are not.
 *
 * Never throws. Used inside best-effort hooks after journal write.
 */
export function scanForTriggers(plaintext: string): ScanResult {
  if (typeof plaintext !== "string" || plaintext.trim().length === 0) {
    return EMPTY_RESULT;
  }

  const normalized = normalize(plaintext);
  if (normalized.length === 0) return EMPTY_RESULT;

  let matchCount = 0;
  const categorySet = new Set<TriggerCategory>();
  let severity: Severity = "low";
  let anyHit = false;

  for (const pattern of PATTERNS) {
    const normalizedPhrase = normalize(pattern.phrase);
    if (normalizedPhrase.length === 0) continue;

    const re = new RegExp(`\\b${escapeRegex(normalizedPhrase)}\\b`, "g");
    const matches = normalized.match(re);
    if (!matches || matches.length === 0) continue;

    anyHit = true;
    matchCount += matches.length;
    categorySet.add(pattern.category);
    severity = maxSeverity(severity, pattern.severity);
  }

  if (!anyHit) return EMPTY_RESULT;

  return {
    hit: true,
    matchCount,
    categories: Array.from(categorySet).sort(),
    severity,
  };
}
