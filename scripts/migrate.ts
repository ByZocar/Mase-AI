import { Client, ClientConfig } from "pg";
import { readFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { config } from "dotenv";

config({ path: resolve(process.cwd(), ".env.local") });

const PASSWORD = process.env.SUPABASE_DB_PASSWORD || "WHITE%(=/5807";
const PROJECT_REF = "excchoebhxigvhbeubxz";

const regions = [
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "sa-east-1",
  "eu-west-1",
  "eu-west-2",
  "eu-central-1",
  "eu-central-2",
  "eu-north-1",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-south-1",
  "ap-northeast-1",
  "ca-central-1",
];

const candidates: { label: string; config: ClientConfig }[] = [];

for (const region of regions) {
  for (const prefix of ["aws-0", "aws-1"]) {
    candidates.push({
      label: `Pooler ${prefix}-${region} (session, 5432)`,
      config: {
        host: `${prefix}-${region}.pooler.supabase.com`,
        port: 5432,
        user: `postgres.${PROJECT_REF}`,
        password: PASSWORD,
        database: "postgres",
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000,
      },
    });
  }
}

async function tryConnect(): Promise<Client> {
  for (const { label, config: cfg } of candidates) {
    const c = new Client(cfg);
    try {
      await c.connect();
      console.log(`Connected via: ${label}`);
      return c;
    } catch (err) {
      const msg = (err as Error).message;
      if (msg.includes("Tenant or user not found")) {
        console.log(`  [wrong region] ${label}`);
      } else if (msg.includes("ENOTFOUND")) {
      } else {
        console.log(`  ${label}: ${msg}`);
      }
      try {
        await c.end();
      } catch {}
    }
  }
  throw new Error("Could not connect via any candidate.");
}

async function main() {
  const migrationsDir = resolve(process.cwd(), "supabase", "migrations");
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  console.log(`Found ${files.length} migration file(s):`);
  files.forEach((f) => console.log(`  - ${f}`));

  const client = await tryConnect();
  for (const file of files) {
    const sql = readFileSync(join(migrationsDir, file), "utf8");
    console.log(`\n>>> Applying ${file} (${sql.length} chars)`);
    try {
      await client.query(sql);
      console.log(`OK ${file}`);
    } catch (err) {
      console.error(`ERROR in ${file}: ${(err as Error).message}`);
      throw err;
    }
  }
  await client.end();
  console.log("\nAll migrations applied successfully.");
}

main().catch((err) => {
  console.error("FATAL:", err.message);
  process.exit(1);
});
