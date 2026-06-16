import fs from "fs";
import path from "path";

const root = process.cwd();
const componentPath = path.join(root, "apps/web/components/tasks/V98GoodDayTaskuriParityWorkspace.tsx");
const dataPath = path.join(root, "apps/web/lib/enterprise/work-os-v98-goodday-ui-content-function-parity.ts");
const docs = [
  "docs/V_NEXT_GOODDAY_UI_REFERENCE_AUDIT.md",
  "docs/V_NEXT_VERCEL_UI_REALITY_AUDIT.md",
  "docs/V_NEXT_BUTTON_FUNCTIONALITY_AUDIT.md",
  "docs/V_NEXT_FUNCTIONAL_FLOW_REPORT.md",
  "docs/V_NEXT_MANUAL_UI_SCREENSHOT_AUDIT.md",
  "docs/V_NEXT_QA_REPORT.md"
];
const failures = [];
function read(file) { try { return fs.readFileSync(file, "utf8"); } catch { failures.push(`Missing ${file}`); return ""; } }
const component = read(componentPath);
const data = read(dataPath);
for (const doc of docs) read(path.join(root, doc));

const forbidden = [/STATIC_UI/i, /separate showcase/i, /demo page/i, /dead button/i];
for (const pattern of forbidden) {
  if (pattern.test(component) || pattern.test(data)) failures.push(`Forbidden wording found: ${pattern}`);
}

const requiredStrings = [
  "data-testid=\"task-drawer\"",
  "data-testid=\"enterprise-task-table\"",
  "data-testid=\"kanban-mature-board\"",
  "data-testid=\"ticket-request-center\"",
  "data-testid=\"calendar-gantt-real-planning\"",
  "data-testid=\"workload-resource-planning\"",
  "createTask",
  "createTicket",
  "convertTicket",
  "escalateTicket",
  "addComment",
  "toggleChecklist",
  "addDependency",
  "attachMockFile",
  "startTimer",
  "stopTimer",
  "bulkStatus",
  "bulkAssignee",
  "exportCsv",
  "saveView",
  "markNotificationRead",
  "approve",
  "localStorage",
  "Array.from({ length: 52 })",
  "Array.from({ length: 15 })",
  "REAL_LOCAL_PERSISTENT MOCK_INTERACTIVE"
];
for (const token of requiredStrings) {
  if (!component.includes(token) && !data.includes(token)) failures.push(`Missing required token: ${token}`);
}

const pages = ["page.tsx", "overview/page.tsx", "my-work/page.tsx", "tickets-notificari/page.tsx", "board/page.tsx", "tabel/page.tsx", "calendar-gantt/page.tsx", "workload-aprobari/page.tsx"];
for (const page of pages) {
  const pagePath = path.join(root, "apps/web/app/taskuri", page);
  const txt = read(pagePath);
  if (!txt.includes("V98GoodDayTaskuriParityWorkspace")) failures.push(`Taskuri page not replaced by dense workspace: ${page}`);
}

const report = [];
report.push("# v9.8.0 GoodDay UI Content Function Parity Source Audit");
report.push("");
if (failures.length) {
  report.push("FAIL");
  report.push("");
  for (const failure of failures) report.push(`- ${failure}`);
} else {
  report.push("PASS");
  report.push("");
  report.push("Dense workspace, drawer, board, table, tickets, calendar/gantt, workload, handlers, seed counts and docs are present.");
}
const outDir = path.join(root, "audit-results");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "v980-goodday-ui-content-function-parity-source-audit.md");
fs.writeFileSync(outPath, report.join("\n"));
console.log(report.join("\n"));
if (failures.length) process.exit(1);
