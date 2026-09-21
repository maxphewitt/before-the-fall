---
type: handover
domain: operations
status: read-first
created: 2026-09-15
tags:
  - "#cowork"
  - "#handover"
  - "#read-first"
  - "#tachyon"
---

# Tachyon — Founding Handoff (Read First)

Orientation for every Cowork/Claude session on **Tachyon**, Max's nuclear-medicine-industry business. This is the founding note of a brand-new project: there is no code yet, no vault history, no prior sessions. It exists so the first working session starts with the full operating system Max and Claude proved out on Before the Fall, instead of relearning it.

**THE WORK ORDER IS THE SPEC.** Max will attach a work order describing what Tachyon is and what the website must do. Read it before this note's §3, and treat it as authoritative for scope, audience, and content. This handoff governs *how* we work; the work order governs *what* we build. Where this note says [FROM WORK ORDER], fill it in from that document during session one and update this note.

---

## ★ OPERATING PROTOCOL — CLAUDE, READ AND OBEY THIS FIRST ★
Carried over from Before the Fall, where it worked. Not optional.

1. **This handoff is your source of truth — stick to it.** Do NOT re-read chat history to figure out where things stand; that is slow, wasteful, and how hallucination creeps in. When you need a fact, a decision, a file path, or "where did we leave off," look it up in Obsidian first — this note and the linked notes. The vault is the memory; the chat log is not.
2. **OBSIDIAN IS FOR YOU.** It exists to make your job faster and more reliable, not as a chore for Max. Search it, trust it, keep it current. Before spelunking through code or transcripts, check whether the answer is already written down.
3. **Update yourself into Obsidian after every OTHER input from Max.** On roughly every second message he sends (and always before a session ends or context runs low), append a short dated entry to the Session Log below — what changed, what's now true, what's next. Keep it tight. This is how the next session stays oriented without re-reading anything.
4. **★ THE FATIGUE RULE.** Long sessions degrade you. Manage it actively: (a) delegate big builds/research to agents instead of doing everything in the main thread; (b) when you notice fatigue signs — re-asking settled questions, forgetting file paths, contradicting the Session Log — SAY SO to Max, finish the current small step, write the handoff, and tell him to start a new chat; (c) NEVER start a large new feature when context is nearly spent — write it up as NEXT UP instead; (d) a clean handoff beats a degraded push, every time.
5. **Never leave the handoff stale.** If you finish the open request, mark it done in the Session Log and write the next open request. A future Claude should be able to read only this note and be fully caught up.
6. **Start every reply to Max with "Max,"** and follow the rules in §0.

---

## ★ SESSION LOG (Claude appends here — newest on top)
Short dated entries. What changed / what's now true / what's next.

- **2026-09-15 (PROJECT FOUNDED).** This handoff written from the Before the Fall session, encoding that project's proven workflow for Tachyon. Nothing built yet. NEXT UP (session one, in order): (1) read the attached work order end to end; (2) fill every [FROM WORK ORDER] blank in this note and ask Max the §5 open questions; (3) set up the vault folders (§1); (4) scaffold the repo and deploy a hello-world to Vercel BEFORE building features — pipeline first, so every session ships to a real URL; (5) write the Session Log entry.

---

## 0. Max's rules (non-negotiable — carry these every session)

- Open every reply with his name — "Max,".
- No emojis, no dingbat glyphs anywhere — replies, code comments, or site copy. UI marks are inline SVG only. Comment separators `─` and typographic arrows (→ ← ↗) are fine.
- Be concise and direct; prose over bullet-spam; minimal formatting.
- **Layout before code for big things.** For any major feature, page system, or content-heavy build, write the layout/spec as a document for Max to read and mark up BEFORE writing code. Small fixes and mechanics can be built directly. (This rhythm — spec → his edits → build → he tests — was the single best workflow discovery on Before the Fall.)
- **Make claims defensible.** Nuclear medicine is a regulated industry. No efficacy, safety, or compliance claim on the site without a source Max can hand to a reviewer; no superlatives that read as medical or regulatory promises ("safest," "guaranteed compliant"). Where Before the Fall had clinician sign-off, Tachyon has regulatory/legal review — same discipline. Anything compliance-adjacent gets flagged for attorney review before public launch (Hap reviewed BTF's; confirm who reviews Tachyon's).
- Don't work in tiny broken edits or word-vomit commits. Make the change, verify with tsc + eslint, hand a clean summary. **Max commits and pushes locally, always.**
- Any new feature that would change an onboarding/orientation surface later: NOTE IT in this handoff, ALERT MAX, update together.

## 1. Vault + folders (re-grant each new session)

Folder access is per-session. Standard opener for Max: "Connect the Tachyon repo and the Tachyon vault."

