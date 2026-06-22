import fs from "node:fs";
import path from "node:path";
const baseUrl = process.env.SERVELECT_AUDIT_BASE_URL || "https://servelect-work-os-web.vercel.app";
const rows = [
  ["Taskuri", "New Task", "Delegated click + bridge mutation", "Mutation record in localStorage", "Use Playwright/manual click audit", "PENDING"],
  ["Taskuri", "Board status move", "Drag/drop/status action", "State and count update", "Use Playwright/manual click audit", "PENDING"],
  ["Taskuri", "Drawer save", "Edit/save fields", "All views update", "Use Playwright/manual click audit", "PENDING"],
  ["Inbox", "Mark all read", "Click notification action", "Badge decreases", "Use Playwright/manual click audit", "PENDING"],
  ["Procurement", "Purchase order", "Generate order", "Activity + report refresh", "Use Playwright/manual click audit", "PENDING"],
];
let md = `# v21.0.0 Browser Functional Flow Audit\n\nBaseUrl: ${baseUrl}\n\nThis report is intentionally not marked 100%; run full Playwright/manual click audit after Vercel deploy.\n\n| Page | Element | Action tested | Expected result | Actual result | PASS/FAIL |\n|---|---|---|---|---|---:|\n`;
for (const r of rows) md += `| ${r.join(" | ")} |\n`;
fs.mkdirSync(path.join(process.cwd(), "audit-results"), { recursive: true });
fs.writeFileSync(path.join(process.cwd(), "audit-results", "v2100-browser-functional-flow-audit.md"), md);
fs.writeFileSync(path.join(process.cwd(), "docs", "V_NEXT_FULL_FRONTEND_FUNCTIONAL_AUDIT.md"), md);
console.log(md);
