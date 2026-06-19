import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const baseUrl = process.env.BASE_URL || "https://servelect-work-os-lxxm5kbbk-mrshoby1.vercel.app";
const root = process.cwd();
const outDir = path.join(root, "audit-results", "v1500-screenshots");
const reportPath = path.join(root, "audit-results", "V15_0_0_SCREENSHOT_MANUAL_UI_AUDIT_REPORT.md");
fs.mkdirSync(outDir, { recursive: true });

const routes = ["/taskuri", "/taskuri/overview", "/taskuri/my-work", "/taskuri/inbox", "/taskuri/tickets", "/taskuri/tickets-notificari", "/taskuri/proiecte-active", "/taskuri/proiecte-viitoare", "/taskuri/proiecte-finalizate", "/taskuri/board", "/taskuri/tabel", "/taskuri/table", "/taskuri/calendar", "/taskuri/calendar-gantt", "/taskuri/workload", "/taskuri/workload-aprobari"];
let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch (error) {
  const blocked = ["# V15.0.0 Screenshot + Manual UI Audit", "", `BaseUrl: ${baseUrl}`, "", "BLOCKED_NO_PLAYWRIGHT", "", "Playwright is not installed/available. Run `pnpm exec playwright install chromium` or install Playwright, then rerun this script."];
  fs.writeFileSync(reportPath, blocked.join("\n"), "utf8");
  throw error;
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
const rows = [];
for (const route of routes) {
  const url = baseUrl.replace(/\/$/, "") + route;
  const file = path.join(outDir, `${route.replace(/^\//, "").replaceAll("/", "__") || "taskuri"}.png`);
  let status = 0;
  let html = "";
  let note = "";
  try {
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    status = response?.status() ?? 0;
    await page.screenshot({ path: file, fullPage: true });
    html = await page.content();
  } catch (error) {
    note = error instanceof Error ? error.message : String(error);
  }
  const marker = html.includes("data-v150-goodday-structural-parity") || html.includes("GoodDay-like structural parity");
  const forbidden = html.includes("Work OS · Taskuri") || html.includes("Workspace hierarchy") || html.includes("Enterprise table/list peste tot");
  const dense = html.includes("Task detail drawer") && html.includes("New Task") && html.includes("Save View") && html.includes("Export") && html.includes("local persistent");
  const familySpecific = html.includes("Ticket queue with SLA") || html.includes("Enterprise task table/list") || html.includes("Team workload grid") || html.includes("Gantt timeline") || html.includes("Inbox triage feed") || html.includes("Automation rules") || html.includes("Command Center") || html.includes("My Work");
  const pass = status >= 200 && status < 300 && marker && !forbidden && dense && familySpecific;
  rows.push({ route, file, status, marker, forbidden, dense, familySpecific, pass, note });
}
await browser.close();

const passed = rows.filter((row) => row.pass).length;
const lines = ["# V15.0.0 Screenshot + Manual GoodDay-like Taskuri UI Audit", "", `BaseUrl: ${baseUrl}`, "", "| Page | Screenshot path | HTTP | v150 marker | old generic/inner marker absent | Dense content | Route-specific content | PASS/FAIL | Notes |", "|---|---|---:|---:|---:|---:|---:|---:|---|"];
for (const row of rows) lines.push(`| ${row.route} | ${path.relative(root, row.file)} | ${row.status} | ${row.marker ? "yes" : "no"} | ${!row.forbidden ? "yes" : "no"} | ${row.dense ? "yes" : "no"} | ${row.familySpecific ? "yes" : "no"} | ${row.pass ? "PASS" : "FAIL"} | ${(row.note || "OK").replaceAll("|", "/")} |`);
lines.push("", `Manual screenshot pass: ${passed} / ${rows.length}`);
fs.writeFileSync(reportPath, lines.join("\n"), "utf8");
try {
  const zipPath = path.join(root, "audit-results", "v1500-screenshots.zip");
  if (fs.existsSync(zipPath)) fs.rmSync(zipPath, { force: true });
  execFileSync("powershell.exe", ["-NoProfile", "-Command", `Compress-Archive -Path '${outDir.replaceAll("'", "''")}\\*' -DestinationPath '${zipPath.replaceAll("'", "''")}' -Force`], { stdio: "ignore" });
} catch {
  // zip creation is optional; screenshots remain in outDir
}
if (passed !== rows.length) throw new Error(`v15.0.0 screenshot/manual UI audit failed: ${passed} / ${rows.length}. Report: ${reportPath}`);
console.log(`PASS: v15.0.0 screenshot/manual UI audit clean (${passed}/${rows.length})`);
console.log(`Report: ${reportPath}`);
