/**
 * import-parishes-osm.mjs (v5 — patient, resumable, overnight-safe)
 *
 * Bulk-imports US Catholic churches from OpenStreetMap into SQL for the
 * `parishes` table (task-50). Built to be left running unattended:
 *
 *   - CHECKPOINTS: progress saves to scripts/.parish-import-progress.json
 *     after every state. Stop it, restart it, rerun it tomorrow — it only
 *     fetches states it doesn't have yet.
 *   - PATIENT: each state is tried up to 8 times across 4 public Overpass
 *     servers, with waits growing from 30s to 10 minutes. Free community
 *     servers get busy; the script simply outlasts the busy spells.
 *   - ALWAYS-CURRENT OUTPUT: scripts/parishes-osm-import.sql is rewritten
 *     from ALL collected states after every success, so whenever you stop,
 *     the SQL file is complete for everything gathered so far. Running it
 *     in Supabase twice is harmless (inserts skip duplicates).
 *
 * Usage (Mac, from the repo root — caffeinate stops the Mac sleeping):
 *   caffeinate -i node scripts/import-parishes-osm.mjs
 *   node scripts/import-parishes-osm.mjs NY NJ     # only these states
 *   node scripts/import-parishes-osm.mjs --fresh   # ignore old progress
 *
 * Data: © OpenStreetMap contributors, ODbL — the Parish Finder page
 * carries the required attribution line. No user data involved anywhere.
 */

import { writeFileSync, readFileSync, existsSync } from "node:fs";

const ALL_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

const args = process.argv.slice(2).filter((a) => a !== "--fresh");
const FRESH = process.argv.includes("--fresh");
const STATES = args.length ? args.map((s) => s.toUpperCase()) : ALL_STATES;

const ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.osm.jp/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];
const HEADERS = {
  "User-Agent": "BeforeTheFall-ParishImport/1.0 (beta directory build; contact: mgmt@mphracingteam.com)",
  Accept: "application/json",
};
// Waits between attempts for one state: grows to 10 min, 8 tries total.
const BACKOFF_SECONDS = [30, 60, 120, 240, 480, 600, 600];

