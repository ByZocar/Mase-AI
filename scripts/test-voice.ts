import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env.local") });

const BASE = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

async function main() {
  console.log("Testing voice with new custom voice + ultra-realistic preset\n");

  const disc = await (
    await fetch(`${BASE}/api/leads/discover`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ useDemoData: true, maxResults: 1 }),
    })
  ).json();

  const leadId = disc.results[0].lead.id;
  console.log(`Lead: ${disc.results[0].lead.full_name}`);

  await fetch(`${BASE}/api/leads/${leadId}/classify`, { method: "POST" });

  const start = Date.now();
  const gen = await (
    await fetch(`${BASE}/api/leads/${leadId}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel: "whatsapp_voice",
        voice_preset: "user_custom",
      }),
    })
  ).json();
  const elapsed = Date.now() - start;

  console.log(`\nGeneration took ${elapsed}ms`);
  console.log(`Voice ID: ${gen.personalized?.voice_script ? "OK" : "MISSING"}`);
  console.log(`Voice script: ${gen.personalized?.voice_script}`);
  console.log(`Audio URL: ${gen.audio_url}`);
}

main().catch(console.error);
