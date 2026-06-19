import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = [
  "apps/web/components/tasks/V100GoodDayTaskuriMatureWorkspace.tsx",
  "apps/web/lib/enterprise/work-os-v100-goodday-ui-functional-parity.ts",
  "docs/V_NEXT_BUTTON_AUDIT.md",
  "docs/V_NEXT_STATIC_UI_ELIMINATION_REPORT.md",
  "docs/V_NEXT_GOODDAY_UI_PARITY_ACCEPTANCE.md"
];
const required = [
  "REAL_LOCAL_PERSISTENT",
  "MOCK_INTERACTIVE",
  "TaskDrawer",
  "BoardPanel",
  "TablePanel",
  "TicketsPanel",
  "WorkloadPanel",
  "CalendarGanttPanel",
  "localStorage",
  "createTask",
  "createTicket",
  "saveView",
  "exportCsv",
  "bulkUpdate",
  "convertTicket",
  "startTimer",
  "stopTimer",
  "toggleChecklist"
];
const forbidden = ["STATIC_UI", "separate demo", "demo app", "GoodDay logo", "GoodDay asset"];
const failures = [];
for (const rel of files) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) failures.push(`missing ${rel}`);
}
const combined = files.filter((rel) => fs.existsSync(path.join(root, rel))).map((rel) => fs.readFileSync(path.join(root, rel), "utf8")).join("\n");
for (const needle of required) if (!combined.includes(needle)) failures.push(`required marker missing: ${needle}`);
for (const bad of forbidden) if (combined.toLowerCase().includes(bad.toLowerCase())) failures.push(`forbidden/static marker found: ${bad}`);
const routeFiles = ["page.tsx","overview/page.tsx","my-work/page.tsx","inbox/page.tsx","tickets/page.tsx","tickets-notificari/page.tsx","board/page.tsx","tabel/page.tsx","calendar-gantt/page.tsx","workload-aprobari/page.tsx"];
for (const rel of routeFiles) {
  const abs = path.join(root, "apps/web/app/taskuri", rel);
  if (!fs.existsSync(abs)) failures.push(`missing route ${rel}`);
  else if (!fs.readFileSync(abs,"utf8").includes("V100GoodDayTaskuriMatureWorkspace")) failures.push(`route not wired to v10 workspace: ${rel}`);
}
const outDir = path.join(root, "audit-results");
fs.mkdirSync(outDir, { recursive: true });
const reportPath = path.join(outDir, "v1000-goodday-ui-source-audit.md");
fs.writeFileSync(reportPath, failures.length ? `# v10.0.0 GoodDay UI Source Audit\n\nFAIL\n\n${failures.map((f)=>`- ${f}`).join("\n")}\n` : "# v10.0.0 GoodDay UI Source Audit\n\nPASS\n", "utf8");
if (failures.length) throw new Error(`v10.0.0 source audit failed: ${failures.join("; ")}`);
console.log("PASS: v10.0.0 GoodDay UI source audit clean");
console.log(`Report: ${reportPath}`);
