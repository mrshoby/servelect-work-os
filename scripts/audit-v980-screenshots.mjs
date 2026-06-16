import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "https://servelect-work-os-ky01ppafk-mrshoby1.vercel.app";
const routes = [
  "/taskuri",
  "/taskuri/overview",
  "/taskuri/my-work",
  "/taskuri/tickets-notificari",
  "/taskuri/board",
  "/taskuri/tabel",
  "/taskuri/calendar-gantt",
  "/taskuri/workload-aprobari",
  "/api/v1/work-os/v98-goodday-ui-content-function-parity/health"
];
const outDir = path.join(process.cwd(), "audit-results", "v980-screenshots");
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 1100 }, deviceScaleFactor: 1 });
const rows = [];
let passed = 0;
for (const route of routes) {
  const url = `${baseUrl.replace(/\/$/, "")}${route}`;
  const safe = route.replace(/^\//, "").replaceAll("/", "_") || "home";
  const png = `${safe}.png`;
  try {
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(900);
    const status = response?.status() ?? 0;
    const file = path.join(outDir, png);
    await page.screenshot({ path: file, fullPage: true });
    const bytes = fs.statSync(file).size;
    const ok = status >= 200 && status < 300 && bytes > 9000;
    if (ok) passed += 1;
    rows.push({ route, result: ok ? "PASS" : "FAIL", status, png, bytes, note: ok ? "OK" : "Capture too small/status error" });
  } catch (error) {
    rows.push({ route, result: "FAIL", status: "ERR", png, bytes: 0, note: String(error).replace(/\|/g, "/") });
  }
}
await browser.close();
const report = [];
report.push("# V9.8.0 GoodDay UI Content Function Parity Screenshot + Manual Audit Report");
report.push("");
report.push(`BaseUrl: ${baseUrl}`);
report.push("");
report.push("| Route | Result | HTTP | PNG | Bytes | Note |");
report.push("|---|---:|---:|---|---:|---|");
for (const row of rows) report.push(`| ${row.route} | ${row.result} | ${row.status} | ${row.png} | ${row.bytes} | ${row.note} |`);
report.push("");
report.push(`Captured clean: ${passed} / ${routes.length}`);
report.push("");
report.push("## Manual UI acceptance table");
report.push("");
report.push("| Page | Screenshot exists | UI closer to Work OS reference | Density sufficient | Content sufficient | Functionality verified | PASS/FAIL |");
report.push("|---|---:|---:|---:|---:|---:|---:|");
for (const route of routes.filter((route) => route.startsWith("/taskuri"))) {
  report.push(`| ${route} | PASS | CHECK REQUIRED | CHECK REQUIRED | CHECK REQUIRED | source/flow audit required | PENDING MANUAL REVIEW |`);
}
const outPath = path.join(process.cwd(), "audit-results", "V9_8_0_SCREENSHOT_MANUAL_UI_AUDIT_REPORT.md");
fs.writeFileSync(outPath, report.join("\n"));
console.log(`v9.8.0 screenshot audit captured clean: ${passed} / ${routes.length}`);
console.log(`Report: ${outPath}`);
if (passed !== routes.length) process.exit(1);
