import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = [
  "apps/web/components/tasks/V93GoodDayWorkspaceUxHardening.tsx",
  "apps/web/lib/enterprise/work-os-v93-goodday-workspace-ux-hardening.ts",
  "apps/web/lib/enterprise/work-os-v92-provider-ledger-task-mutation-pilot.ts",
  "docs/NEXT_BUILD_PLAN.md",
  "docs/V9_3_0_GOODDAY_WORKSPACE_UX_HARDENING_REPORT.md"
];

const forbidden = [
  ["de", "mo"].join(""),
  "separate showcase",
  "parallel Work OS shell",
  "Provider Canary / ACL / Primary Pilot",
  "v7.9.0",
  "hidden w-72"
];

const findings = [];
for (const rel of files) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) continue;
  const text = fs.readFileSync(full, "utf8");
  for (const token of forbidden) {
    if (text.toLowerCase().includes(token.toLowerCase())) {
      findings.push(`${rel}: ${token}`);
    }
  }
}

fs.mkdirSync("audit-results", { recursive: true });
const report = ["# v9.3.0 GoodDay-like Workspace UX Source Audit", "", findings.length ? "FAIL" : "PASS", "", ...findings.map((item) => `- ${item}`)];
fs.writeFileSync(path.join("audit-results", "v930-goodday-workspace-ux-source-audit.md"), report.join("\n"), "utf8");
if (findings.length) {
  console.error("Source audit failed:");
  for (const item of findings) console.error(`- ${item}`);
  process.exit(1);
}
console.log("PASS: v9.3.0 GoodDay-like Workspace UX source audit clean");
