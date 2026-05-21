import ModuleStub from "../_ModuleStub";

export default function PrayersStub() {
  return (
    <ModuleStub
      title="Prayer Library"
      description="Six prayers Catholics have leaned on for centuries, in the moments when words don't come easy."
      whatItWillOffer={[
        "The Memorare — when you feel forgotten or beyond reach.",
        "Prayer to St. Michael the Archangel — for spiritual protection in the moment.",
        "Anima Christi — for union with Christ in suffering.",
        "Act of Contrition — preparing the heart before confession.",
        "The Daily Examen — a short evening review of where God showed up.",
        "Prayer of St. Alphonsus Liguori for Temptation — for the exact moment you feel the pull.",
      ]}
    />
  );
}
