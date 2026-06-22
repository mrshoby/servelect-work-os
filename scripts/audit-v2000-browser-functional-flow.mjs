import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const baseUrl = process.env.BASE_URL || process.argv.find((arg) => arg.startsWith("--baseUrl="))?.split("=")[1] || "https://servelect-work-os-web.vercel.app";

const rows = [
  ["Taskuri", "New Task", "Click opens form, Save creates task, persists after refresh", "Use browser script/manual run on Vercel", "PENDING_MANUAL"],
  ["Taskuri", "Board status move", "Drag/drop or click status move updates Table/My Work/Drawer", "Use browser script/manual run on Vercel", "PENDING_MANUAL"],
  ["Taskuri", "Drawer save", "Status/assignee/due/estimate updates all views", "Use browser script/manual run on Vercel", "PENDING_MANUAL"],
  ["Taskuri", "Comments/checklist/dependencies/files", "Adds to drawer and activity log", "Use browser script/manual run on Vercel", "PENDING_MANUAL"],
  ["Taskuri", "Timer", "Start/stop creates time entry and workload impact", "Use browser script/manual run on Vercel", "PENDING_MANUAL"],
  ["Inbox", "Notifications", "Mark read/all read/open entity updates badge and drawer", "Use browser script/manual run on Vercel", "PENDING_MANUAL"],
  ["Procurement", "RFQ/PO/Invoice", "Request → RFQ → offers → PO → invoice flow creates activity", "Use browser script/manual run on Vercel", "PENDING_MANUAL"],
];

const report = [
  "# v20.0.0 Browser Functional Flow Audit",
  "",
  `BaseUrl: ${baseUrl}`,
  "",
  "Acest raport este generat ca checklist de browser/manual audit. Nu este marcat 100% fără rulare reală pe UI.",
  "",
  "| Page | Element | Action tested | Expected result | Actual result | PASS/FAIL |",
  "|---|---|---|---|---|---:|",
  ...rows.map(([page, element, action, expected, result]) => `| ${page} | ${element} | ${action} | ${expected} | ${result} | PENDING |`),
  "",
].join("\n");

fs.mkdirSync(path.join(root, "audit-results"), { recursive: true });
fs.writeFileSync(path.join(root, "audit-results/v2000-browser-functional-flow-audit.md"), report);
fs.writeFileSync(path.join(root, "docs/V_NEXT_FULL_FRONTEND_FUNCTIONAL_AUDIT.md"), report);
console.log(report);
