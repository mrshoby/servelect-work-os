import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "https://servelect-work-os-web.vercel.app";
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
  "/taskuri/command-center-v90",
  "/taskuri/pilot-cutover-console",
  "/taskuri/live-provider-dispatch",
  "/taskuri/signed-webhook-hardening",
  "/taskuri/action-required",
  "/taskuri/workload-capacity-map",
  "/taskuri/project-hierarchy",
  "/taskuri/cross-module-activity",
  "/taskuri/field-team-dispatch",
  "/taskuri/rbac-approval-gates",
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
  "/admin/production-pilot-cutover",
  "/admin/live-provider-dispatch",
  "/admin/signed-webhook-hardening",
  "/admin/goodday-parity-command",
  "/admin/rbac-access-gates",
  "/admin/rollback-drill-center",
  "/admin/pixel-diff-release-gates",
  "/work-os/enterprise-department-suite",
  "/work-os/auth-rls-department-pilot",
  "/work-os/live-provider-mutation-replay",
  "/work-os/pilot-mutation-replay",
  "/work-os/pixel-diff-provider-webhook",
  "/work-os/live-webhook-drill",
  "/work-os/dead-letter-recovery",
  "/work-os/provider-delivery-ci-webhook",
  "/work-os/signed-webhook-intake",
  "/work-os/replay-recovery-control",
  "/work-os/production-pilot-cutover",
  "/work-os/live-provider-dispatch",
  "/work-os/signed-webhook-hardening",
  "/work-os/goodday-command-layer",
  "/work-os/portfolio-hierarchy",
  "/work-os/resource-capacity",
  "/work-os/cross-module-control"
];
const outDir = path.join(process.cwd(), "audit-results", "v900-screenshots");
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
const rows = [];
let passed = 0;

for (const route of routes) {
  const url = baseUrl.replace(/\/$/, "") + route;
  const file = route.replace(/^\//, "").replaceAll("/", "_") + ".png";
  try {
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    const status = response?.status() ?? 0;
    if (status >= 200 && status < 300) {
      const fullPath = path.join(outDir, file);
      await page.screenshot({ path: fullPath, fullPage: true });
      const stat = await fs.stat(fullPath);
      rows.push({ route, result: "PASS", http: status, png: file, bytes: stat.size, note: "OK" });
      passed++;
    } else {
      rows.push({ route, result: "FAIL", http: status, png: "NO_PNG", bytes: 0, note: "Non-2xx" });
    }
  } catch (error) {
    rows.push({ route, result: "FAIL", http: 0, png: "NO_PNG", bytes: 0, note: String(error.message || error).replace(/\|/g, "/") });
  }
}

await browser.close();

const report = [];
report.push("# V9.0.0 Production Pilot Cutover Screenshot Audit Report");
report.push("");
report.push(`BaseUrl: ${baseUrl}`);
report.push("");
report.push("| Route | Result | HTTP | PNG | Bytes | Note |");
report.push("|---|---:|---:|---|---:|---|");
for (const row of rows) {
  report.push(`| ${row.route} | ${row.result} | ${row.http} | ${row.png} | ${row.bytes} | ${row.note} |`);
}
report.push("");
report.push(`Captured clean: ${passed} / ${routes.length}`);

await fs.writeFile(path.join(process.cwd(), "audit-results", "V9_0_0_SCREENSHOT_AUDIT_REPORT.md"), report.join("\n"), "utf8");
console.log(`v9.0.0 screenshot audit captured clean: ${passed} / ${routes.length}`);
if (passed !== routes.length) process.exit(1);


