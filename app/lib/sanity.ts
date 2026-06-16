/**
 * Sanity content layer — dependency-free.
 *
 * Reads published content from Sanity's hosted query API over plain
 * fetch (GROQ). No npm packages, no SDK, nothing to bundle. The agency
 * edits content in Sanity Studio (a separate hosted app they log into);
 * this file only ever READS.
 *
 * Configure via env (see SANITY-SETUP.md):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID   (required to enable Sanity)
 *   NEXT_PUBLIC_SANITY_DATASET      (default "production")
 *   NEXT_PUBLIC_SANITY_API_VERSION  (default "2024-01-01")
 *   SANITY_READ_TOKEN               (optional — only if the dataset is private)
 *
 * When NEXT_PUBLIC_SANITY_PROJECT_ID is absent, everything degrades
 * gracefully: queries return null and the site falls back to its
 * "coming soon" states. So the app runs fine before Sanity exists.
 */

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
const readToken = process.env.SANITY_READ_TOKEN;

/** True once a Sanity project id is configured. */
export const sanityConfigured = Boolean(projectId);

/**
 * Run a GROQ query against the Sanity CDN (published content). Returns
 * null if Sanity isn't configured or the request fails — callers should
 * treat null as "no content".
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  revalidateSeconds = 60
): Promise<T | null> {
  if (!projectId) return null;
  try {
    const url = new URL(
      `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}`
    );
    url.searchParams.set("query", query);
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(`$${k}`, JSON.stringify(v));
    }
    const res = await fetch(url.toString(), {
      headers: readToken ? { Authorization: `Bearer ${readToken}` } : {},
      next: { revalidate: revalidateSeconds },
    });
    if (!res.ok) {
      console.error("Sanity fetch failed:", res.status, await res.text());
      return null;
    }
    const json = (await res.json()) as { result: T };
    return json.result;
  } catch (err) {
    console.error("Sanity fetch exception:", err);
    return null;
  }
}

/**
 * Build an image CDN URL from a Sanity asset _ref, without
 * @sanity/image-url. Ref format: image-<assetId>-<w>x<h>-<ext>.
 */
export function urlForImage(
  ref: string | null | undefined,
  width = 1200
): string | null {
  if (!ref || !projectId) return null;
  const m = /^image-([a-f0-9]+)-(\d+)x(\d+)-(\w+)$/.exec(ref);
  if (!m) return null;
  const [, id, w, h, ext] = m;
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${w}x${h}.${ext}?w=${width}&auto=format&fit=max`;
}
