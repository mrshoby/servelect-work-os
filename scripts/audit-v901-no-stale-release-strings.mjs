import fs from "node:fs/promises";
import path from "node:path";

const roots = ["apps/web", "docs", "scripts"];
const ignore = [
  "node_modules",
  ".next",
  "audit-results",
  "v790",
  "v780",
  "V7_",
  "V8_7_0_SCREENSHOT_AUDIT_REPORT.md"
];
const patterns = [/v7\.9\.0/i, /Provider Canary\s*\/\s*ACL\s*\/\s*Primary Pilot/i];
const hits = [];

async function walk(dir) {
  let entries = [];
  try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (ignore.some((token) => full.includes(token))) continue;
    if (entry.isDirectory()) {
      await walk(full);
      continue;
    }
    if (!/\.(ts|tsx|md|mjs|ps1|json)$/i.test(entry.name)) continue;
    const text = await fs.readFile(full, "utf8").catch(() => "");
    for (const pattern of patterns) {
      if (pattern.test(text)) hits.push(`${full}: ${pattern}`);
    }
  }
}
for (const root of roots) await walk(path.join(process.cwd(), root));
if (hits.length) {
  console.error("Stale release strings found:");
  for (const hit of hits) console.error(`- ${hit}`);
  process.exit(1);
}
console.log("OK: no stale v9.0.1 / Provider Canary labels in active source files.");

