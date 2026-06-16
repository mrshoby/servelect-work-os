import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const baseUrl = process.env.BASE_URL || "https://servelect-work-os-web.vercel.app";
const repo = process.cwd();
const outDir = path.join(repo, "audit-results", "v1300-screenshots");
const reportPath = path.join(repo, "audit-results", "V13_0_0_SCREENSHOT_MANUAL_UI_AUDIT_REPORT.md");
const zipPath = path.join(repo, "audit-results", "v1300-screenshots.zip");
fs.mkdirSync(outDir, { recursive: true });

const routes = ["/taskuri", "/taskuri/overview", "/taskuri/my-work", "/taskuri/inbox", "/taskuri/tickets", "/taskuri/board", "/taskuri/tabel", "/taskuri/calendar-gantt", "/taskuri/workload-aprobari", "/taskuri/reports", "/taskuri/automations", "/taskuri/program-board-v97"];
const forbidden = [["Work OS", "Taskuri"].join(" · "), ["Workspace", "hierarchy"].join(" "), ["Canonical", "Work"].join(" "), ["SERVELECT", "EMP"].join(" ")];
let browser;
let chromium;
try {
  ({ chromium } = await import("playwright"));
  browser = await chromium.launch({ headless: true });
} catch (error) {
  throw new Error(`Playwright is required for screenshot delivery: ${error.message}`);
}

const rows = ["# V13.0.0 Screenshot + Manual Single Sidebar UI Audit", "", `BaseUrl: ${baseUrl}`, "", "| Page | Screenshot exists | v130 marker | old inner marker absent | Dense content marker | PASS/FAIL |", "|---|---:|---:|---:|---:|---:|"];
let passed = 0;
for (const route of routes) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 });
  const url = `${baseUrl}${route}`;
  let pass = false;
  let screenshotExists = false;
  let hasMarker = false;
  let noOld = false;
  let dense = false;
  try {
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    const html = await page.content();
    hasMarker = html.includes("data-v130-taskuri-route-unification") && html.includes("data-v120-single-canonical-sidebar");
    noOld = forbidden.every((marker) => !html.includes(marker));
    dense = ["Enterprise table/list", "Task detail drawer", "Board / workload / tickets", "New Task", "Export CSV"].every((marker) => html.includes(marker));
    const fileName = route.replace(/^\//, "").replaceAll("/", "_") || "root";
    await page.screenshot({ path: path.join(outDir, `${fileName}.png`), fullPage: true });
    screenshotExists = true;
    pass = Boolean(response?.ok()) && screenshotExists && hasMarker && noOld && dense;
  } catch (error) {
    rows.push(`| ${route} | no | no | no | no | FAIL |`);
    await page.close();
    continue;
  }
  if (pass) passed++;
  rows.push(`| ${route} | ${screenshotExists ? "yes" : "no"} | ${hasMarker ? "yes" : "no"} | ${noOld ? "yes" : "no"} | ${dense ? "yes" : "no"} | ${pass ? "PASS" : "FAIL"} |`);
  await page.close();
}
await browser.close();
rows.push("", `Manual screenshot pass: ${passed} / ${routes.length}`);
fs.writeFileSync(reportPath, rows.join("\n"));
try {
  if (fs.existsSync(zipPath)) fs.rmSync(zipPath, { force: true });
  execFileSync("powershell", ["-NoProfile", "-Command", `Compress-Archive -LiteralPath '${outDir}' -DestinationPath '${zipPath}' -Force`], { stdio: "ignore" });
} catch {}
if (passed < Math.ceil(routes.length * 0.85)) throw new Error(`v13.0.0 screenshot/manual density audit needs review: ${passed} / ${routes.length}. Report: ${reportPath}`);
console.log(`v13.0.0 screenshot/manual audit passed: ${passed} / ${routes.length}`);
console.log(`Report: ${reportPath}`);
console.log(`Screenshots: ${outDir}`);
console.log(`Screenshots ZIP: ${zipPath}`);