const PROGRESS_FILE = "scripts/.parish-import-progress.json";
const SQL_FILE = "scripts/parishes-osm-import.sql";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const esc = (s) => String(s).replace(/'/g, "''").trim();
const now = () => new Date().toLocaleTimeString();

function stateQuery(abbr) {
  return `
[out:json][timeout:300];
area["ISO3166-2"="US-${abbr}"][admin_level=4]->.a;
(
  nwr["amenity"="place_of_worship"]["religion"="christian"]["denomination"~"^(roman_)?catholic$"](area.a);
);
out center;`;
}

// ─── Progress (resumable) ────────────────────────────────────────────────

let progress = { rowsByState: {} };
if (!FRESH && existsSync(PROGRESS_FILE)) {
  try {
    progress = JSON.parse(readFileSync(PROGRESS_FILE, "utf8"));
    const have = Object.keys(progress.rowsByState);
    if (have.length) console.log(`Resuming — already have ${have.length} state(s): ${have.join(" ")}`);
  } catch {
    progress = { rowsByState: {} };
  }
}
function saveProgress() {
  writeFileSync(PROGRESS_FILE, JSON.stringify(progress));
}

// ─── SQL generation (rewritten after every state) ────────────────────────

function writeSql() {
  const all = Object.values(progress.rowsByState).flat();
  const seen = new Set();
  const unique = all.filter((r) => {
    const key = `${r.name}|${r.lat.toFixed(3)}|${r.lng.toFixed(3)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const values = unique.map(
    (r) =>
      `('${esc(r.name)}', '${esc(r.address)}', '${esc(r.city)}', '${esc(r.state)}', '${esc(r.zip)}', ` +
      `${r.phone ? `'${esc(r.phone)}'` : "null"}, ${r.website ? `'${esc(r.website)}'` : "null"}, ` +
      `${r.lat.toFixed(6)}, ${r.lng.toFixed(6)})`
  );
  const sql = `-- parishes-osm-import.sql — generated ${new Date().toISOString()}
-- ${unique.length} US Catholic churches from OpenStreetMap (ODbL).
-- States included: ${Object.keys(progress.rowsByState).sort().join(" ")}
-- Attribution required: "Includes data © OpenStreetMap contributors".
-- Idempotent — safe to run in Supabase Studio more than once.

-- Widen the dedupe key: OSM rows often have no ZIP, and distinct parishes
-- can share a name. Key on name + rounded coordinates instead.
drop index if exists parishes_name_zip_key;
create unique index if not exists parishes_name_coords_key
  on parishes (name, round(lat::numeric, 3), round(lng::numeric, 3));

insert into parishes (name, address, city, state, zip, phone, website, lat, lng) values
${values.join(",\n")}
on conflict (name, round(lat::numeric, 3), round(lng::numeric, 3)) do nothing;
`;
  writeFileSync(SQL_FILE, sql);
  return unique.length;
}

// ─── Fetch one state, patiently ──────────────────────────────────────────

async function fetchStateOnce(st, endpoint) {
  const res = await fetch(`${endpoint}?data=${encodeURIComponent(stateQuery(st))}`, {
    headers: HEADERS,
    signal: AbortSignal.timeout(330000), // just over the query's own 300s cap
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function parseRows(json, st) {
  const rows = [];
  for (const el of json.elements ?? []) {
    const t = el.tags ?? {};
    if (!t.name) continue;
    const lat = el.lat ?? el.center?.lat;
    const lng = el.lon ?? el.center?.lon;
    if (typeof lat !== "number" || typeof lng !== "number") continue;
    rows.push({
      name: t.name,
      address: [t["addr:housenumber"], t["addr:street"]].filter(Boolean).join(" "),
      city: t["addr:city"] ?? "",
      state: st,
      zip: t["addr:postcode"] ?? "",
      phone: t.phone ?? t["contact:phone"] ?? null,
      website: t.website ?? t["contact:website"] ?? null,
      lat,
      lng,
    });
  }
  return rows;
}

async function collectState(st) {
  for (let attempt = 0; attempt <= BACKOFF_SECONDS.length; attempt++) {
    const endpoint = ENDPOINTS[attempt % ENDPOINTS.length];
    try {
      process.stdout.write(`[${now()}] ${st} attempt ${attempt + 1} via ${new URL(endpoint).host}… `);
      const json = await fetchStateOnce(st, endpoint);
      const rows = parseRows(json, st);
      console.log(`OK — ${rows.length} churches`);
      return rows;
    } catch (err) {
      const wait = BACKOFF_SECONDS[Math.min(attempt, BACKOFF_SECONDS.length - 1)];
      if (attempt === BACKOFF_SECONDS.length) {
        console.log(`${err.message} — giving up on ${st} for this run`);
        return null;
      }
      console.log(`${err.message} — waiting ${wait}s, then trying another server`);
      await sleep(wait * 1000);
    }
  }
  return null;
}

// ─── Main ────────────────────────────────────────────────────────────────

console.log(`parish importer v5 — patient/resumable. ${STATES.length} state(s) requested.\n`);

const failed = [];
for (const st of STATES) {
  if (progress.rowsByState[st]) {
    console.log(`[${now()}] ${st} already collected (${progress.rowsByState[st].length} churches) — skipping`);
    continue;
  }
  const rows = await collectState(st);
  if (rows) {
    progress.rowsByState[st] = rows;
    saveProgress();
    const total = writeSql();
    console.log(`   saved — ${SQL_FILE} now holds ${total} parishes across ${Object.keys(progress.rowsByState).length} states`);
  } else {
    failed.push(st);
  }
  await sleep(10000); // courtesy gap between states
}

const doneCount = Object.keys(progress.rowsByState).length;
console.log(`\n──────────────────────────────────────────`);
console.log(`Done. ${doneCount} state(s) collected, ${writeSql()} unique parishes in ${SQL_FILE}.`);
if (failed.length) {
  console.log(`Still missing: ${failed.join(" ")}`);
  console.log(`Just run the same command again later — it resumes automatically.`);
} else if (doneCount === ALL_STATES.length) {
  console.log(`All 50 states + DC collected. Paste ${SQL_FILE} into Supabase Studio and run it.`);
} else {
  console.log(`Run again without arguments to collect the remaining states.`);
}
