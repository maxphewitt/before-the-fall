# Tool / "Game" Build Playbook

How to build or rebuild a Tier-1 self-help tool (a "game") in this app so it's
**uniform, immersive, clinically defensible, and wired into the data + return
loop**. When told "update / rebuild Tool X," follow this — it's a repeatable task.

Tools live in `app/(platform)/tools/[slug]/start/` (one `*Flow.tsx` per tool),
share `_shared.tsx`, and are routed by `page.tsx`. The six tools: **stop,
urge-surfing, box-breathing, grounding, tipp, thought-record.**

---

## The process (the thought process to repeat every time)

1. **Research first — don't code yet.** For a rebuild, spin up agent(s),
   in parallel when useful:
   - a **clinical/psychology** agent (the skill's evidence, mechanism, safety/
     contraindications, what to measure, and a **defensible-claims vs
     overclaim** list), and
   - when visuals are in scope, a **game-UI/interaction** agent (how good
     web/mobile UIs feel — "juice" dialed to a whisper, easing, feedback,
     calm-not-stimulate, ethical re-engagement).
   Adversarial + cited. The output decides the copy claims and the mechanics.
2. **Read the existing flow + `_shared.tsx`** before changing anything. Match
   ground truth, not memory.
3. **Confirm scope** with the user via a quick multiple-choice if there's real
   ambiguity (build-vs-spec, which measure, how far). Don't gate trivial calls.
4. **Match the measure to the technique — never harm the tool to look uniform**
   (see "Tracking" below). This is the cardinal rule.
