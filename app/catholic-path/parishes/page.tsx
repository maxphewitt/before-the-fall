import ModuleStub from "../_ModuleStub";
import BumpActivity from "../../components/BumpActivity";

export const dynamic = "force-dynamic";

export default function ParishesStub() {
  return (
    <>
    <BumpActivity />
    <ModuleStub
      title="Parish Finder"
      description="A directory of Catholic parishes near you, with everything you need to actually walk through the doors."
      whatItWillOffer={[
        "Search by zip code, city, or current location.",
        "Mass schedules across the week.",
        "Confession times — when and how long.",
        "Parish website, phone, and pastor contact when published.",
        "Notes for the spiritually-distant: which parishes welcome anonymous walk-ins and quiet visits without obligation.",
      ]}
    />
    </>
  );
}
