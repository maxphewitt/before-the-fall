import * as bip39 from "bip39";
import { createHash, randomInt } from "crypto";

/**
 * Beta access codes — three BIP39 words, hyphen-separated.
 *
 *   silent-river-prayer
 *
 * Three words = 33 bits entropy ≈ 8.5 billion combinations. With the
 * per-IP rate limit at the validate endpoint, brute force is
 * impractical at closed-beta scale. Shorter than the 4-word loved-one
 * code because the beta gate is meant to be typed once by each
 * tester and remembered; we want it as low-friction as possible.
 *
 * Privacy posture matches the user recovery code and loved-one
 * referral code: plaintext goes to the tester once via the admin UI;
 * the platform persists SHA-256 only.
 */

const WORDLIST = bip39.wordlists.english;

export function generateBetaAccessCode(): string {
  if (!WORDLIST) throw new Error("BIP39 English wordlist unavailable");
  const words: string[] = [];
  for (let i = 0; i < 3; i++) {
    const idx = randomInt(0, WORDLIST.length);
    words.push(WORDLIST[idx]);
  }
  return words.join("-");
}

export function normalizeBetaAccessCode(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function hashBetaAccessCode(code: string): string {
  return createHash("sha256").update(normalizeBetaAccessCode(code)).digest("hex");
}

export function isWellFormedBetaAccessCode(input: string): boolean {
  if (!WORDLIST) return false;
  const normalized = normalizeBetaAccessCode(input);
  const parts = normalized.split("-");
  if (parts.length !== 3) return false;
  return parts.every((w) => WORDLIST.includes(w));
}
