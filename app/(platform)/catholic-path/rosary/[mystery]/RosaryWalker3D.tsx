"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  MYSTERIES,
  getMysteryBySlug,
  generateRosary,
  todaysMysterySlug,
  type MysterySet,
} from "../../../../lib/rosary";
import {
  createRosaryScene,
  stepTarget,
  ROSARY_MODEL_CREDIT,
  type RosaryScene,
} from "./rosaryScene";
import { recordHabitCompletionForCurrentUser } from "../../../../actions/habits";
import { listIntentions, createEntry } from "../../../../actions/journal";
import { listCommunityIntentions } from "../../../../actions/community";

/**
 * 3D Rosary walker.
 *
 * A rendered rosary (gold crucifix + chain + Our Father beads, silver
 * Hail Mary beads, Immaculate Mary medal) fills the screen. The gate
 * shows the whole rosary zoomed out with Begin at its center and the
 * pre-prayer switches: show/hide prayer text, show/hide mysteries,
 * choose an intention (yours or the community's), and pray the Pope's
 * monthly intention. While praying, the camera walks bead to bead;
 * chosen intentions stay pinned at the top of the screen.
 *
 * Next button, tap (mobile), Space/→ advance; ← goes back; the legacy
 * text walker is archived in the vault if we ever need it again.
 */

type Phase = "gate" | "praying";

type Settings = {
  showPrayers: boolean;
  showMysteries: boolean;
  prayPope: boolean;
};

const SETTINGS_KEY = "btf-rosary-3d-settings";

