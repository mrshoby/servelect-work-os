import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "https://servelect-work-os-web.vercel.app";
const outputDir = path.join(process.cwd(), "audit-results", "v860-screenshots");

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
  "/taskuri/enterprise-control-room",
  "/admin/workflows",
  "/admin/custom-fields",
  "/admin/primary-write-pilot",
  "/admin/production-pilot-readiness",
  "/admin/primary-write-session-provider",
  "/admin/auth-session-audit-outbox",
  "/admin/prisma-audit-outbox-transaction-pilot",
  "/admin/database-adapter-dispatch-worker",
  "/admin/enterprise-department-suite",
  "/admin/auth-rls-department-pilot",
  "/work-os/primary-write-pilot",
  "/work-os/production-pilot-readiness",
  "/work-os/primary-write-session-provider",
  "/work-os/auth-session-audit-outbox",
  "/work-os/prisma-audit-outbox-transaction-pilot",
  "/work-os/database-adapter-dispatch-worker",
  "/work-os/enterprise-department-suite",
  "/work-os/auth-rls-department-pilot"
];

function safeName(route) {
  return route.replace(/^\//, "").replaceAll("/", "_") || "home";
}

await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 });

const report = [
  "# V8.6.0 Screenshot Audit Report",
  "",
  `BaseUrl: ${baseUrl}`,
  `Bypass secret used: ${Boolean(process.env.VERCEL_AUTOMATION_BYPASS_SECRET)}`,
  "",
  "| Route | Result | HTTP | PNG | Bytes | Note |",
  "|---|---:|---:|---|---:|---|"
];

let passed = 0;

for (const route of routes) {
  const url = `${baseUrl}${route}`;
  const png = `${safeName(route)}.png`;
  const filePath = path.join(outputDir, png);

  try {
    const headers = {};
    if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
      headers["x-vercel-protection-bypass"] = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
    }

    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 45000, headers });
    const status = response?.status() ?? 0;

    if (status >= 200 && status < 300) {
      await page.screenshot({ path: filePath, fullPage: true });
      const stat = await fs.stat(filePath);
      passed += 1;
      console.log(`${route} -> PASS HTTP ${status} | ${png} | ${stat.size} bytes`);
      report.push(`| ${route} | PASS | ${status} | ${png} | ${stat.size} | OK |`);
    } else {
      console.log(`${route} -> FAIL HTTP ${status}`);
      report.push(`| ${route} | FAIL | ${status} | NO_PNG | 0 | Non-2xx |`);
    }
  } catch (error) {
    console.log(`${route} -> FAIL ${error.message}`);
    report.push(`| ${route} | FAIL | ERR | NO_PNG | 0 | ${String(error.message).replaceAll("|", "/")} |`);
  }
}

await browser.close();

report.splice(4, 0, `Captured clean: ${passed} / ${routes.length}`);
report.splice(5, 0, "");

await fs.writeFile(path.join(process.cwd(), "audit-results", "V8_6_0_SCREENSHOT_AUDIT_REPORT.md"), report.join("\n"), "utf8");

console.log(`v8.6.0 screenshot audit captured clean: ${passed} / ${routes.length}`);

if (passed !== routes.length) {
  process.exit(1);
}

