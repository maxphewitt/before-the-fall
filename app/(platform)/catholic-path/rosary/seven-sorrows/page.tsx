import { getCurrentUserId } from "../../../../lib/session";
import OnboardingRequired from "../../../../components/OnboardingRequired";
import { generateSevenSorrows } from "../../../../lib/sevenSorrows";
import ChapletWalker from "./ChapletWalker";

/**
 * /catholic-path/rosary/seven-sorrows — the Seven Sorrows Rosary
 * (Servite chaplet), prayed in the text-first walker. Static route, so
 * it wins over the [mystery] dynamic sibling. A 3D chaplet model can
 * replace the walker later, same as the main Rosary's path.
 */
export const dynamic = "force-dynamic";

export default async function SevenSorrowsPage() {
  const userId = await getCurrentUserId();
  if (!userId) return <OnboardingRequired returnTo="/catholic-path/rosary/seven-sorrows" />;

  const steps = generateSevenSorrows();

  return (
    <ChapletWalker
      title="The Seven Sorrows of Mary"
      steps={steps}
      unitLabel="Sorrow"
      unitTotal={7}
      beadsPerUnit={7}
      habitSlug="seven-sorrows"
    />
  );
}
