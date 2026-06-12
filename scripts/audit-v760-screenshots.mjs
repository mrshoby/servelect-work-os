import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3100";
const routes = [
  "/work-os/signed-attachments",
  "/work-os/provider-delivery",
  "/work-os/attachments",
  "/admin/access-enforced-mutations",
  "/admin/access-inheritance",
  "/taskuri/overview",
  "/taskuri/tickets-notificari",
  "/taskuri/forms",
  "/taskuri/timesheets",
  "/taskuri/workload-aprobari",
  "/taskuri/automations",
  "/taskuri/reports"
];

const outDir = path.join(process.cwd(), "audit-results", "v76-screenshots");
fs.mkdirSync(outDir, { recursive: true });
const results = [];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
for (const route of routes) {
  const name = route.replace(/^\//, "").replaceAll("/", "_") || "home";
  const fileName = `${name}.png`;
  const output = path.join(outDir, fileName);
  try {
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 35000 });
    await page.screenshot({ path: output, fullPage: true });
    const size = fs.existsSync(output) ? fs.statSync(output).size : 0;
    const ok = Boolean(response && response.ok() && size > 0);
    results.push({ route, result: ok ? "PASS" : "FAIL", http: response?.status() ?? 0, png: size > 0 ? fileName : "NO_PNG", bytes: size });
  } catch (error) {
    results.push({ route, result: `FAIL: ${String(error).replaceAll("|", "/")}`, http: 0, png: "NO_PNG", bytes: 0 });
  }
}
await browser.close();

const clean = results.filter((item) => item.result === "PASS" && item.png !== "NO_PNG" && item.bytes > 0).length;
const lines = [
  "# V7.6.0 Screenshot Audit Report",
  "",
  `BaseUrl: ${baseUrl}`,
  `Captured clean: ${clean} / ${routes.length}`,
  "",
  "| Route | Result | HTTP | PNG | Bytes |",
  "|---|---:|---:|---|---:|",
  ...results.map((item) => `| ${item.route} | ${item.result} | ${item.http} | ${item.png} | ${item.bytes} |`)
];
const report = path.join(process.cwd(), "audit-results", "V7_6_0_SCREENSHOT_AUDIT_REPORT.md");
fs.writeFileSync(report, lines.join("\n"), "utf8");
console.log(lines.join("\n"));
if (clean !== routes.length) process.exitCode = 1;
