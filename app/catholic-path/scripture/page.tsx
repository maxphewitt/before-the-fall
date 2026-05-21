import ModuleStub from "../_ModuleStub";

export default function ScriptureStub() {
  return (
    <ModuleStub
      title="Daily Scripture"
      description="A short reading from a Catholic translation, paired with a reflection written for the moment you're in."
      whatItWillOffer={[
        "Your choice of translation — NABRE (default, used at Mass in the US), RSV-2CE (traditional/scholarly), or Douay-Rheims (Latin Mass community).",
        "Readings selected for what you said you're carrying at signup — not generic verse-of-the-day.",
        "A short guided reflection on each passage, written to land in real life.",
        "Saved to your journal if you want to keep what struck you.",
      ]}
    />
  );
}
