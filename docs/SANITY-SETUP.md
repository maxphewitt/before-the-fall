# Sanity setup — News & Articles (agency-managed, no code access)

The Next.js read side is already built on the `restructure/public-platform-split`
branch (`app/lib/sanity.ts`, `app/lib/articles.ts`, `/news`, `/news/[slug]`,
`sitemap.ts`). It uses plain `fetch` + GROQ — **no npm packages added**. It stays
dormant until you set the env vars below, so nothing breaks before then.

This runbook gets the agency a content-only editor (Sanity Studio) they log into.
They never see your repo, Vercel, or Supabase.

---

## 1. Create the Sanity project (you, ~5 min)

1. Go to sanity.io → sign up (free "Growth" tier is plenty).
2. Create a new project. Name it "Before the Fall".
3. Create a dataset named `production`. Set visibility to **Public** (recommended —
   the site only reads published posts, and public datasets need no API token).
4. Note your **Project ID** (Sanity → project → API / settings). You'll need it twice.

## 2. Scaffold the Studio (you, ~10 min)

The Studio is the editor app. Keep it in its OWN folder — NOT inside the
before-the-fall repo — so it's fully separate from your code.

```bash
cd ~/Developer
npm create sanity@latest -- --template clean --typescript
# When prompted: log in, select the "Before the Fall" project + "production"
# dataset, project output path: btf-studio
cd btf-studio
```

Then drop in the schema files from this bundle (`sanity-studio/schemaTypes/`):

1. Copy all files from `sanity-studio/schemaTypes/` into `btf-studio/schemaTypes/`,
   replacing the generated `index.ts`.
2. Open `sanity.config.ts` and make sure the schema is wired:
   ```ts
   import { schemaTypes } from "./schemaTypes";
   // ...
   schema: { types: schemaTypes },
   ```
3. Run it locally to check:
   ```bash
   npm run dev      # opens http://localhost:3333
   ```
4. Deploy the hosted Studio (this is the URL the agency uses):
   ```bash
   npx sanity deploy
   # pick a hostname, e.g. beforethefall → https://beforethefall.sanity.studio
   ```

## 3. Point the website at Sanity (you, ~2 min)

Add these to `before-the-fall/.env.local` AND to Vercel
(Project → Settings → Environment Variables):

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

(Only if you made the dataset Private: also add `SANITY_READ_TOKEN=` with a
Viewer token from Sanity → API → Tokens. With a Public dataset, skip it.)

Redeploy. That's the entire wiring — no code change needed.

## 4. Invite the agency (you, ~2 min)

Sanity → project → **Members** → Invite. Give them the **Editor** role
(content only — NOT Administrator). They get the Studio URL + their own login.
They can write, upload images, and publish; they cannot touch billing, members,
your repo, Vercel, or Supabase.

---

## How the agency publishes (give them this)

1. Open the Studio URL, log in.
2. First time only: create an **Author** (you) and a couple of **Categories**
   (e.g. "News", "Blog").
3. **Article → Create new.** Fill Title, Slug (auto from title), Excerpt, Cover
   image, Category, Author, and the Body (drag images straight in). Set
   **Published at**.
4. Open the **SEO** tab to override meta title / description / social image —
   otherwise the site falls back to the title, excerpt, and cover automatically.
5. **Publish.**

The post appears on the site within ~60 seconds:
- the newest posts cycle into the **homepage carousel** (News/Blog slides), and
- the full article lives at `beforethefall.app/news/<slug>`, listed on `/news`.

Scheduling: set "Published at" to a future time and the post stays hidden until then.

---

## What the website does automatically

- Per-article SEO: `<title>`, meta description, Open Graph / Twitter cards from the
  CMS SEO fields (with title/excerpt/cover fallbacks).
- JSON-LD `Article` structured data on each post (rich results in Google).
- `sitemap.xml` includes every published article.
- Images served from Sanity's CDN, optimized via `next/image`.

Note: the whole site is currently `noindex` during closed beta (set in
`app/layout.tsx`). Flip that to index at public launch and the articles become
search-visible.
