import fs from "node:fs";
import path from "node:path";

const baseUrl = process.env.BASE_URL || "https://servelect-work-os-web.vercel.app";
const routes = ["/taskuri", "/taskuri/overview", "/taskuri/my-work", "/taskuri/inbox", "/taskuri/tickets", "/taskuri/tickets-notificari", "/taskuri/proiecte-active", "/taskuri/proiecte-viitoare", "/taskuri/proiecte-finalizate", "/taskuri/board", "/taskuri/tabel", "/taskuri/table", "/taskuri/calendar", "/taskuri/calendar-gantt", "/taskuri/workload", "/taskuri/workload-aprobari", "/taskuri/forms", "/taskuri/timesheets", "/taskuri/reports", "/taskuri/automations"];
const root = process.cwd();
const outDir = path.join(root, "audit-results", "v1100-screenshots");
fs.mkdirSync(outDir, { recursive: true });
let playwright;
try {
  playwright = await import("playwright");
} catch (error) {
  const reportPath = path.join(root, "audit-results", "V11_0_0_SCREENSHOT_MANUAL_UI_AUDIT_REPORT.md");
  fs.writeFileSync(reportPath, `# V11.0.0 Screenshot + Manual UI Audit\n\nPlaywright is not available in this environment. Run in the project environment where previous screenshot audits worked.\n`, "utf8");
  throw error;
}
const browser = await playwright.chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1536, height: 1080 } });
const rows = [];
for (const route of routes) {
  const url = `${baseUrl.replace(/\/$/, "")}${route}`;
  let result = { route, http: 0, png: "", density: "manual-review", content: "manual-review", functions: "manual-review", verdict: "REVIEW" };
  try {
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    const status = response?.status() ?? 0;
    const name = route.replace(/^\//, "").replace(/[^a-z0-9]+/gi, "_") || "root";
    const png = `${name}.png`;
    await page.screenshot({ path: path.join(outDir, png), fullPage: true });
    const text = await page.locator("body").innerText({ timeout: 5000 });
    const hasDensity = text.includes("Enterprise Work Command Center") && text.includes("Workspace hierarchy") && text.includes("New Task") && text.includes("Save View");
    const hasFunctions = text.includes("Bulk status") || text.includes("Start timer") || text.includes("Escalate") || text.includes("Export");
    result = { route, http: status, png, density: hasDensity ? "yes" : "no", content: text.length > 6000 ? "yes" : "needs-review", functions: hasFunctions ? "yes" : "needs-review", verdict: status < 400 && hasDensity ? "PASS_WITH_MANUAL_REVIEW" : "FAIL" };
  } catch (error) {
    result = { route, http: 0, png: "", density: "no", content: "no", functions: "no", verdict: `FAIL ${String(error).replace(/\|/g, "/")}` };
  }
  rows.push(result);
}
await browser.close();
const passed = rows.filter((row) => row.verdict.startsWith("PASS")).length;
const reportPath = path.join(root, "audit-results", "V11_0_0_SCREENSHOT_MANUAL_UI_AUDIT_REPORT.md");
const md = [
  "# V11.0.0 Screenshot + Manual UI Density Audit",
  "",
  `BaseUrl: ${baseUrl}`,
  "",
  "| Page | Screenshot exists | HTTP | Looks dense? | Has enough content? | Functions marker? | PASS/FAIL |",
  "|---|---:|---:|---:|---:|---:|---:|",
  ...rows.map((row) => `| ${row.route} | ${row.png ? "yes" : "no"} | ${row.http} | ${row.density} | ${row.content} | ${row.functions} | ${row.verdict} |`),
  "",
  `Captured + density marker pass: ${passed} / ${rows.length}`,
  "",
  "This report still requires human visual acceptance after deploy. Route 200 and screenshot existence alone are not enough.",
].join("\n");
fs.writeFileSync(reportPath, md, "utf8");
if (passed < Math.ceil(rows.length * 0.85)) throw new Error(`v11.0.0 screenshot/manual density audit needs review: ${passed} / ${rows.length}. Report: ${reportPath}`);
console.log(`v11.0.0 screenshot/manual audit captured: ${passed} / ${rows.length}`);
console.log(`Report: ${reportPath}`);
