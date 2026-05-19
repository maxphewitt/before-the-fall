import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

/**
 * Server-side encryption for journal entries.
 *
 * Algorithm: AES-256-GCM (authenticated encryption).
 *  - Confidentiality: ciphertext alone reveals nothing about the plaintext.
 *  - Integrity: the auth_tag detects any byte-level tampering of the
 *    ciphertext or IV. A tampered row will fail to decrypt loudly.
 *  - Random IV per entry: same plaintext produces different ciphertext
 *    each time, so an observer cannot tell that two entries are duplicates.
 *
 * Key management:
 *  - Single server-held master key, sourced from JOURNAL_ENCRYPTION_KEY.
 *  - 64 hex chars (= 32 bytes = 256 bits). Generate with `openssl rand -hex 32`.
 *  - Stored as an env var in .env.local locally and in Vercel for production.
 *  - Rotation requires re-encrypting every existing row — do NOT change
 *    this value once entries exist without a migration plan.
 *
 * What is and is NOT encrypted:
 *  - Encrypted: the entry text body (the user's words).
 *  - Plaintext: user_id, created_at, updated_at, deleted_at. These must
 *    remain queryable for the list view, soft delete, and future safety
 *    trigger scanning (Task #14).
 *
 * Why server-held keys, not client-only:
 *  - Locked decision: the platform must be able to decrypt content when
 *    988 / NCMEC / Mandatory Reporting triggers fire. See
 *    [[Pseudonymous Identity Model]]. Zero-knowledge anonymity that
 *    costs lives is not the goal.
 */

const ALGORITHM = "aes-256-gcm";
const IV_BYTES = 12; // GCM standard recommendation
const KEY_BYTES = 32; // 256-bit key

export type EncryptedPayload = {
  ciphertext: string; // base64
  iv: string; // base64
  authTag: string; // base64
};

function getKey(): Buffer {
  const hex = process.env.JOURNAL_ENCRYPTION_KEY;
  if (!hex) {
    throw new Error(
      "JOURNAL_ENCRYPTION_KEY is not set. Set it in .env.local and Vercel before journaling can be used. Generate with: openssl rand -hex 32"
    );
  }
  const buf = Buffer.from(hex, "hex");
  if (buf.length !== KEY_BYTES) {
    throw new Error(
      `JOURNAL_ENCRYPTION_KEY must decode to ${KEY_BYTES} bytes (${KEY_BYTES * 2} hex chars). Got ${buf.length} bytes.`
    );
  }
  return buf;
}

/**
 * Encrypt a journal entry body. Returns three base64 strings that should
 * be stored in their corresponding columns on journal_entries.
 *
 * Throws if the encryption key is missing or malformed — let the server
 * action's try/catch surface this as a user-facing error.
 */
export function encryptJournalText(plaintext: string): EncryptedPayload {
  const key = getKey();
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return {
    ciphertext: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
  };
}

/**
 * Decrypt a row. Throws if the auth_tag does not validate — i.e. the
 * ciphertext or IV was modified, or the wrong key is in play. Callers
 * should treat decryption failure as data corruption, NOT as a normal
 * empty-result case.
 */
export function decryptJournalText(payload: EncryptedPayload): string {
  const key = getKey();
  const iv = Buffer.from(payload.iv, "base64");
  const authTag = Buffer.from(payload.authTag, "base64");
  const ciphertext = Buffer.from(payload.ciphertext, "base64");

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}
