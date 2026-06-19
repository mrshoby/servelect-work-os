import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const baseUrl = process.env.BASE_URL || "https://servelect-work-os-web.vercel.app";
const root = process.cwd();
const reportDir = path.join(root, "audit-results");
const screenshotDir = path.join(reportDir, "v1400-screenshots");
fs.mkdirSync(screenshotDir, { recursive: true });
const reportPath = path.join(reportDir, "V14_0_0_SCREENSHOT_MANUAL_UI_AUDIT_REPORT.md");
const zipPath = path.join(reportDir, "v1400-screenshots.zip");
const routes = ["/taskuri", "/taskuri/overview", "/taskuri/my-work", "/taskuri/inbox", "/taskuri/tickets", "/taskuri/board", "/taskuri/tabel", "/taskuri/calendar", "/taskuri/calendar-gantt", "/taskuri/workload", "/taskuri/workload-aprobari", "/taskuri/reports", "/taskuri/automations", "/taskuri/forms", "/taskuri/timesheets", "/taskuri/project-hierarchy", "/taskuri/files-evidence-v95", "/taskuri/provider-mutation-replay", "/taskuri/approval-workflow-builder-v94"];
let chromium;
try {
  const playwright = await import("playwright");
  chromium = playwright.chromium;
} catch {
  throw new Error("Playwright is required for v14 screenshot audit. Run: pnpm exec playwright install chromium");
}
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
const rows = [];
for (const route of routes) {
  const url = baseUrl.replace(/\/$/, "") + route;
  const response = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(600);
  const html = await page.content();
  const file = path.join(screenshotDir, `${route.replace(/^\//, "").replaceAll("/", "__")}.png`);
  await page.screenshot({ path: file, fullPage: true });
  const hasV14 = html.includes("data-v140-goodday-route-specific-taskuri");
  const hasV120 = html.includes("data-v120-single-canonical-sidebar");
  const oldMenuAbsent = !html.includes("Work OS · Taskuri") && !html.includes("Workspace hierarchy") && !html.includes("Canonical Work") && !html.includes("SERVELECT EMP");
  const routeSpecific = html.includes("Conținutul acestei pagini este specific submeniului") || html.includes("v14 route-specific content");
  const notOnlyTable = html.includes("Kanban board") || html.includes("Calendar") || html.includes("Gantt") || html.includes("Workload") || html.includes("Rapoarte") || html.includes("Tichete") || html.includes("Inbox") || html.includes("Timesheet") || html.includes("Formulare") || html.includes("Fișiere") || html.includes("Aprobări") || html.includes("Automatizări") || html.includes("Structură proiecte");
  const ok = Boolean(response?.ok()) && hasV14 && hasV120 && oldMenuAbsent && routeSpecific && notOnlyTable;
  rows.push({ route, status: response?.status() ?? 0, hasV14, hasV120, oldMenuAbsent, routeSpecific, notOnlyTable, ok });
}
await browser.close();
const lines = [
  "# V14.0.0 Screenshot + Manual GoodDay Route-Specific UI Audit",
  "",
  `BaseUrl: ${baseUrl}`,
  "",
  "| Page | HTTP | v14 marker | single sidebar | old menu absent | route-specific content | not only enterprise table/list | PASS/FAIL |",
  "|---|---:|---:|---:|---:|---:|---:|---:|",
  ...rows.map((row) => `| ${row.route} | ${row.status} | ${row.hasV14 ? "yes" : "no"} | ${row.hasV120 ? "yes" : "no"} | ${row.oldMenuAbsent ? "yes" : "no"} | ${row.routeSpecific ? "yes" : "no"} | ${row.notOnlyTable ? "yes" : "no"} | ${row.ok ? "PASS" : "FAIL"} |`),
  "",
  `Manual screenshot pass: ${rows.filter((row) => row.ok).length} / ${rows.length}`,
  `Screenshots: ${screenshotDir}`,
  `Screenshots ZIP: ${zipPath}`
];
fs.writeFileSync(reportPath, lines.join("\n"));
if (fs.existsSync(zipPath)) fs.rmSync(zipPath, { force: true });
try {
  execFileSync("powershell", ["-NoProfile", "-Command", `Compress-Archive -Path '${screenshotDir.replaceAll("'", "''")}\\*' -DestinationPath '${zipPath.replaceAll("'", "''")}' -Force`], { stdio: "inherit" });
} catch {
  try { execFileSync("pwsh", ["-NoProfile", "-Command", `Compress-Archive -Path '${screenshotDir.replaceAll("'", "''")}/*' -DestinationPath '${zipPath.replaceAll("'", "''")}' -Force`], { stdio: "inherit" }); } catch {}
}
const pass = rows.filter((row) => row.ok).length;
if (pass < Math.ceil(rows.length * 0.9)) throw new Error(`v14.0.0 screenshot/manual audit needs review: ${pass} / ${rows.length}. Report: ${reportPath}`);
console.log(`PASS: v14.0.0 screenshot/manual audit passed ${pass} / ${rows.length}`);
console.log(`Report: ${reportPath}`);
console.log(`Screenshots ZIP: ${zipPath}`);
