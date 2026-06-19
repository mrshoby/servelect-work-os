import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const componentPath = path.join(root, "apps/web/components/tasks/V140GoodDayRouteSpecificTaskuriWorkspace.tsx");
const reportDir = path.join(root, "audit-results");
fs.mkdirSync(reportDir, { recursive: true });
const reportPath = path.join(reportDir, "v1400-browser-flow-source-audit.md");
const text = fs.readFileSync(componentPath, "utf8");
const markers = [
  "onClick={addTask}",
  "onClick={addTicket}",
  "onClick={exportCsv}",
  "bulkMoveToReview",
  "updateTask(task.id",
  "setSelectedTaskId(task.id)",
  "localStorage.setItem",
  "convertTicket(ticket.id)",
  "event.dataTransfer.setData",
  "onDrop={(event)",
  "type=\"date\"",
  "type=\"number\"",
  "checked={item.done}",
  "download = \"servelect-taskuri-v140.csv\""
];
const rows = markers.map((marker) => ({ marker, ok: text.includes(marker) }));
const lines = ["# v14.0.0 Browser Flow Source Audit", "", rows.every((row) => row.ok) ? "PASS" : "FAIL", "", "| Flow marker | PASS/FAIL |", "|---|---:|", ...rows.map((row) => `| ${row.marker.replaceAll("|", "\\|")} | ${row.ok ? "PASS" : "FAIL"} |`)];
fs.writeFileSync(reportPath, lines.join("\n"));
const failed = rows.filter((row) => !row.ok);
if (failed.length) throw new Error(`v14.0.0 browser flow source audit failed: ${failed.length}. Report: ${reportPath}`);
console.log(`PASS: v14.0.0 browser flow source audit clean (${rows.length} / ${rows.length})`);
console.log(`Report: ${reportPath}`);
