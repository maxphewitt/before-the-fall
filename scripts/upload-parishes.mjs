/**
 * upload-parishes.mjs — push the collected OSM parishes straight into
 * Supabase, bypassing the SQL Editor's query-size limit.
 *
 * Reads scripts/.parish-import-progress.json (written by
 * import-parishes-osm.mjs), dedupes, and inserts in batches of 500 using
 * the service-role key from .env.local — the same credentials the app
 * itself uses. Run AFTER task-50-parishes.sql has created the table.
 *
 * Usage (from the repo root):
 *   node scripts/upload-parishes.mjs
 *   node scripts/upload-parishes.mjs --force   # allow re-upload
 *
 * Guard: refuses to run if the table already holds >1000 rows (so a
 * double-click doesn't double the directory) unless --force is passed.
 * Duplicate rows within the dataset are removed before upload.
 */

import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const PROGRESS_FILE = "scripts/.parish-import-progress.json";

// ── Load env from .env.local (no dotenv dependency needed) ──
const env = {};
for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}
const supabase = createClient(url, key, { auth: { persistSession: false } });

// ── Load + dedupe collected rows ──
if (!existsSync(PROGRESS_FILE)) {
  console.error(`No ${PROGRESS_FILE} found — run import-parishes-osm.mjs first.`);
  process.exit(1);
}
const progress = JSON.parse(readFileSync(PROGRESS_FILE, "utf8"));
const all = Object.values(progress.rowsByState ?? {}).flat();
const seen = new Set();
const rows = all.filter((r) => {
  const k = `${r.name}|${r.lat.toFixed(3)}|${r.lng.toFixed(3)}`;
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
});
console.log(`${Object.keys(progress.rowsByState ?? {}).length} states collected, ${rows.length} unique parishes ready.`);

// ── Double-run guard ──
const { count, error: countErr } = await supabase
  .from("parishes")
  .select("id", { count: "exact", head: true });
if (countErr) {
  console.error(`Can't read the parishes table (${countErr.message}). Did you run task-50-parishes.sql?`);
  process.exit(1);
}
console.log(`Table currently holds ${count} rows.`);
if (count > 1000 && !process.argv.includes("--force")) {
  console.log("Looks already uploaded. Pass --force to upload anyway (duplicates are possible then).");
  process.exit(0);
}

// ── Skip rows already in the table (e.g. the 14 seed cathedrals, or a
// partial earlier upload) so a collision can't fail a whole batch. ──
const existingKeys = new Set();
{
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data: existing, error } = await supabase
      .from("parishes")
      .select("name, lat, lng")
      .range(from, from + PAGE - 1);
    if (error) {
      console.error(`Couldn't read existing rows: ${error.message}`);
      process.exit(1);
    }
    for (const r of existing ?? []) {
      existingKeys.add(`${r.name}|${Number(r.lat).toFixed(3)}|${Number(r.lng).toFixed(3)}`);
    }
    if (!existing || existing.length < PAGE) break;
  }
}
const fresh = rows.filter(
  (r) => !existingKeys.has(`${r.name}|${r.lat.toFixed(3)}|${r.lng.toFixed(3)}`)
);
if (fresh.length < rows.length) {
  console.log(`${rows.length - fresh.length} already in the table — uploading ${fresh.length} new.`);
}
rows.length = 0;
rows.push(...fresh);

// ── Upload in batches ──
const BATCH = 500;
let inserted = 0;
for (let i = 0; i < rows.length; i += BATCH) {
  const batch = rows.slice(i, i + BATCH).map((r) => ({
    name: r.name,
    address: r.address ?? "",
    city: r.city ?? "",
    state: r.state,
    zip: r.zip ?? "",
    phone: r.phone,
    website: r.website,
    lat: r.lat,
    lng: r.lng,
  }));
  const { error } = await supabase.from("parishes").insert(batch);
  if (error) {
    console.error(`Batch ${i / BATCH + 1} failed: ${error.message} — stopping. Already inserted: ${inserted}.`);
    process.exit(1);
  }
  inserted += batch.length;
  process.stdout.write(`\ruploaded ${inserted}/${rows.length}…`);
}
console.log(`\nDone — ${inserted} parishes uploaded. Check Supabase Table Editor, then search a ZIP in the app.`);
