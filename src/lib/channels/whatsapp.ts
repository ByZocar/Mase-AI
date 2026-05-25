const WAHA_BASE = process.env.WAHA_BASE_URL || "http://localhost:3000";
const WAHA_KEY = process.env.WAHA_API_KEY;
const SESSION = process.env.WAHA_SESSION || "default";

async function waha<T = unknown>(
  path: string,
  init?: RequestInit & { json?: unknown }
): Promise<{ ok: true; data: T } | { ok: false; mocked: true; error: string }> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (WAHA_KEY) headers["X-Api-Key"] = WAHA_KEY;

  try {
    const r = await fetch(`${WAHA_BASE}${path}`, {
      ...init,
      headers: { ...headers, ...(init?.headers as Record<string, string>) },
      body: init?.json ? JSON.stringify(init.json) : init?.body,
    });
    if (!r.ok) {
      return {
        ok: false,
        mocked: true,
        error: `WAHA ${r.status}: ${await r.text().catch(() => "")}`,
      };
    }
    return { ok: true, data: (await r.json()) as T };
  } catch (e) {
    return { ok: false, mocked: true, error: (e as Error).message };
  }
}

export function normalizePhone(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}

export async function sendWhatsAppText(opts: { phone: string; text: string }) {
  const chatId = `${normalizePhone(opts.phone)}@c.us`;
  const res = await waha<{ id: string }>(`/api/sendText`, {
    method: "POST",
    json: { chatId, text: opts.text, session: SESSION },
  });
  if (!res.ok) {
    return {
      mocked: true,
      id: `mock_wa_${Date.now()}`,
      phone: opts.phone,
      text: opts.text,
      sentAt: new Date().toISOString(),
    };
  }
  return { id: res.data.id, sentAt: new Date().toISOString() };
}

export async function sendWhatsAppVoice(opts: { phone: string; audioUrl: string }) {
  const chatId = `${normalizePhone(opts.phone)}@c.us`;
  const res = await waha<{ id: string }>(`/api/sendVoice`, {
    method: "POST",
    json: {
      chatId,
      file: { url: opts.audioUrl },
      session: SESSION,
      convert: true,
    },
  });
  if (!res.ok) {
    return {
      mocked: true,
      id: `mock_wa_voice_${Date.now()}`,
      phone: opts.phone,
      audioUrl: opts.audioUrl,
      sentAt: new Date().toISOString(),
    };
  }
  return { id: res.data.id, sentAt: new Date().toISOString() };
}

export async function wahaStatus() {
  return waha(`/api/sessions/${SESSION}`);
}
