import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { spawn } from "node:child_process";

const routes = [
  ["01_taskuri_overview", "/taskuri/overview"],
  ["02_taskuri_my_work", "/taskuri/my-work"],
  ["03_taskuri_tickets_notificari", "/taskuri/tickets-notificari"],
  ["04_taskuri_proiecte_active", "/taskuri/proiecte-active"],
  ["05_taskuri_proiecte_viitoare", "/taskuri/proiecte-viitoare"],
  ["06_taskuri_proiecte_finalizate", "/taskuri/proiecte-finalizate"],
  ["07_taskuri_board", "/taskuri/board"],
  ["08_taskuri_tabel", "/taskuri/tabel"],
  ["09_taskuri_calendar_gantt", "/taskuri/calendar-gantt"],
  ["10_taskuri_workload_aprobari", "/taskuri/workload-aprobari"]
];

const args = new Map(process.argv.slice(2).map((arg, index, all) => arg.startsWith("--") ? [arg, all[index + 1] && !all[index + 1].startsWith("--") ? all[index + 1] : "true"] : [arg, "true"]));
const baseUrl = args.get("--base-url") || process.env.SERVELECT_AUDIT_BASE_URL || "http://127.0.0.1:3100";
const outputDir = path.resolve(args.get("--output") || process.env.SERVELECT_AUDIT_OUTPUT || path.join(process.cwd(), "audit-results", "taskuri-screenshots-v6.6.0"));
const noServerStart = args.has("--no-server-start") || process.env.SERVELECT_AUDIT_NO_SERVER_START === "1";
const viewport = { width: Number(args.get("--width") || 1600), height: Number(args.get("--height") || 1000) };

function wait(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
function httpStatus(url) { return new Promise((resolve) => { const req = http.get(url, (res) => { res.resume(); resolve(res.statusCode || 0); }); req.on("error", () => resolve(0)); req.setTimeout(3000, () => { req.destroy(); resolve(0); }); }); }
async function waitForServer(url, timeoutMs = 90000) { const start = Date.now(); while (Date.now() - start < timeoutMs) { const status = await httpStatus(url); if (status >= 200 && status < 500) return true; await wait(1000); } return false; }

async function ensureServer() {
  const ready = await waitForServer(`${baseUrl}/taskuri/overview`, 5000);
  if (ready || noServerStart) return null;
  const child = spawn(process.platform === "win32" ? "pnpm.cmd" : "pnpm", ["--filter", "@servelect/web", "start", "--", "-p", "3100", "-H", "127.0.0.1"], { cwd: process.cwd(), stdio: ["ignore", "pipe", "pipe"], shell: false });
  const log = fs.createWriteStream(path.join(outputDir, "next-server.log"));
  child.stdout.pipe(log); child.stderr.pipe(log);
  const ok = await waitForServer(`${baseUrl}/taskuri/overview`, 90000);
  if (!ok) throw new Error(`Local Next server did not start at ${baseUrl}`);
  return child;
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  let playwright;
  try { playwright = await import("playwright"); } catch (error) {
    const msg = `Playwright is not installed. Run: pnpm install && pnpm exec playwright install chromium. Original: ${error.message}`;
    fs.writeFileSync(path.join(outputDir, "PLAYWRIGHT_MISSING.log"), msg);
    throw new Error(msg);
  }

  const server = await ensureServer();
  const browser = await playwright.chromium.launch({ headless: true });
  const results = [];

  try {
    // smoke test first
    const [smokeName, smokeRoute] = routes[0];
    const smoke = await captureRoute(browser, smokeName, smokeRoute);
    results.push(smoke);
    if (smoke.state !== "CAPTURED") {
      await writeReports(results, true);
      process.exitCode = 1;
      return;
    }
    for (const [name, route] of routes.slice(1)) results.push(await captureRoute(browser, name, route));
  } finally {
    await browser.close();
    if (server) server.kill();
  }

  await writeReports(results, false);
  const captured = results.filter((item) => item.state === "CAPTURED").length;
  if (captured !== routes.length) process.exitCode = 1;
}

async function captureRoute(browser, name, route) {
  const url = `${baseUrl}${route}`;
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const consoleLines = [];
  const pageErrors = [];
  const networkFailed = [];
  page.on("console", (msg) => { if (["error", "warning"].includes(msg.type())) consoleLines.push(`[${msg.type()}] ${msg.text()}`); });
  page.on("pageerror", (err) => pageErrors.push(err.stack || err.message));
  page.on("requestfailed", (req) => networkFailed.push(`${req.method()} ${req.url()} :: ${req.failure()?.errorText || "failed"}`));

  const pngPath = path.join(outputDir, `${name}.png`);
  const htmlPath = path.join(outputDir, `${name}.html`);
  const metaPath = path.join(outputDir, `${name}.metadata.json`);
  let state = "CAPTURED";
  let status = 0;
  let finalUrl = url;
  let title = "";
  let bodyTextLength = 0;
  let bodyBox = null;
  let scrollHeight = 0;
  let screenshotError = "";
  let readyFound = false;

  try {
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    status = response?.status() || 0;
    finalUrl = page.url();
    await page.addStyleTag({ content: `*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}html,body{background:#fff!important;-webkit-font-smoothing:antialiased!important}` });
    try { await page.waitForSelector('[data-audit-page="taskuri"][data-audit-ready="true"]', { timeout: 15000 }); readyFound = true; } catch { readyFound = false; }
    await page.waitForFunction(() => document.body && document.body.scrollHeight > 500, null, { timeout: 15000 }).catch(() => undefined);
    await page.evaluate(() => document.fonts?.ready).catch(() => undefined);
    await page.waitForTimeout(1500);
    title = await page.title();
    const html = await page.content();
    fs.writeFileSync(htmlPath, html, "utf8");
    bodyTextLength = await page.evaluate(() => document.body?.innerText?.length || 0);
    bodyBox = await page.locator("body").boundingBox().catch(() => null);
    scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight || document.body.scrollHeight || 0);
    if (status < 200 || status >= 400) state = "HTTP_FAIL";
    if (!readyFound) state = state === "CAPTURED" ? "SELECTOR_NOT_READY" : state;
    if (bodyTextLength < 80 || scrollHeight < 500) state = "CLIENT_ERROR";
    await page.screenshot({ path: pngPath, fullPage: true, type: "png", timeout: 60000 });
  } catch (error) {
    screenshotError = error.stack || error.message;
    state = screenshotError.includes("Timeout") ? "TIMEOUT" : "SCREENSHOT_EXCEPTION";
  }

  const pngBytes = fs.existsSync(pngPath) ? fs.statSync(pngPath).size : 0;
  const htmlBytes = fs.existsSync(htmlPath) ? fs.statSync(htmlPath).size : 0;
  if (pngBytes <= 0) state = state === "CAPTURED" ? "NO_PNG" : state;
  if (pageErrors.length && state === "CAPTURED") state = "CLIENT_ERROR";

  const meta = { name, route, url, finalUrl, status, browser: "playwright-chromium", state, pngPath, pngBytes, htmlPath, htmlBytes, consoleErrors: consoleLines, pageErrors, networkFailed, screenshotMethod: "playwright", attempt: 1, title, bodyTextLength, bodyBox, scrollHeight, readyFound, viewport, screenshotError };
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), "utf8");
  fs.writeFileSync(path.join(outputDir, `${name}_console.log`), consoleLines.join("\n"), "utf8");
  fs.writeFileSync(path.join(outputDir, `${name}_page_errors.log`), pageErrors.join("\n"), "utf8");
  fs.writeFileSync(path.join(outputDir, `${name}_network_failed.log`), networkFailed.join("\n"), "utf8");
  await page.close();
  return meta;
}

