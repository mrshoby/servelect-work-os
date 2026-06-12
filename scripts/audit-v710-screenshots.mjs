import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3100";
const routes = [
  "/work-os/backend-mutations",
  "/admin/backend-mutations",
  "/taskuri/overview",
  "/taskuri/tickets-notificari",
  "/taskuri/forms",
  "/taskuri/timesheets",
  "/taskuri/workload-aprobari"
];
const outDir = path.join(process.cwd(), "audit-results", "v71-screenshots");
fs.mkdirSync(outDir, { recursive: true });
const lines = ["# V7.1.0 Screenshot Audit Report", "", `BaseUrl: ${baseUrl}`, "", "| Route | Result | HTTP | PNG | Bytes |", "|---|---:|---:|---|---:|"];
let clean = 0;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
for (const route of routes) {
  const name = route.replace(/^\//, "").replaceAll("/", "_") + ".png";
  const filePath = path.join(outDir, name);
  try {
    const response = await page.goto(baseUrl + route, { waitUntil: "networkidle", timeout: 30000 });
    const status = response?.status() ?? 0;
    if (status < 200 || status >= 400) throw new Error(`HTTP ${status}`);
    await page.screenshot({ path: filePath, fullPage: true });
    const bytes = fs.statSync(filePath).size;
    if (bytes <= 0) throw new Error("NO_PNG");
    clean++;
    lines.push(`| ${route} | PASS | ${status} | ${name} | ${bytes} |`);
  } catch (error) {
    const message = error instanceof Error ? error.message.replaceAll("|", "/") : "Unknown error";
    lines.push(`| ${route} | FAIL: ${message} | 0 | NO_PNG | 0 |`);
  }
}
await browser.close();
lines.splice(3, 0, `Captured clean: ${clean} / ${routes.length}`);
const report = path.join(process.cwd(), "audit-results", "V7_1_0_SCREENSHOT_AUDIT_REPORT.md");
fs.writeFileSync(report, lines.join("\n"));
console.log(lines.join("\n"));
if (clean !== routes.length) process.exitCode = 1;
