import * as bip39 from "bip39";
import { createHash } from "crypto";

/**
 * Generate a fresh 12-word recovery code.
 *
 * Uses BIP39 (Bitcoin Improvement Proposal 39), the industry standard for
 * human-friendly recovery phrases. 128 bits of entropy = 2^128 possible codes,
 * far beyond brute-force range. Standard 2048-word English wordlist.
 *
 * Output is lowercase, space-separated.
 */
export function generateRecoveryCode(): string {
  return bip39.generateMnemonic(128);
}

/**
 * Normalize a user-entered code before hashing or validating.
 *
 * Returning users will paste codes with stray whitespace, line breaks, or
 * capitalization variants. We need every variant to hash to the same value.
 */
export function normalizeRecoveryCode(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * SHA-256 hash of the normalized recovery code.
 *
 * We never store the plaintext code anywhere. Only the hash. If our database
 * is ever leaked, no attacker can recover any user's code, because:
 *  (a) BIP39 has 128 bits of entropy, beyond rainbow-table feasibility, AND
 *  (b) only hashes are persisted — not the codes themselves.
 *
 * Salting is not needed for the same reason: the entropy is too high for
 * any precomputed attack to matter.
 */
export function hashRecoveryCode(code: string): string {
  const normalized = normalizeRecoveryCode(code);
  return createHash("sha256").update(normalized).digest("hex");
}

/**
 * Validate that a string is a well-formed 12-word BIP39 mnemonic.
 *
 * Used when a returning user pastes their code, to catch typos and bad
 * paste data before we hit the database. BIP39 includes a built-in checksum
 * in the last word, so this catches most paste errors.
 */
export function isValidRecoveryCode(code: string): boolean {
  const normalized = normalizeRecoveryCode(code);
  return bip39.validateMnemonic(normalized);
}
