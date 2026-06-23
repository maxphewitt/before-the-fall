# Pass-over for the next Claude agent — EMOJI / DINGBAT cleanup

**Context:** Max has a HARD LIMIT — **no emojis** (and the UI/UX Pro Max skill agrees:
icons must be SVG, never emoji/dingbat glyphs). The previous agent violated this in a
few UI strings on the `restructure/public-platform-split` branch. **Fix these; do not
"fix" the false positives below.**

## The rule
- UI-visible icons/marks must be **inline SVG** (the codebase already has a clean
  pattern — see the cross marks built from `<div>`s, and the SVG `TierIcon`/`MiniGlyph`
  in `app/(marketing)/what-we-offer/page.tsx` and `UrgeSurfingFlow.tsx`).
- Plain text + the existing SVG patterns only. No `✍ ✎ ✓ ✦ ⚠ 🕊 🌿` etc.

## MUST FIX — user-facing emoji/dingbats introduced this session
| File | Line | Glyph | Suggested fix |
|---|---|---|---|
| `app/(platform)/field-journal/FieldJournal.tsx` | ~245 | `✍` ("✍ Daily journal") | drop the glyph, or replace with a small inline SVG pencil |
| `app/(platform)/field-journal/daily/DailyJournal.tsx` | ~130 | `✓` ("Saved to your journal ✓") | drop `✓` (just "Saved to your journal") or inline SVG check |
| `app/(platform)/tools/[slug]/start/UrgeSurfingFlow.tsx` | ~497 | `✓` ("Kept in your journal ✓") | drop `✓` |
| `app/(platform)/tools/[slug]/start/UrgeSurfingFlow.tsx` | ~585 | `✓` ("I'm ready to come back ✓") | drop `✓` |
| `app/(platform)/tools/[slug]/start/UrgeSurfingFlow.tsx` | ~594 | `✎` ("✎ jot a thought ›") | drop `✎`; keep "jot a thought" (the `›` is a chevron — replace with inline SVG or drop) |

## ALSO FIX — same rule, but PRE-EXISTING (not from this session)
| File | Line | Glyph | Note |
|---|---|---|---|
| `app/(platform)/catholic-path/_ModuleStub.tsx` | ~48 | `✦` | decorative; replace with SVG or remove |
| `app/(platform)/catholic-path/rosary/MysteryPicker.tsx` | ~76 | `✦` | same |
| `app/(platform)/today/page.tsx` | ~228 | `✓` | habit-complete check — use inline SVG check |
| `app/(platform)/today/edit/HabitEditClient.tsx` | ~123 | `✓` | toggle check — inline SVG |
| `app/admin/beta-codes/BetaCodesClient.tsx` | ~191 | `✓` | "Copied ✓" — drop glyph |
| `app/loved-one/result/LovedOneResultClient.tsx` | ~129,136 | `✓` | "Copied ✓" — drop glyph |
| `app/components/CrisisExitRamp.tsx` | ~83 | `⚠` | user-facing warning mark — replace with inline SVG triangle |

## LOW PRIORITY — emoji in CODE COMMENTS only (not rendered)
`⚠️` appears in JSDoc/comments in `app/lib/fieldJournalContent.ts`, `app/lib/urgeSurfContent.ts`,
and `app/admin/field-review/page.tsx`. Not user-facing, but for strict compliance swap `⚠️` →
`WARNING:` in those comments.

## NOT violations — do NOT touch
- `─` box-drawing characters: these are **comment separators** (`/* ─── Section ─── */`)
  throughout the codebase. Not UI, not emoji. Leave them.
- Typographic arrows `→`, `↗`, `←`, `↺`: used in CTAs ("Learn more →", "Public site ↗").
  These match Max's own uploaded prototypes, which use `→` freely. Treat as acceptable
  unless Max says otherwise — confirm with him before stripping, don't assume.

## How to verify when done
Re-run the audit (a Python scan over `app/**/*.tsx` for codepoints in the dingbat/emoji
ranges, excluding `─` and typographic arrows/quotes). Zero user-facing hits = clean.
Then `npx tsc --noEmit` and `npx eslint app` must stay green.

_Branch: `restructure/public-platform-split`. Nothing in this pass has been changed — it
is a to-do list only._