async function writeReports(results, smokeFailed) {
  const captured = results.filter((item) => item.state === "CAPTURED").length;
  const csvHeader = ["Name","Route","HTTP","Browser","State","PNG bytes","HTML bytes","Console errors","Page errors","Network failed","Screenshot method","Attempt","Final URL"].join(",");
  const csvRows = results.map((item) => [item.name,item.route,item.status,item.browser,item.state,item.pngBytes,item.htmlBytes,item.consoleErrors.length,item.pageErrors.length,item.networkFailed.length,item.screenshotMethod,item.attempt,item.finalUrl].map((cell) => `"${String(cell).replaceAll('"','""')}"`).join(","));
  fs.writeFileSync(path.join(outputDir, "SCREENSHOT_AUDIT_RESULTS_v6.6.0.csv"), [csvHeader, ...csvRows].join("\n"), "utf8");
  const table = results.map((item) => `| ${item.name} | ${item.route} | ${item.status} | ${item.browser} | ${item.state} | ${item.pngBytes} | ${item.htmlBytes} | ${item.consoleErrors.length} | ${item.pageErrors.length} | ${item.networkFailed.length} | ${item.screenshotMethod} | ${item.attempt} | ${item.finalUrl} |`).join("\n");
  const md = `# SERVELECT WORK OS v6.6.0 Taskuri screenshot audit\n\nGenerated: ${new Date().toISOString()}\nBaseUrl: ${baseUrl}\nCaptured clean: ${captured} / ${routes.length}\nProblem routes: ${routes.length - captured} / ${routes.length}\nSmoke failed: ${smokeFailed ? "YES" : "NO"}\n\n| Name | Route | HTTP | Browser | State | PNG bytes | HTML bytes | Console errors | Page errors | Network failed | Screenshot method | Attempt | Final URL |\n|---|---|---:|---|---|---:|---:|---:|---:|---:|---|---:|---|\n${table}\n\n## Rule\n\n10/10 CAPTURED = audit vizual posibil. Sub 10/10 = audit vizual invalid.\n`;
  fs.writeFileSync(path.join(outputDir, "SCREENSHOT_AUDIT_REPORT_v6.6.0.md"), md, "utf8");
}

main().catch((error) => { console.error(error); process.exit(1); });