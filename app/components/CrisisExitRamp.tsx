"use client";

import { useEffect, useState } from "react";

type Resource = {
  name: string;
  action: string;
  href: string;
  text: string;
};

const RESOURCES: Resource[] = [
  {
    name: "988 Suicide & Crisis Lifeline",
    action: "Call or text 988",
    href: "tel:988",
    text: "For thoughts of suicide, self-harm, emotional distress, or substance crisis. Veterans press 1 after dialing.",
  },
  {
    name: "Crisis Text Line",
    action: "Text HOME to 741741",
    href: "sms:741741&body=HOME",
    text: "For any kind of crisis if you can't or don't want to talk on the phone.",
  },
  {
    name: "National Domestic Violence Hotline",
    action: "Call 1-800-799-7233",
    href: "tel:18007997233",
    text: "For anyone experiencing or worried about domestic violence — victim, survivor, or someone trying to stop hurting a partner.",
  },
  {
    name: "NCMEC CyberTipline",
    action: "Call 1-800-843-5678",
    href: "tel:18008435678",
    text: "Reporting child sexual exploitation, missing children, or someone struggling with attractions to minors who wants help before harming a child.",
  },
  {
    name: "Stop It Now",
    action: "Call 1-888-773-8368",
    href: "tel:18887738368",
    text: "Confidential help for adults concerned about their own thoughts or behavior toward children, or worried about another adult's behavior toward a child.",
  },
  {
    name: "SAMHSA National Helpline",
    action: "Call 1-800-662-4357",
    href: "tel:18006624357",
    text: "Free, confidential treatment referrals for substance use disorders and mental health conditions.",
  },
  {
    name: "Childhelp National Child Abuse Hotline",
    action: "Call 1-800-422-4453",
    href: "tel:18004224453",
    text: "For anyone reporting suspected child abuse, or a child in distress.",
  },
];

export default function CrisisExitRamp() {
  const [open, setOpen] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      {/* Persistent floating button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open crisis resources"
        className="fixed bottom-5 right-5 z-40 bg-[#8b1a1a] hover:bg-[#a02020] text-white font-medium px-5 py-3 rounded-full shadow-xl shadow-red-950/30 flex items-center gap-2 transition-colors text-sm tracking-wide"
      >
        <span aria-hidden>⚠</span>
        <span>I&rsquo;m in crisis</span>
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="crisis-title"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky header */}
            <div className="bg-btf-sky-deep text-white px-6 sm:px-8 py-6 sm:py-8 sticky top-0 rounded-t-3xl">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close crisis resources"
                className="absolute top-3 right-4 text-white/70 hover:text-white text-3xl leading-none w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                ×
              </button>
              <h2 id="crisis-title" className="font-serif text-2xl sm:text-3xl font-light pr-8">
                We&rsquo;re glad you stopped here.
              </h2>
              <p className="mt-3 text-sm text-white/85 font-light leading-relaxed">
                If you are in immediate danger &mdash; to yourself or to anyone else &mdash; please reach a real person right now. The numbers below connect you to trained crisis counselors, 24 hours a day, free.
              </p>
            </div>

            {/* Resources list */}
            <ul className="px-4 sm:px-6 py-5 space-y-3">
              {RESOURCES.map((r) => (
                <li key={r.name}>
                  <a
                    href={r.href}
                    className="block rounded-xl border border-btf-text-light/20 bg-white hover:bg-btf-sky-pale/30 hover:border-btf-sky-light px-4 py-4 transition-colors"
                  >
                    <p className="text-[10px] tracking-[0.2em] uppercase text-btf-text-light font-semibold mb-1">
                      {r.name}
                    </p>
                    <p className="font-serif text-lg text-btf-sky-deep mb-1.5">
                      {r.action}
                    </p>
                    <p className="text-xs text-btf-text-mid font-light leading-relaxed">
                      {r.text}
                    </p>
                  </a>
                </li>
              ))}
            </ul>

            {/* Weapon distance footer note */}
            <div className="px-6 sm:px-8 pb-8 pt-2">
              <div className="border-t border-btf-text-light/15 pt-5">
                <p className="text-xs text-btf-text-mid font-light leading-relaxed text-center">
                  If you have a weapon nearby and you are thinking about hurting yourself or someone else, the most important next step is to put distance between you and that weapon. Lock it in a car. Hand it to a neighbor. Place it outside the door. Then call 988 or 911.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}