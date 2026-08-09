/**
 * refresh-parishes.mjs — the monthly one-command parish refresh.
 *
 * Does everything in sequence:
 *   1. Archives last run's checkpoint (.parish-import-progress.prev.json)
 *   2. Re-runs the OSM importer fresh (all 50 states + DC; resumable —
 *      if it dies, run this again and it continues)
 *   3. Diffs old vs new: parishes added, websites/phones newly mapped
 *   4. Writes scripts/parish-refresh-report.md
 *   5. Uploads ONLY the new rows to Supabase (upload-parishes.mjs already
 *      skips everything present in the table)
 *
 * Usage (Max's Mac, repo root — takes a while, that's fine):
 *   caffeinate -i node scripts/refresh-parishes.mjs
 *
 * Standing rule (Max, 2026-07-28): this runs at the start of every month;
 * a scheduled Cowork task reminds/reports. The sandbox can't reach
 * overpass or Supabase, so the run itself happens here.
 */

import { readFileSync, writeFileSync, existsSync, renameSync } from "node:fs";
import { spawnSync } from "node:child_process";

const CUR = "scripts/.parish-import-progress.json";
const PREV = "scripts/.parish-import-progress.prev.json";
const REPORT = "scripts/parish-refresh-report.md";

const key = (r) => `${r.name}|${r.lat.toFixed(3)}|${r.lng.toFixed(3)}`;
const flat = (p) => Object.values(p?.rowsByState ?? {}).flat();

// ── 1. Archive the previous checkpoint (unless resuming a refresh) ──
const resuming = process.argv.includes("--resume") || (existsSync(CUR) && existsSync(PREV));
if (existsSync(CUR) && !resuming) {
  renameSync(CUR, PREV);
  console.log("Archived last run's data for comparison.\n");
}

// ── 2. Run the importer (fresh file; resumable within this refresh) ──
console.log("Running the OSM importer — this takes a while, let it work…\n");
const imp = spawnSync("node", ["scripts/import-parishes-osm.mjs"], { stdio: "inherit" });
if (imp.status !== 0) {
  console.error("\nImporter exited abnormally. Run this same command again to resume.");
  process.exit(1);
}

// ── 3. Diff old vs new ──
const oldRows = existsSync(PREV) ? flat(JSON.parse(readFileSync(PREV, "utf8"))) : [];
const newRows = flat(JSON.parse(readFileSync(CUR, "utf8")));
const oldByKey = new Map(oldRows.map((r) => [key(r), r]));
const added = [];
const gainedWebsite = [];
for (const r of newRows) {
  const prev = oldByKey.get(key(r));
  if (!prev) added.push(r);
  else if (!prev.website && r.website) gainedWebsite.push(r);
}
const byState = (rows) => {
  const m = {};
  for (const r of rows) m[r.state] = (m[r.state] ?? 0) + 1;
  return Object.entries(m).sort((a, b) => b[1] - a[1]);
};

const report = `# Parish directory refresh — ${new Date().toISOString().slice(0, 10)}

- Total parishes in OpenStreetMap now: **${newRows.length}** (was ${oldRows.length || "n/a"})
- **New parishes since last refresh: ${added.length}**
- **Parishes that gained a website: ${gainedWebsite.length}**

## New parishes by state
${added.length ? byState(added).map(([s, n]) => `- ${s}: ${n}`).join("\n") : "- none"}

## Newly mapped websites (first 40)
${gainedWebsite.slice(0, 40).map((r) => `- ${r.name} (${r.city || "?"}, ${r.state}) — ${r.website}`).join("\n") || "- none"}

## New parishes (first 40)
${added.slice(0, 40).map((r) => `- ${r.name} (${r.city || "?"}, ${r.state})`).join("\n") || "- none"}
`;
writeFileSync(REPORT, report);
console.log(`\nReport written to ${REPORT}`);
console.log(`New parishes: ${added.length} · newly mapped websites: ${gainedWebsite.length}\n`);

// ── 4. Upload only what's new (upload script skips existing rows) ──
console.log("Uploading new rows to Supabase…\n");
const up = spawnSync("node", ["scripts/upload-parishes.mjs", "--force"], { stdio: "inherit" });
if (up.status !== 0) {
  console.error("\nUpload had a problem — the report above is still valid; rerun: node scripts/upload-parishes.mjs --force");
  process.exit(1);
}

// NOTE on websites: rows that only GAINED a website match an existing
// table row (same name+coords), so the upload skips them. Refresh their
// website column via the printed list in the report — or ask Claude to
// generate the UPDATE statements from parish-refresh-report data.
console.log("\nDone. Open scripts/parish-refresh-report.md for the summary — or show it to Claude.");
