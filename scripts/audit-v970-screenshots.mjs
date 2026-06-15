import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const routes = [
  "/taskuri/program-board-v97",
  "/taskuri/workgraph-map-v97",
  "/taskuri/reporting-command-v97",
  "/taskuri/sla-evidence-report-v97",
  "/taskuri/resource-portfolio-v97",
  "/taskuri/executive-summary-v97",
  "/taskuri/saved-layouts-v97",
  "/admin/taskuri-reporting-governance-v97",
  "/api/v1/work-os/v97-portfolio-workgraph-reporting-command/health",
];

const outDir = path.join(process.cwd(), "audit-results", "v970-screenshots");
fs.mkdirSync(outDir, { recursive: true });
const rows = [];
let passed = 0;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
for (const route of routes) {
  const url = `${baseUrl.replace(/\/$/, "")}${route}`;
  const safe = route.replace(/^\//, "").replace(/[^a-z0-9]+/gi, "_").replace(/_$/, "").toLowerCase();
  const file = `${safe}.png`;
  try {
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    const status = response?.status() ?? 0;
    await page.screenshot({ path: path.join(outDir, file), fullPage: true });
    const bytes = fs.statSync(path.join(outDir, file)).size;
    if (status === 200 && bytes > 5000) {
      passed += 1;
      rows.push(`| ${route} | PASS | ${status} | ${file} | ${bytes} | OK |`);
    } else {
      rows.push(`| ${route} | FAIL | ${status} | ${file} | ${bytes} | Small/invalid screenshot |`);
    }
  } catch (error) {
    rows.push(`| ${route} | FAIL | ERR | - | 0 | ${String(error).replace(/\|/g, "/")} |`);
  }
}
await browser.close();

const report = [
  "# V9.7.0 Portfolio WorkGraph Reporting Screenshot Audit Report",
  "",
  `BaseUrl: ${baseUrl}`,
  "",
  "| Route | Result | HTTP | PNG | Bytes | Note |",
  "|---|---:|---:|---|---:|---|",
  ...rows,
  "",
  `Captured clean: ${passed} / ${routes.length}`,
];
const reportPath = path.join(process.cwd(), "audit-results", "V9_7_0_SCREENSHOT_AUDIT_REPORT.md");
fs.writeFileSync(reportPath, report.join("\n"), "utf8");
if (passed !== routes.length) {
  throw new Error(`v9.7.0 screenshot audit failed: ${passed} / ${routes.length}. Report: ${reportPath}`);
}
console.log(`v9.7.0 screenshot audit captured clean: ${passed} / ${routes.length}`);
console.log(`Report: ${reportPath}`);
