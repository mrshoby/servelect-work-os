import fs from "fs";
import path from "path";

const root = process.cwd();
const component = path.join(root, "apps/web/components/tasks/V170GoodDayFunctionalParityWorkspace.tsx");
const required = [
  "data-v150-goodday-structural-parity",
  "data-v170-goodday-functional-parity",
  "REAL_LOCAL_PERSISTENT",
  "New Task",
  "New Ticket",
  "Save View",
  "Reset Filter",
  "Bulk to review",
  "Task detail drawer",
  "Add comment",
  "Add checklist",
  "Add dependency",
  "Attach file",
  "Start timer",
  "Stop timer",
  "Mark all read",
  "Approve",
  "Reject",
  "Export",
  "Import",
  "localStorage",
  "V160RealProviderMutationTaskuriWorkspace"
];

const missing = [];
if (!fs.existsSync(component)) missing.push(`missing component ${component}`);
const text = fs.existsSync(component) ? fs.readFileSync(component, "utf8") : "";
for (const item of required) {
  if (item === "V160RealProviderMutationTaskuriWorkspace") {
    if (text.includes(item)) missing.push("component must not depend on V160 shell");
  } else if (!text.includes(item)) missing.push(`missing marker: ${item}`);
}

const pages = ["taskuri/page.tsx", "taskuri/my-work/page.tsx", "taskuri/board/page.tsx", "taskuri/tabel/page.tsx", "taskuri/tickets/page.tsx", "taskuri/calendar-gantt/page.tsx"];
for (const page of pages) {
  const file = path.join(root, "apps/web/app", page);
  if (!fs.existsSync(file)) missing.push(`missing page ${page}`);
  else {
    const pageText = fs.readFileSync(file, "utf8");
    if (!pageText.includes("V170GoodDayFunctionalParityWorkspace")) missing.push(`page not bound to V170: ${page}`);
    if (pageText.includes("V160RealProviderMutationTaskuriWorkspace")) missing.push(`page still bound to V160: ${page}`);
  }
}

const out = [
  "# v17.0.0 Source Audit",
  "",
  `Component: ${component}`,
  "",
  missing.length === 0 ? "PASS" : "FAIL",
  "",
  ...missing.map(m => `- ${m}`)
].join("\n");
const outPath = path.join(root, "audit-results", "v1700-source-audit.md");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, out);
console.log(out);
if (missing.length) process.exit(1);
