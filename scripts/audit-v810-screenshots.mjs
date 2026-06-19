import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.BASE_URL || "https://servelect-work-os-web.vercel.app";
const secret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET || "";
const outDir = path.join(process.cwd(), "audit-results", "v810-screenshots");
await fs.mkdir(outDir, { recursive: true });

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
  "/work-os/primary-write-pilot",
  "/work-os/production-pilot-readiness",
  "/work-os/primary-write-session-provider"
];

const headers = secret ? { "x-vercel-protection-bypass": secret } : {};
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, extraHTTPHeaders: headers });
const page = await context.newPage();

const rows = [];
let clean = 0;
for (const route of routes) {
  const url = `${baseUrl.replace(/\/$/, "")}${route}`;
  const safeName = route.replace(/^\//, "").replaceAll("/", "_") || "home";
  const png = `${safeName}.png`;
  try {
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    const status = response?.status() || 0;
    if (status >= 200 && status < 300) {
      const filePath = path.join(outDir, png);
      await page.screenshot({ path: filePath, fullPage: true });
      const stat = await fs.stat(filePath);
      clean += 1;
      rows.push({ route, result: "PASS", http: status, png, bytes: stat.size, note: "OK" });
      console.log(`${route} -> PASS ${status} ${png}`);
    } else {
      rows.push({ route, result: "FAIL", http: status, png: "NO_PNG", bytes: 0, note: `HTTP ${status}` });
      console.log(`${route} -> FAIL HTTP ${status}`);
    }
  } catch (error) {
    rows.push({ route, result: "FAIL", http: "ERR", png: "NO_PNG", bytes: 0, note: error instanceof Error ? error.message : String(error) });
    console.log(`${route} -> FAIL ${error}`);
  }
}
await browser.close();

const report = [];
report.push("# V8.1.0 Screenshot Audit Report");
report.push("");
report.push(`BaseUrl: ${baseUrl}`);
report.push(`Bypass secret used: ${Boolean(secret)}`);
report.push(`Captured clean: ${clean} / ${routes.length}`);
report.push("");
report.push("| Route | Result | HTTP | PNG | Bytes | Note |");
report.push("|---|---:|---:|---|---:|---|");
for (const row of rows) {
  report.push(`| ${row.route} | ${row.result} | ${row.http} | ${row.png} | ${row.bytes} | ${String(row.note).replaceAll("|", "/")} |`);
}

const reportPath = path.join(process.cwd(), "audit-results", "V8_1_0_SCREENSHOT_AUDIT_REPORT.md");
await fs.writeFile(reportPath, report.join("\n"), "utf8");
await fs.writeFile(path.join(process.cwd(), "docs", "V8_1_0_SCREENSHOT_AUDIT_REPORT.md"), report.join("\n"), "utf8");

if (clean !== routes.length) process.exit(1);

