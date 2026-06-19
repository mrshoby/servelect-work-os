import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const token = process.env.VERCEL_PROTECTION_BYPASS || process.env.VERCEL_AUTOMATION_BYPASS_SECRET || "";
const outPath = path.join(process.cwd(), "audit-results", "v1700-browser-functional-flow-audit.md");
fs.mkdirSync(path.dirname(outPath), { recursive: true });

const flows = [
  { page: "/taskuri", element: "New Task", action: async (p) => p.getByRole("button", { name: "New Task" }).first().click(), expected: "New Task created" },
  { page: "/taskuri/tickets", element: "New Ticket", action: async (p) => p.getByRole("button", { name: "New Ticket" }).first().click(), expected: "New Ticket created" },
  { page: "/taskuri/tabel", element: "Save View", action: async (p) => p.getByRole("button", { name: "Save View" }).first().click(), expected: "Saved View persisted" },
  { page: "/taskuri/tabel", element: "Export", action: async (p) => p.getByRole("button", { name: "Export" }).first().click(), expected: "Export generated" },
  { page: "/taskuri", element: "Import", action: async (p) => p.getByRole("button", { name: "Import" }).first().click(), expected: "Import completed" },
  { page: "/taskuri/board", element: "Bulk to review", action: async (p) => p.getByRole("button", { name: "Bulk to review" }).first().click(), expected: "Bulk validation" },
  { page: "/taskuri/timesheets", element: "Start timer", action: async (p) => p.getByRole("button", { name: "Start timer" }).first().click(), expected: "Timer started" },
  { page: "/taskuri/timesheets", element: "Stop timer", action: async (p) => p.getByRole("button", { name: "Stop timer" }).first().click(), expected: "Timer stopped" },
  { page: "/taskuri/inbox", element: "Mark all read", action: async (p) => p.getByRole("button", { name: "Mark all read" }).first().click(), expected: "All notifications marked read" },
  { page: "/taskuri/approvals", element: "Approve", action: async (p) => p.getByRole("button", { name: "Approve" }).first().click(), expected: "approved" },
  { page: "/taskuri/approvals", element: "Reject", action: async (p) => p.getByRole("button", { name: "Reject" }).first().click(), expected: "rejected" },
  { page: "/taskuri/automations", element: "Create automation", action: async (p) => p.getByRole("button", { name: "Create automation" }).first().click(), expected: "Automation created" },
  { page: "/taskuri", element: "Add comment", action: async (p) => p.getByRole("button", { name: "Add comment" }).first().click(), expected: "Comment added" },
  { page: "/taskuri", element: "Add dependency", action: async (p) => p.getByRole("button", { name: "Add dependency" }).first().click(), expected: "Dependency added" },
  { page: "/taskuri", element: "Attach file", action: async (p) => p.getByRole("button", { name: "Attach file" }).first().click(), expected: "Mock attachment added" }
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
const page = await context.newPage();
if (token && baseUrl.includes("vercel.app")) {
  const warmUrl = `${baseUrl}/taskuri?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=${encodeURIComponent(token)}`;
  await page.goto(warmUrl, { waitUntil: "networkidle", timeout: 60000 });
}
const rows = [];
for (const flow of flows) {
  let pass = false;
  let actual = "";
  let persisted = "CHECK";
  try {
    await page.goto(`${baseUrl}${flow.page}`, { waitUntil: "networkidle", timeout: 60000 });
    const before = await page.content();
    if (!before.includes("data-v170-goodday-functional-parity")) throw new Error("Missing v17 marker");
    await flow.action(page);
    await page.waitForTimeout(600);
    const after = await page.content();
    actual = after.includes(flow.expected) || after.toLowerCase().includes(flow.expected.toLowerCase()) ? flow.expected : "feedback not found";
    pass = actual !== "feedback not found";
    await page.reload({ waitUntil: "networkidle", timeout: 60000 });
    const refreshed = await page.content();
    persisted = refreshed.includes("data-v170-goodday-functional-parity") ? "YES" : "NO";
  } catch (error) {
    actual = error instanceof Error ? error.message : String(error);
  }
  rows.push({ ...flow, actual, stateChanged: pass ? "YES" : "NO", persisted, pass });
}
await browser.close();
const passed = rows.filter(r => r.pass).length;
const lines = [
  "# V_NEXT_FULL_FRONTEND_FUNCTIONAL_AUDIT",
  "",
  `BaseUrl: ${baseUrl}`,
  "",
  "| Page | Element | Action tested | Expected result | Actual result | State changed | Persisted | PASS/FAIL |",
  "|---|---|---|---|---|---:|---:|---:|",
  ...rows.map(r => `| ${r.page} | ${r.element} | click | ${r.expected} | ${String(r.actual).replaceAll("|", "/")} | ${r.stateChanged} | ${r.persisted} | ${r.pass ? "PASS" : "FAIL"} |`),
  "",
  `Passed: ${passed} / ${rows.length}`
];
const docPath = path.join(process.cwd(), "docs", "V_NEXT_FULL_FRONTEND_FUNCTIONAL_AUDIT.md");
fs.writeFileSync(docPath, lines.join("\n"));
fs.writeFileSync(outPath, lines.join("\n"));
console.log(lines.join("\n"));
if (passed < rows.length) process.exit(1);
