import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SYSTEM_PROMPTS = {
  email: `You are an expert business writing assistant. Generate a polished email draft.
Return STRICT format:
Subject: <one-line subject>

<email body with greeting, paragraphs, sign-off>

Adapt vocabulary, formality, and structure to the audience and tone requested. Keep it concise and professional.`,
  summarize: `You are an expert meeting notes summarizer. Given raw meeting notes, produce a structured summary using EXACTLY this Markdown format and section order:

## Key Points
- bullet points of the most important discussion topics

## Decisions Made
- clear list of decisions

## Action Items
- **Owner** — task description — **Deadline: <date>** (omit deadline bold if none mentioned)

## Important Dates & Deadlines
- list every concrete date/deadline mentioned, in **bold**

Be faithful to the source notes. If a section has no items, write "- None identified".`,
  plan: `You are an expert productivity coach. Given a list of tasks (and optionally time available), produce a prioritized plan using EXACTLY this Markdown structure:

## Eisenhower Prioritization
Group tasks into the four quadrants (Urgent & Important, Important Not Urgent, Urgent Not Important, Neither). Use bullet lists under bold subheadings.

## Time-Blocked Schedule
A clean schedule with time ranges (e.g. **9:00 – 10:30** — Task). Respect time available if provided; otherwise plan a sensible workday.

## Optimisation Tips
3–5 sharp, specific tips to batch work, reduce context switching, and tackle high-impact items first.`,
} as const;

const inputSchema = z.object({
  kind: z.enum(["email", "summarize", "plan"]),
  payload: z.record(z.string(), z.any()),
});

function buildUserPrompt(kind: "email" | "summarize" | "plan", payload: Record<string, any>): string {
  if (kind === "email") {
    return `Recipient context: ${payload.audience}
Tone: ${payload.tone}
Key points to include:
${payload.points}`;
  }
  if (kind === "summarize") {
    return `Raw meeting notes:\n\n${payload.notes}`;
  }
  return `Tasks (one per line):
${payload.tasks}

Time available: ${payload.time?.trim() ? payload.time : "Not specified — assume a standard workday"}`;
}

export const runAi = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      throw new Error("AI is not configured. Please contact support.");
    }

    const system = SYSTEM_PROMPTS[data.kind];
    const user = buildUserPrompt(data.kind, data.payload);

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      if (res.status === 429) {
        throw new Error("Rate limit reached. Please wait a moment and try again.");
      }
      if (res.status === 402) {
        throw new Error("AI credits exhausted. Please add credits in your workspace.");
      }
      throw new Error(`AI request failed (${res.status}): ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = json.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error("AI returned an empty response.");
    return { content };
  });