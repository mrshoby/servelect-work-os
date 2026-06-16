import fs from "node:fs";
import path from "node:path";

const repo = process.cwd();
const reportDir = path.join(repo, "audit-results");
fs.mkdirSync(reportDir, { recursive: true });
const reportPath = path.join(reportDir, "v1300-browser-flow-source-audit.md");
const componentPath = path.join(repo, "apps", "web", "components", "tasks", "V130UnifiedTaskuriWorkspace.tsx");
const text = fs.readFileSync(componentPath, "utf8");
const required = [
  "onClick={state.addTask}",
  "onClick={state.addTicket}",
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
];
const failures = required.filter((marker) => !text.includes(marker));
const rows = ["# v13.0.0 Browser Flow Source Audit", "", failures.length ? "FAIL" : "PASS", "", "| Flow marker | PASS/FAIL |", "|---|---:|", ...required.map((marker) => `| ${marker.replaceAll("|", "/")} | ${failures.includes(marker) ? "FAIL" : "PASS"} |`)];
fs.writeFileSync(reportPath, rows.join("\n"));
if (failures.length) throw new Error(`v13.0.0 browser flow source audit failed: ${failures.join(", ")}`);
console.log(`PASS: v13.0.0 browser flow source audit clean (${required.length} / ${required.length})`);
console.log(`Report: ${reportPath}`);
