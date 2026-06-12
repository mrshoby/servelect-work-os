import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3100";
const routes = ["/taskuri", "/taskuri/overview", "/taskuri/my-work", "/taskuri/tickets-notificari", "/taskuri/board", "/taskuri/tabel", "/taskuri/calendar-gantt", "/taskuri/workload-aprobari", "/taskuri/forms", "/taskuri/timesheets", "/taskuri/reports", "/taskuri/automations", "/admin/workflows", "/admin/custom-fields", "/admin/goodday-observability", "/work-os/goodday-ui-parity", "/work-os/provider-rehearsal", "/work-os/primary-write-dry-run"];
const outDir = path.join(process.cwd(), "audit-results", "v770-screenshots");
await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
const rows = [];
for (const route of routes) {
  const file = route.replace(/^\//, "").replaceAll("/", "_") + ".png";
  const target = path.join(outDir, file);
  try {
    const response = await page.goto(baseUrl + route, { waitUntil: "networkidle", timeout: 35000 });
    await page.screenshot({ path: target, fullPage: true });
    const stat = await fs.stat(target);
    rows.push({ route, result: "PASS", http: response?.status() ?? 0, png: file, bytes: stat.size });
  } catch (error) {
    rows.push({ route, result: `FAIL: ${error instanceof Error ? error.message : String(error)}`, http: 0, png: "NO_PNG", bytes: 0 });
  }
}
await browser.close();
const clean = rows.filter((row) => row.result === "PASS" && row.bytes > 0).length;
const report = ["# V7.7.0 Screenshot Audit Report", "", `BaseUrl: ${baseUrl}`, `Captured clean: ${clean} / ${rows.length}`, "", "| Route | Result | HTTP | PNG | Bytes |", "|---|---:|---:|---|---:|", ...rows.map((row) => `| ${row.route} | ${row.result} | ${row.http} | ${row.png} | ${row.bytes} |`)];
await fs.writeFile(path.join(process.cwd(), "audit-results", "V7_7_0_SCREENSHOT_AUDIT_REPORT.md"), report.join("\n"));
console.log(report.join("\n"));
if (clean !== rows.length) process.exitCode = 1;
