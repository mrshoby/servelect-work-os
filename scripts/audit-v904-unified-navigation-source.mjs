
import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const reportPath = path.join(root, "audit-results", "v904-unified-navigation-source-audit.md");
const target = path.join(root, "apps", "web", "components", "work-os", "V79PrimaryWritePilotClient.tsx");
const checks = [];

async function read(file) {
  return fs.readFile(file, "utf8");
}

const text = await read(target);
const forbiddenInV79 = [
  "<aside className=\"hidden w-72",
  "hidden w-72 shrink-0 flex-col",
  "<h1 className=\"mt-2 text-xl font-black\">Work OS</h1>",
  "v7.9.0 · Provider Canary / ACL / Primary Pilot",
  "Provider Canary / ACL / Primary Pilot"
];

for (const needle of forbiddenInV79) {
  checks.push({ scope: "V79PrimaryWritePilotClient.tsx", needle, ok: !text.includes(needle) });
}

async function walk(dir, files = []) {
  for (const item of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (["node_modules", ".next", "audit-results"].includes(item.name)) continue;
      await walk(full, files);
    } else if (/\.(ts|tsx)$/.test(item.name)) {
      files.push(full);
    }
  }
  return files;
}

const appFiles = await walk(path.join(root, "apps", "web"));
const exactForbidden = [
  "v7.9.0 · Provider Canary / ACL / Primary Pilot",
  "Provider Canary / ACL / Primary Pilot"
];
for (const file of appFiles) {
  const body = await read(file);
  for (const needle of exactForbidden) {
    if (body.includes(needle)) {
      checks.push({ scope: path.relative(root, file), needle, ok: false });
    }
  }
}

const failed = checks.filter((check) => !check.ok);
await fs.mkdir(path.dirname(reportPath), { recursive: true });
const lines = [
  "# v9.0.4 Unified Taskuri Navigation Source Audit",
  "",
  `Target: ${path.relative(root, target)}`,
  "",
  "| Check | Scope | Result |",
  "|---|---|---:|",
  ...checks.map((check) => `| ${check.needle.replaceAll("|", "\\|")} | ${check.scope} | ${check.ok ? "PASS" : "FAIL"} |`),
  "",
  failed.length ? `FAILED: ${failed.length}` : "PASS: unified navigation source audit clean"
];
await fs.writeFile(reportPath, lines.join("\n"));
console.log(lines.at(-1));
console.log(`Report: ${reportPath}`);
if (failed.length) process.exit(1);
