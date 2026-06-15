import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require("fs");
const path = require("path");

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const outDir = path.join(process.cwd(), "audit-results", "v950-screenshots");
fs.mkdirSync(outDir, { recursive: true });

const routes = [
  "/taskuri/collaboration-hub-v95",
  "/taskuri/checklists-quality-v95",
  "/taskuri/files-evidence-v95",
  "/taskuri/sla-escalation-v95",
  "/taskuri/workload-forecast-v95",
  "/taskuri/decision-register-v95",
  "/taskuri/request-portal-bridge-v95",
  "/admin/taskuri-collaboration-governance-v95",
  "/api/v1/work-os/v95-goodday-collaboration-sla/health",
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
  const report = ["# V9.5.0 GoodDay Collaboration Files SLA Screenshot Audit Report", "", `BaseUrl: ${baseUrl}`, "", "| Route | Result | HTTP | PNG | Bytes | Note |", "|---|---:|---:|---|---:|---|"];
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
  const reportPath = path.join(process.cwd(), "audit-results", "V9_5_0_SCREENSHOT_AUDIT_REPORT.md");
  fs.writeFileSync(reportPath, report.join("\n"), "utf8");
  console.log(`v9.5.0 screenshot audit captured clean: ${passed} / ${routes.length}`);
  if (passed !== routes.length) process.exit(1);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

