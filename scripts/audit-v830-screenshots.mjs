import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const baseUrl = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
const screenshotDir = path.join(process.cwd(), "audit-results", "v830-screenshots");
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
  "/admin/prisma-audit-outbox-transaction-pilot",
  "/work-os/primary-write-pilot",
  "/work-os/production-pilot-readiness",
  "/work-os/primary-write-session-provider",
  "/work-os/auth-session-audit-outbox",
  "/work-os/prisma-audit-outbox-transaction-pilot",
];

await fs.mkdir(screenshotDir, { recursive: true });
await fs.mkdir(path.join(process.cwd(), "audit-results"), { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1200 } });
if (bypassSecret) {
  await context.setExtraHTTPHeaders({ "x-vercel-protection-bypass": bypassSecret });
}
const page = await context.newPage();
const report = [
  "# V8.3.0 Screenshot Audit Report",
  "",
  `BaseUrl: ${baseUrl}`,
  `Bypass secret used: ${Boolean(bypassSecret)}`,
  "Captured clean: PENDING",
  "Protected 401: PENDING",
  "",
  "| Route | Result | HTTP | PNG | Bytes | Note |",
  "|---|---:|---:|---|---:|---|",
];
let captured = 0;
let protected401 = 0;

for (const route of routes) {
  const url = `${baseUrl}${route}`;
  const fileName = route.replace(/^\//, "").replace(/[\/]/g, "_") + ".png";
  const filePath = path.join(screenshotDir, fileName);
  try {
    const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(900);
    const status = response?.status() ?? 0;
    if (status === 401) protected401 += 1;
    if (status >= 200 && status < 300) {
      await page.screenshot({ path: filePath, fullPage: true });
      const stat = await fs.stat(filePath);
      captured += 1;
      report.push(`| ${route} | PASS | ${status} | ${fileName} | ${stat.size} | OK |`);
      console.log(`${route} -> PASS ${status} ${fileName}`);
    } else {
      report.push(`| ${route} | FAIL | ${status} | NO_PNG | 0 | HTTP ${status} |`);
      console.log(`${route} -> FAIL ${status}`);
    }
  } catch (error) {
    const message = String(error?.message || error).replace(/\|/g, "/");
    report.push(`| ${route} | FAIL | ERR | NO_PNG | 0 | ${message} |`);
    console.log(`${route} -> FAIL ${message}`);
  }
}

await browser.close();
report[4] = `Captured clean: ${captured} / ${routes.length}`;
report[5] = `Protected 401: ${protected401}`;
await fs.writeFile(path.join(process.cwd(), "audit-results", "V8_3_0_SCREENSHOT_AUDIT_REPORT.md"), report.join("\n"), "utf8");
if (captured !== routes.length) process.exit(1);

