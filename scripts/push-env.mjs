import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const SKIP = new Set([
  "NEXT_PUBLIC_APP_URL",
  "NODE_ENV",
  "SUPABASE_DB_URL",
  "OPENROUTER_API_KEY_DISABLED",
  "OLLAMA_BASE_URL",
  "OLLAMA_MODEL",
  "WAHA_BASE_URL",
  "WAHA_API_KEY",
  "WAHA_SESSION",
  "APP_NAME",
]);

const content = readFileSync(".env.local", "utf8");
const lines = content.split(/\r?\n/);

const vars = [];
for (const line of lines) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const eq = t.indexOf("=");
  if (eq < 1) continue;
  const key = t.slice(0, eq).trim();
  const value = t.slice(eq + 1).trim();
  if (SKIP.has(key)) continue;
  if (!value) continue;
  vars.push({ key, value });
}

console.log(`Pushing ${vars.length} env vars to Vercel production + preview + development...`);

for (const { key, value } of vars) {
  for (const env of ["production", "preview", "development"]) {
    process.stdout.write(`  ${key} -> ${env}... `);

    spawnSync("npx", ["vercel", "env", "rm", key, env, "--yes"], {
      stdio: ["ignore", "ignore", "ignore"],
      shell: true,
    });

    const r = spawnSync("npx", ["vercel", "env", "add", key, env], {
      input: value,
      stdio: ["pipe", "pipe", "pipe"],
      shell: true,
      encoding: "utf8",
    });

    if (r.status === 0) {
      console.log("OK");
    } else {
      console.log(`FAIL (${r.stderr?.slice(0, 100) || r.stdout?.slice(0, 100)})`);
    }
  }
}

console.log("\nDone.");
