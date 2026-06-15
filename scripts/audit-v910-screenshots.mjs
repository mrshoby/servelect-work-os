import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
const baseUrl = process.env.BASE_URL || "https://servelect-work-os-web.vercel.app";
const outDir = path.join(process.cwd(), "audit-results", "v910-screenshots");
fs.mkdirSync(outDir, { recursive: true });
const routes = ["/taskuri/workspace-command", "/taskuri/action-board", "/taskuri/hierarchy-map-v91", "/taskuri/task-detail-v91", "/taskuri/workload-planner-v91", "/taskuri/time-tracking-v91", "/taskuri/updates-stream-v91", "/taskuri/request-intake-v91", "/admin/taskuri-workspace-governance", "/api/v1/work-os/v91-goodday-task-execution/health"];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
const rows = []; let clean = 0;
for (const route of routes) { const url = `${baseUrl.replace(/\/$/, "")}${route}`; const safe = route.replace(/^\//, "").replaceAll("/", "_") || "home"; const png = `${safe}.png`; try { const response = await page.goto(url, { waitUntil: "networkidle", timeout: 60000 }); const http = response?.status() ?? 0; const file = path.join(outDir, png); await page.screenshot({ path: file, fullPage: true }); const size = fs.statSync(file).size; const ok = http >= 200 && http < 400 && size > 1000; if (ok) clean++; rows.push({ route, result: ok ? "PASS" : "FAIL", http, png, bytes: size, note: ok ? "OK" : "HTTP/PNG check failed" }); } catch (error) { rows.push({ route, result: "FAIL", http: 0, png, bytes: 0, note: error.message }); } }
await browser.close();
const report = ["# V9.1.0 GoodDay-like Task Execution Screenshot Audit Report", "", `BaseUrl: ${baseUrl}`, "", "| Route | Result | HTTP | PNG | Bytes | Note |", "|---|---:|---:|---|---:|---|", ...rows.map((row) => `| ${row.route} | ${row.result} | ${row.http} | ${row.png} | ${row.bytes} | ${String(row.note).replace(/\|/g, "/")} |`), "", `Captured clean: ${clean} / ${routes.length}`].join("\n");
const reportPath = path.join(process.cwd(), "audit-results", "V9_1_0_SCREENSHOT_AUDIT_REPORT.md");
fs.writeFileSync(reportPath, report + "\n");
console.log(`v9.1.0 screenshot audit captured clean: ${clean} / ${routes.length}`);
console.log(`Report: ${reportPath}`);
if (clean !== routes.length) process.exit(1);
