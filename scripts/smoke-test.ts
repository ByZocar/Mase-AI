import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env.local") });

const BASE = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

async function call(path: string, init?: RequestInit) {
  const r = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers as Record<string, string>),
    },
  });
  const text = await r.text();
  try {
    return { status: r.status, json: JSON.parse(text) };
  } catch {
    return { status: r.status, text };
  }
}

async function main() {
  console.log("\n=== SMOKE TEST: Zolvo Engine ===\n");

  console.log("[1/4] Discovery (demo mode)...");
  const discovery = await call("/api/leads/discover", {
    method: "POST",
    body: JSON.stringify({ useDemoData: true, maxResults: 3 }),
  });
  console.log(`    status=${discovery.status}`);
  if ("json" in discovery) {
    console.log(`    leads=${discovery.json.count}`);
    const lead = discovery.json.results?.[0]?.lead;
    if (!lead) {
      console.error("No lead returned");
      process.exit(1);
    }
    console.log(`    first lead: ${lead.full_name} (${lead.role}) score=${lead.intent_score}`);

    console.log("\n[2/4] Classify lead with AI...");
    const classify = await call(`/api/leads/${lead.id}/classify`, {
      method: "POST",
    });
    console.log(`    status=${classify.status}`);
    if ("json" in classify) {
      const c = classify.json.classification;
      console.log(`    segment=${c?.segment} stage=${c?.journey_stage} score=${c?.intent_score}`);
      console.log(`    trigger=${c?.emotional_trigger?.slice(0, 100)}`);
      console.log(`    pains=${c?.pain_points?.length}`);
    }

    console.log("\n[3/4] Generate WhatsApp voice message...");
    const gen = await call(`/api/leads/${lead.id}/generate`, {
      method: "POST",
      body: JSON.stringify({ channel: "whatsapp_voice", voice_preset: "latam_female" }),
    });
    console.log(`    status=${gen.status}`);
    if ("json" in gen) {
      const p = gen.json.personalized;
      console.log(`    body: ${p?.body?.slice(0, 150)}`);
      console.log(`    voice_script: ${p?.voice_script?.slice(0, 150)}`);
      console.log(`    audio_url: ${gen.json.audio_url}`);
      console.log(`    emotional_hook: ${p?.emotional_hook}`);
    }

    console.log("\n[4/4] Generate Email message...");
    const email = await call(`/api/leads/${lead.id}/generate`, {
      method: "POST",
      body: JSON.stringify({ channel: "email" }),
    });
    console.log(`    status=${email.status}`);
    if ("json" in email) {
      const p = email.json.personalized;
      console.log(`    subject: ${p?.subject}`);
      console.log(`    body: ${p?.body?.slice(0, 200)}`);
    }
  }

  console.log("\n=== DONE ===\n");
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
