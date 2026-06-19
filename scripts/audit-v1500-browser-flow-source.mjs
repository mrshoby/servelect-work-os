import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const componentPath = path.join(root, "apps", "web", "components", "tasks", "V150GoodDayStructuralTaskuriWorkspace.tsx");
const reportPath = path.join(root, "audit-results", "v1500-browser-flow-source-audit.md");
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
const text = fs.readFileSync(componentPath, "utf8");
const markers = [
  "onClick={state.addTask}",
  "onClick={state.addTicket}",
  "onClick={state.addRequest}",
  "onClick={state.saveView}",
  "onClick={state.exportCsv}",
  "bulkMoveToReview",
  "updateTask(task.id",
  "setSelectedTaskId(task.id)",
  "localStorage.setItem",
  "convertTicket",
  "checklistDone",
  "dueDate",
  "estimate",
  "assignee",
  'type="date"',
  "markNotificationRead",
  "archiveNotification",
  "addDependency",
  "startTimer",
  "stopTimer",
  "attachFile",
  "approve(item.id",
  "createAutomation",
  "testAutomation",
  "event.dataTransfer.setData",
  "onDrop=",
];
const rows = markers.map((marker) => ({ marker, ok: text.includes(marker) }));
const report = ["# v15.0.0 Browser Flow Source Audit", "", rows.every((row) => row.ok) ? "PASS" : "FAIL", "", "| Flow marker | PASS/FAIL |", "|---|---:|", ...rows.map((row) => `| ${row.marker.replaceAll("|", "\\|")} | ${row.ok ? "PASS" : "FAIL"} |`)];
fs.writeFileSync(reportPath, report.join("\n"), "utf8");
const failed = rows.filter((row) => !row.ok);
if (failed.length) throw new Error(`v15.0.0 browser flow source audit failed: ${failed.length}. Report: ${reportPath}`);
console.log(`PASS: v15.0.0 browser flow source audit clean (${rows.length}/${rows.length})`);
console.log(`Report: ${reportPath}`);
