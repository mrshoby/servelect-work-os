import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const baseUrl = process.env.BASE_URL || "https://servelect-work-os-pfhz44t1c-mrshoby1.vercel.app";
const token = process.env.VERCEL_PROTECTION_BYPASS;

if (!token || token.trim().length === 0) {
  throw new Error("Lipsește VERCEL_PROTECTION_BYPASS. Verifică dacă tokenul este salvat în Windows User Environment.");
}

const outDir = path.join(process.cwd(), "audit-results", "v1500-bypass-screenshots");
fs.mkdirSync(outDir, { recursive: true });

const routes = [
  "/taskuri",
  "/taskuri/overview",
  "/taskuri/my-work",
  "/taskuri/inbox",
  "/taskuri/tickets",
  "/taskuri/tickets-notificari",
  "/taskuri/proiecte-active",
  "/taskuri/proiecte-viitoare",
  "/taskuri/proiecte-finalizate",
  "/taskuri/board",
  "/taskuri/tabel",
  "/taskuri/table",
  "/taskuri/calendar",
  "/taskuri/calendar-gantt",
  "/taskuri/workload",
  "/taskuri/workload-aprobari",
  "/taskuri/reports",
  "/taskuri/automations",
  "/taskuri/forms",
  "/taskuri/timesheets"
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1600, height: 1100 },
  deviceScaleFactor: 1
});

const page = await context.newPage();

const warmUrl = `${baseUrl}/taskuri?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=${encodeURIComponent(token)}`;
await page.goto(warmUrl, { waitUntil: "networkidle", timeout: 60000 });

const rows = [];

for (const route of routes) {
  const url = `${baseUrl}${route}`;
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });

  const html = await page.content();
  const isAuth = html.includes("Vercel Authentication") || html.includes("Authentication Required");
  const hasV15 = html.includes("data-v150-goodday-structural-parity");

  const safe = route.replaceAll("/", "_").replace(/^_/, "") || "taskuri";
  const shot = path.join(outDir, `${safe}.png`);

  await page.screenshot({ path: shot, fullPage: true });

  rows.push({
    route,
    isAuth,
    hasV15,
    screenshot: shot
  });
}

await browser.close();

const report = [
  "# V15.0.0 Bypass Screenshot Audit",
  "",
  `Base URL: ${baseUrl}`,
  "",
  "| Page | Auth page? | V15 marker | Screenshot | Verdict |",
  "|---|---:|---:|---|---:|",
  ...rows.map(r => `| ${r.route} | ${r.isAuth ? "YES" : "NO"} | ${r.hasV15 ? "YES" : "NO"} | ${r.screenshot} | ${(!r.isAuth && r.hasV15) ? "PASS" : "FAIL"} |`)
].join("\n");

fs.writeFileSync(
  path.join(process.cwd(), "audit-results", "V15_0_0_BYPASS_SCREENSHOT_AUDIT_REPORT.md"),
  report,
  "utf8"
);

console.log(report);
