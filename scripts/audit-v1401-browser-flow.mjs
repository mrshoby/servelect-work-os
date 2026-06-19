import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const componentPath = path.join(root, "apps", "web", "components", "tasks", "V140GoodDayRouteSpecificTaskuriWorkspace.tsx");
const reportDir = path.join(root, "audit-results");
const reportPath = path.join(reportDir, "v1401-browser-flow-source-audit.md");

if (!fs.existsSync(componentPath)) {
  throw new Error(`Missing component: ${componentPath}`);
}

const source = fs.readFileSync(componentPath, "utf8");

const requiredMarkers = [
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
  'type="date"'
];

const rows = requiredMarkers.map((marker) => ({
  marker,
  ok: source.includes(marker)
}));

const failed = rows.filter((row) => !row.ok);

fs.mkdirSync(reportDir, { recursive: true });
const report = [
  "# v14.0.1 Browser Flow Source Audit",
  "",
  failed.length ? "FAIL" : "PASS",
  "",
  "| Flow marker | PASS/FAIL |",
  "|---|---:|",
  ...rows.map((row) => `| ${row.marker.replaceAll("|", "\\|")} | ${row.ok ? "PASS" : "FAIL"} |`),
  "",
  `Checked component: ${path.relative(root, componentPath)}`,
  "",
  failed.length ? `Failed markers: ${failed.map((row) => row.marker).join(", ")}` : "All required browser-flow markers are present."
];
fs.writeFileSync(reportPath, report.join("\n"), "utf8");

if (failed.length) {
  throw new Error(`v14.0.1 browser flow source audit failed: ${failed.length}. Report: ${reportPath}`);
}

console.log("PASS: v14.0.1 browser flow source audit clean");
console.log(`Report: ${reportPath}`);
