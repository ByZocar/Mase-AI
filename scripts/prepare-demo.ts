import { Client } from "pg";
import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env.local") });

const BASE = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

async function clearTables() {
  const c = new Client({
    host: "aws-1-us-west-2.pooler.supabase.com",
    port: 5432,
    user: "postgres.excchoebhxigvhbeubxz",
    password: "WHITE%(=/5807",
    database: "postgres",
    ssl: { rejectUnauthorized: false },
  });
  await c.connect();
  console.log("Connected. Clearing tables...");
  await c.query(`
    delete from voice_generations;
    delete from messages;
    delete from conversations;
    delete from content_posts;
    delete from pain_points_library;
    delete from events;
    delete from leads;
    delete from campaigns;
    delete from companies;
  `);
  console.log("Tables cleared.");
  await c.end();
}

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
  console.log("=== PREPARING DEMO ===\n");

  if (process.argv.includes("--clean")) {
    await clearTables();
  } else {
    console.log("(Skipping cleanup. Use --clean to reset DB first.)");
  }

  console.log("\n[1] Discovery: 5 leads seed para LATAM");
  await call("/api/leads/discover", {
    method: "POST",
    body: JSON.stringify({ useDemoData: true, maxResults: 5 }),
  });

  console.log("[2] Clasificación IA de cada lead");
  const { data: leadsResp } = await (
    await fetch(`${BASE}/api/leads/discover`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ useDemoData: true, maxResults: 5 }),
    })
  ).json();
  void leadsResp;

  const discoveryResp = await call("/api/leads/discover", {
    method: "POST",
    body: JSON.stringify({ useDemoData: true, maxResults: 5 }),
  });
  if ("json" in discoveryResp) {
    const leads = discoveryResp.json.results;
    for (const r of leads) {
      const cls = await call(`/api/leads/${r.lead.id}/classify`, { method: "POST" });
      if ("json" in cls && cls.json.ok) {
        console.log(
          `    ${r.lead.full_name}: ${cls.json.classification.segment} / ${cls.json.classification.journey_stage} / ${cls.json.classification.intent_score}`
        );
      }
    }

    console.log("\n[3] Generando mensajes hyperpersonalizados");
    const target = leads[0].lead;
    const channels = ["whatsapp_voice", "email", "linkedin_dm"];
    for (const ch of channels) {
      const g = await call(`/api/leads/${target.id}/generate`, {
        method: "POST",
        body: JSON.stringify({
          channel: ch,
          voice_preset: ch === "whatsapp_voice" ? "latam_female" : "latam_male",
        }),
      });
      if ("json" in g && g.json.ok) {
        console.log(
          `    ${ch} → ${g.json.audio_url ? "AUDIO real generado" : "texto"}`
        );
      }
    }

    if (leads[1]) {
      const cfo = leads.find(
        (l: { lead: { id: string; full_name: string } }) =>
          l.lead.full_name.includes("Carlos") || l.lead.full_name.includes("Laura")
      );
      if (cfo) {
        await call(`/api/leads/${cfo.lead.id}/generate`, {
          method: "POST",
          body: JSON.stringify({ channel: "email" }),
        });
        console.log("    Email CFO generado");
      }
      const vp = leads.find((l: { lead: { full_name: string } }) =>
        l.lead.full_name.includes("Andrés")
      );
      if (vp) {
        await call(`/api/leads/${vp.lead.id}/generate`, {
          method: "POST",
          body: JSON.stringify({ channel: "linkedin_voice", voice_preset: "latam_male" }),
        });
        console.log("    LinkedIn Voice para VP generado");
      }
    }
  }

  console.log("\n[4] Generando contenido educativo");
  await call("/api/content/generate", {
    method: "POST",
    body: JSON.stringify({ windowDays: 30, maxPosts: 3 }),
  });
  console.log("    3 posts generados");

  console.log("\n=== DEMO PREPARADO ===");
  console.log(`Abrir ${BASE} para empezar.\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