- Code repo: `~/Developer/tachyon` *(create in session one; confirm the name Max wants)*
- Obsidian vault: `~/Documents/Tachyon Vault` *(create in session one)*

Vault conventions (mirror Before the Fall's):
- `06 - Operations/` — handoffs (tag `read-first`), session wraps, decision records, this note.
- `07 - Content/` — page copy, layout specs, brand notes.
- One migrations-ledger section lives in THIS note (§4), not scattered.
- Never edit a note marked `status: locked`.

## 2. Stack (the Before the Fall template — proven, reuse it)

- **Next.js (App Router) + React + Tailwind v4** with `@theme` brand tokens (define `tachyon-*` tokens once, early — colors, fonts — and use only tokens in components). Fonts via `next/font`, minimal weights.
- **Supabase** for any data (contact/lead forms, gated content): service-role client server-side only, RLS enabled on every table, **authorize inside every server action** (render-time gating is not a security boundary). Migrations as idempotent files `scripts/task-NN-*.sql`, run by Max in the Supabase SQL editor, logged in §4.
- **Vercel** for hosting, deployed from day one via GitHub integration. Preview deployments per branch; production branch decision recorded here when made.
- **Sanity** (optional) only if the site needs agency/marketing-managed content like articles — decide from the work order; don't add a CMS the business doesn't need.
- Sensitive user-submitted text (if any) encrypted at rest server-side (AES-256-GCM, env-held key — BTF's `journalCrypto` pattern). For a B2B site this likely just means: treat lead-form contents with care, never log them, never put PII in URLs.

**Workflow facts (hard-won on BTF — do not relearn these):**
- `.sql` files → Supabase SQL editor. `.mjs`/node scripts → a terminal on Max's Mac, in a SECOND terminal, never the dev-server one.
- `npx tsc --noEmit` + `npx eslint <files>` verify every change; `next build` and git operations run on Max's Mac, not in the sandbox. If a Cowork session runs git read commands on the mounted repo it can leave a stale `.git/index.lock` — if Max's git ever complains, delete that file.
- Judge site speed with `next build && next start`, never `next dev` (dev compiles per-route and disables prefetch). Test visuals in Chrome/Safari, never an IDE's embedded browser.
- Performance from day one: `Promise.all` for parallel data (no serial awaits), `loading.tsx` skeletons per route group, never cache per-user data server-side, push `"use client"` to leaf components.
- eslint gotchas: `react-hooks/purity` fires on `Date.now()` in render (compute server-side and pass down, or module-scope helper); marketing pages should be static — reserve `force-dynamic` for pages that truly need per-request data.

## 3. What Tachyon is + what we're building

- **The business:** [FROM WORK ORDER — what Tachyon does in the nuclear medicine industry, who its customers are, what it sells.]
- **The website's job:** [FROM WORK ORDER — lead generation? credibility/brochure? portal? e-commerce? Which pages, which calls to action.]
- **Audience:** [FROM WORK ORDER — hospital admins? radiopharmacists? clinic buyers? Tone follows audience.]
- **Brand:** [FROM WORK ORDER or session-one decision — name treatment, palette, type. Write a brand note in `07 - Content/` once decided and lock it.]
- **Design bar:** professional, clear-cut, organized (Max's words). BTF's visual quality is the floor; the aesthetic will differ (this is a technical B2B company, not a pastoral app).

**NEXT UP:** see the Session Log's founding entry — work order first, pipeline second, pages third.

## 4. Supabase migrations ledger (confirm each with Max)

None yet. New migrations continue `task-01`, `task-02`, … in `scripts/`, idempotent, logged here with run/confirmed status. (Numbering restarts for Tachyon — this is a separate Supabase project. NEVER point Tachyon at the Before the Fall database.)

## 5. Open questions for Max (session one asks these)

1. Repo + vault names and the production domain (is one purchased?).
2. Who is the attorney/regulatory reviewer for Tachyon's public claims — Hap again, or industry counsel?
3. Any relationship between Tachyon and Mph Racing Team LLC / a new entity? (Affects footer, privacy policy, and contact details on the site.)
4. Separate GitHub/Vercel/Supabase accounts or the same ones as BTF? (Recommend same accounts, separate projects — but his call.)
5. Does the work order imply anything patient-adjacent? If yes, HIPAA posture must be settled BEFORE any form or data feature is built.

## 6. Companion notes

None yet. As they're created, list them here: brand note, layout specs, performance findings, pre-launch legal checklist. (If a pattern from Before the Fall is needed verbatim — the perf plan, the crypto helper — ask Max to connect that repo/vault read-only and copy the pattern across; never copy BTF user data or keys.)
