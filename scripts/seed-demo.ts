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
  console.log("Seeding demo data...\n");

  console.log("[1] Discovering 5 demo leads...");
  const disc = await call("/api/leads/discover", {
    method: "POST",
    body: JSON.stringify({ useDemoData: true, maxResults: 5 }),
  });
  if (!("json" in disc) || !disc.json.ok) {
    console.error("Discovery failed");
    process.exit(1);
  }
  const leads = disc.json.results.map(
    (r: { lead: { id: string; full_name: string } }) => r.lead
  );
  console.log(`    ${leads.length} leads created`);

  console.log("\n[2] Classifying each lead with IA...");
  for (const l of leads) {
    const c = await call(`/api/leads/${l.id}/classify`, { method: "POST" });
    if ("json" in c && c.json.ok) {
      console.log(`    ${l.full_name}: ${c.json.classification.segment} / ${c.json.classification.journey_stage} / score ${c.json.classification.intent_score}`);
    }
  }

  console.log("\n[3] Generating messages for top 3 leads (mix of channels)...");
  const channels = ["whatsapp_voice", "email", "linkedin_dm"];
  for (let i = 0; i < Math.min(3, leads.length); i++) {
    const ch = channels[i % channels.length];
    const g = await call(`/api/leads/${leads[i].id}/generate`, {
      method: "POST",
      body: JSON.stringify({ channel: ch, voice_preset: i === 0 ? "latam_female" : "latam_male" }),
    });
    if ("json" in g && g.json.ok) {
      console.log(`    ${leads[i].full_name} → ${ch} ${g.json.audio_url ? "(audio)" : ""}`);
    }
  }

  console.log("\n[4] Generating content posts...");
  const content = await call("/api/content/generate", {
    method: "POST",
    body: JSON.stringify({ windowDays: 30, maxPosts: 3 }),
  });
  if ("json" in content && content.json.ok) {
    console.log(`    ${content.json.posts.length} posts generated`);
  }

  console.log("\nSeed complete. Open http://localhost:3001 to explore.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
