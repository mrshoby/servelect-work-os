import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const scriptPath = path.join(root, "scripts", "audit-v1401-browser-flow.mjs");
const reportDir = path.join(root, "audit-results");
const reportPath = path.join(reportDir, "v1402-browser-flow-script-syntax-audit.md");

const script = fs.readFileSync(scriptPath, "utf8");
const checks = [
  { name: "no broken double-quoted type=date marker", ok: !script.includes('"type="date""') },
  { name: "uses single-quoted type=date marker", ok: script.includes('\'type="date"\'') },
  { name: "keeps setSelectedTaskId marker", ok: script.includes('"setSelectedTaskId(task.id)"') },
  { name: "writes report.join with escaped newline", ok: script.includes('report.join("\\n")') },
  { name: "does not remove failure throw", ok: script.includes("throw new Error(`v14.0.1 browser flow source audit failed") }
];

fs.mkdirSync(reportDir, { recursive: true });
const report = [
  "# v14.0.2 Browser Flow Script Syntax Audit",
  "",
  checks.every((check) => check.ok) ? "PASS" : "FAIL",
  "",
  "| Check | PASS/FAIL |",
  "|---|---:|",
  ...checks.map((check) => `| ${check.name} | ${check.ok ? "PASS" : "FAIL"} |`)
];
fs.writeFileSync(reportPath, report.join("\n"), "utf8");

const failed = checks.filter((check) => !check.ok);
if (failed.length) {
  throw new Error(`v14.0.2 browser flow script syntax audit failed: ${failed.length}. Report: ${reportPath}`);
}

console.log("PASS: v14.0.2 browser flow script syntax audit clean");
console.log(`Report: ${reportPath}`);
