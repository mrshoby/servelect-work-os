import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://localhost:3010";
const routes = [
  "/taskuri",
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
  "/taskuri/automations",
  "/admin/workflows",
  "/admin/custom-fields",
  "/admin/primary-write-pilot",
  "/admin/production-pilot-readiness",
  "/admin/primary-write-session-provider",
  "/admin/auth-session-audit-outbox",
  "/work-os/primary-write-pilot",
  "/work-os/production-pilot-readiness",
  "/work-os/primary-write-session-provider",
  "/work-os/auth-session-audit-outbox"
];
const outDir = path.join(process.cwd(), "audit-results", "v820-screenshots");
await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
const rows = [];
let passed = 0;
for (const route of routes) {
  const url = baseUrl.replace(/\/$/, "") + route;
  const name = route.replace(/^\//, "").replaceAll("/", "_") || "home";
  const png = `${name}.png`;
  try {
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    const status = response?.status() ?? 0;
    await page.screenshot({ path: path.join(outDir, png), fullPage: true });
    const stat = await fs.stat(path.join(outDir, png));
    const ok = status >= 200 && status < 300 && stat.size > 1000;
    if (ok) passed += 1;
    rows.push(`| ${route} | ${ok ? "PASS" : "FAIL"} | ${status} | ${png} | ${stat.size} | ${ok ? "OK" : "HTTP/PNG issue"} |`);
    console.log(`${route} -> ${ok ? "PASS" : "FAIL"} HTTP ${status} | ${stat.size} bytes`);
  } catch (error) {
    rows.push(`| ${route} | FAIL | ERR | NO_PNG | 0 | ${String(error.message).replaceAll("|", "/")} |`);
    console.log(`${route} -> FAIL ${error.message}`);
  }
}
await browser.close();
const report = [
  "# V8.2.0 Screenshot Audit Report",
  "",
  `BaseUrl: ${baseUrl}`,
  `Captured clean: ${passed} / ${routes.length}`,
  "Protected 401: 0",
  "",
  "| Route | Result | HTTP | PNG | Bytes | Note |",
  "|---|---:|---:|---|---:|---|",
  ...rows
];
await fs.writeFile(path.join(process.cwd(), "audit-results", "V8_2_0_SCREENSHOT_AUDIT_REPORT.md"), report.join("\n"), "utf8");
if (passed !== routes.length) process.exit(1);

