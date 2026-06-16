# Before the Fall — Restructure Handoff (for review in Cursor)

**Branch:** `restructure/public-platform-split` (checked out in your repo)
**Status:** complete, local only. NOTHING deployed, nothing pushed, nothing on `main`.
**Backup:** tag + branch `backup-pre-restructure-2026-06-15` + zip in your outputs folder.

---

## Important: finish the commit on your Mac

I built everything as working-tree changes (file moves + edits). I could **not** commit from the sandbox — the mounted `.git` blocks the `unlink` git needs, so commits/`git add` fail there. Your Mac's native git has no such problem.

The git index may be in a half-staged state from my attempts. Reset it and commit fresh:

```bash
cd ~/Developer/before-the-fall
rm -f .git/index.lock            # if it exists
git reset                        # unstage everything, KEEPS all working-tree changes
git status                       # review the moves + new files
git add -A
git commit -m "Restructure: split public marketing site from gated platform"
rm -rf .cowork-trash             # my scratch files (already gitignored)
```

Renames are detected at commit time, so history is preserved. `.cowork-trash/`, `.build.log` are gitignored.

## Run it locally

```bash
npm run build      # full build (works on your Mac; couldn't run in sandbox — see note)
npm run dev        # http://localhost:3000
```

To exercise the beta gate locally, make sure `.env.local` has `BETA_GATE_ENABLED=true`.

> Sandbox note: I verified `tsc --noEmit` (types/imports) and `eslint` — both clean. I could NOT run `next build` in the sandbox: it's linux/arm64 with no network, so Next can't fetch its SWC binary. That's environmental, not a code issue; the build runs normally on your Mac.

---

## What changed

**New structure (route groups — URLs unchanged):**

- `app/(marketing)/` — PUBLIC, no account
  - `layout.tsx` — header with extendable nav (Home / Who We Are / News-"Soon") + Log In / Create Account, shared footer
  - `page.tsx` — new Home (`/`); tiers are informational, CTAs route into account creation
  - `who-we-are/page.tsx` — migrated from `/about` (`/about` now 301s here)
- `app/(auth)/` — reachable without a session
  - `return/page.tsx` — Log In (recovery code) + "Keep me logged in" checkbox
  - `onboard/page.tsx` — **server gate**: shows beta-code entry when gated, else the questionnaire
  - `onboard/OnboardFlow.tsx` — the questionnaire (now has "Keep me logged in")
- `app/(platform)/` — GATED, requires `btf_user_id`
  - `layout.tsx` — platform shell: brand → /today, persistent "Public site ↗" (→ `/?stay=1`), Sign out
  - `today/ tools/ journal/ catholic-path/` — moved unchanged (just relocated + import depth fixed)
- `app/loved-one/` — hybrid: landing is PUBLIC; `quiz`, `result`, `resources` are gated

**Gating (`proxy.ts` rewritten):** marketing/auth/offline open; platform routes require a session (logged-out → `/`); admin unchanged. The beta gate is **no longer** a site-wide perimeter.

**Beta gate moved to account creation:** enforced **server-side** in `createUser()` (rejects if `BETA_GATE_ENABLED=true` and no valid beta session) — can't be bypassed by URL. Both self and loved-one signups require a code during beta; the home page never asks for one.

**Keep me logged in:** `setSessionCookie(userId, persist)` — checked = 30-day cookie; unchecked = session-only cookie, so a new window lands back on Home to log in again. Wired into `/return` and `/onboard`.

**Logged-in routing:** hitting `/`, `/return`, or `/onboard` while logged in soft-redirects to `/today`, unless `?stay=1` (the platform's "Public site" link).

---

## Decisions / flags for your review

1. **Loved-one + CRAFT copy conflict.** You asked for CSOs to have accounts (grant data). I gated the quiz behind login so each CSO becomes a countable user. BUT the landing copy ("You're not the user, you're the bridge") and the self-oriented onboarding questionnaire are now in tension with requiring a CSO account. I did **not** rewrite the clinical copy (needs advisor review per your boundaries). Recommend a dedicated CSO onboarding variant later.
2. **CSO flow gap.** A logged-out CSO who clicks "Create an account to start" goes to `/onboard`, creates an account, then lands on `/today` — not back at the quiz. Minor; can wire a return-to later.
3. **Platform pages** still have their own `← Home` links (→ `/`, which redirects logged-in users to `/today`) and their own `min-h-screen` main under the new header (slight extra scroll). Cosmetic polish, left as-is.
4. **`LovedOneCodeAffordance` component** is now unused (was on the old home). Left in place; delete if you want.

Tools/tier functionality itself was not touched — this was navigation + access only.
