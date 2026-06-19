import fs from "fs/promises";
import path from "path";
import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL || "https://servelect-work-os-web.vercel.app";
const OUT_DIR = path.join(process.cwd(), "audit-results", "v870-screenshots");
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
  "/taskuri/provider-mutation-replay",
  "/taskuri/live-provider-command-center",
  "/taskuri/pilot-mutation-replay",
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
  "/admin/live-provider-mutation-replay",
  "/admin/provider-credential-vault",
  "/work-os/primary-write-pilot",
  "/work-os/production-pilot-readiness",
  "/work-os/primary-write-session-provider",
  "/work-os/auth-session-audit-outbox",
  "/work-os/prisma-audit-outbox-transaction-pilot",
  "/work-os/database-adapter-dispatch-worker",
  "/work-os/enterprise-department-suite",
  "/work-os/auth-rls-department-pilot",
  "/work-os/live-provider-mutation-replay",
  "/work-os/pilot-mutation-replay"
];

function safeName(route) {
  return route.replace(/^\//, "").replaceAll("/", "_") || "home";
}

await fs.mkdir(OUT_DIR, { recursive: true });
await fs.mkdir(path.join(process.cwd(), "audit-results"), { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
  await context.setExtraHTTPHeaders({ "x-vercel-protection-bypass": process.env.VERCEL_AUTOMATION_BYPASS_SECRET });
}
const page = await context.newPage();
const report = [];
report.push("# V8.7.0 Screenshot Audit Report");
report.push("");
report.push(`BaseUrl: ${BASE_URL}`);
report.push("");
report.push("| Route | Result | HTTP | PNG | Bytes | Note |");
report.push("|---|---:|---:|---|---:|---|");
let passed = 0;

for (const route of routes) {
  const url = `${BASE_URL.replace(/\/$/, "")}${route}`;
  const png = `${safeName(route)}.png`;
  const target = path.join(OUT_DIR, png);
  try {
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    const status = response?.status() ?? 0;
    if (status >= 200 && status < 300) {
      await page.screenshot({ path: target, fullPage: true });
      const stat = await fs.stat(target);
      console.log(`${route} -> PASS HTTP ${status} | ${png} | ${stat.size} bytes`);
      report.push(`| ${route} | PASS | ${status} | ${png} | ${stat.size} | OK |`);
      passed++;
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
report.push("");
report.push(`Captured clean: ${passed} / ${routes.length}`);
await fs.writeFile(path.join(process.cwd(), "audit-results", "V8_7_0_SCREENSHOT_AUDIT_REPORT.md"), report.join("\n"), "utf8");
console.log(`v8.7.0 screenshot audit captured clean: ${passed} / ${routes.length}`);
if (passed !== routes.length) process.exit(1);


