/**
 * Local seed script to create an admin user.
 *
 * Run from the project root:
 *   npx tsx scripts/seed-admin.ts "Max Hewitt" founder
 *
 * Arguments:
 *   1. display_name — required, human-readable. Stored on the admin_users row.
 *   2. role         — optional, one of: founder | reviewer | clinical_advisor | attorney
 *                     Default: reviewer.
 *
 * What it does:
 *   1. Generates a fresh 32-byte hex admin code (256 bits of entropy).
 *   2. SHA-256 hashes it.
 *   3. Inserts a new row in `admin_users` via the service-role Supabase
 *      client, using SUPABASE_SERVICE_ROLE_KEY from .env.local.
 *   4. Prints the plaintext code ONCE to stdout. **Save it immediately**
 *      — it is not stored anywhere else and we cannot recover it.
 *
 * Re-run any time to mint additional admins (clinical advisor, attorney).
 * Existing admins are not affected.
 *
 * Requires Node 18+ and dependencies already installed (@supabase/supabase-js).
 * Install tsx once if you don't have it: `npm install --save-dev tsx`.
 */

import { createHash, randomBytes } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnv(): Record<string, string> {
  // Minimal .env.local loader so this script can run without a framework.
  const envPath = resolve(process.cwd(), ".env.local");
  const env: Record<string, string> = {};
  try {
    const text = readFileSync(envPath, "utf8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 0) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      env[key] = value;
    }
  } catch (err) {
    console.error("Could not read .env.local at", envPath);
    console.error(err);
    process.exit(1);
  }
  return env;
}

async function main() {
  const args = process.argv.slice(2);
  const displayName = args[0];
  const role = args[1] ?? "reviewer";

  if (!displayName) {
    console.error("Usage: npx tsx scripts/seed-admin.ts \"<display name>\" [role]");
    console.error("  role: founder | reviewer | clinical_advisor | attorney");
    process.exit(1);
  }

  const allowedRoles = ["founder", "reviewer", "clinical_advisor", "attorney"];
  if (!allowedRoles.includes(role)) {
    console.error(`Invalid role "${role}". Must be one of: ${allowedRoles.join(", ")}`);
    process.exit(1);
  }

  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  const code = randomBytes(32).toString("hex");
  const codeHash = createHash("sha256").update(code).digest("hex");

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase
    .from("admin_users")
    .insert({
      recovery_code_hash: codeHash,
      display_name: displayName,
      role,
    })
    .select("id, display_name, role, created_at")
    .single();

  if (error || !data) {
    console.error("Failed to insert admin_users row:", error);
    process.exit(1);
  }

  console.log("\n=========================================================");
  console.log("Admin user created.");
  console.log("=========================================================");
  console.log("  ID:           ", data.id);
  console.log("  Display name: ", data.display_name);
  console.log("  Role:         ", data.role);
  console.log("  Created at:   ", data.created_at);
  console.log("=========================================================");
  console.log("ADMIN CODE (save it now — shown ONCE, cannot be recovered):");
  console.log();
  console.log("  " + code);
  console.log();
  console.log("Paste this into /admin/login to sign in.");
  console.log("=========================================================\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
