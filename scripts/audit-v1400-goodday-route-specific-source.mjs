import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const componentPath = path.join(root, "apps/web/components/tasks/V140GoodDayRouteSpecificTaskuriWorkspace.tsx");
const taskuriRoot = path.join(root, "apps/web/app/taskuri");
const reportDir = path.join(root, "audit-results");
fs.mkdirSync(reportDir, { recursive: true });
const reportPath = path.join(reportDir, "v1400-goodday-route-specific-source-audit.md");

const errors = [];
function read(file) { return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : ""; }
const component = read(componentPath);
if (!component) errors.push(`missing component: ${componentPath}`);

const required = [
  "data-v140-goodday-route-specific-taskuri",
  "data-v120-single-canonical-sidebar",
  "function routeKind",
  "renderRouteContent",
  "BoardView",
  "TableView",
  "CalendarView",
  "GanttView",
  "WorkloadView",
  "ReportsView",
  "AutomationView",
  "FormsView",
  "TimesheetView",
  "ProjectsView",
  "FilesView",
  "ProviderView",
  "ApprovalsView",
  "TicketsView",
  "InboxView",
  "MyWorkView",
  "localStorage.setItem",
  "onDrop=",
  "dataTransfer",
  "convertTicket",
  "exportCsv",
  "bulkMoveToReview"
];
for (const marker of required) {
  if (!component.includes(marker)) errors.push(`component missing marker: ${marker}`);
}

const forbiddenComponent = ["Work OS · Taskuri", "Workspace hierarchy", "Canonical Work", "SERVELECT EMP", "Enterprise table/list everywhere"];
for (const marker of forbiddenComponent) {
  if (component.includes(marker)) errors.push(`forbidden component marker still present: ${marker}`);
}

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && entry.name === "page.tsx") out.push(full);
  }
  return out;
}
const pages = walk(taskuriRoot);
for (const page of pages) {
  const text = read(page);
  if (!text.includes("V140GoodDayRouteSpecificTaskuriWorkspace")) errors.push(`page not bound to V140: ${path.relative(root, page)}`);
  if (!text.includes("route=\"/taskuri")) errors.push(`page missing route prop: ${path.relative(root, page)}`);
}

const routeKinds = ["dashboard", "myWork", "inbox", "tickets", "board", "table", "calendar", "gantt", "workload", "reports", "automations", "forms", "timesheets", "projects", "files", "provider", "approvals"];
for (const kind of routeKinds) {
  if (!component.includes(`kind === \"${kind}\"`) && !component.includes(`${kind}: {`)) errors.push(`route-specific kind not implemented: ${kind}`);
}

const lines = [
  "# v14.0.0 GoodDay Route-Specific Taskuri Source Audit",
  "",
  errors.length ? "FAIL" : "PASS",
  "",
  `Checked Taskuri pages: ${pages.length}`,
  `Checked view families: ${routeKinds.length}`,
  "",
  ...errors.map((error) => `- ${error}`)
];
fs.writeFileSync(reportPath, lines.join("\n"));
if (errors.length) throw new Error(`v14.0.0 source audit failed: ${errors.length} issue(s). Report: ${reportPath}`);
console.log(`PASS: v14.0.0 GoodDay route-specific source audit clean (${pages.length} pages, ${routeKinds.length} view families)`);
console.log(`Report: ${reportPath}`);
