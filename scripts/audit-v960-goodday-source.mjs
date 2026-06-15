import fs from "fs";
import path from "path";

const repo = process.cwd();
const targets = [
  "apps/web/components/tasks/V96LiveInlinePersistenceCommandGantt.tsx",
  "apps/web/lib/enterprise/work-os-v96-live-inline-persistence-command-gantt.ts",
  "apps/web/lib/enterprise/work-os-v95-goodday-collaboration-sla.ts",
  "docs/NEXT_BUILD_PLAN.md",
];

const blocked = [
  /demo/i,
  /separate\s+showcase/i,
  /legacy\s+v7_9\s+label/i,
  /Provider Canary\s*\/\s*ACL\s*\/\s*Primary Pilot/i,
  /hidden\s+w-72/i,
];

const issues = [];
for (const rel of targets) {
  const file = path.join(repo, rel);
  if (!fs.existsSync(file)) {
    issues.push(`${rel}: missing`);
    continue;
  }
  const text = fs.readFileSync(file, "utf8");
  for (const pattern of blocked) {
    if (pattern.test(text)) issues.push(`${rel}: ${pattern}`);
  }
}

const report = ["# v9.6.0 Live Inline Persistence Command Gantt Source Audit", ""];
fs.mkdirSync(path.join(repo, "audit-results"), { recursive: true });
const out = path.join(repo, "audit-results", "v960-live-inline-persistence-command-gantt-source-audit.md");
if (issues.length) {
  report.push("FAIL", "", ...issues.map((item) => `- ${item}`));
  fs.writeFileSync(out, report.join("\n"), "utf8");
  console.error(report.join("\n"));
  process.exit(1);
}
report.push("PASS");
fs.writeFileSync(out, report.join("\n"), "utf8");
console.log("PASS: v9.6.0 Live Inline Persistence Command Gantt source audit clean");
