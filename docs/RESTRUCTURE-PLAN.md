# Before the Fall — Site Restructure Plan

**Status:** PROPOSAL — no code changed yet. Awaiting your go.
**Branch (when approved):** `restructure/public-platform-split`
**Constraint:** local only, no deploy, no push to `main`. Backup already taken (tag/branch `backup-pre-restructure-2026-06-15` + zip).

---

## 1. Decisions locked in (from your answers)

1. **Account required** for all tiers, tools, and support modules. Logged-out visitors get redirected to the landing/login.
2. **Route groups, same URLs** (my recommendation — see §3). No `/app/*` prefix, so no broken bookmarks or PWA `start_url`.
3. **Structure only:** build Home + "Who We Are" (migrated from `/about`); "News & Articles" is a wired nav tab with no content yet.
4. I post this plan and **stop** until you approve.

---

## 2. Current state (what I found)

- **Stack:** Next.js 16 (App Router), React 19, Supabase, Tailwind v4.
- **Gate:** `proxy.ts` (Next 16's middleware), toggled by `BETA_GATE_ENABLED`. Today it sits at the **perimeter** — when on, *every* non-public route demands a `btf_beta_access` cookie, and `/` renders a beta-code wall (`BetaGate`) instead of the marketing site.
- **Three cookie identities:**
  - `btf_beta_access` — beta gate (issued by `/api/verify-code`)
  - `btf_user_id` — the pseudonymous user session (set at `/onboard` signup or `/return` login)
  - `btf_admin_id` — admin (magic link at `/a/[token]`, guards `/admin/*`)
- **`app/page.tsx` does too much:** marketing hero + Tier cards (Tier 1 links straight into `/tools`) + Catholic Path + about-style content + auth entry points all on one page.
- **Auth flows already exist:** `/onboard` = create account (7-question flow → 12-word recovery code), `/return` = log in (paste code). These *are* "Create Account" and "Log In."
- **Safety surfaces** that must stay reachable to everyone: `CrisisExitRamp` (in root layout), `/offline`, inline crisis numbers.

---

## 3. Target architecture — three route groups

Reorganize `app/` into route groups. Route groups (`(name)`) **don't change URLs** — they only organize files and let each zone have its own layout. This gives a clean folder boundary now and makes a future hard split (separate deployment for marketing vs platform) a matter of lifting one folder.

```
app/
├─ (marketing)/                 # PUBLIC — no gate, no session needed
│   ├─ layout.tsx               # marketing shell: extendable top nav + Log In / Create Account, footer
│   ├─ page.tsx                 # Home (/) — refactored landing
│   ├─ who-we-are/page.tsx      # migrated from current /about
│   └─ (news tab is in the nav, "coming soon", no route yet)
│
├─ (auth)/                      # reachable without a session
│   ├─ return/page.tsx          # Log In (paste recovery code) — open
│   └─ onboard/page.tsx         # Create Account — BETA GATE TRIGGERS HERE
│
├─ (platform)/                  # GATED — requires btf_user_id
│   ├─ layout.tsx               # platform shell: persistent "Return to public Home" + Sign out
│   ├─ today/…
│   ├─ tools/…
│   ├─ journal/…
│   └─ catholic-path/…
│
├─ admin/…                      # unchanged (own auth via btf_admin_id)
├─ a/[token]/…                  # unchanged (admin magic link)
├─ api/…                        # verify-code stays; used by create-account now
├─ offline/…                    # unchanged, always public
├─ components/ lib/ actions/    # unchanged locations
└─ layout.tsx                   # root layout: keeps CrisisExitRamp on every page
```

**`/loved-one` — DECIDED: account-required.** Concerned people (CSOs) also create an account, so every one is real, countable data for grant reporting. The "Worried about someone you love?" CTA on the public Home leads into a create-account path tailored for the CSO (`here_for: "loved_one"`), which then produces the referral code as today. So `/loved-one` lives in the auth/platform zone, not the public marketing zone — only its entry CTA is public.

> **Minor flag:** during closed beta, does CSO account creation also require a beta code (consistent with self-signup), or should CSO signups be exempt to maximize top-of-funnel grant data? Default: same beta gate as everyone. Say the word if you want CSOs exempt.

---

## 4. Gating logic (rewrite of `proxy.ts`)

New behavior, all server-side at the edge, with defense-in-depth in layouts/actions:

- **Marketing + `/offline` + static:** always open.
- **`/return` (login):** always open.
- **`/onboard` (create account):** page is viewable, but **account creation is beta-gated server-side** — see §5.
- **`(platform)` routes:** require `btf_user_id`. Missing → redirect to `/` (landing). Enforced in `proxy.ts` *and* re-checked in `(platform)/layout.tsx` so tools can't be reached by URL without a session.
- **Logged-in user landing on `/`:** see §6 (recommended: soft redirect with a persistent escape hatch).
- **`/admin` + `/a/*`:** unchanged.

`BETA_GATE_ENABLED` changes meaning: it no longer walls the whole site — it **only** controls whether a beta code is required to create an account. When flipped to `false` at public launch, signup opens to everyone and nothing else changes.

---

## 5. Beta gate moves to the Create-Account step

- Repurpose `BetaGate` / `BetaGateForm` from the home wall into the **start of the `/onboard` flow**: when `BETA_GATE_ENABLED=true` and no valid `btf_beta_access` cookie, the first onboard step asks for a beta access code (posts to existing `/api/verify-code`, which issues the cookie). Crisis numbers stay visible on that step.
- **Server-side enforcement (the real boundary):** add a guard at the top of the `createUser` server action — if `BETA_GATE_ENABLED==='true'` and the request has no valid `btf_beta_access` cookie, reject before any row is created. This can't be bypassed by hitting `/onboard` directly or calling the action, satisfying the "enforce server-side" requirement.
- `/return` (existing users) is **never** beta-gated — approved users log in normally.

---

## 6. Logged-in routing + "Keep me logged in?" choice — DECIDED: soft redirect

**Soft redirect (not a hard trap):**
- Logged-in visitor hitting `/` is redirected to `/today` (the platform home).
- The `(platform)` shell carries a **persistent "Public site ↗" link** that opens the public Home without re-redirecting (e.g. `/?stay=1`, which the home checks and renders the marketing page instead of bouncing).

**"Keep me logged in on this device?" — new requirement.**
At both auth entry points (`/return` login and `/onboard` create-account completion), ask the user whether to save their login on this device:
- **Yes →** persistent session cookie (30-day `maxAge`, as today). The soft-redirect-to-platform behavior applies on return visits.
- **No →** **session-only** cookie (no `maxAge`) — it dies when the browser window/session closes. A new window therefore has no session, so the platform routes redirect them back to Home to log in again. This is the right default for shared devices and the sensitive nature of the platform.

**Implementation:** `setSessionCookie(userId)` gains a `persist: boolean` param controlling whether `maxAge` is set. The choice is a toggle/prompt in the login and signup UI, passed through `resumeSession` and `createUser`.

---

## 7. The new Home page

Refactor of current `app/page.tsx`, brand intact (deep sky blue / white / gold, the cross):
- Hero with the existing emotional copy + cross.
- **Prominent, single-source auth:** Log In and Create Account (in the hero and the nav — one trusted place, not scattered).
- Tier cards become **informational** (no direct link into `/tools`, since tools are now gated). Tier 1 CTA becomes "Create your account to begin" / "Log in."
- "Worried about someone you love?" → `/loved-one` (public).
- Mission, "What this is / isn't," footer with nav to Who We Are.
- Mobile-first; scales up to desktop.
- Extendable nav component so you can add tabs later by editing one array.

---

## 8. Commit sequence (small, reviewable)

1. Introduce route groups; **move files only**, no logic change (verify build still green).
2. Marketing layout + extendable nav component.
3. New Home page.
4. `who-we-are` migrated from `/about` (redirect `/about` → `/who-we-are`).
5. Platform shell (`(platform)/layout.tsx`) with session re-check + "Public site" link.
6. `proxy.ts` gating rewrite (perimeter → session-based for platform).
7. Move beta gate into create-account flow + server guard in `createUser`.
8. Logged-in redirect + escape hatch; cleanup, dead-link sweep.

Each commit is local to the branch. **No deploy, no push to `main`.**

---

## 9. Verification (before I hand it back)

- `npm run build` + `npm run lint` clean.
- **Access matrix tested locally** (`BETA_GATE_ENABLED` on and off):
  - Logged-out: can see `/`, `/who-we-are`; cannot reach `/tools`, `/today`, `/journal` (redirected); `/return` works; `/onboard` requires beta code when gate on.
  - Beta code entry → create account → lands in platform.
  - Logged-in: redirect-to-platform works; "Public site" escape hatch works; sign out works.
  - Crisis exit ramp + `/offline` reachable in every state.
  - `/admin` + magic link unaffected.
- Confirm PWA `start_url` + manifest still valid (URLs unchanged).
- Confirm no tool route silently depended on the beta cookie in a way the session swap breaks.

---

## 10. All decisions locked

- Account required for tools/tiers. ✓
- Route groups, same URLs. ✓
- Structure only (Home + Who We Are from /about; News tab wired, empty). ✓
- `/loved-one` requires an account (self + CSO), for real grant data. ✓
- Soft redirect for logged-in users + "Keep me logged in on this device?" choice (No = session-only cookie). ✓
- **Beta access code required at ACCOUNT CREATION only** (self + loved-one). Login uses the 12-word recovery code; no separate beta code at login. Home + marketing fully open. ✓

**Only thing left is your go.** When you say go, I create branch `restructure/public-platform-split`, work through §8, run §9 verification, and report what changed + how to run it locally in Cursor. Nothing deploys or hits `main`.