export default function RosaryWalker3D({
  initialMystery,
  popeIntention,
}: {
  initialMystery: MysterySet;
  popeIntention: { title: string; body: string; period: string };
}) {
  const [phase, setPhase] = useState<Phase>("gate");
  // Which set of mysteries to reflect on. The route (and the picker that
  // links here) defaults to the day's traditional set; the gate lets the
  // user switch. Today's set is labeled once known (client-side date).
  const [mysterySlug, setMysterySlug] = useState<MysterySet>(initialMystery);
  const [todaySlug, setTodaySlug] = useState<MysterySet | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-side date at mount
    setTodaySlug(todaysMysterySlug());
  }, []);
  const { mystery, steps: allSteps } = useMemo(() => {
    const m = getMysteryBySlug(mysterySlug) ?? MYSTERIES[0];
    return { mystery: m, steps: generateRosary(m) };
  }, [mysterySlug]);
  const mysteryName = mystery.name;
  const steps = allSteps;
  const [settings, setSettings] = useState<Settings>({
    showPrayers: true,
    showMysteries: true,
    prayPope: true,
  });
  const [index, setIndex] = useState(0);
  const [webglOk, setWebglOk] = useState(true);
  const [, startTransition] = useTransition();

  // Intention picking
  const [mine, setMine] = useState<{ id: string; text: string }[]>([]);
  const [community, setCommunity] = useState<{ id: string; text: string }[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTab, setPickerTab] = useState<"mine" | "community">("mine");
  const [intention, setIntention] = useState("");
  const [intentionIsNew, setIntentionIsNew] = useState(false);
  const [draft, setDraft] = useState("");

  // Restore saved switches; load intention lists. Best-effort on both.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const s = JSON.parse(raw) as Partial<Settings>;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-time restore
        setSettings((cur) => ({ ...cur, ...s }));
      }
    } catch {
      // Ignore — defaults are fine.
    }
    let active = true;
    listIntentions().then((res) => {
      if (active && res.success)
        setMine(res.data.map((i) => ({ id: i.id, text: i.text })));
    });
    listCommunityIntentions().then((res) => {
      if (active && res.success)
        setCommunity(res.data.map((i) => ({ id: i.id, text: i.body })));
    });
    return () => {
      active = false;
    };
  }, []);

  function updateSettings(patch: Partial<Settings>) {
    setSettings((cur) => {
      const next = { ...cur, ...patch };
      try {
        window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      } catch {
        // Storage full/blocked — non-fatal.
      }
      return next;
    });
  }

  // Hiding the mysteries removes the meditation pages entirely; the
  // decade prayers themselves are untouched.
  const activeSteps = useMemo(
    () =>
      settings.showMysteries
        ? steps
        : steps.filter((s) => s.kind !== "meditation"),
    [steps, settings.showMysteries]
  );
  const total = activeSteps.length;
  const step = activeSteps[Math.min(index, total - 1)];
  const atStart = index === 0;
  const atEnd = index === total - 1;

  // ─── three.js scene lifecycle ──────────────────────────────────────────
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<RosaryScene | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const frame = frameRef.current;
    if (!canvas || !frame) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let scene: RosaryScene | null = null;
    try {
      scene = createRosaryScene(canvas, { reducedMotion: reduced });
    } catch {
      // WebGL unavailable — the walker still works as a text experience.
      // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-time capability check
      setWebglOk(false);
    }
    sceneRef.current = scene;
    if (scene) {
      scene.resize(frame.clientWidth, frame.clientHeight);
      const ro = new ResizeObserver(() => {
        scene?.resize(frame.clientWidth, frame.clientHeight);
      });
      ro.observe(frame);
      return () => {
        ro.disconnect();
        scene?.dispose();
        sceneRef.current = null;
      };
    }
    return () => {
      sceneRef.current = null;
    };
  }, []);

  // Drive the camera from the current phase/step.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (phase === "gate") scene.overview();
    else if (step) scene.focus(stepTarget(step));
  }, [phase, index, step]);

  // ─── Navigation ────────────────────────────────────────────────────────
  function goNext() {
    setIndex((i) => Math.min(i + 1, total - 1));
  }
  function goBack() {
    setIndex((i) => Math.max(i - 1, 0));
  }
  function restartDecade() {
    if (!step || step.section !== "decade" || !("decade" in step)) return;
    const d = step.decade;
    const firstIdx = activeSteps.findIndex(
      (s) => s.section === "decade" && "decade" in s && s.decade === d
    );
    if (firstIdx !== -1) setIndex(firstIdx);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (phase !== "praying") return;
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setIndex((i) => Math.min(i + 1, total - 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setIndex((i) => Math.max(i - 1, 0));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, total]);

  // Habit completion — once, on reaching the final step.
  const completionFired = useRef(false);
  useEffect(() => {
    if (phase === "praying" && atEnd && !completionFired.current) {
      completionFired.current = true;
      recordHabitCompletionForCurrentUser("rosary").catch(() => {
        // Best-effort.
      });
    }
  }, [phase, atEnd]);

  function begin() {
    const chosen = intention.trim();
    // A newly written intention is also saved to their Prayer Intentions
    // (encrypted journal), same as the pre-prayer picker used to do.
    if (chosen && intentionIsNew) {
      startTransition(async () => {
        await createEntry(chosen, "intention").catch(() => {});
      });
    }
    setIndex(0);
    setPhase("praying");
  }

  // ─── Header line ───────────────────────────────────────────────────────
  let headerLine = "";
  if (step?.section === "opening") headerLine = "Opening prayers";
  else if (step?.section === "closing") headerLine = "Closing prayers";
  else if (step && step.section === "decade" && "decade" in step)
    headerLine = `Decade ${step.decade} of 5`;

  const inDecadePrayer =
    step && step.section === "decade" && step.kind !== "meditation";

  return (
    <main className="fixed inset-0 bg-gradient-to-b from-btf-deep-night via-btf-sky-deep to-btf-sky text-white overflow-hidden">
      {/* Gold glow behind the rosary */}
      <div
        className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-btf-gold/15 blur-3xl pointer-events-none"
        aria-hidden
      />

      {/* 3D canvas */}
      <div ref={frameRef} className="absolute inset-0">
        {webglOk && <canvas ref={canvasRef} className="block w-full h-full" />}
      </div>

      {/* Tap-to-advance layer (mobile): sits over the canvas, under the HUD */}
      {phase === "praying" && !atEnd && (
        <button
          type="button"
          aria-label="Next prayer"
          onClick={goNext}
          className="absolute inset-0 z-[1] cursor-pointer bg-transparent"
        />
      )}

      {/* ── HUD ── */}
      {/* Exit */}
      <Link
        href="/catholic-path/rosary"
        aria-label="Exit Rosary"
        className="absolute top-5 left-5 z-20 text-white/60 hover:text-white text-xs tracking-[0.25em] uppercase font-medium transition-colors"
      >
        ← Exit
      </Link>

      {/* Mystery name */}
      <div className="absolute top-5 left-0 right-0 z-10 text-center pointer-events-none">
        <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold/80 font-semibold">
          {mysteryName.replace(/^The /, "")}
        </p>
      </div>

      {phase === "praying" && (
        <>
          {/* Progress */}
          <div className="absolute top-12 left-6 right-6 h-px bg-white/15 z-10">
            <div
              className="h-full bg-btf-gold transition-all duration-500"
              style={{ width: `${Math.round(((index + 1) / total) * 100)}%` }}
              aria-hidden
            />
          </div>

          {/* Intentions — pinned at the top for the whole prayer */}
          {(intention.trim() || settings.prayPope) && (
            <div className="absolute top-16 left-0 right-0 z-10 px-6 pointer-events-none">
              <div className="max-w-md mx-auto space-y-1.5">
                {intention.trim() && (
                  <p className="text-center text-[12px] leading-snug text-btf-gold-light/95 font-light rounded-full bg-btf-deep-night/55 backdrop-blur border border-btf-gold/25 px-4 py-1.5 line-clamp-2">
                    <span className="tracking-[0.14em] uppercase text-[9px] font-semibold text-btf-gold/90 mr-2">
                      Praying for
                    </span>
                    {intention.trim()}
                  </p>
                )}
                {settings.prayPope && (
                  <p className="text-center text-[11px] leading-snug text-white/70 font-light rounded-full bg-btf-deep-night/45 backdrop-blur border border-white/10 px-4 py-1.5 line-clamp-2">
                    <span className="tracking-[0.14em] uppercase text-[9px] font-semibold text-white/50 mr-2">
                      With the Holy Father · {popeIntention.period}
                    </span>
                    {popeIntention.title}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Prayer / meditation panel */}
          <div className="absolute bottom-[7.25rem] left-0 right-0 z-10 px-4 pointer-events-none">
            <div className="max-w-xl mx-auto">
              <div className="rounded-2xl bg-btf-deep-night/70 backdrop-blur-md border border-white/10 px-5 py-4 max-h-[34vh] overflow-y-auto pointer-events-auto">
                <p className="text-center text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/80 font-semibold mb-1.5">
                  {headerLine}
                </p>
                {step?.kind === "meditation" && (
                  <div className="text-center">
                    <h2 className="font-serif text-xl md:text-2xl font-light text-white mb-1">
                      {step.name}
                    </h2>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-btf-gold-light/70 font-semibold mb-2.5">
                      {step.scriptureRef}
                    </p>
                    <p className="font-serif italic text-[15px] md:text-base text-white/85 font-light leading-relaxed">
                      {step.summary}
                    </p>
                  </div>
                )}
                {step?.kind === "prayer" && (
                  <div className="text-center">
                    <h2 className="font-serif text-lg md:text-xl font-light text-btf-gold-light mb-0.5">
                      {step.name}
                    </h2>
                    {typeof step.openingHailIndex === "number" && (
                      <p className="text-[9px] tracking-[0.25em] uppercase text-white/40 font-semibold mb-1.5">
                        Hail Mary {step.openingHailIndex + 1} of 3
                      </p>
                    )}
                    {step.section === "decade" &&
                      step.name === "Hail Mary" &&
                      typeof step.beadIndex === "number" && (
                        <p className="text-[9px] tracking-[0.25em] uppercase text-white/40 font-semibold mb-1.5">
                          Bead {step.beadIndex + 1} of 10
                        </p>
                      )}
                    {settings.showPrayers && (
                      <p className="font-serif text-[15px] md:text-lg text-white/95 font-light leading-relaxed">
                        {step.body}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-6 pt-4 bg-gradient-to-t from-btf-deep-night/90 to-transparent">
            <div className="max-w-xl mx-auto">
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={atStart}
                  aria-label="Previous prayer"
                  className="text-xs tracking-[0.25em] uppercase text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-2"
                >
                  ← Back
                </button>
                <p className="text-[10px] tracking-[0.25em] uppercase text-white/40 font-semibold">
                  {index + 1} / {total}
                </p>
                {inDecadePrayer ? (
                  <button
                    type="button"
                    onClick={restartDecade}
                    aria-label="Restart decade"
                    className="text-xs tracking-[0.25em] uppercase text-white/60 hover:text-white transition-colors px-3 py-2"
                  >
                    Restart decade ↺
                  </button>
                ) : (
                  <span aria-hidden className="w-[7rem]" />
                )}
              </div>
              {atEnd ? (
                <Link
                  href="/catholic-path/rosary"
                  className="w-full block text-center bg-gradient-to-br from-btf-gold to-btf-gold-light text-btf-sky-deep font-medium px-8 py-3.5 rounded-full shadow-lg shadow-btf-gold/30 hover:-translate-y-0.5 transition-transform"
                >
                  Amen. Return to Catholic Path →
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={goNext}
                  className="w-full bg-gradient-to-br from-btf-gold to-btf-gold-light text-btf-sky-deep font-medium px-8 py-3.5 rounded-full shadow-lg shadow-btf-gold/30 hover:-translate-y-0.5 transition-transform"
                >
                  Next →
                </button>
              )}
              <p className="text-center text-[9px] tracking-[0.25em] uppercase text-white/30 font-semibold mt-3">
                Tap anywhere or press Space to continue · ← to go back
              </p>
            </div>
          </div>
        </>
      )}

      {/* ── Settings gate — Begin sits at the center of the rosary ── */}
      {phase === "gate" && (
        <div className="absolute inset-0 z-10 overflow-y-auto">
          <div className="min-h-full flex flex-col items-center justify-center px-6 py-16">
            <div className="w-full max-w-sm rounded-3xl bg-btf-deep-night/70 backdrop-blur-md border border-white/10 p-6">
              <p className="text-center text-[10px] tracking-[0.25em] uppercase text-btf-gold/90 font-semibold mb-1">
                The Holy Rosary
              </p>
              <h1 className="font-serif text-2xl font-light text-center mb-4">
                {mysteryName}
              </h1>

              {/* Which mysteries to reflect on (defaults to the day's set) */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {MYSTERIES.map((m) => {
                  const active = m.slug === mysterySlug;
                  const isToday = m.slug === todaySlug;
                  return (
                    <button
                      key={m.slug}
                      type="button"
                      onClick={() => setMysterySlug(m.slug)}
                      className={
                        "rounded-2xl px-3 py-2.5 text-left border transition-colors " +
                        (active
                          ? "bg-btf-gold/15 border-btf-gold/50"
                          : "bg-white/[0.05] border-white/10 hover:border-btf-gold/30")
                      }
                    >
                      <span
                        className={
                          "block text-[13px] " +
                          (active ? "text-btf-gold-light font-medium" : "text-white/85")
                        }
                      >
                        {m.name.replace(/^The /, "").replace(/ Mysteries$/, "")}
                      </span>
                      <span className="block text-[10px] text-[#8aa0b0] font-light">
                        {isToday ? "Today's mysteries" : m.days.join(" · ")}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Switches */}
              <SettingRow
                label="Show the prayers"
                hint="Read along with each prayer's words."
                on={settings.showPrayers}
                onToggle={() => updateSettings({ showPrayers: !settings.showPrayers })}
              />
              <SettingRow
                label="Show the mysteries"
                hint="A short meditation before each decade."
                on={settings.showMysteries}
                onToggle={() => updateSettings({ showMysteries: !settings.showMysteries })}
              />
              <SettingRow
                label="Pray the Pope's intention"
                hint={`${popeIntention.period} — ${popeIntention.title}`}
                on={settings.prayPope}
                onToggle={() => updateSettings({ prayPope: !settings.prayPope })}
              />

              {/* Intention */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-[10px] tracking-[0.2em] uppercase text-btf-gold font-semibold mb-2">
                  Add an intention
                </p>
                {intention.trim() ? (
                  <div className="flex items-start gap-2 rounded-2xl bg-btf-gold/10 border border-btf-gold/30 px-3.5 py-2.5 mb-2">
                    <p className="flex-1 text-[13px] text-btf-gold-light font-light leading-snug">
                      {intention.trim()}
                    </p>
                    <button
                      type="button"
                      aria-label="Remove intention"
                      onClick={() => {
                        setIntention("");
                        setIntentionIsNew(false);
                      }}
                      className="text-white/50 hover:text-white text-sm leading-none mt-0.5"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPickerOpen((o) => !o)}
                    className="w-full text-left rounded-2xl bg-white/[0.06] border border-white/15 hover:border-btf-gold/40 px-4 py-3 text-[13px] text-[#cfe0ee] transition-colors"
                  >
                    {pickerOpen ? "Choose below…" : "Choose from my intentions or the community's…"}
                  </button>
                )}

                {pickerOpen && !intention.trim() && (
                  <div className="mt-2 rounded-2xl bg-white/[0.04] border border-white/10 p-3">
                    <div className="flex gap-2 mb-2">
                      {(["mine", "community"] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setPickerTab(tab)}
                          className={
                            "flex-1 rounded-full py-1.5 text-[11px] tracking-[0.12em] uppercase font-semibold transition-colors " +
                            (pickerTab === tab
                              ? "bg-btf-gold/20 text-btf-gold-light border border-btf-gold/40"
                              : "bg-white/[0.05] text-white/55 border border-white/10")
                          }
                        >
                          {tab === "mine" ? "My intentions" : "Community"}
                        </button>
                      ))}
                    </div>
                    <ul className="max-h-36 overflow-y-auto space-y-1">
                      {(pickerTab === "mine" ? mine : community).map((it) => (
                        <li key={it.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setIntention(it.text);
                              setIntentionIsNew(false);
                              setPickerOpen(false);
                            }}
                            className="w-full text-left rounded-xl px-3 py-2 text-[13px] text-white/85 font-light hover:bg-white/[0.07] transition-colors"
                          >
                            {it.text}
                          </button>
                        </li>
                      ))}
                      {(pickerTab === "mine" ? mine : community).length === 0 && (
                        <li className="text-[12px] text-white/45 font-light px-3 py-2">
                          {pickerTab === "mine"
                            ? "No saved intentions yet — write one below."
                            : "No community intentions right now."}
                        </li>
                      )}
                    </ul>
                    <div className="mt-2 pt-2 border-t border-white/10 flex gap-2">
                      <input
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="Or write a new intention…"
                        className="flex-1 rounded-xl bg-white/[0.06] border border-white/15 px-3 py-2 text-[13px] text-[#e9f1f8] placeholder:text-[#9fb6c8] outline-none focus:border-btf-gold/50"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const t = draft.trim();
                          if (!t) return;
                          setIntention(t);
                          setIntentionIsNew(true);
                          setDraft("");
                          setPickerOpen(false);
                        }}
                        className="rounded-xl px-3 py-2 text-[12px] font-semibold text-btf-gold-light bg-btf-gold/15 border border-btf-gold/30"
                      >
                        Use
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Begin */}
              <button
                type="button"
                onClick={begin}
                className="mt-5 w-full bg-gradient-to-br from-btf-gold to-btf-gold-light text-btf-sky-deep font-medium px-8 py-4 rounded-full shadow-lg shadow-btf-gold/30 hover:-translate-y-0.5 transition-transform"
              >
                Begin the Rosary
              </button>

              {/* CC BY attribution for the 3D model (license requirement) */}
              <p className="mt-3 text-center text-[9px] text-white/35 font-light leading-snug">
                3D model:{" "}
                <a
                  href={ROSARY_MODEL_CREDIT.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white/60"
                >
                  &ldquo;{ROSARY_MODEL_CREDIT.title}&rdquo;
                </a>{" "}
                by {ROSARY_MODEL_CREDIT.author},{" "}
                <a
                  href={ROSARY_MODEL_CREDIT.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white/60"
                >
                  {ROSARY_MODEL_CREDIT.license}
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function SettingRow({
  label,
  hint,
  on,
  onToggle,
}: {
  label: string;
  hint: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-white/[0.06] last:border-b-0">
      <div className="flex-1 min-w-0">
        <p className="text-[14px] text-white/90">{label}</p>
        <p className="text-[11px] text-[#8aa0b0] font-light leading-snug line-clamp-2">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={onToggle}
        className={
          "relative flex-none w-11 h-6 rounded-full transition-colors " +
          (on ? "bg-btf-gold" : "bg-white/15")
        }
      >
        <span
          aria-hidden
          className={
            "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all " +
            (on ? "left-[1.375rem]" : "left-0.5")
          }
        />
      </button>
    </div>
  );
}
