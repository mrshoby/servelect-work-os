import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const outDir = path.join(process.cwd(), "audit-results", "v880-screenshots");
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
  "/taskuri/visual-evidence-center",
  "/taskuri/provider-secret-adapter",
  "/taskuri/inbound-webhook-drill",
  "/taskuri/dead-letter-recovery",
  "/admin/workflows",
  "/admin/custom-fields",
  "/admin/enterprise-department-suite",
  "/admin/auth-rls-department-pilot",
  "/admin/live-provider-mutation-replay",
  "/admin/provider-credential-vault",
  "/admin/pixel-diff-ci-gates",
  "/admin/provider-secret-adapter",
  "/admin/inbound-webhook-drill",
  "/admin/dead-letter-recovery",
  "/work-os/enterprise-department-suite",
  "/work-os/auth-rls-department-pilot",
  "/work-os/live-provider-mutation-replay",
  "/work-os/pilot-mutation-replay",
  "/work-os/pixel-diff-provider-webhook",
  "/work-os/live-webhook-drill",
  "/work-os/dead-letter-recovery",
];

await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1200 },
  extraHTTPHeaders: process.env.VERCEL_AUTOMATION_BYPASS_SECRET
    ? { "x-vercel-protection-bypass": process.env.VERCEL_AUTOMATION_BYPASS_SECRET }
    : {},
});

const report = [];
report.push("# V8.8.0 Pixel Diff Provider Webhook Screenshot Audit Report");
report.push("");
report.push(`BaseUrl: ${baseUrl}`);
report.push("");
report.push("| Route | Result | HTTP | PNG | Bytes | Note |");
report.push("|---|---:|---:|---|---:|---|");
let passed = 0;

for (const route of routes) {
  const url = `${baseUrl.replace(/\/$/, "")}${route}`;
  const file = `${route.replace(/^\//, "").replace(/[\/]/g, "_") || "home"}.png`;
  const target = path.join(outDir, file);
  try {
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    const status = response?.status() ?? 0;
    if (status >= 200 && status < 300) {
      await page.screenshot({ path: target, fullPage: true });
      const stat = await fs.stat(target);
      passed += 1;
      console.log(`${route} -> PASS HTTP ${status} | ${file} | ${stat.size} bytes`);
      report.push(`| ${route} | PASS | ${status} | ${file} | ${stat.size} | OK |`);
    } else {
      console.log(`${route} -> FAIL HTTP ${status}`);
      report.push(`| ${route} | FAIL | ${status} | NO_PNG | 0 | Non-2xx |`);
    }
  } catch (error) {
    const msg = String(error?.message || error).replace(/\|/g, "/");
    console.log(`${route} -> FAIL ${msg}`);
    report.push(`| ${route} | FAIL | ERR | NO_PNG | 0 | ${msg} |`);
  }
}

await browser.close();
report.push("");
report.push(`Captured clean: ${passed} / ${routes.length}`);
await fs.writeFile(path.join(process.cwd(), "audit-results", "V8_8_0_SCREENSHOT_AUDIT_REPORT.md"), report.join("\n"), "utf8");
console.log(`v8.8.0 screenshot audit captured clean: ${passed} / ${routes.length}`);
if (passed !== routes.length) process.exit(1);

