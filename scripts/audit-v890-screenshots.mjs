import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "https://servelect-work-os-web.vercel.app";
const outDir = path.join(process.cwd(), "audit-results", "v890-screenshots");
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
  "/taskuri/provider-delivery-worker",
  "/taskuri/github-pixel-diff-ci",
  "/taskuri/signed-webhook-intake",
  "/taskuri/manager-approval-evidence",
  "/taskuri/replay-recovery-control",
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
  "/admin/provider-delivery-worker",
  "/admin/github-pixel-diff-ci",
  "/admin/signed-webhook-intake",
  "/admin/manager-approval-evidence",
  "/admin/replay-recovery-control",
  "/work-os/enterprise-department-suite",
  "/work-os/auth-rls-department-pilot",
  "/work-os/live-provider-mutation-replay",
  "/work-os/pilot-mutation-replay",
  "/work-os/pixel-diff-provider-webhook",
  "/work-os/live-webhook-drill",
  "/work-os/dead-letter-recovery",
  "/work-os/provider-delivery-ci-webhook",
  "/work-os/signed-webhook-intake",
  "/work-os/replay-recovery-control"
];

await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1050 }, deviceScaleFactor: 1 });
const report = [
  "# V8.9.0 Provider Delivery CI Webhook Screenshot Audit Report",
  "",
  `BaseUrl: ${baseUrl}`,
  "",
  "| Route | Result | HTTP | PNG | Bytes | Note |",
  "|---|---:|---:|---|---:|---|",
];

let passed = 0;
for (const route of routes) {
  const url = `${baseUrl}${route}`;
  const png = route.replace(/^\//, "").replaceAll("/", "_") + ".png";
  const target = path.join(outDir, png);
  try {
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    const status = response?.status() ?? 0;
    if (status >= 200 && status < 300) {
      await page.screenshot({ path: target, fullPage: true });
      const stat = await fs.stat(target);
      passed++;
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
report.push("");
report.push(`Captured clean: ${passed} / ${routes.length}`);
await fs.writeFile(path.join(process.cwd(), "audit-results", "V8_9_0_SCREENSHOT_AUDIT_REPORT.md"), report.join("
"), "utf8");
console.log(`v8.9.0 screenshot audit captured clean: ${passed} / ${routes.length}`);
if (passed !== routes.length) process.exit(1);
