import { Suspense } from "react";
import LovedOneResultClient from "./LovedOneResultClient";

/**
 * /loved-one/result — code reveal + CSO resources.
 *
 * Wrapper around the client subcomponent so we can use a Suspense
 * boundary for useSearchParams without tripping Next.js's
 * static-prerender check (the same pattern we use on /journal/new).
 */
export const dynamic = "force-dynamic";

export default function LovedOneResultPage() {
  return (
    <Suspense fallback={null}>
      <LovedOneResultClient />
    </Suspense>
  );
}
