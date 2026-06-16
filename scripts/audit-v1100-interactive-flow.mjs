import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const componentPath = path.join(root, "apps/web/components/tasks/V110GoodDayTaskuriEnterpriseWorkspace.tsx");
const source = fs.readFileSync(componentPath, "utf8");
const flows = [
  ["Create task", "createTask("],
  ["Open drawer", "setSelectedTaskId"],
  ["Edit status", "status: e.target.value"],
  ["Edit assignee", "assignee: e.target.value"],
  ["Add comment", "addComment"],
  ["Toggle checklist", "toggleChecklist"],
  ["Add dependency", "addDependency"],
  ["Start timer", "startStopTimer"],
  ["Stop timer", "activeTimer === task.id"],
  ["Board move", "onDrop"],
  ["Table bulk action", "bulkUpdate"],
  ["Create ticket", "createTicket"],
  ["Escalate ticket", "Escalate"],
  ["Convert ticket", "convertTicket"],
  ["Submit request", "createRequest"],
  ["Mark notification read", "markRead"],
  ["Archive notification", "archiveNotification"],
  ["Create saved view", "saveView"],
  ["Change deadline", "dueDate: e.target.value"],
  ["Change estimate", "estimate: Number"],
  ["Approve/reject", "approve(item.id"],
  ["Export CSV", "exportCsv"],
  ["Switch role", "setRole"],
  ["Create automation", "createAutomation"],
  ["Test automation", "testAutomation"],
  ["Persist shared state", "localStorage.setItem"],
];
const rows = flows.map(([flow, marker]) => ({ flow, marker, pass: source.includes(marker) }));
const passed = rows.filter((row) => row.pass).length;
const reportDir = path.join(root, "audit-results");
fs.mkdirSync(reportDir, { recursive: true });
const reportPath = path.join(reportDir, "v1100-interactive-flow-audit.md");
const md = [
  "# v11.0.0 Interactive Flow Audit",
  "",
  "This audit verifies source-level handlers and shared-state coverage. Browser execution must still be run after Vercel deployment.",
  "",
  "| Flow | Marker | Result |",
  "|---|---|---:|",
  ...rows.map((row) => `| ${row.flow} | ${row.marker.replace(/\|/g, "/")} | ${row.pass ? "PASS" : "FAIL"} |`),
  "",
  `Passed: ${passed} / ${rows.length}`,
].join("\n");
fs.writeFileSync(reportPath, md, "utf8");
if (passed !== rows.length) throw new Error(`v11.0.0 interactive flow source audit failed: ${passed} / ${rows.length}. Report: ${reportPath}`);
console.log(`PASS: v11.0.0 interactive flow source audit clean (${passed} / ${rows.length})`);
console.log(`Report: ${reportPath}`);