5. **Build with the shared components** (don't reinvent — see inventory).
6. **Verify**: `npx tsc --noEmit` (ignore only the pre-existing `.next/types`
   `app/page.js` validator artifact), `npx eslint app`, and a dingbat/emoji
   scan. All green. Then **commit** on the working branch (don't push).
7. **Record it**: update the vault science note (`06 - Operations`) and, if the
   pattern itself changed, update this file.

---

## The uniform skeleton (every tool follows this shape)

1. **WelcomeScreen** (shared) — slow breathing gold cross + serif headline + one
   evocative line + a single gold CTA. Optional `children` (a gentle choice,
   e.g. Box Breathing's "how long?") and `footer` (a caution note or path link,
   e.g. TIPP's safety note). **Never open on a data scale.**
2. **Optional 0–10 StateCheck** (`ChargeScale`) — its **own page two**, prominently
   skippable. Framed as personal self-monitoring ("notice your own change"),
   **never** as proof the tool works.
3. **Guided steps** — **read → tap Begin → guided pacing**; nothing auto-starts.
   Calm, single-focus, eased motion, staged reveals. Respect
   `prefers-reduced-motion`. The breath/circle does the settling.
4. **ActivityComplete** (shared) close — the streak chip (gold cross, taps to the
   grove), an honest headline, optional `stats` pills, and a **Recommended next**
   tool + grove + crisis. This is the return loop (meaning/mastery, not pressure).
5. **Chrome**: `Shell` / `ToolHeader` give the Exit + tool name; background is the
   `deep-night → sky-deep → sky` gradient. Full-screen flows (Urge Surfing) render
   `ToolHeader` themselves.

---

## Shared inventory (reuse — never rebuild these)

`app/(platform)/tools/[slug]/start/_shared.tsx`:
- `Shell`, `ToolHeader` — chrome (Exit + title, gradient bg).
- `WelcomeScreen` — the standard opening.
- `ActivityComplete` + `useDisplayStreak` — the standard close (streak + stats +
  next steps). `CompletionStat`, `NextStep` types. `CRISIS_NEXT_STEP` const.
- `ChargeScale` — the 0–10 StateCheck input.
- `BreathingCircle` (box 4-4-4-4), `PacedBreathingCircle` (inhale/exhale, default
  4 in / 6 out), `Timer` (ring countdown, `allowEarly`), `ChoiceGrid`,
  `IntensitySlider`.
- `useAutoSave(active, fn)` — saves once when `active` turns true.

`app/components/StreakChip.tsx`: `StreakChip`, `GoldCrossIcon` (the gold cross —
the **placeholder milestone marker** until the ad team ships per-milestone icons;
keep every milestone/stat marker a cross for now).

Server actions: `createToolSession({ steps, stateCheck, timeOfDay, outcome?,
confidence? })` (journal entry + state_checks + habit completion in one call),
`getToolMoments(slug)` (grove archive), `recordStateCheck` / `getStateCheckSummary`,
`getDisplayStreak`, `urgeSurf.ts`, `fieldJournal.ts`. Migrations: `scripts/task-38`
(state_checks), `task-39` (urge-surf tracking).

---

## Tracking — we have THREE methods; reuse them, never invent a fourth

1. **StateCheck** — optional 0–10 before/after "charge", via
   `createToolSession({ stateCheck, timeOfDay })` → `state_checks` table + the
   grove. SUDS-style self-monitoring.
2. **The journal** — the user's own words saved as the tool session → decrypted
   into grove "moments" via `getToolMoments`.
3. **Habit completion + streak** — automatic in `createToolSession` → feeds
   `getDisplayStreak` + the grove.

**Match the measure to the technique:**
- **Arousal-down tools** (grounding, box-breathing, tipp, stop): use the 0–10
  charge before/after. "You brought it down" only when their own numbers drop.
- **Acceptance tools** (urge-surfing): **no intensity check** — it undermines the
  skill and becomes a shame counter. Use coping **confidence (0–100, rising-is-
  good)** + a **neutral equal-weight outcome** (rode it out / stepped away / acted
  on it; Abstinence-Violation-Effect-safe) + words. (`urge_surf_sessions`.)
- **Passive surfaces** (freeform journaling): **background usage only** (when/how
  often, already in `journal_entries.created_at`). No charge, no mood prompt.
- **Deferred:** a per-tool "what helped" → **personal coping toolkit** is intended
  for all tools but waits for the AI clinician (Acutis.ai). Don't hard-code it.

---

## Claims discipline (pending clinician sign-off)

Keep every user-facing claim inside the defensible set; cite real sources
(VA/NCPTSD grounding; Zaccaro 2018 slow breathing; Wolpe/SUDS; Bowen & Marlatt
urge surfing; Linehan DBT; Brand 2025 dissociation RCT). **Never** say "clinically
proven," "cures," "activates the parasympathetic system" for non-breathing
mechanisms, or attribute disputed quotes (e.g. the Frankl "space between"). These
are crisis tools, not treatment — always surface the crisis off-ramp, never frame
them as a substitute for care. Full write-ups live in the vault `06 - Operations`.

## Craft & ethics
- Calm > stimulate. Engagement = calm guidance, pacing, sense of place — not
  scores/urgency/surprise. Two motion speeds: responsive ~150–300ms, calm content
  3–8s. Honor reduced-motion.
- Ethical return only (SDT: autonomy/competence/relatedness). **No** streaks-as-
  breakable-chains, FOMO, confirmshaming, or nagging. A slip never breaks anything.
- **No emojis/dingbats anywhere** — inline SVG only (the `─` comment separators
  and typographic arrows are fine).

---

## Per-tool audit (what's unique / uniform / why it works)

| Tool | Unique | Works because |
|---|---|---|
| **STOP** | Letter marks S·T·O·P; guided breath on "T"; path-aware "you're not alone" beat (Christ's temptation Matt 4 / Epictetus) | Names + stands in the urge→action gap; common-humanity reduces shame |
| **Urge Surfing** | Narrator-engine wave (breath-paced orb), faith/secular voice, acceptance tracking (confidence + outcome, NO intensity), "Waves you rode" archive | Acceptance: watch the urge rise & fall without acting; no-shame |
| **5-4-3-2-1 Grounding** | Tap-the-real-room sight field, per-sense word chips, ~11s ambient glow | Redirects attention to present-moment sensory input |
| **Box Breathing** | `BreathingCircle` square 4-4-4-4; "how long?" (4/8) on the welcome | Slow paced breath → parasympathetic (the one defensible autonomic claim) |
| **TIPP** | Read→Begin gated physical steps (cold/exercise timers, PMR), safety caution on welcome, paced breathing 4/6 | Physically down-regulates extreme arousal fast |
| **Thought Record** | Beck 7-column FieldScreen w/ example toggles, 0–100 intensity start/end, before/after chart | Cognitive restructuring: force the thought to face the evidence |

**Uniform across all:** `Shell`/`ToolHeader` chrome + gradient, `WelcomeScreen`
opening, optional 0–10 StateCheck on page two, `ActivityComplete` close with the
gold-cross streak chip, the grove return loop, defensible copy, no dingbats.

---

## Verification checklist (every change)
- [ ] `npx tsc --noEmit` clean (ignore only the `.next/types/validator.ts`
      `app/page.js` artifact from the route restructure).
- [ ] `npx eslint app` — 0 errors.
- [ ] Dingbat/emoji scan over the changed files = none.
- [ ] Opens on the WelcomeScreen; any 0–10 check is page two; nothing auto-starts.
- [ ] Closes on ActivityComplete (streak chip + grove); claims defensible.
- [ ] Commit on the branch with a clear message. Update the vault note.
