# Field Journal — evidence base (verified)

_Verified by a research agent, 2026-06-16, against Crossref / PubMed / primary
publishers. Backs the Field Journal mechanics. Read with the phrasing cautions —
this is a clinically-sensitive platform._

| Mechanic | Anchor source | Status |
|---|---|---|
| Self-monitoring improves behavior change | Harkin et al. (2016) *Psychological Bulletin* 142(2):198–229 — doi 10.1037/bul0000025; Michie et al. (2009) *Health Psychology* 28(6):690–701 — doi 10.1037/a0016136 | VERIFIED |
| Honesty over outcome / Abstinence Violation Effect | Larimer, Palmer & Marlatt (1999) *Alcohol Research & Health* 23(2):151–160 (NIAAA, public domain, PMC6760427); Witkiewitz & Marlatt (2004) *American Psychologist* — doi 10.1037/0003-066X.59.4.224 | VERIFIED |
| Forgiving streak (all-or-nothing framing worsens relapse) | same AVE sources | PARTIAL — AVE supports the *rationale*; no head-to-head test that a forgiving-streak UI beats a rigid one. Don't call the feature itself "evidence-based." |
| Endowed progress (start at 30 XP, not 0) | Nunes & Drèze (2006) *Journal of Consumer Research* 32(4):504–512 — doi 10.1086/500480 | VERIFIED (consumer research, not clinical — UX rationale only) |
| HALT (Hungry/Angry/Lonely/Tired) | 12-step tradition (AA Step 10); appears in lit only as a clinician mnemonic (Baverstock & Finlay 2019, BMJ ADC E&P — doi 10.1136/archdischild-2019-317209) | PARTIAL — a widely-used recovery **heuristic**, NOT a validated instrument. ⚠️ clinician-review wording. |
| Daily Examen (faith framing) | St. Ignatius of Loyola, *Spiritual Exercises* (1548, public domain); ignatianspirituality.com | VERIFIED (devotional practice, not a clinical claim) |
| If-then plans (the auto-filled plan) | Gollwitzer & Sheeran (2006) *Adv. Exp. Soc. Psych.* 38:69–119 — doi 10.1016/S0065-2601(06)38002-1 | VERIFIED (one of the strongest anchors) |
| Expressive writing / journaling | Pennebaker (1997) *Psychological Science* 8(3):162–166 — doi 10.1111/j.1467-9280.1997.tb00403.x | VERIFIED — effects modest/inconsistent; not a treatment claim |

## How to phrase claims (mandatory)
- Never "treats," "cures," or "clinically proven." Use "associated with," "can help," "supports."
- Name the population gap: evidence is from general health-behavior / goal pursuit / alcohol-drug recovery, **not** pornography/compulsive-behavior specifically. The mechanics are *informed by* established science, not validated in this exact use case.
- HALT = "a self-awareness habit used in recovery communities," not "clinically proven."
- Keep the Examen rhetorically separate from the empirical citations (tradition, not data).
- Don't imply the XP/streak mechanics themselves are evidence-based — the *psychology behind them* is.

## ⚠️ Flag for clinician/lawyer review (Launch Gate)
- **Severity detection** infers risk from entries — effectively a screening/triage function. No source validates automated severity detection. Must be clinician-reviewed, paired with a non-diagnostic disclaimer + crisis fallback, before launch.
- **HALT** wording must be clinician-approved so it doesn't read as a validated screen.
- Severity thresholds + the care-team review SLA: [FOUNDER + clinician + lawyer].
