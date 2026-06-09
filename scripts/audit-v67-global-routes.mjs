import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.SERVELECT_BASE_URL || "http://127.0.0.1:3100";
const outputDir = process.env.SERVELECT_SCREENSHOT_DIR || path.resolve(process.cwd(), "audit-results", "v670-global-command-screenshots");
const routes = [
  ["01_dashboard", "/work-os/dashboard"],
  ["02_notifications", "/notifications"],
  ["03_notification_center", "/work-os/notification-center"],
  ["04_approvals", "/work-os/approvals"],
  ["05_search", "/search"],
  ["06_action_center", "/action-center"],
  ["07_taskuri_overview", "/taskuri/overview"]
];

fs.mkdirSync(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const rows = [];
let failed = 0;

for (const [name, route] of routes) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
  const consoleMessages = [];
  const pageErrors = [];
  const requestFailures = [];
  page.on("console", (message) => consoleMessages.push(`${message.type()}: ${message.text()}`));
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("requestfailed", (request) => requestFailures.push(`${request.url()} :: ${request.failure()?.errorText ?? "unknown"}`));
  const url = `${baseUrl}${route}`;
  const pngPath = path.join(outputDir, `${name}.png`);
  const htmlPath = path.join(outputDir, `${name}.html`);
  const metaPath = path.join(outputDir, `${name}.json`);
  let state = "CAPTURED";
  let httpStatus = 0;
  let pngBytes = 0;
  let htmlBytes = 0;
  try {
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    httpStatus = response?.status() ?? 0;
    await page.evaluate(() => document.fonts?.ready ?? Promise.resolve());
    await page.addStyleTag({ content: "*,*::before,*::after{animation:none!important;transition:none!important} body{background:#ffffff!important;-webkit-font-smoothing:antialiased!important}" });
    await page.waitForTimeout(1200);
    const html = await page.content();
    fs.writeFileSync(htmlPath, html, "utf8");
    htmlBytes = Buffer.byteLength(html);
    await page.screenshot({ path: pngPath, fullPage: true });
    pngBytes = fs.existsSync(pngPath) ? fs.statSync(pngPath).size : 0;
    if (httpStatus < 200 || httpStatus >= 400) state = "HTTP_FAIL";
    if (pngBytes <= 0) state = "NO_PNG";
    if (pageErrors.length > 0 && state === "CAPTURED") state = "CAPTURED_WITH_PAGE_ERRORS";
  } catch (error) {
    failed += 1;
    state = "SCREENSHOT_EXCEPTION";
    fs.writeFileSync(path.join(outputDir, `${name}_error.log`), error instanceof Error ? error.stack ?? error.message : String(error), "utf8");
  }
  if (state !== "CAPTURED" && state !== "CAPTURED_WITH_PAGE_ERRORS") failed += 1;
  fs.writeFileSync(metaPath, JSON.stringify({ name, route, url, state, httpStatus, pngBytes, htmlBytes, consoleMessages, pageErrors, requestFailures }, null, 2), "utf8");
  rows.push({ name, route, url, state, httpStatus, pngBytes, htmlBytes, consoleErrors: consoleMessages.filter((item) => item.startsWith("error")).length, pageErrors: pageErrors.length, networkFailed: requestFailures.length });
  await page.close();
}

await browser.close();

const csv = ["Name,Route,HTTP,State,PNG bytes,HTML bytes,Console errors,Page errors,Network failed,URL"].concat(rows.map((row) => [row.name, row.route, row.httpStatus, row.state, row.pngBytes, row.htmlBytes, row.consoleErrors, row.pageErrors, row.networkFailed, row.url].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))).join("\n");
fs.writeFileSync(path.join(outputDir, "SCREENSHOT_AUDIT_RESULTS_v6.7.0.csv"), csv, "utf8");
const md = [
  "# SERVELECT WORK OS v6.7.0 Global Command Screenshot Audit",
  "",
  `Generated: ${new Date().toISOString()}`,
  `BaseUrl: ${baseUrl}`,
  `Captured clean: ${rows.filter((row) => row.state === "CAPTURED").length} / ${rows.length}`,
  "",
  "| Name | Route | HTTP | State | PNG bytes | HTML bytes | Console errors | Page errors | Network failed |",
  "|---|---|---:|---|---:|---:|---:|---:|---:|",
  ...rows.map((row) => `| ${row.name} | ${row.route} | ${row.httpStatus} | ${row.state} | ${row.pngBytes} | ${row.htmlBytes} | ${row.consoleErrors} | ${row.pageErrors} | ${row.networkFailed} |`)
].join("\n");
fs.writeFileSync(path.join(outputDir, "SCREENSHOT_AUDIT_REPORT_v6.7.0.md"), md, "utf8");
if (failed > 0) process.exitCode = 1;
