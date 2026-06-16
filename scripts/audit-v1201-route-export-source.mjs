import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = [
  "apps/web/app/api/v1/work-os/v120-single-canonical-sidebar-taskuri/route.ts",
  "apps/web/app/api/v1/work-os/v120-single-canonical-sidebar-taskuri/[section]/route.ts",
];

const failures = [];
for (const rel of files) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) {
    failures.push(`missing ${rel}`);
    continue;
  }
  const text = fs.readFileSync(abs, "utf8");
  if (/export\s+(const|function)\s+payload\b/.test(text)) failures.push(`${rel}: forbidden exported payload`);
  if (/export\s+\{[^}]*payload[^}]*\}/.test(text)) failures.push(`${rel}: forbidden payload export list`);
  if (!/export\s+async\s+function\s+GET/.test(text)) failures.push(`${rel}: missing GET export`);
  if (rel.includes("[section]") && !/params:\s*Promise<\{\s*section:\s*string;?\s*\}>/.test(text)) {
    failures.push(`${rel}: Next 15 params Promise signature missing`);
  }
}

const reportDir = path.join(root, "audit-results");
fs.mkdirSync(reportDir, { recursive: true });
const reportPath = path.join(reportDir, "v1201-route-export-source-audit.md");
const report = [
  "# v12.0.1 Route Export Source Audit",
  "",
  failures.length ? "FAIL" : "PASS",
  "",
  ...failures.map((failure) => `- ${failure}`),
].join("\n");
fs.writeFileSync(reportPath, report, "utf8");

if (failures.length) {
  throw new Error(`v12.0.1 route export source audit failed: ${failures.join("; ")}`);
}

console.log("PASS: v12.0.1 route export source audit clean");
console.log(`Report: ${reportPath}`);
