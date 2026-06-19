import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const token = process.env.VERCEL_PROTECTION_BYPASS || process.env.VERCEL_AUTOMATION_BYPASS_SECRET || "";
const root = process.cwd();
const outDir = path.join(root, "audit-results", "v1600-screenshots");
fs.mkdirSync(outDir, { recursive: true });
const routes = ["/taskuri", "/taskuri/board", "/taskuri/calendar-gantt", "/taskuri/workload", "/taskuri/tabel", "/taskuri/timesheets", "/taskuri/provider-mutation-replay", "/taskuri/workload-aprobari"];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1600, height: 1100 }, deviceScaleFactor: 1 });
const page = await context.newPage();
if (token && baseUrl.includes("vercel.app")) await page.goto(`${baseUrl}/taskuri?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=${encodeURIComponent(token)}`, { waitUntil: "networkidle", timeout: 60000 });
const rows = [];
for (const route of routes) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 60000 });
  const html = await page.content();
  const isAuth = html.includes("Vercel Authentication") || html.includes("Authentication Required");
  const hasV16 = html.includes("data-v160-real-provider-mutation");
  const safe = route.replaceAll("/", "_").replace(/^_/, "") || "taskuri";
  const shot = path.join(outDir, `${safe}.png`);
  await page.screenshot({ path: shot, fullPage: true });
  rows.push({ route, isAuth, hasV16, shot });
}
await browser.close();
try { execFileSync("powershell", ["-NoProfile", "-Command", `Compress-Archive -Path '${outDir}\\*' -DestinationPath '${path.join(root, "audit-results", "v1600-screenshots.zip")}' -Force`]); } catch {}
const report = ["# v16.0.0 Screenshot BYPASS Audit", "", `BaseUrl: ${baseUrl}`, "", "| Page | Auth page? | V16 marker | Screenshot | Verdict |", "|---|---:|---:|---|---:|", ...rows.map((row) => `| ${row.route} | ${row.isAuth ? "YES" : "NO"} | ${row.hasV16 ? "YES" : "NO"} | ${row.shot} | ${!row.isAuth && row.hasV16 ? "PASS" : "FAIL"} |`)].join("\n");
fs.writeFileSync(path.join(root, "audit-results", "V16_0_0_SCREENSHOT_BYPASS_AUDIT_REPORT.md"), report);
console.log(report);
if (rows.some((row) => row.isAuth || !row.hasV16)) process.exit(1);
