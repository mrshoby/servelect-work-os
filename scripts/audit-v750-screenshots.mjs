import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.BASE_URL || "https://servelect-work-os-web.vercel.app";
const routes = [
  "/work-os/conflict-resolution",
  "/work-os/attachments",
  "/admin/access-inheritance",
  "/work-os/db-shadow-writes",
  "/work-os/prisma-migration",
  "/work-os/prisma-shadow-records",
  "/taskuri/overview",
  "/taskuri/tickets-notificari",
  "/taskuri/forms",
  "/taskuri/timesheets",
  "/taskuri/workload-aprobari",
  "/taskuri/automations",
  "/taskuri/reports"
];
const outDir = path.join(process.cwd(), "audit-results", "v75-screenshots");
await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
const rows = [];
for (const route of routes) {
  const fileName = `${route.replace(/^\//, "").replaceAll("/", "_")}.png`;
  const filePath = path.join(outDir, fileName);
  try {
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 45000 });
    const status = response?.status() ?? 0;
    if (status < 200 || status >= 400) throw new Error(`HTTP ${status}`);
    await page.screenshot({ path: filePath, fullPage: true });
    const stat = await fs.stat(filePath);
    rows.push({ route, result: "PASS", http: status, png: fileName, bytes: stat.size });
  } catch (error) {
    rows.push({ route, result: `FAIL: ${error instanceof Error ? error.message : String(error)}`, http: 0, png: "NO_PNG", bytes: 0 });
  }
}
await browser.close();
const clean = rows.filter((row) => row.result === "PASS" && row.bytes > 0).length;
const lines = [
  "# V7.5.0 Screenshot Audit Report",
  "",
  `BaseUrl: ${baseUrl}`,
  `Captured clean: ${clean} / ${routes.length}`,
  "",
  "| Route | Result | HTTP | PNG | Bytes |",
  "|---|---:|---:|---|---:|",
  ...rows.map((row) => `| ${row.route} | ${row.result} | ${row.http} | ${row.png} | ${row.bytes} |`)
];
const reportPath = path.join(process.cwd(), "audit-results", "V7_5_0_SCREENSHOT_AUDIT_REPORT.md");
await fs.writeFile(reportPath, lines.join("\n"), "utf8");
console.log(lines.join("\n"));
if (clean !== routes.length) process.exitCode = 1;

