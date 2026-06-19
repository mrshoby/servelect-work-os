import fs from "node:fs";
import path from "node:path";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const root = process.cwd();
const reportPath = path.join(root, "audit-results", "v1500-functional-browser-flow-audit.md");
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
let chromium;
try { ({ chromium } = await import("playwright")); } catch (error) {
  fs.writeFileSync(reportPath, "# v15.0.0 Functional Browser Flow Audit\n\nBLOCKED_NO_PLAYWRIGHT\n", "utf8");
  throw error;
}
const flows = [
  ["Create task", "/taskuri", "New Task", "New task created"],
  ["Create ticket", "/taskuri/tickets", "New Ticket", "New ticket created"],
  ["Create request", "/taskuri", "New Request", "New request"],
  ["Save view", "/taskuri/tabel", "Save View", "Saved view"],
  ["Export CSV", "/taskuri/tabel", "Export", "Exported"],
  ["Bulk action", "/taskuri/board", "Bulk to review", "Bulk moved"],
  ["Start timer", "/taskuri/timesheets", "Start timer", "Timer started"],
  ["Stop timer", "/taskuri/timesheets", "Stop timer", "Timer stopped"],
  ["Create automation", "/taskuri/automations", "Create automation", "Automation created"],
];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1500, height: 900 } });
const rows = [];
for (const [name, route, buttonText, feedbackText] of flows) {
  const url = baseUrl.replace(/\/$/, "") + route;
  let pass = false;
  let note = "";
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    await page.getByRole("button", { name: buttonText, exact: false }).first().click({ timeout: 7000 });
    await page.waitForTimeout(350);
    const content = await page.content();
    pass = content.includes(feedbackText) || content.includes("Feedback:");
    note = pass ? "state feedback detected" : "feedback not detected";
  } catch (error) {
    note = error instanceof Error ? error.message : String(error);
  }
  rows.push({ name, route, buttonText, pass, note });
}
await browser.close();
const passed = rows.filter((row) => row.pass).length;
const lines = ["# v15.0.0 Functional Browser Flow Audit", "", `BaseUrl: ${baseUrl}`, "", "| Flow | Page | Button | PASS/FAIL | Notes |", "|---|---|---|---:|---|"];
for (const row of rows) lines.push(`| ${row.name} | ${row.route} | ${row.buttonText} | ${row.pass ? "PASS" : "FAIL"} | ${row.note.replaceAll("|", "/")} |`);
lines.push("", `Passed: ${passed} / ${rows.length}`);
fs.writeFileSync(reportPath, lines.join("\n"), "utf8");
if (passed !== rows.length) throw new Error(`v15.0.0 functional browser flow audit failed: ${passed}/${rows.length}. Report: ${reportPath}`);
console.log(`PASS: v15.0.0 functional browser flow audit clean (${passed}/${rows.length})`);
console.log(`Report: ${reportPath}`);
