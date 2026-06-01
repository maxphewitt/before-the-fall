import { getCurrentUserId } from "../lib/session";

/**
 * Server component whose only job is to fire the activity-touch side
 * effect by calling getCurrentUserId() on render. Drop `<BumpActivity />`
 * into any server-rendered page where you want a visit to count as
 * activity for the signed-in user.
 *
 * Returns null. Calling cookies() (inside getCurrentUserId) implicitly
 * opts the host route into dynamic rendering, so static-export pages
 * that include this become per-request.
 */
export default async function BumpActivity() {
  await getCurrentUserId();
  return null;
}
