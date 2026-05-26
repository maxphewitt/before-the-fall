import * as bip39 from "bip39";
import { createHash, randomInt } from "crypto";

/**
 * Loved-one referral codes — short, memorable, shareable.
 *
 * 4 words from the BIP39 English wordlist, hyphen-separated:
 *   amber-river-quiet-stone
 *
 * Why 4 words instead of the user recovery code's 12?
 *   - The CSO sends this to their loved one in a text message. Long
 *     phrases get truncated, mis-typed, and not used.
 *   - Entropy is 11 bits/word × 4 = 44 bits ≈ 17.5 trillion combinations.
 *     Plenty against brute force given closed-beta scale and the rate
 *     limits we add at the lookup layer.
 *   - Unlike the recovery code, there's no checksum — 4 isn't a valid
 *     BIP39 length. We rely on the hash-lookup miss to reject typos.
 *
 * Privacy posture matches the recovery code: plaintext goes to the CSO
 * once and only once; we store SHA-256(normalized) and look up by that.
 */

const WORDLIST = bip39.wordlists.english;

export function generateLovedOneCode(): string {
  if (!WORDLIST) throw new Error("BIP39 English wordlist unavailable");
  const words: string[] = [];
  for (let i = 0; i < 4; i++) {
    // randomInt is from node:crypto — uniform, cryptographically secure.
    const idx = randomInt(0, WORDLIST.length);
    words.push(WORDLIST[idx]);
  }
  return words.join("-");
}

/**
 * Strip whitespace, lowercase, accept spaces or hyphens as separators,
 * collapse to canonical hyphen-separated lowercase.
 *
 * Most user input mistakes that don't change the meaning hash to the
 * same value: "Amber River Quiet Stone", "amber-river-quiet-stone",
 * "AMBER_RIVER_QUIET_STONE" → all canonicalize identically.
 */
export function normalizeLovedOneCode(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function hashLovedOneCode(code: string): string {
  return createHash("sha256").update(normalizeLovedOneCode(code)).digest("hex");
}

/**
 * Format check: 4 lowercase words, each in the BIP39 wordlist, joined
 * by single hyphens. Reject anything malformed BEFORE we hash + query
 * the database. Catches typos cheaply.
 */
export function isWellFormedLovedOneCode(input: string): boolean {
  if (!WORDLIST) return false;
  const normalized = normalizeLovedOneCode(input);
  const parts = normalized.split("-");
  if (parts.length !== 4) return false;
  return parts.every((w) => WORDLIST.includes(w));
}
