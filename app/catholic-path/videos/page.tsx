import ModuleStub from "../_ModuleStub";
import BumpActivity from "../../components/BumpActivity";

export const dynamic = "force-dynamic";

export default function VideosStub() {
  return (
    <>
    <BumpActivity />
    <ModuleStub
      title="Weekly Teaching Videos"
      description="Short videos from Catholic priests and clinicians on what scripture and the Magisterium have to say about the kinds of struggles people bring here."
      whatItWillOffer={[
        "A new short video each week — five to ten minutes, low production overhead, high signal.",
        "Each one paired with the scripture and Catechism references it draws from, so you can dig deeper if you want.",
        "Both clergy and Catholic clinicians on rotation — the spiritual and the practical, in the same place.",
        "A small library of past episodes you can return to.",
      ]}
    />
    </>
  );
}
