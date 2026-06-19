import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3100";
const routes = [
  "/work-os/prisma-migration",
  "/admin/prisma-migration",
  "/work-os/prisma-shadow-records",
  "/taskuri/overview",
  "/taskuri/tickets-notificari",
  "/taskuri/forms",
  "/taskuri/timesheets",
  "/taskuri/workload-aprobari",
  "/taskuri/automations",
  "/taskuri/reports"
];

const outDir = path.join(process.cwd(), "audit-results", "v7-3-screenshots");
fs.mkdirSync(outDir, { recursive: true });
const report = ["# V7.3.0 Screenshot Audit Report", "", `BaseUrl: ${baseUrl}`, "", "| Route | Result | HTTP | PNG | Bytes |", "|---|---:|---:|---|---:|"];
let clean = 0;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
for (const route of routes) {
  const file = route.replace(/^\//, "").replaceAll("/", "_") + ".png";
  const target = path.join(outDir, file);
  try {
    const response = await page.goto(baseUrl + route, { waitUntil: "networkidle", timeout: 30000 });
    const status = response?.status() ?? 0;
    if (status >= 200 && status < 400) {
      await page.screenshot({ path: target, fullPage: true });
      const bytes = fs.statSync(target).size;
      clean += bytes > 0 ? 1 : 0;
      report.push(`| ${route} | PASS | ${status} | ${file} | ${bytes} |`);
    } else {
      report.push(`| ${route} | FAIL | ${status} | NO_PNG | 0 |`);
    }
  } catch (error) {
    report.push(`| ${route} | FAIL: ${String(error).replaceAll("|", "/")} | 0 | NO_PNG | 0 |`);
  }
}
await browser.close();
report.splice(3, 0, `Captured clean: ${clean} / ${routes.length}`);
const reportPath = path.join(process.cwd(), "audit-results", "V7_3_0_SCREENSHOT_AUDIT_REPORT.md");
fs.writeFileSync(reportPath, report.join("\n"), "utf8");
console.log(report.join("\n"));
if (clean !== routes.length) process.exitCode = 1;

