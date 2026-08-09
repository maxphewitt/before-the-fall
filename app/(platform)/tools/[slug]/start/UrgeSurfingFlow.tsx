"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createToolSession } from "../../../../actions/journal";
import type { UrgeOutcome } from "../../../../lib/journalTypes";
import { getDisplayStreak } from "../../../../actions/streaks";
import type { DisplayStreak } from "../../../../lib/streakTypes";
import StreakChip from "../../../../components/StreakChip";
import { ToolHeader } from "./_shared";
import {
  saveUrgeSurfSession,
  getUrgeSurfStats,
  type UrgeSurfStats,
} from "../../../../actions/urgeSurf";
import {
  type Path,
  type Theme,
  QUOTES,
  ENCOURAGE,
  CHECKINS,
  PROMPTS,
  ACKS_CRESTING,
  ACKS_EASING,
  BREATH_WORDS,
  inferThemes,
  pick,
  pickQuote,
  selectStory,
  bridgeFor,
} from "../../../../lib/urgeSurfContent";

/**
 * Ride It Out — narrator-guided urge surfing.
 *
 * Locked mechanics (per PROMPT.md): breath-paced orb metronome (in 4s,
 * hold 1.5s, out 5.5s), a single silent narrator ABOVE the orb,
 * reflections answered at the BOTTOM, a "jot a thought" tab, OPEN-ENDED
 * (the user decides when it's passed), every input gets a warm reply,
 * and an always-present crisis off-ramp. Restyled to the Before the Fall
 * brand; reduced-motion respected; content public-domain + verified.
 *
 * Faith path is draft pending pastoral review; CBT approach pending
 * licensed-clinician review.
 */

type Reflection = { q: string | null; a: string; own: boolean };
type Screen = "path" | "welcome" | "name" | "wave" | "journal";

