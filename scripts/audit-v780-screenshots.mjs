import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3100";
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET || "";
const allowProtected401 = process.env.ALLOW_VERCEL_PROTECTION_401 === "1";

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
  "/admin/goodday-observability",
  "/admin/server-saved-views",
  "/admin/provider-telemetry",
  "/work-os/goodday-ui-parity",
  "/work-os/provider-rehearsal",
  "/work-os/primary-write-dry-run",
  "/work-os/provider-telemetry",
  "/work-os/mutation-canary"
];

const outDir = path.join(process.cwd(), "audit-results", "v780-screenshots");
await fs.mkdir(outDir, { recursive: true });

const extraHTTPHeaders = bypassSecret ? { "x-vercel-protection-bypass": bypassSecret } : undefined;
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1120 }, deviceScaleFactor: 1, ...(extraHTTPHeaders ? { extraHTTPHeaders } : {}) });
const page = await context.newPage();
const rows = [];

for (const route of routes) {
  const file = route.replace(/^\//, "").replaceAll("/", "_") + ".png";
  const target = path.join(outDir, file);
  try {
    const response = await page.goto(baseUrl + route, { waitUntil: "networkidle", timeout: 35000 });
    const status = response?.status() ?? 0;
    if (status === 401 && baseUrl.includes("vercel.app") && !bypassSecret) {
      rows.push({ route, result: allowProtected401 ? "PROTECTED_401" : "FAIL_PROTECTED_401", http: 401, png: "NO_PNG", bytes: 0, note: "Vercel Deployment Protection returned 401 before app render." });
      continue;
    }
    if (!response || status >= 400) {
      rows.push({ route, result: `FAIL_HTTP_${status}`, http: status, png: "NO_PNG", bytes: 0, note: "HTTP failure" });
      continue;
    }
    await page.screenshot({ path: target, fullPage: true });
    const stat = await fs.stat(target);
    rows.push({ route, result: "PASS", http: status, png: file, bytes: stat.size, note: "OK" });
  } catch (error) {
    rows.push({ route, result: `FAIL: ${error instanceof Error ? error.message : String(error)}`, http: 0, png: "NO_PNG", bytes: 0, note: "Capture failed" });
  }
}

await browser.close();

const clean = rows.filter((row) => row.result === "PASS" && row.bytes > 0).length;
const protectedCount = rows.filter((row) => row.result === "PROTECTED_401" || row.result === "FAIL_PROTECTED_401").length;
const report = [
  "# V7.8.0 Screenshot Audit Report",
  "",
  `BaseUrl: ${baseUrl}`,
  `Bypass secret used: ${Boolean(bypassSecret)}`,
  `Captured clean: ${clean} / ${rows.length}`,
  `Protected 401: ${protectedCount}`,
  "",
  "| Route | Result | HTTP | PNG | Bytes | Note |",
  "|---|---:|---:|---|---:|---|",
  ...rows.map((row) => `| ${row.route} | ${row.result} | ${row.http} | ${row.png} | ${row.bytes} | ${row.note} |`)
];

await fs.writeFile(path.join(process.cwd(), "audit-results", "V7_8_0_SCREENSHOT_AUDIT_REPORT.md"), report.join("\n"));
console.log(report.join("\n"));

if (clean !== rows.length && !(allowProtected401 && protectedCount === rows.length)) process.exitCode = 1;
