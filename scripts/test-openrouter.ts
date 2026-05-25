import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
  const key = process.env.OPENAI_API_KEY;
  console.log("Key length:", key?.length);
  console.log("Key starts with:", key?.slice(0, 12));
  console.log("Key ends with:", key?.slice(-10));

  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://zolvo.local",
      "X-Title": "Zolvo Engine",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: "say hi in 3 words" }],
    }),
  });
  console.log("Status:", r.status);
  console.log("Body:", await r.text());
}

main();
