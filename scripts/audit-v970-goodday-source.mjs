import fs from "node:fs";
import path from "node:path";

const checks = [
  "apps/web/lib/enterprise/work-os-v97-portfolio-workgraph-reporting-command.ts",
  "apps/web/components/tasks/V97PortfolioWorkgraphReportingCommand.tsx",
];
const forbidden = [/separate showcase/i, /demo app/i, /parallel internal Work OS sidebar/i, /legacy v7_9 label/i, /Provider Canary\s*\/\s*ACL\s*\/\s*Primary Pilot/i];
const required = [/Taskuri/i, /WorkGraph/i, /Reporting/i, /productionWrites/i, /off-gated/i];
const failures = [];
for (const file of checks) {
  const full = path.join(process.cwd(), file);
  if (!fs.existsSync(full)) {
    failures.push(`Missing ${file}`);
    continue;
  }
  const text = fs.readFileSync(full, "utf8");
  for (const pattern of forbidden) {
    if (pattern.test(text)) failures.push(`${file}: forbidden ${pattern}`);
  }
}
const combined = checks.map((file) => fs.existsSync(path.join(process.cwd(), file)) ? fs.readFileSync(path.join(process.cwd(), file), "utf8") : "").join("\n");
for (const pattern of required) {
  if (!pattern.test(combined)) failures.push(`Missing required signal ${pattern}`);
}
const out = ["# v9.7.0 Portfolio WorkGraph Reporting Source Audit", ""];
if (failures.length) {
  out.push("FAIL", "", ...failures.map((failure) => `- ${failure}`));
} else {
  out.push("PASS");
}
const outPath = path.join(process.cwd(), "audit-results", "v970-portfolio-workgraph-reporting-source-audit.md");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, out.join("\n"), "utf8");
if (failures.length) {
  console.error(out.join("\n"));
  process.exit(1);
}
console.log("PASS: v9.7.0 Portfolio WorkGraph Reporting source audit clean");
console.log(`Report: ${outPath}`);
