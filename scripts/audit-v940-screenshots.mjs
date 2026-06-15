import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const routes = [
  "/taskuri/timeline-dependencies-v94",
  "/taskuri/calendar-capacity-v94",
  "/taskuri/drawer-mutation-queue-v94",
  "/taskuri/approval-workflow-builder-v94",
  "/taskuri/task-template-recurrence-v94",
  "/taskuri/policy-contracts-v94",
  "/taskuri/gantt-readiness-v94",
  "/admin/taskuri-execution-governance-v94",
  "/api/v1/work-os/v94-goodday-timeline-drawer-mutation/health"
];

const outDir = path.join("audit-results", "v940-screenshots");
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
const rows = [];
for (const route of routes) {
  const url = `${baseUrl.replace(/\/$/, "")}${route}`;
  let status = 0;
  let result = "FAIL";
  let note = "";
  const file = `${route.replace(/^\//, "").replaceAll("/", "_")}.png`;
  try {
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    status = response?.status() ?? 0;
    await page.screenshot({ path: path.join(outDir, file), fullPage: true });
    result = status >= 200 && status < 300 ? "PASS" : "FAIL";
    note = result === "PASS" ? "OK" : `HTTP ${status}`;
  } catch (error) {
    note = error instanceof Error ? error.message : String(error);
  }
  const bytes = fs.existsSync(path.join(outDir, file)) ? fs.statSync(path.join(outDir, file)).size : 0;
  rows.push({ route, result, status, file, bytes, note });
}
await browser.close();
const pass = rows.filter((row) => row.result === "PASS" && row.bytes > 0).length;
const report = [
  "# V9.4.0 Timeline Drawer Mutation Screenshot Audit Report",
  "",
  `BaseUrl: ${baseUrl}`,
  "",
  "| Route | Result | HTTP | PNG | Bytes | Note |",
  "|---|---:|---:|---|---:|---|",
  ...rows.map((row) => `| ${row.route} | ${row.result} | ${row.status} | ${row.file} | ${row.bytes} | ${row.note.replaceAll("|", "/")} |`),
  "",
  `Captured clean: ${pass} / ${rows.length}`
];
fs.writeFileSync(path.join("audit-results", "V9_4_0_SCREENSHOT_AUDIT_REPORT.md"), report.join("\n"), "utf8");
console.log(`v9.4.0 screenshot audit captured clean: ${pass} / ${rows.length}`);
if (pass !== rows.length) process.exit(1);
