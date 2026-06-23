import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "../../lib/session";

/**
 * POST /api/reflect — the Daily Journal freeform analyzer.
 *
 * Reflect-first, pastoral, never clinical. Tools must come only from the
 * caller's availableTools. Scripture must be public-domain wording. The
 * model flags severity; a human decides. Returns the strict JSON contract
 * below (or a graceful, non-AI fallback if no provider key is set).
 *
 * Provider is swappable: set ANTHROPIC_BASE_URL + ANTHROPIC_API_KEY.
 * When Acutis AI (Claude-compatible) issues a key, point ANTHROPIC_BASE_URL
 * at their endpoint and drop in the key — no code change.
 *
 * Privacy note: this sends the entry TEXT to the model provider. The text
 * is analyzed as typed (pre-encryption); we never decrypt stored entries
 * here. Founder-approved for the prototype (Anthropic), to move to Acutis.
 */

const BASE_URL = process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com";
const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.REFLECT_MODEL || "claude-haiku-4-5-20251001";

type ReflectInput = {
  text?: string;
  entryType?: string;
  availableTools?: { id: string; label: string }[];
};

type Analysis = {
  reflection: string;
  themes: string[];
  tools: { id: string; label: string; why: string }[];
  scriptures: { ref: string; text: string; why: string }[];
  roleModels: { name: string; note: string; passage: string }[];
  severity: { flag: boolean; urgent: boolean };
  promptBack: string;
};

function fallback(): Analysis {
  return {
    reflection:
      "Thank you for putting this into words. Whatever you're carrying, naming it honestly is real work — and you just did it.",
    themes: [],
    tools: [],
    scriptures: [],
    roleModels: [],
    severity: { flag: false, urgent: false },
    promptBack: "What is one small, kind thing you could do for yourself next?",
  };
}

function systemPrompt(tools: { id: string; label: string }[]): string {
  const toolList = tools.map((t) => `${t.id} ("${t.label}")`).join(", ") || "(none)";
  return `You are a warm, gentle spiritual director inside a faith-rooted recovery app. Someone has written a journal entry. Respond with ONE JSON object and nothing else — no prose, no markdown fences.

Rules (all must hold):
- Reflect FIRST: 2–3 warm sentences that name and validate the feeling. No diagnosis, no fix yet. Grace over condemnation. Never clinical, never preachy, never "you should".
- "tools" may ONLY be chosen from this exact list (use the id verbatim): ${toolList}. Never invent a tool. Each tool needs a "why" tied to what they wrote. 0–2 tools.
- Scripture: only well-known PUBLIC-DOMAIN wording (KJV or Douay-Rheims); about struggle and restoration, never moralizing. 0–2. If unsure of exact wording, omit it rather than risk a misquote.
- roleModels: biblical figures of struggle and restoration (e.g. David, Peter, Joseph), each with a short note and where to read it. 0–2.
- severity: set flag=true if real distress; urgent=true only if there is language of self-harm or hopelessness. You flag; a human decides. Never describe self-harm methods.
- promptBack: one gentle, open question specific to what they wrote, to carry into tomorrow.
- Keep reflection and promptBack specific to the entry, not generic.

Return exactly this shape:
{"reflection":"","themes":[],"tools":[{"id":"","label":"","why":""}],"scriptures":[{"ref":"","text":"","why":""}],"roleModels":[{"name":"","note":"","passage":""}],"severity":{"flag":false,"urgent":false},"promptBack":""}`;
}

export async function POST(request: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as ReflectInput | null;
  const text = (body?.text ?? "").trim();
  if (!text) return NextResponse.json({ error: "Empty entry." }, { status: 400 });
  const tools = body?.availableTools ?? [];

  // No provider key yet → graceful, honest fallback (still warm).
  if (!API_KEY) {
    return NextResponse.json(fallback());
  }

  try {
    const res = await fetch(`${BASE_URL}/v1/messages`, {
      method: "POST",
      headers: {
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 900,
        system: systemPrompt(tools),
        messages: [{ role: "user", content: text }],
      }),
    });
    if (!res.ok) {
      console.error("reflect provider error:", res.status, await res.text());
      return NextResponse.json(fallback());
    }
    const data = (await res.json()) as { content?: { type: string; text?: string }[] };
    const raw = data.content?.find((c) => c.type === "text")?.text ?? "";
    const jsonStr = raw.replace(/^```json\s*|\s*```$/g, "").trim();
    const parsed = JSON.parse(jsonStr) as Analysis;

    // Defense: drop any tool the model invented outside availableTools.
    const allowed = new Set(tools.map((t) => t.id));
    parsed.tools = (parsed.tools ?? []).filter((t) => allowed.has(t.id));

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("reflect exception:", err);
    return NextResponse.json(fallback());
  }
}
