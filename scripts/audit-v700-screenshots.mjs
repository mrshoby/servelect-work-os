import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3100";
const outputDir = path.resolve("audit-results", "v7-screenshots");
const reportPath = path.resolve("audit-results", "V7_0_0_SCREENSHOT_AUDIT_REPORT.md");
const routes = [
  "/taskuri/overview",
  "/taskuri/my-work",
  "/taskuri/tickets-notificari",
  "/taskuri/board",
  "/taskuri/tabel",
  "/taskuri/calendar-gantt",
  "/taskuri/workload-aprobari",
  "/taskuri/forms",
  "/taskuri/timesheets",
  "/taskuri/reports",
  "/admin/workflows",
  "/admin/custom-fields"
];

await fs.mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
const rows = [];
let clean = 0;

for (const route of routes) {
  const fileName = route.replaceAll("/", "_").replace(/^_/, "") + ".png";
  const filePath = path.join(outputDir, fileName);
  try {
    const response = await page.goto(baseUrl + route, { waitUntil: "networkidle", timeout: 45000 });
    const status = response?.status() ?? 0;
    await page.screenshot({ path: filePath, fullPage: true });
    const stat = await fs.stat(filePath);
    const ok = status >= 200 && status < 400 && stat.size > 1000;
    if (ok) clean += 1;
    rows.push({ route, status, png: fileName, bytes: stat.size, result: ok ? "PASS" : "FAIL" });
  } catch (error) {
    rows.push({ route, status: 0, png: "NO_PNG", bytes: 0, result: "FAIL: " + error.message });
  }
}

await browser.close();
const report = [
  "# V7.0.0 Screenshot Audit Report",
  "",
  "BaseUrl: " + baseUrl,
  "Captured clean: " + clean + " / " + routes.length,
  "",
  "| Route | Result | HTTP | PNG | Bytes |",
  "|---|---:|---:|---|---:|",
  ...rows.map((row) => `| ${row.route} | ${row.result} | ${row.status} | ${row.png} | ${row.bytes} |`)
].join("\n");
await fs.writeFile(reportPath, report, "utf8");
console.log(report);
if (clean !== routes.length) {
  process.exitCode = 1;
}

