import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = [
  "apps/web/components/tasks/V94GoodDayTimelineDrawerMutation.tsx",
  "apps/web/lib/enterprise/work-os-v94-goodday-timeline-drawer-mutation.ts",
  "apps/web/lib/enterprise/work-os-v93-goodday-workspace-ux-hardening.ts",
  "docs/NEXT_BUILD_PLAN.md",
  "docs/V9_4_0_TIMELINE_DRAWER_MUTATION_QUEUE_REPORT.md"
];

const forbidden = [
  ["de", "mo"].join(""),
  ["separate", "showcase"].join(" "),
  ["parallel", "Work OS", "shell"].join(" "),
  ["hidden", "w-72"].join(" "),
  ["Provider Canary", "ACL", "Primary Pilot"].join(" / "),
  "v7.9.0"
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
const report = ["# v9.4.0 Timeline Drawer Mutation Source Audit", "", findings.length ? "FAIL" : "PASS", "", ...findings.map((item) => `- ${item}`)];
fs.writeFileSync(path.join("audit-results", "v940-goodday-source-audit.md"), report.join("\n"), "utf8");
if (findings.length) {
  console.error("Source audit failed:");
  for (const item of findings) console.error(`- ${item}`);
  process.exit(1);
}
console.log("PASS: v9.4.0 Timeline Drawer Mutation source audit clean");
