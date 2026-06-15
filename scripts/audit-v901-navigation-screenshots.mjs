import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "https://servelect-work-os-web.vercel.app";
const routes = [
  "/taskuri",
  "/taskuri/command-center-v90",
  "/taskuri/pilot-cutover-console",
  "/taskuri/action-required",
  "/taskuri/workload-capacity-map",
  "/taskuri/project-hierarchy",
  "/admin/release",
  "/admin/production-pilot-cutover",
  "/work-os/production-pilot-cutover",
  "/work-os/goodday-command-layer"
];

const outDir = path.join(process.cwd(), "audit-results", "v901-navigation-screenshots");
await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
const report = [
  "# V9.0.1 Navigation + Version Truth Screenshot Audit Report",
  "",
  `BaseUrl: ${baseUrl}`,
  "",
  "| Route | Result | HTTP | PNG | Bytes | Note |",
  "|---|---:|---:|---|---:|---|"
];
let pass = 0;
for (const route of routes) {
  const url = `${baseUrl.replace(/\/$/, "")}${route}`;
  const name = route.replace(/^\//, "").replaceAll("/", "_") || "home";
  const png = `${name}.png`;
  try {
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    const status = response?.status() ?? 0;
    const html = await page.content();
    const hasStale = /v7\.9\.0|Provider Canary\s*\/\s*ACL\s*\/\s*Primary Pilot/.test(html);
    if (status >= 200 && status < 300 && !hasStale) {
      const target = path.join(outDir, png);
      await page.screenshot({ path: target, fullPage: true });
      const stat = await fs.stat(target);
      pass += 1;
      report.push(`| ${route} | PASS | ${status} | ${png} | ${stat.size} | OK |`);
    } else if (hasStale) {
      report.push(`| ${route} | FAIL | ${status} | NO_PNG | 0 | Stale v9.0.1 label found |`);
    } else {
      report.push(`| ${route} | FAIL | ${status} | NO_PNG | 0 | Non-2xx |`);
    }
  } catch (error) {
    report.push(`| ${route} | FAIL | 0 | NO_PNG | 0 | ${String(error).replaceAll("|", "/")} |`);
  }
}
await browser.close();
report.push("");
report.push(`Captured clean: ${pass} / ${routes.length}`);
await fs.writeFile(path.join(process.cwd(), "audit-results", "V9_0_1_NAVIGATION_SCREENSHOT_AUDIT_REPORT.md"), report.join("\n"), "utf8");
console.log(report.join("\n"));
if (pass !== routes.length) process.exit(1);

