import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = (process.env.BASE_URL || "https://servelect-work-os-web.vercel.app").replace(/\/$/, "");
const outDir = path.join(process.cwd(), "audit-results", "v871-route-hotfix-screenshots");
const routes = [
  "/taskuri/provider-mutation-replay",
  "/taskuri/live-provider-command-center",
  "/taskuri/pilot-mutation-replay",
  "/admin/live-provider-mutation-replay",
  "/admin/provider-credential-vault",
  "/work-os/live-provider-mutation-replay",
  "/work-os/pilot-mutation-replay"
];

await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
const report = [
  "# V8.7.1 Route Completion Hotfix Screenshot Audit Report",
  "",
  `BaseUrl: ${baseUrl}`,
  "",
  "| Route | Result | HTTP | PNG | Bytes | Note |",
  "|---|---:|---:|---|---:|---|"
];
let clean = 0;
for (const route of routes) {
  const url = `${baseUrl}${route}`;
  const file = `${route.replace(/^\//, "").replace(/\//g, "_")}.png`;
  const outputPath = path.join(outDir, file);
  try {
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    const status = response?.status() ?? 0;
    if (status >= 200 && status < 300) {
      await page.screenshot({ path: outputPath, fullPage: true });
      const stat = await fs.stat(outputPath);
      report.push(`| ${route} | PASS | ${status} | ${file} | ${stat.size} | OK |`);
      console.log(`${route} -> PASS HTTP ${status} | ${file} | ${stat.size} bytes`);
      clean++;
    } else {
      report.push(`| ${route} | FAIL | ${status} | NO_PNG | 0 | Non-2xx |`);
      console.log(`${route} -> FAIL HTTP ${status}`);
    }
  } catch (error) {
    const message = String(error?.message || error).replace(/\|/g, "/");
    report.push(`| ${route} | FAIL | ERR | NO_PNG | 0 | ${message} |`);
    console.log(`${route} -> FAIL ${message}`);
  }
}
await browser.close();
report.push("");
report.push(`Captured clean: ${clean} / ${routes.length}`);
await fs.writeFile(path.join(process.cwd(), "audit-results", "V8_7_1_ROUTE_HOTFIX_SCREENSHOT_AUDIT_REPORT.md"), report.join("\n"), "utf8");
console.log(`v8.7.1 route hotfix screenshot audit captured clean: ${clean} / ${routes.length}`);
if (clean !== routes.length) process.exit(1);
