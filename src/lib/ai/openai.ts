import { generateObject, generateText } from "ai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const OPENROUTER_BASE = "https://openrouter.ai/api/v1";
const OLLAMA_BASE = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";

const MODEL = "anthropic/claude-3.5-sonnet";
const MODEL_FAST = "openai/gpt-4o-mini";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3:8b";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash-exp";

async function geminiChat(opts: {
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  temperature?: number;
  jsonMode?: boolean;
}): Promise<{ content: string }> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Missing GEMINI_API_KEY");

  const systemParts = opts.messages
    .filter((m) => m.role === "system")
    .map((m) => m.content);
  const userParts = opts.messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const body: Record<string, unknown> = {
    contents: userParts,
    generationConfig: {
      temperature: opts.temperature ?? 0.7,
      maxOutputTokens: 4096,
      ...(opts.jsonMode ? { responseMimeType: "application/json" } : {}),
    },
  };
  if (systemParts.length > 0) {
    body.systemInstruction = {
      role: "system",
      parts: [{ text: systemParts.join("\n\n") }],
    };
  }

  const r = await fetch(
    `${GEMINI_BASE}/models/${GEMINI_MODEL}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`Gemini ${r.status}: ${txt.slice(0, 300)}`);
  }
  const json = (await r.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const content =
    json.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? "")
      .join("") ?? "";
  return { content };
}

async function ollamaChat(opts: {
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  temperature?: number;
  format?: "json";
}): Promise<{ content: string }> {
  const r = await fetch(`${OLLAMA_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: opts.messages,
      stream: false,
      format: opts.format,
      options: {
        temperature: opts.temperature ?? 0.6,
      },
    }),
  });
  if (!r.ok) {
    throw new Error(`Ollama ${r.status}: ${await r.text().catch(() => "")}`);
  }
  const json = (await r.json()) as {
    message?: { content?: string };
  };
  return { content: json.message?.content ?? "" };
}

async function openrouterChat(opts: {
  model: string;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  temperature?: number;
  response_format?: unknown;
}): Promise<{ content: string }> {
  const key = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
  if (!key) {
    throw new Error("Missing OPENAI_API_KEY (OpenRouter)");
  }
  const r = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer":
        process.env.NEXT_PUBLIC_APP_URL || "https://zolvo.local",
      "X-Title": "Zolvo Engine",
    },
    body: JSON.stringify({
      model: opts.model,
      messages: opts.messages,
      temperature: opts.temperature ?? 0.6,
      response_format: opts.response_format,
    }),
  });
  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`OpenRouter ${r.status}: ${txt.slice(0, 300)}`);
  }
  const json = (await r.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return { content: json.choices?.[0]?.message?.content ?? "" };
}

async function smartChat(opts: {
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  temperature?: number;
  jsonMode?: boolean;
  fast?: boolean;
}): Promise<{ content: string; provider: "gemini" | "openrouter" | "ollama" }> {
  if (process.env.GEMINI_API_KEY) {
    try {
      const res = await geminiChat({
        messages: opts.messages,
        temperature: opts.temperature,
        jsonMode: opts.jsonMode,
      });
      return { ...res, provider: "gemini" };
    } catch (err) {
      console.warn(`Gemini failed: ${(err as Error).message}`);
    }
  }

  const orKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
  if (orKey) {
    try {
      const res = await openrouterChat({
        model: opts.fast ? MODEL_FAST : MODEL,
        messages: opts.messages,
        temperature: opts.temperature,
        response_format: opts.jsonMode ? { type: "json_object" } : undefined,
      });
      return { ...res, provider: "openrouter" };
    } catch (err) {
      console.warn(
        `OpenRouter failed, falling back to Ollama: ${(err as Error).message}`
      );
    }
  }

  const res = await ollamaChat({
    messages: opts.messages,
    temperature: opts.temperature,
    format: opts.jsonMode ? "json" : undefined,
  });
  return { ...res, provider: "ollama" };
}

export async function aiText(prompt: string, system?: string) {
  const messages: { role: "system" | "user"; content: string }[] = [];
  if (system) messages.push({ role: "system", content: system });
  messages.push({ role: "user", content: prompt });
  const { content } = await smartChat({ messages });
  return { text: content };
}

export async function aiTextFast(prompt: string) {
  return aiText(prompt);
}

function extractJson(text: string): string {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) return fence[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) return text.slice(start, end + 1);
  return text;
}

export async function aiJson<T extends z.ZodTypeAny>(opts: {
  schema: T;
  prompt: string;
  system?: string;
  fast?: boolean;
}): Promise<z.infer<T>> {
  const jsonSchema = zodToJsonSchema(opts.schema as never, "Output");

  const systemFull = `${opts.system ?? ""}

REGLA CRITICA: Tu respuesta debe ser EXCLUSIVAMENTE un objeto JSON valido que cumpla este schema:

${JSON.stringify(jsonSchema, null, 2)}

NO incluyas texto antes ni despues. NO uses markdown code fences. SOLO el JSON.`;

  const { content } = await smartChat({
    messages: [
      { role: "system", content: systemFull },
      { role: "user", content: opts.prompt },
    ],
    jsonMode: true,
    fast: opts.fast,
  });

  let parsed: unknown;
  try {
    parsed = JSON.parse(extractJson(content));
  } catch {
    parsed = JSON.parse(content);
  }
  return opts.schema.parse(parsed);
}

void generateObject;
void generateText;

