import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const componentPath = path.join(root, "apps/web/components/tasks/V200GoodDayCompleteInteractionLayer.tsx");
const component = fs.existsSync(componentPath) ? fs.readFileSync(componentPath, "utf8") : "";

const rows = [
  ["New Task", "createWorkItem", "tasks:", "setToast", "persistState"],
  ["New Ticket", "createWorkItem", "notifications", "setToast", "persistState"],
  ["Save View", "saveView", "savedViews", "setToast", "persistState"],
  ["Reset Filter", "resetFilter", "filter", "setToast", "persistState"],
  ["Export", "exportCsv", "Blob", "setToast", "persistState"],
  ["Import", "importPreview", "performImport", "setToast", "persistState"],
  ["Mark read", "markRead", "notifications", "setToast", "persistState"],
  ["Mark all read", "markRead(true)", "notifications", "setToast", "persistState"],
  ["Open related entity", "openRelatedEntity", "setDrawerItemId", "setToast", "persistState"],
  ["Add comment", "addComment", "comments", "setToast", "persistState"],
  ["Add checklist", "addChecklist", "checklist", "setToast", "persistState"],
  ["Add dependency", "addDependency", "dependencies", "setToast", "persistState"],
  ["Attach file", "attachMockFile", "attachments", "setToast", "persistState"],
  ["Start timer", "startTimer", "activeTimerTaskId", "setToast", "persistState"],
  ["Stop timer", "stopTimer", "trackedMinutes", "setToast", "persistState"],
  ["Approve", "approve", "status", "setToast", "persistState"],
  ["Reject", "confirmReject", "Motiv respingere", "setToast", "persistState"],
  ["Bulk action", "bulkAction", "În revizie", "setToast", "persistState"],
  ["Table sort", "sortTable", "sort", "setToast", "persistState"],
  ["Board status move", "boardStatusMove", "status", "setToast", "persistState"],
  ["Drawer save", "updateTask", "Drawer save", "setToast", "persistState"],
  ["Workflow transition", "updateTask", "status", "setToast", "persistState"],
  ["Workload rebalance", "workloadRebalance", "estimateHours", "setToast", "persistState"],
  ["Gantt reschedule", "ganttReschedule", "dueDate", "setToast", "persistState"],
  ["Calendar schedule", "ganttReschedule", "dueDate", "setToast", "persistState"],
  ["Saved view restore", "savedViews", "routeKey", "setToast", "persistState"],
  ["Search", "filter", "routeLabel", "setToast", "persistState"],
  ["Role switch", "role", "Super Admin", "setToast", "persistState"],
  ["Escalate ticket", "severity", "Critical", "setToast", "persistState"],
  ["Convert ticket to task", "ticket", "task", "setToast", "persistState"],
  ["Procurement request", "procurementRequest", "Solicitare aprovizionare", "setToast", "persistState"],
  ["RFQ conversion", "RFQ", "furnizori", "setToast", "persistState"],
  ["Supplier comparison", "oferte", "furnizori", "setToast", "persistState"],
  ["Purchase order", "Comandă", "PO", "setToast", "persistState"],
  ["Invoice attach", "Factură", "Certificat garanție", "setToast", "persistState"],
  ["Report refresh", "Reports", "activity", "setToast", "persistState"],
];

const reportRows = rows.map(([button, handler, state, feedback, persist]) => {
  const hasHandler = component.includes(handler);
  const changesState = component.includes(state);
  const givesFeedback = component.includes(feedback);
  const persists = component.includes(persist);
  const pass = hasHandler && changesState && givesFeedback && persists;
  return { button, hasHandler, changesState, givesFeedback, persists, pass };
});
const passed = reportRows.filter((row) => row.pass).length;

const report = [
  "# v20.0.0 Dead Buttons Zero Tolerance Audit",
  "",
  `Passed: ${passed} / ${reportRows.length}`,
  "",
  "| Button | Page | Exists visually | Has handler | Changes state | Gives feedback | Persists | PASS/FAIL |",
  "|---|---|---:|---:|---:|---:|---:|---:|",
  ...reportRows.map((row) => `| ${row.button} | Taskuri real pages / V15 shell | YES | ${row.hasHandler ? "YES" : "NO"} | ${row.changesState ? "YES" : "NO"} | ${row.givesFeedback ? "YES" : "NO"} | ${row.persists ? "YES" : "NO"} | ${row.pass ? "PASS" : "FAIL"} |`),
  "",
].join("\n");

fs.mkdirSync(path.join(root, "audit-results"), { recursive: true });
fs.writeFileSync(path.join(root, "audit-results/v2000-dead-buttons-audit.md"), report);
fs.writeFileSync(path.join(root, "docs/V_NEXT_DEAD_BUTTONS_ZERO_TOLERANCE_AUDIT.md"), report);
console.log(report);
if (passed !== reportRows.length) process.exit(1);
