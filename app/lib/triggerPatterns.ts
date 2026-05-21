/**
 * DRAFT v1 trigger patterns for journal-text safety scanning.
 *
 * **REQUIRES CLINICAL ADVISOR REVIEW BEFORE PUBLIC LAUNCH.**
 *
 * Posture for v1:
 *   - Bias toward FALSE POSITIVES, not false negatives. We would rather
 *     an admin look at a benign entry than miss a real crisis.
 *   - Whole-word, case-insensitive matching via regex word boundaries.
 *   - Multiple matches escalate severity. Two high-severity hits in the
 *     same entry are treated as high; a single low-severity hit is low.
 *   - Plaintext is NEVER persisted past the scan. Only category labels +
 *     severity land in `incidents`.
 *
 * Known limitations of a keyword scanner (document for the clinician):
 *   - Cannot distinguish past-tense recovery ("I used to want to die") from
 *     present ideation. Conservative posture means we'll flag both.
 *   - Cannot detect indirect/metaphorical language ("I'm done", "checking out").
 *   - Cannot weight context (someone describing a movie vs. describing self).
 *   - Cannot catch novel phrasings. A v2 should layer in an embedding-based
 *     classifier reviewed by the clinical advisor.
 */

export type TriggerCategory =
  | "suicide_ideation"
  | "self_harm"
  | "violence_to_others"
  | "csa_risk"
  | "domestic_violence";

export type Severity = "low" | "medium" | "high";

export type Pattern = {
  category: TriggerCategory;
  severity: Severity;
  // Each phrase is matched whole-word, case-insensitive. Plain strings only —
  // no regex metacharacters expected. Punctuation is stripped from the
  // input before matching.
  phrase: string;
};

export const PATTERNS: Pattern[] = [
  // ─── Suicide ideation ────────────────────────────────────────────────
  { category: "suicide_ideation", severity: "high", phrase: "kill myself" },
  { category: "suicide_ideation", severity: "high", phrase: "end it all" },
  { category: "suicide_ideation", severity: "high", phrase: "end my life" },
  { category: "suicide_ideation", severity: "high", phrase: "take my own life" },
  { category: "suicide_ideation", severity: "high", phrase: "want to die" },
  { category: "suicide_ideation", severity: "high", phrase: "wish i was dead" },
  { category: "suicide_ideation", severity: "high", phrase: "wish i were dead" },
  { category: "suicide_ideation", severity: "high", phrase: "better off dead" },
  { category: "suicide_ideation", severity: "high", phrase: "no point in living" },
  { category: "suicide_ideation", severity: "high", phrase: "wont be here tomorrow" },
  { category: "suicide_ideation", severity: "high", phrase: "wont be here in the morning" },
  { category: "suicide_ideation", severity: "medium", phrase: "suicide" },
  { category: "suicide_ideation", severity: "medium", phrase: "suicidal" },

  // ─── Self-harm ───────────────────────────────────────────────────────
  { category: "self_harm", severity: "high", phrase: "cut myself" },
  { category: "self_harm", severity: "high", phrase: "cutting myself" },
  { category: "self_harm", severity: "high", phrase: "burn myself" },
  { category: "self_harm", severity: "high", phrase: "burning myself" },
  { category: "self_harm", severity: "high", phrase: "hurt myself" },
  { category: "self_harm", severity: "medium", phrase: "self harm" },
  { category: "self_harm", severity: "medium", phrase: "self-harm" },
  { category: "self_harm", severity: "medium", phrase: "razor blade" },

  // ─── Violence to others ──────────────────────────────────────────────
  { category: "violence_to_others", severity: "high", phrase: "kill him" },
  { category: "violence_to_others", severity: "high", phrase: "kill her" },
  { category: "violence_to_others", severity: "high", phrase: "kill them" },
  { category: "violence_to_others", severity: "high", phrase: "shoot them" },
  { category: "violence_to_others", severity: "high", phrase: "shoot him" },
  { category: "violence_to_others", severity: "high", phrase: "shoot her" },
  { category: "violence_to_others", severity: "high", phrase: "make them pay" },
  { category: "violence_to_others", severity: "high", phrase: "shoot up" },
  { category: "violence_to_others", severity: "high", phrase: "hurt my wife" },
  { category: "violence_to_others", severity: "high", phrase: "hurt my husband" },
  { category: "violence_to_others", severity: "high", phrase: "hurt my partner" },
  { category: "violence_to_others", severity: "high", phrase: "hurt my kids" },
  { category: "violence_to_others", severity: "high", phrase: "hurt my child" },
  { category: "violence_to_others", severity: "high", phrase: "hurt my children" },

  // ─── CSA risk ────────────────────────────────────────────────────────
  // These are intentionally broad. ANY hit here goes to high severity
  // because the cost of a missed report is catastrophic. Admin reviews
  // each one and dismisses if the context is clearly therapeutic
  // (e.g., someone describing their own past abuse).
  { category: "csa_risk", severity: "high", phrase: "attracted to children" },
  { category: "csa_risk", severity: "high", phrase: "attracted to kids" },
  { category: "csa_risk", severity: "high", phrase: "attracted to a child" },
  { category: "csa_risk", severity: "high", phrase: "attracted to minors" },
  { category: "csa_risk", severity: "high", phrase: "fantasies about kids" },
  { category: "csa_risk", severity: "high", phrase: "fantasies about children" },
  { category: "csa_risk", severity: "high", phrase: "fantasies about minors" },
  { category: "csa_risk", severity: "high", phrase: "child porn" },
  { category: "csa_risk", severity: "high", phrase: "child pornography" },
  { category: "csa_risk", severity: "high", phrase: "csam" },
  { category: "csa_risk", severity: "high", phrase: "underage girl" },
  { category: "csa_risk", severity: "high", phrase: "underage boy" },

  // ─── Domestic violence (giving or receiving) ─────────────────────────
  { category: "domestic_violence", severity: "high", phrase: "he hits me" },
  { category: "domestic_violence", severity: "high", phrase: "she hits me" },
  { category: "domestic_violence", severity: "high", phrase: "he hit me" },
  { category: "domestic_violence", severity: "high", phrase: "she hit me" },
  { category: "domestic_violence", severity: "high", phrase: "afraid of him" },
  { category: "domestic_violence", severity: "high", phrase: "afraid of her" },
  { category: "domestic_violence", severity: "medium", phrase: "he chokes me" },
  { category: "domestic_violence", severity: "medium", phrase: "she chokes me" },
  { category: "domestic_violence", severity: "medium", phrase: "abusive" },
];

/**
 * Severity ranking used by triggerScan to compute the worst hit.
 */
export const SEVERITY_RANK: Record<Severity, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

export function maxSeverity(a: Severity, b: Severity): Severity {
  return SEVERITY_RANK[a] >= SEVERITY_RANK[b] ? a : b;
}
