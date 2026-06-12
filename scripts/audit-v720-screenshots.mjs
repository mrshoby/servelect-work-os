import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3100";
const root = process.cwd();
const outDir = path.join(root, "audit-results", "v72-screenshots");
fs.mkdirSync(outDir, { recursive: true });

const routes = [
  "/work-os/prisma-shadow-records",
  "/admin/prisma-shadow-records",
  "/taskuri/overview",
  "/taskuri/tickets-notificari",
  "/taskuri/forms",
  "/taskuri/timesheets",
  "/taskuri/workload-aprobari",
  "/taskuri/automations",
  "/taskuri/reports"
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
const rows = [];

for (const route of routes) {
  const name = route.replace(/^\//, "").replaceAll("/", "_") || "home";
  const file = `${name}.png`;
  const filepath = path.join(outDir, file);
  try {
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 45000 });
    const status = response ? response.status() : 0;
    if (!response || status >= 400) throw new Error(`HTTP ${status}`);
    await page.screenshot({ path: filepath, fullPage: true });
    const bytes = fs.statSync(filepath).size;
    rows.push({ route, result: "PASS", status, png: file, bytes });
  } catch (error) {
    rows.push({ route, result: `FAIL: ${error instanceof Error ? error.message : String(error)}`, status: 0, png: "NO_PNG", bytes: 0 });
  }
}

await browser.close();

const pass = rows.filter((row) => row.result === "PASS" && row.bytes > 0).length;
const report = [
  "# V7.2.3 Screenshot Audit Report",
  "",
  `BaseUrl: ${baseUrl}`,
  `Captured clean: ${pass} / ${routes.length}`,
  "",
  "| Route | Result | HTTP | PNG | Bytes |",
  "|---|---:|---:|---|---:|",
  ...rows.map((row) => `| ${row.route} | ${row.result} | ${row.status} | ${row.png} | ${row.bytes} |`)
].join("\n");

const reportPath = path.join(root, "audit-results", "V7_2_3_SCREENSHOT_AUDIT_REPORT.md");
fs.writeFileSync(reportPath, report, "utf8");
console.log(report);
if (pass !== routes.length) process.exitCode = 1;
