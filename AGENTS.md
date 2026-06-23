<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project rules

## Every tool emits a StateCheck (benefit-over-time tracking)

As we build or update any self-help tool, it MUST emit the shared before/after
"StateCheck" signal so the platform can honestly read what helps each user over
time, and feed the future "what helps you, when" recommendation layer.

- The default is the shared **0–10 charge** check (`ToolStateCheck`, scale
  `charge-0-10`): optional, skippable, framed as personal **self-monitoring
  (SUDS-style) — never as proof a tool works**. Wire it via
  `createToolSession({ stateCheck, timeOfDay })`; it mirrors numbers to the
  `state_checks` table (`scripts/task-38`). Reference: `GroundingFlow.tsx`,
  `BoxBreathingFlow.tsx`.
- **Match the measure to the technique — never harm the tool to look uniform.**
  Acceptance-based tools (e.g. urge surfing) do NOT use a 0–10 intensity check:
  reducing intensity isn't their mechanism and an intensity log becomes a shame
  counter. Use acceptance-consistent signals instead — coping confidence
  (rising-is-good), a neutral equal-weight outcome (no streak-breaks; Abstinence
  Violation Effect-safe), and the user's own words. Reference:
  `UrgeSurfingFlow.tsx`, `scripts/task-39`, and the vault notes in
  `06 - Operations`.
- Every tool's meta layer (grove / "waves you rode" / etc.) is strengths-based
  and **explicitly non-clinical**. No streaks, no scores, no intensity charts.
- **Not every surface needs a charge.** Passive surfaces (e.g. freeform
  journaling) are tracked as **background usage only — when and how often**,
  which `journal_entries.created_at` already captures. Do NOT bolt a before/after
  mood check onto open-ended writing; that's over-engineering.
- Claims shown to users must stay within the verified, defensible set (see the
  vault science notes); pending clinician sign-off.

### Deferred: "What helped" → AI clinician
A per-tool "what helped" capture that builds a **personal coping toolkit** is
intended for ALL tools, but is **deferred until an AI clinician (Acutis.ai or
similar) is integrated**. That AI will build and curate the toolkit from the
user's own responses and update it over time — rather than us hard-coding tags
now. Don't build the toolkit feature before then; design captures so their data
can feed it later.
