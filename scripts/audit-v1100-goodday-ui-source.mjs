import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = [
  "apps/web/components/tasks/V110GoodDayTaskuriEnterpriseWorkspace.tsx",
  "apps/web/lib/enterprise/work-os-v110-major-taskuri-goodday-redesign.ts",
  "docs/V_NEXT_GOODDAY_VISUAL_AND_FUNCTIONAL_REFERENCE.md",
  "docs/V_NEXT_LIVE_TASKURI_UI_AUDIT.md",
  "docs/V_NEXT_BUTTON_AUDIT.md",
  "docs/V_NEXT_STATIC_UI_ELIMINATION_REPORT.md",
  "docs/V_NEXT_FUNCTIONAL_FLOW_REPORT.md",
  "docs/V_NEXT_GOODDAY_UI_PARITY_ACCEPTANCE.md",
  "docs/NEXT_BUILD_PLAN.md",
];

const failures = [];
const forbidden = ["STATIC_UI", "separate demo", "GoodDay logo", "GoodDay asset", "copy GoodDay branding"];
for (const file of files) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) failures.push(`missing file: ${file}`);
}
const combined = files.filter((file) => fs.existsSync(path.join(root, file))).map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");
for (const marker of forbidden) {
  if (combined.includes(marker)) failures.push(`forbidden marker found: ${marker}`);
}
const required = [
  "localStorage",
  "New Task",
  "New Ticket",
  "Save View",
  "Export",
  "Bulk status",
  "Start timer",
  "Stop timer",
  "Add comment",
  "Attach file",
  "Approve",
  "Reject",
  "dataTransfer",
  "onDrop",
  "TaskDrawer",
  "BoardView",
  "TableView",
  "WorkloadView",
  "TicketsView",
  "InboxView",
  "V110GoodDayTaskuriEnterpriseWorkspace",
];
for (const marker of required) {
  if (!combined.includes(marker)) failures.push(`required interactive marker missing: ${marker}`);
}

const reportDir = path.join(root, "audit-results");
fs.mkdirSync(reportDir, { recursive: true });
const reportPath = path.join(reportDir, "v1100-goodday-ui-source-audit.md");
fs.writeFileSync(reportPath, failures.length ? `# v11.0.0 GoodDay UI Source Audit\n\nFAIL\n\n${failures.map((f) => `- ${f}`).join("\n")}\n` : "# v11.0.0 GoodDay UI Source Audit\n\nPASS\n", "utf8");
if (failures.length) throw new Error(`v11.0.0 source audit failed: ${failures.join("; ")}`);
console.log("PASS: v11.0.0 GoodDay UI source audit clean");
console.log(`Report: ${reportPath}`);