export default function UrgeSurfingFlow({ initialPath }: { initialPath?: Path }) {
  // If we already know the voice from the user's faith preference, skip the
  // chooser and go straight to the welcome (the voice stays switchable there).
  const [screen, setScreen] = useState<Screen>(initialPath ? "welcome" : "path");
  const [path, setPath] = useState<Path>(initialPath ?? "secular");
  const [triggers, setTriggers] = useState<string[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const addReflection = useCallback(
    (r: Reflection) => setReflections((prev) => [...prev, r]),
    []
  );
  const [durationMs, setDurationMs] = useState(0);

  function reset() {
    setReflections([]);
    setTriggers([]);
    setDurationMs(0);
    setScreen(initialPath ? "welcome" : "path");
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-btf-deep-night via-btf-sky-deep to-btf-sky text-white overflow-hidden">
      {/* Shared Exit + title header (hidden during the full-immersive wave,
          which carries its own controls). */}
      {screen !== "wave" && (
        <div className="absolute top-0 inset-x-0 z-30">
          <div className="max-w-xl mx-auto px-6 py-8">
            <ToolHeader toolName="Urge Surfing" toolSlug="urge-surfing" />
          </div>
        </div>
      )}
      {screen === "path" && (
        <PathScreen
          onPick={(p) => {
            setPath(p);
            setScreen("welcome");
          }}
        />
      )}
      {screen === "welcome" && (
        <WelcomeScreen
          path={path}
          onSwitch={() => setPath((p) => (p === "catholic" ? "secular" : "catholic"))}
          onBegin={() => setScreen("name")}
        />
      )}
      {screen === "name" && (
        <NameScreen
          triggers={triggers}
          setTriggers={setTriggers}
          onStart={() => setScreen("wave")}
        />
      )}
      {screen === "wave" && (
        <WaveScreen
          path={path}
          triggers={triggers}
          onReflection={addReflection}
          onFinish={(ms) => {
            setDurationMs(ms);
            setScreen("journal");
          }}
        />
      )}
      {screen === "journal" && (
        <JournalScreen
          path={path}
          triggers={triggers}
          reflections={reflections}
          durationMs={durationMs}
          onRestart={reset}
        />
      )}
    </main>
  );
}

/* ─── Screen 1: path ─── */
function PathScreen({ onPick }: { onPick: (p: Path) => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-12 max-w-xl mx-auto">
      <Cross className="mb-8" />
      <h1 className="font-serif text-3xl md:text-4xl font-light leading-tight mb-3">
        First, who&rsquo;s walking with you?
      </h1>
      <p className="text-white/75 font-light leading-relaxed mb-9 max-w-md">
        Pick the voice that feels like home. It shapes the words you&rsquo;ll
        hear &mdash; and you can change it anytime.
      </p>
      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={() => onPick("catholic")}
          className="w-full text-left rounded-2xl border-2 border-white/15 bg-white/5 hover:border-btf-gold hover:bg-white/10 p-5 transition-all cursor-pointer"
        >
          <p className="font-serif text-xl">The faith path</p>
          <p className="text-sm text-white/70 font-light mt-1">
            Scripture and the Psalms meet you in the harder moments.
          </p>
        </button>
        <button
          onClick={() => onPick("secular")}
          className="w-full text-left rounded-2xl border-2 border-white/15 bg-white/5 hover:border-btf-gold hover:bg-white/10 p-5 transition-all cursor-pointer"
        >
          <p className="font-serif text-xl">The wisdom path</p>
          <p className="text-sm text-white/70 font-light mt-1">
            Philosophers and quiet, time-tested words keep you company.
          </p>
        </button>
      </div>
    </div>
  );
}

/* ─── Screen 2: welcome ─── */
function WelcomeScreen({
  path,
  onSwitch,
  onBegin,
}: {
  path: Path;
  onSwitch: () => void;
  onBegin: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-12 max-w-xl mx-auto">
      <div className="btf-breathe mb-8">
        <Cross />
      </div>
      <h1 className="font-serif text-3xl md:text-4xl font-light leading-tight mb-4">
        An urge is a wave.
      </h1>
      <p className="text-white/80 font-light leading-relaxed mb-10 max-w-md">
        It rises, it crests, and &mdash; every single time &mdash; it falls
        again. You don&rsquo;t have to fight it or fix it. You just have to stay
        on the board until it passes.
      </p>
      <button
        onClick={onBegin}
        className="bg-btf-gold hover:bg-btf-gold-light text-btf-sky-deep font-medium px-10 py-4 rounded-full shadow-lg shadow-btf-gold/30 transition-all hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
      >
        I&rsquo;m ready to begin
      </button>
      <p className="mt-6 text-sm text-white/55 font-light">
        {path === "catholic" ? "Walking the faith path." : "Walking the wisdom path."}{" "}
        <button
          onClick={onSwitch}
          className="underline underline-offset-2 text-white/70 hover:text-white cursor-pointer"
        >
          Switch to the {path === "catholic" ? "wisdom" : "faith"} voice
        </button>
      </p>
    </div>
  );
}

/* ─── Screen 3: name the urge ─── */
function NameScreen({
  triggers,
  setTriggers,
  onStart,
}: {
  triggers: string[];
  setTriggers: (t: string[]) => void;
  onStart: () => void;
}) {
  const [input, setInput] = useState("");
  function add() {
    const v = input.trim();
    if (!v) return;
    setTriggers([...triggers, v]);
    setInput("");
  }
  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12 max-w-xl mx-auto">
      <h1 className="font-serif text-2xl md:text-3xl font-light leading-tight mb-2 text-center">
        What&rsquo;s pulling at you?
      </h1>
      <p className="text-white/75 font-light leading-relaxed mb-7 text-center text-sm">
        Name it plainly &mdash; the urge, the trigger, whatever&rsquo;s here
        right now. Just naming it loosens its grip a little.
      </p>
      <div className="rounded-2xl bg-white/5 border border-white/15 p-5">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            placeholder="e.g. stress after work, late and alone…"
            autoComplete="off"
            className="flex-1 rounded-xl bg-white/10 border border-white/15 focus:border-btf-gold focus:outline-none px-4 py-3 text-white placeholder:text-white/40"
          />
          <button
            onClick={add}
            className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 text-sm font-medium transition-colors cursor-pointer"
          >
            Add
          </button>
        </div>
        {triggers.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {triggers.map((t, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 text-sm"
              >
                {t}
                <button
                  aria-label={`Remove ${t}`}
                  onClick={() => setTriggers(triggers.filter((_, j) => j !== i))}
                  className="text-btf-gold-light hover:text-white cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-white/50 font-light mt-3">
          Add as many as you like. We&rsquo;ll keep them for your journal.
        </p>
      </div>
      <button
        onClick={onStart}
        className="mt-7 bg-btf-gold hover:bg-btf-gold-light text-btf-sky-deep font-medium px-8 py-3.5 rounded-full shadow-lg shadow-btf-gold/30 transition-all hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer mx-auto"
      >
        Take me to the water →
      </button>
    </div>
  );
}

/* ─── Screen 4: the wave ─── */
const IN = 4,
  HOLD = 1.5,
  OUT = 5.5,
  CYCLE = IN + HOLD + OUT;

function breathPhase(t: number): { amt: number; cue: "in" | "hold" | "out" } {
  const p = t % CYCLE;
  if (p < IN) return { amt: p / IN, cue: "in" };
  if (p < IN + HOLD) return { amt: 1, cue: "hold" };
  return { amt: 1 - (p - IN - HOLD) / OUT, cue: "out" };
}
function urgeIntensity(t: number): number {
  const peak = 46,
    climb = 18,
    ease = 60;
  const v =
    t < peak
      ? Math.exp(-Math.pow((t - peak) / climb, 2))
      : Math.max(0.16, Math.exp(-Math.pow((t - peak) / ease, 2)));
  return Math.max(0.16, v);
}

type NarrState = { text: string; cls: string; visible: boolean };

function WaveScreen({
  path,
  triggers,
  onReflection,
  onFinish,
}: {
  path: Path;
  triggers: string[];
  onReflection: (r: Reflection) => void;
  onFinish: (ms: number) => void;
}) {
  const orbRef = useRef<HTMLDivElement | null>(null);
  const w1 = useRef<SVGPathElement | null>(null);
  const w2 = useRef<SVGPathElement | null>(null);
  const w3 = useRef<SVGPathElement | null>(null);

  const [narr, setNarr] = useState<NarrState>({ text: "", cls: "lead", visible: false });
  const [promptOpen, setPromptOpen] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [promptInput, setPromptInput] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [noteConfirm, setNoteConfirm] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const promptTextRef = useRef<string>("");

  // Engine API exposed to JSX handlers.
  const api = useRef<{
    answer: (text: string) => void;
    skip: () => void;
    openNote: () => void;
    saveNote: (text: string) => void;
    finish: () => void;
  } | null>(null);

  useEffect(() => {
    const themes: Theme[] = inferThemes(triggers);
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── engine state (local; refs not needed since closure is stable) ──
    let raf = 0;
    let narrTimer: ReturnType<typeof setTimeout> | null = null;
    const startTime = performance.now();
    const beatQueue: { say?: string; cls?: string; guided?: number; reflect?: string }[] = [];
    let movementIdx = 0;
    const toldIds: string[] = [];
    let breathGuide = false;
    let breatheTarget = 0;
    let breatheDone = 0;
    let gPrev = "";
    let reflectOpen = false;
    let noteShowing = false;
    let finished = false;

    const elapsed = () => (performance.now() - startTime) / 1000;
    const isEasing = () => elapsed() > 50 || urgeIntensity(elapsed()) < 0.55;

    function setNarrator(text: string, cls: string) {
      setNarr((p) => ({ ...p, visible: false }));
      window.setTimeout(() => setNarr({ text, cls, visible: true }), 280);
    }
    function readMs(text: string) {
      return Math.min(9500, 4200 + text.length * 38);
    }
    function scheduleNext(ms: number) {
      if (narrTimer) clearTimeout(narrTimer);
      narrTimer = setTimeout(advance, ms);
    }
    function startGuidedBreath(cycles: number) {
      breathGuide = true;
      breatheTarget = cycles;
      breatheDone = 0;
      gPrev = "";
      setNarrator("Let's take a few slow breaths together.", "breath");
    }
    function refill() {
      const m = movementIdx++;
      if (m > 0 && m % 3 === 2) beatQueue.push({ guided: 2 });
      const story = selectStory(path, themes, toldIds);
      if (story) {
        toldIds.push(story.id);
        story.lines.forEach((line) => beatQueue.push({ say: line }));
        beatQueue.push({ say: bridgeFor(path), cls: "ack" });
      }
      beatQueue.push({ say: pick(ENCOURAGE), cls: "ack" });
      if (m % 2 === 1) beatQueue.push({ reflect: pick(PROMPTS) });
      if (m % 2 === 0) {
        const q = pickQuote(path, isEasing() ? "closing" : "peak");
        beatQueue.push({ say: `“${q.text}” — ${q.src}`, cls: "quote" });
      }
      if (m % 3 === 0) beatQueue.push({ say: pick(CHECKINS), cls: "lead" });
    }
    function advance() {
      if (finished || reflectOpen) return;
      if (noteShowing) {
        scheduleNext(2500);
        return;
      }
      if (!beatQueue.length) refill();
      const beat = beatQueue.shift();
      if (!beat) return;
      if (beat.guided) {
        startGuidedBreath(beat.guided);
        return;
      }
      if (beat.reflect) {
        reflectOpen = true;
        setPromptText(beat.reflect);
        setPromptInput("");
        setPromptOpen(true);
        setNarrator("Let's pause a moment. " + beat.reflect, "lead");
        return;
      }
      setNarrator(beat.say ?? "", beat.cls ?? "");
      scheduleNext(readMs(beat.say ?? ""));
    }

    function drawWave(el: SVGPathElement | null, phase: number, amp: number, yBase: number) {
      if (!el) return;
      const W = 560,
        H = 300,
        baseY = H * yBase;
      let d = `M0 ${baseY}`;
      for (let x = 0; x <= W; x += 20) {
        const y = baseY + Math.sin((x / W) * 6.28 * 1.4 + phase) * amp;
        d += ` L${x} ${y.toFixed(1)}`;
      }
      d += ` L${W} ${H} L0 ${H} Z`;
      el.setAttribute("d", d);
    }

    function loop() {
      const t = elapsed();
      const b = breathPhase(t);
      const urge = urgeIntensity(t);

      if (breathGuide && b.cue !== gPrev) {
        if (b.cue === "in" && gPrev === "out") breatheDone++;
        gPrev = b.cue;
        if (breatheDone >= breatheTarget) {
          breathGuide = false;
          setNarrator(pick(["Good. Stay just like that.", "There. The breath is yours now."]), "ack");
          scheduleNext(2600);
        } else {
          setNarrator(BREATH_WORDS[b.cue], "breath");
        }
      }

      const orb = orbRef.current;
      if (orb) {
        const base = 70 + urge * 60;
        const breathScale = reduced ? 1 : 0.9 + b.amt * 0.35;
        orb.style.width = orb.style.height = `${base}px`;
        orb.style.transform = `translate(-50%,-50%) scale(${breathScale})`;
        orb.style.boxShadow = `0 0 ${40 + urge * 60}px ${8 + urge * 16}px rgba(201,168,76,${0.35 + urge * 0.4})`;
      }
      if (!reduced) {
        drawWave(w1.current, t * 0.7, 26, 0.6);
        drawWave(w2.current, t * 0.9, 20, 0.45);
        drawWave(w3.current, t * 1.1, 14, 0.3);
      }
      raf = requestAnimationFrame(loop);
    }

    // expose handlers
    api.current = {
      answer: (text) => {
        const v = text.trim();
        reflectOpen = false;
        setPromptOpen(false);
        if (v) onReflection({ q: promptTextRef.current, a: v, own: false });
        setNarrator(
          v ? pick(isEasing() ? ACKS_EASING : ACKS_CRESTING) : "That's okay. Stay with the breath — I'm right here.",
          "ack"
        );
        scheduleNext(v ? 3400 : 2600);
      },
      skip: () => {
        reflectOpen = false;
        setPromptOpen(false);
        setNarrator("That's okay. Just stay with the breath — I'll keep going.", "ack");
        scheduleNext(2600);
      },
      openNote: () => {
        noteShowing = true;
        if (reflectOpen) {
          reflectOpen = false;
          setPromptOpen(false);
          scheduleNext(1200);
        }
        setNoteConfirm("");
        setNoteOpen(true);
      },
      saveNote: (text) => {
        const v = text.trim();
        if (v) {
          onReflection({ q: null, a: v, own: true });
          setNoteConfirm("Kept in your journal — add another, or close.");
        } else {
          noteShowing = false;
          setNoteOpen(false);
        }
      },
      finish: () => {
        finished = true;
        if (raf) cancelAnimationFrame(raf);
        if (narrTimer) clearTimeout(narrTimer);
        onFinish(performance.now() - startTime);
      },
    };

    // start
    loop();
    setNarrator(
      "Welcome. Let's ride this out together — there's no clock here, and you decide when it's passed.",
      "lead"
    );
    narrTimer = setTimeout(() => startGuidedBreath(3), 5400);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (narrTimer) clearTimeout(narrTimer);
      api.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  // keep latest prompt text available to the engine's answer handler
  useEffect(() => {
    promptTextRef.current = promptText;
  }, [promptText]);

  // close the note sheet when needed
  function closeNote() {
    setNoteOpen(false);
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Narrator — above the orb */}
      <div className="absolute left-0 right-0 top-[7%] h-[34%] flex items-center justify-center px-6 pointer-events-none">
        <p
          className={
            "max-w-[34ch] text-center leading-relaxed transition-opacity duration-500 " +
            (narr.visible ? "opacity-100" : "opacity-0") +
            " " +
            narratorClass(narr.cls)
          }
        >
          {narr.text}
        </p>
      </div>

      {/* Orb */}
      <div
        ref={orbRef}
        className="absolute left-1/2 top-[54%] rounded-full"
        style={{
          width: 96,
          height: 96,
          transform: "translate(-50%,-50%)",
          background: "radial-gradient(circle at 35% 30%, #fff, #c9a84c 70%)",
          willChange: "transform",
        }}
        aria-hidden
      />

      {/* Waves */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[46%]"
        viewBox="0 0 560 300"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path ref={w1} fill="rgba(255,255,255,0.16)" />
        <path ref={w2} fill="rgba(61,143,196,0.45)" />
        <path ref={w3} fill="#0d4f7c" />
      </svg>

      {/* Done bar */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => api.current?.finish()}
          className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
        >
          I&rsquo;m ready to come back
        </button>
      </div>

      {/* Jot a thought tab (left edge) */}
      <button
        onClick={() => api.current?.openNote()}
        className="absolute left-0 top-[56%] -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 border border-white/15 rounded-r-2xl pl-3 pr-4 py-3 text-sm font-medium transition-colors cursor-pointer"
      >
        jot a thought
      </button>

      {/* Reflection prompt (bottom) — compact; the narrator carries the
          question, so the card is just a quiet place to answer. */}
      {promptOpen && (
        <div className="absolute left-4 right-4 bottom-5 z-30 mx-auto max-w-sm rounded-2xl bg-btf-sky-deep/95 border border-white/15 p-3 shadow-xl">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                api.current?.answer(promptInput);
                setPromptInput("");
              }
            }}
            placeholder="a word or two is plenty…"
            className="w-full rounded-lg bg-white/10 border border-white/15 focus:border-btf-gold focus:outline-none px-3 py-2 text-sm text-white placeholder:text-white/40"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => api.current?.skip()}
              className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full py-2 text-xs font-medium transition-colors cursor-pointer"
            >
              Just breathe
            </button>
            <button
              onClick={() => {
                api.current?.answer(promptInput);
                setPromptInput("");
              }}
              className="flex-1 bg-btf-gold hover:bg-btf-gold-light text-btf-sky-deep rounded-full py-2 text-xs font-medium transition-colors cursor-pointer"
            >
              Share it
            </button>
          </div>
        </div>
      )}

      {/* Note sheet (bottom) — compact */}
      {noteOpen && (
        <div className="absolute left-4 right-4 bottom-5 z-40 mx-auto max-w-sm rounded-2xl bg-btf-sky-deep/95 border border-white/15 p-3 shadow-xl">
          <p className="text-xs text-white/70 font-light mb-2">
            In your own words — what do you want to remember?
          </p>
          <textarea
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            rows={2}
            placeholder="anything you want in your journal…"
            className="w-full rounded-lg bg-white/10 border border-white/15 focus:border-btf-gold focus:outline-none px-3 py-2 text-sm text-white placeholder:text-white/40 resize-none"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={closeNote}
              className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full py-2 text-xs font-medium transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                api.current?.saveNote(noteInput);
                setNoteInput("");
              }}
              className="flex-1 bg-btf-gold hover:bg-btf-gold-light text-btf-sky-deep rounded-full py-2 text-xs font-medium transition-colors cursor-pointer"
            >
              Keep it
            </button>
          </div>
          {noteConfirm && (
            <p className="text-[11px] text-btf-gold-light font-medium mt-2">{noteConfirm}</p>
          )}
        </div>
      )}

      {/* Crisis off-ramp */}
      {!promptOpen && !noteOpen && (
        <div className="absolute bottom-4 left-0 right-0 text-center z-10">
          <button
            onClick={() => setHelpOpen(true)}
            className="text-white/70 hover:text-white text-xs underline underline-offset-2 cursor-pointer"
          >
            Feeling unsafe right now?
          </button>
        </div>
      )}

      {helpOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="absolute inset-0 z-50 bg-btf-deep-night/70 flex items-center justify-center p-6"
        >
          <div className="bg-btf-sky-deep border border-white/15 rounded-3xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="font-serif text-xl mb-3">
              You don&rsquo;t have to ride this one alone.
            </h3>
            <p className="text-sm text-white/80 font-light leading-relaxed mb-4">
              If the urge feels like more than a wave right now, a real person
              can help more than any app.
            </p>
            <div className="space-y-2 mb-4">
              <a
                href="tel:988"
                className="block bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl px-4 py-3 text-center transition-colors"
              >
                <span className="text-btf-gold-light font-semibold">988</span> · Suicide &amp; Crisis Lifeline
              </a>
              <a
                href="sms:741741&body=HOME"
                className="block bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl px-4 py-3 text-center transition-colors text-sm"
              >
                Text <span className="text-btf-gold-light font-semibold">HOME</span> to 741741
              </a>
            </div>
            <button
              onClick={() => setHelpOpen(false)}
              className="w-full bg-btf-gold hover:bg-btf-gold-light text-btf-sky-deep rounded-full py-3 text-sm font-medium transition-colors cursor-pointer"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function narratorClass(cls: string): string {
  switch (cls) {
    case "breath":
      return "font-serif text-2xl text-btf-gold-light";
    case "quote":
      return "font-serif italic text-lg text-white/90";
    case "ack":
    case "lead":
    default:
      return "font-light text-lg text-white/90";
  }
}

/* ─── Screen 5: journal ─── */
function JournalScreen({
  path,
  triggers,
  reflections,
  durationMs,
  onRestart,
}: {
  path: Path;
  triggers: string[];
  reflections: Reflection[];
  durationMs: number;
  onRestart: () => void;
}) {
  const [stats, setStats] = useState<UrgeSurfStats | null>(null);
  const [streak, setStreak] = useState<DisplayStreak | null>(null);
  const [phase, setPhase] = useState<"checkin" | "summary">("checkin");
  const [confidence, setConfidence] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<UrgeOutcome | null>(null);
  const [note, setNote] = useState("");
  const savedRef = useRef(false);
  const closing = QUOTES[path].closing[0];
  const prompted = reflections.filter((r) => !r.own);
  const own = reflections.filter((r) => r.own);
  const mins = Math.floor(durationMs / 60000);
  const secs = Math.round((durationMs % 60000) / 1000);
  const durText = `${mins} min ${secs} sec`;

  // Save once, when leaving the (optional) check-in for the summary — so the
  // coping-confidence and outcome the user just gave are part of the record.
  const commit = useCallback(() => {
    if (savedRef.current) return;
    savedRef.current = true;
    const trimmedNote = note.trim();
    const summaryByOutcome =
      outcome === "acted_on_it"
        ? `Logged this one honestly after ${durText} on the ${path === "catholic" ? "faith" : "wisdom"} path — showing up is the work.`
        : outcome === "stepped_away"
          ? `Stepped away and changed the situation after ${durText} on the ${path === "catholic" ? "faith" : "wisdom"} path.`
          : `Stayed with the urge for ${durText} on the ${path === "catholic" ? "faith" : "wisdom"} path. It crested and passed without acting.`;
    (async () => {
      try {
        await createToolSession({
          toolSlug: "urge-surfing",
          toolName: "Urge Surfing",
          steps: [
            ...(triggers.length
              ? [{ heading: "What was pulling at me", prompt: "Named triggers", userAnswer: triggers.join("; ") }]
              : []),
            ...prompted.map((r) => ({
              heading: "While I stayed with it",
              prompt: r.q ?? "Reflection",
              userAnswer: r.a,
            })),
            ...own.map((r) => ({ heading: "In my own words", prompt: "Note", userAnswer: r.a })),
            ...(trimmedNote
              ? [{ heading: "A note before I went", prompt: "Closing reflection", userAnswer: trimmedNote }]
              : []),
          ],
          summary: summaryByOutcome,
          outcome: outcome ?? undefined,
          confidence: confidence ?? undefined,
        });
      } catch (err) {
        console.error("journal save failed", err);
      }
      await saveUrgeSurfSession({
        durationSeconds: Math.round(durationMs / 1000),
        path,
        triggerCount: triggers.length,
        reflectionCount: reflections.length,
        copingConfidence: confidence,
        outcome,
      });
      setStats(await getUrgeSurfStats());
      setStreak(await getDisplayStreak());
    })();
  }, [durationMs, path, triggers, reflections, prompted, own, durText, note, outcome, confidence]);

  function finishCheckin() {
    setPhase("summary");
    commit();
  }

  /* ─── Optional check-in (acceptance-based: no intensity) ─── */
  if (phase === "checkin") {
    const OUTCOMES: { value: UrgeOutcome; label: string; sub: string }[] = [
      { value: "rode_it_out", label: "Rode it out", sub: "stayed with it, didn't act" },
      { value: "stepped_away", label: "Stepped away", sub: "changed my situation" },
      { value: "acted_on_it", label: "Acted on it", sub: "and naming it is the work" },
    ];
    return (
      <div className="min-h-screen px-6 py-12 max-w-xl mx-auto">
        <h1 className="font-serif text-3xl font-light mb-1 text-center">You stayed.</h1>
        <p className="text-white/60 text-sm text-center mb-8">
          Two quick, optional notes — just for you.
        </p>

        <div className="rounded-2xl bg-white/5 border border-white/15 p-6 space-y-8">
          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-btf-gold-light/80 font-semibold mb-2">
              How able do you feel to handle urges like this?
            </p>
            <p className="text-xs text-white/55 font-light mb-4">
              Not how strong it was — how able <em>you</em> feel. This is the number
              that&rsquo;s good to see grow.
            </p>
            <div className="text-center font-serif text-5xl text-white font-light mb-3">
              {confidence === null ? "—" : confidence}
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={confidence ?? 50}
              onChange={(e) => setConfidence(Number(e.target.value))}
              aria-label="How able do you feel to handle urges like this, 0 to 100"
              className="w-full h-2 bg-white/15 rounded-full appearance-none accent-btf-gold cursor-pointer"
            />
            <div className="flex justify-between text-xs text-white/50 font-light mt-2">
              <span>not yet</span>
              <span>very able</span>
            </div>
          </div>

          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-btf-gold-light/80 font-semibold mb-3">
              What happened this time?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {OUTCOMES.map((o) => {
                const active = outcome === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setOutcome(active ? null : o.value)}
                    aria-pressed={active}
                    className={
                      "rounded-2xl border-2 px-4 py-4 text-left transition-all " +
                      (active
                        ? "border-btf-gold bg-btf-gold/15 text-white"
                        : "border-white/15 bg-white/5 text-white/85 hover:border-white/30 hover:bg-white/10")
                    }
                  >
                    <span className="block font-medium">{o.label}</span>
                    <span className="block text-[11px] text-white/60 font-light mt-1 leading-snug">
                      {o.sub}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-white/45 font-light mt-3">
              Every answer counts the same. Showing up and logging it is the skill.
            </p>
          </div>

          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-btf-gold-light/80 font-semibold mb-2">
              Anything to carry forward? <span className="text-white/40">(optional)</span>
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="what helped, what you noticed…"
              aria-label="An optional closing reflection"
              className="w-full rounded-2xl bg-white/10 border-2 border-white/20 focus:border-btf-gold focus:outline-none px-4 py-3 text-base text-white font-light placeholder:text-white/35 placeholder:italic transition-colors"
            />
          </div>
        </div>

        <button
          onClick={finishCheckin}
          className="mt-8 w-full bg-btf-gold hover:bg-btf-gold-light text-btf-sky-deep font-medium px-8 py-3.5 rounded-full shadow-lg shadow-btf-gold/30 transition-all hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
        >
          Keep this
        </button>
        <button
          onClick={finishCheckin}
          className="mt-3 w-full text-sm text-white/55 hover:text-white/80 font-light py-2 transition-colors cursor-pointer"
        >
          Skip — just take me through
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-12 max-w-xl mx-auto">
      {streak && (
        <div className="flex justify-center mb-8">
          <StreakChip streak={streak} tone="dark" />
        </div>
      )}
      <h1 className="font-serif text-3xl font-light mb-1 text-center">You stayed.</h1>
      <p className="text-white/60 text-sm text-center mb-8">
        {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
      </p>

      <div className="rounded-2xl bg-white/5 border border-white/15 p-6 space-y-5 leading-relaxed">
        <Section title="What was pulling at me">
          {triggers.length ? (
            <ul className="list-disc pl-5 space-y-1 text-white/85 font-light">
              {triggers.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          ) : (
            <p className="text-white/85 font-light">
              I came to the water without naming it — and that&rsquo;s okay too.
            </p>
          )}
        </Section>

        {prompted.length > 0 && (
          <Section title="While I stayed with it, I noticed">
            <ul className="list-disc pl-5 space-y-1 text-white/85 font-light">
              {prompted.map((r, i) => (
                <li key={i}>
                  {r.q && <span className="text-white/60">{r.q} — </span>}
                  <em>{r.a}</em>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {own.length > 0 && (
          <Section title="In my own words">
            <ul className="list-disc pl-5 space-y-1 text-white/85 font-light">
              {own.map((r, i) => (
                <li key={i}>
                  <em>{r.a}</em>
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Section title="What happened">
          <p className="text-white/85 font-light">
            {outcome === "acted_on_it" ? (
              <>
                I stayed with it for{" "}
                <strong className="text-white">{durText}</strong>, and this time I acted
                on it. I came back and logged it honestly — and that is its own kind of
                courage.
              </>
            ) : outcome === "stepped_away" ? (
              <>
                I stayed with it for{" "}
                <strong className="text-white">{durText}</strong>, then stepped away and
                changed my situation. That counts.
              </>
            ) : (
              <>
                The urge crested, and then it eased. I stayed on the board for{" "}
                <strong className="text-white">{durText}</strong> — and it passed without
                me having to act on it.
              </>
            )}
          </p>
        </Section>

        <Section title="A word to carry">
          <p className="font-serif italic text-lg text-white/90">
            &ldquo;{closing.text}&rdquo;
            <span className="block not-italic text-sm text-btf-gold-light mt-1">
              — {closing.src}
            </span>
          </p>
        </Section>
      </div>

      {stats && stats.wavesRidden > 0 && (
        <div className="mt-6 rounded-2xl bg-white/5 border border-white/15 p-5 text-center">
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3">
            You&rsquo;ve done this before
          </p>
          <p className="text-white/85 font-light leading-relaxed">
            That&rsquo;s <span className="text-btf-gold-light font-medium">{stats.wavesRidden}</span>{" "}
            {stats.wavesRidden === 1 ? "urge" : "urges"} you&rsquo;ve ridden out — a total of{" "}
            <span className="text-btf-gold-light font-medium">
              {Math.max(1, Math.round(stats.totalSecondsStayed / 60))} minutes
            </span>{" "}
            staying on the board. Every one is proof you don&rsquo;t have to act to make an
            urge end.
          </p>
        </div>
      )}

      <button
        onClick={onRestart}
        className="mt-8 w-full bg-btf-gold hover:bg-btf-gold-light text-btf-sky-deep font-medium px-8 py-3.5 rounded-full shadow-lg shadow-btf-gold/30 transition-all hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
      >
        Done
      </button>
      <div className="mt-4">
        <Link
          href="/today/grove"
          className="block bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 rounded-2xl px-5 py-4 transition-all text-center"
        >
          <p className="font-medium text-white">See the waves you&rsquo;ve ridden &rarr;</p>
          <p className="text-xs text-white/65 font-light mt-1 leading-relaxed">
            Your own record of every urge you stayed with. No streaks, no scores.
          </p>
        </Link>
      </div>
      <div className="mt-3 text-center">
        <Link href="/tools" className="text-white/65 hover:text-white text-sm underline underline-offset-2">
          Back to all tools
        </Link>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] tracking-[0.2em] uppercase text-btf-gold-light/80 font-semibold mb-2">
        {title}
      </p>
      {children}
    </div>
  );
}

/* ─── Brand cross ─── */
function Cross({ className = "" }: { className?: string }) {
  return (
    <div className={"relative w-12 h-12 " + className} aria-hidden>
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1.5 h-12 bg-btf-gold rounded-sm shadow-[0_0_24px_rgba(201,168,76,0.6)]" />
      <div className="absolute left-1/2 top-3 -translate-x-1/2 w-9 h-1.5 bg-btf-gold rounded-sm shadow-[0_0_24px_rgba(201,168,76,0.6)]" />
    </div>
  );
}
