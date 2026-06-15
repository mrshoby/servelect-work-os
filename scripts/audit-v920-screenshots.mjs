import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const outDir = path.join("audit-results", "v920-screenshots");
const reportPath = path.join("audit-results", "V9_2_0_SCREENSHOT_AUDIT_REPORT.md");

const routes = [
  "/taskuri/provider-dispatch-ledger-v92",
  "/taskuri/webhook-intake-ledger-v92",
  "/taskuri/task-mutation-pilot-v92",
  "/taskuri/dead-letter-ledger-v92",
  "/taskuri/task-object-model-v92",
  "/taskuri/activity-stream-v92",
  "/admin/provider-ledger-governance-v92",
  "/api/v1/work-os/v92-provider-ledger-task-mutation-pilot/health"
];

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });

const rows = [];
let passed = 0;

for (const route of routes) {
  const url = `${baseUrl.replace(/\/$/, "")}${route}`;
  const fileName = `${route.replace(/^\//, "").replaceAll("/", "_") || "home"}.png`;
  const filePath = path.join(outDir, fileName);
  try {
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: filePath, fullPage: true });
    const http = response?.status() ?? 0;
    const bytes = fs.existsSync(filePath) ? fs.statSync(filePath).size : 0;
    const ok = http >= 200 && http < 300 && bytes > 10000;
    if (ok) passed += 1;
    rows.push(`| ${route} | ${ok ? "PASS" : "FAIL"} | ${http} | ${fileName} | ${bytes} | ${ok ? "OK" : "NO_PNG_OR_HTTP_FAIL"} |`);
  } catch (error) {
    rows.push(`| ${route} | FAIL | 0 | ${fileName} | 0 | ${String(error).replaceAll("|", "/")} |`);
  }
}

await browser.close();

const report = [
  "# V9.2.0 Provider Ledger Task Mutation Screenshot Audit Report",
  "",
  `BaseUrl: ${baseUrl}`,
  "",
  "| Route | Result | HTTP | PNG | Bytes | Note |",
  "|---|---:|---:|---|---:|---|",
  ...rows,
  "",
  `Captured clean: ${passed} / ${routes.length}`
];

fs.mkdirSync("audit-results", { recursive: true });
fs.writeFileSync(reportPath, report.join("\n"), "utf8");

console.log(`v9.2.0 screenshot audit captured clean: ${passed} / ${routes.length}`);
if (passed !== routes.length) {
  process.exitCode = 1;
}
