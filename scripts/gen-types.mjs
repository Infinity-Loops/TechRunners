// Cross-platform Supabase type generation.
//
// Reads SUPABASE_DB_URL from the environment (or .env.local) and runs the
// Supabase CLI against the database directly — no management-API access needed.
//
// Requirements: Docker Desktop (the CLI runs introspection in a container).
// If you don't have Docker, ask the agent to regenerate types via the Supabase
// MCP, or run this in CI where Docker is available.
//
// Usage: npm run db:types

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvLocal() {
  try {
    const text = readFileSync(join(root, ".env.local"), "utf8");
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (m && !(m[1] in process.env)) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    /* no .env.local — rely on the ambient environment (e.g. CI secrets) */
  }
}

loadEnvLocal();

const dbUrl = process.env.SUPABASE_DB_URL;
if (!dbUrl) {
  console.error(
    "SUPABASE_DB_URL is not set. Add it to .env.local (see .env.example) or the environment."
  );
  process.exit(1);
}

const outFile = join("src", "lib", "database.types.ts");
const result = spawnSync(
  "npx",
  ["supabase", "gen", "types", "typescript", "--db-url", dbUrl, "--schema", "public"],
  { cwd: root, encoding: "utf8", shell: process.platform === "win32" }
);

if (result.status !== 0 || !result.stdout || result.stdout.trim().length < 50) {
  console.error("Type generation failed:\n" + (result.stderr || result.stdout || "unknown error"));
  process.exit(1);
}

const { writeFileSync } = await import("node:fs");
writeFileSync(join(root, outFile), result.stdout);
console.log(`Wrote ${outFile} (${result.stdout.split(/\r?\n/).length} lines).`);
