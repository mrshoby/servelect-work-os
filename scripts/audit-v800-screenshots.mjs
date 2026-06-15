import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
const outDir = path.join(process.cwd(), "audit-results", "v800-screenshots");
const reportPath = path.join(process.cwd(), "audit-results", "V8_0_0_SCREENSHOT_AUDIT_REPORT.md");

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
  "/work-os/primary-write-pilot",
  "/work-os/production-pilot-readiness"
];

function fileNameForRoute(route) {
  return route.replace(/^\//, "").replaceAll("/", "_").replaceAll("-", "-") || "home";
}

await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1100 },
  extraHTTPHeaders: bypassSecret ? {
    "x-vercel-protection-bypass": bypassSecret,
    "x-vercel-set-bypass-cookie": "true"
  } : undefined
});

const results = [];
for (const route of routes) {
  const page = await context.newPage();
  const url = `${baseUrl}${route}`;
  const png = `${fileNameForRoute(route)}.png`;
  const output = path.join(outDir, png);
  try {
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    const http = response?.status() ?? 0;
    await page.screenshot({ path: output, fullPage: true });
    const stat = await fs.stat(output);
    const pass = http >= 200 && http < 400 && stat.size > 2000;
    results.push({ route, result: pass ? "PASS" : "FAIL", http, png, bytes: stat.size, note: pass ? "OK" : "HTTP/PNG check failed" });
    console.log(`${route} -> ${pass ? "PASS" : "FAIL"} HTTP ${http} | ${stat.size} bytes`);
  } catch (error) {
    results.push({ route, result: "FAIL", http: "ERR", png: "NO_PNG", bytes: 0, note: error instanceof Error ? error.message : String(error) });
    console.error(`${route} -> FAIL ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    await page.close();
  }
}
await browser.close();

const passed = results.filter((row) => row.result === "PASS").length;
const report = [
  "# V8.0.0 Screenshot Audit Report",
  "",
  `BaseUrl: ${baseUrl}`,
  `Bypass secret used: ${Boolean(bypassSecret)}`,
  `Captured clean: ${passed} / ${results.length}`,
  "",
  "| Route | Result | HTTP | PNG | Bytes | Note |",
  "|---|---:|---:|---|---:|---|",
  ...results.map((row) => `| ${row.route} | ${row.result} | ${row.http} | ${row.png} | ${row.bytes} | ${String(row.note).replaceAll("|", "/")} |`)
];

await fs.writeFile(reportPath, report.join("\n"), "utf8");
console.log(`Screenshot audit report: ${reportPath}`);
if (passed !== results.length) process.exit(1);
