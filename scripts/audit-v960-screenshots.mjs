import fs from "fs";
import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const outDir = path.join(process.cwd(), "audit-results", "v960-screenshots");
fs.mkdirSync(outDir, { recursive: true });

const routes = [
  "/taskuri/inline-persistence-v96",
  "/taskuri/command-palette-actions-v96",
  "/taskuri/gantt-conflict-review-v96",
  "/taskuri/notification-routing-v96",
  "/taskuri/saved-view-persistence-v96",
  "/taskuri/task-change-audit-v96",
  "/taskuri/manager-gate-inbox-v96",
  "/admin/taskuri-persistence-governance-v96",
  "/api/v1/work-os/v96-live-inline-persistence-command-gantt/health"
];

function safeName(route) {
  return route.replace(/^\//, "").replace(/[^a-z0-9]+/gi, "_").replace(/_$/g, "") + ".png";
}

async function run() {
  let chromium;
  try {
    ({ chromium } = require("playwright"));
  } catch (error) {
    console.error("Playwright is required for screenshot audit.");
    throw error;
  }
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 }, deviceScaleFactor: 1 });
  const report = ["# V9.6.0 Live Inline Persistence Command Gantt Screenshot Audit Report", "", `BaseUrl: ${baseUrl}`, "", "| Route | Result | HTTP | PNG | Bytes | Note |", "|---|---:|---:|---|---:|---|"];
  let passed = 0;
  for (const route of routes) {
    const url = baseUrl.replace(/\/$/, "") + route;
    const file = safeName(route);
    const target = path.join(outDir, file);
    try {
      const response = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
      const status = response ? response.status() : 0;
      await page.screenshot({ path: target, fullPage: true });
      const bytes = fs.statSync(target).size;
      const ok = status === 200 && bytes > 5000;
      if (ok) passed++;
      report.push(`| ${route} | ${ok ? "PASS" : "FAIL"} | ${status} | ${file} | ${bytes} | ${ok ? "OK" : "Check output"} |`);
    } catch (error) {
      report.push(`| ${route} | FAIL | 0 | ${file} | 0 | ${String(error.message).replace(/\|/g, "/")} |`);
    }
  }
  await browser.close();
  report.push("");
  report.push(`Captured clean: ${passed} / ${routes.length}`);
  const reportPath = path.join(process.cwd(), "audit-results", "V9_6_0_SCREENSHOT_AUDIT_REPORT.md");
  fs.writeFileSync(reportPath, report.join("\n"), "utf8");
  console.log(`v9.6.0 screenshot audit captured clean: ${passed} / ${routes.length}`);
  if (passed !== routes.length) process.exit(1);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
