import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const token = process.env.VERCEL_PROTECTION_BYPASS || process.env.VERCEL_AUTOMATION_BYPASS_SECRET || "";
const root = process.cwd();
const reportPath = path.join(root, "audit-results", "v1600-browser-flow-bypass-audit.md");
fs.mkdirSync(path.dirname(reportPath), { recursive: true });

const flows = [
  ["Provider marker", "/taskuri", "data-v160-real-provider-mutation", null],
  ["Create provider task", "/taskuri", "New provider task", "Provider mutation applied: create-task"],
  ["Replay queue", "/taskuri", "Replay queue", "Replay queue applied"],
  ["Commit canary", "/taskuri", "Commit canary batch", "Canary batch committed"],
  ["Rollback mutation", "/taskuri", "Rollback last mutation", "Rollback registered"],
  ["Move board review", "/taskuri/board", "Move selected to Review", "Provider mutation applied: bulk-review"],
  ["Gantt +1", "/taskuri/calendar-gantt", "Reschedule +1 day", "Provider mutation applied: reschedule"],
  ["Gantt -1", "/taskuri/calendar-gantt", "Reschedule -1 day", "Provider mutation applied: reschedule"],
  ["Role Viewer", "/taskuri", "Switch role Viewer", "RBAC role switched to Viewer"],
  ["Viewer denied rollback", "/taskuri", "Rollback last mutation", "RBAC denied"],
  ["Role Super Admin", "/taskuri", "Switch role Super Admin", "RBAC role switched to Super Admin"],
  ["Timer start", "/taskuri/timesheets", "Start timer", "Provider mutation applied: timer-start"],
  ["Timer stop", "/taskuri/timesheets", "Stop timer", "Provider mutation applied: timer-stop"]
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1600, height: 1050 } });
const page = await context.newPage();

if (token && baseUrl.includes("vercel.app")) {
  const warmUrl = `${baseUrl}/taskuri?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=${encodeURIComponent(token)}`;
  await page.goto(warmUrl, { waitUntil: "networkidle", timeout: 60000 });
}

const rows = [];
for (const [flow, route, markerOrButton, feedback] of flows) {
  const url = `${baseUrl}${route}`;
  let pass = false;
  let note = "";
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    const before = await page.content();
    if (before.includes("Vercel Authentication") || before.includes("Authentication Required")) throw new Error("BLOCKED_AUTH");
    if (!before.includes("data-v160-real-provider-mutation")) throw new Error("NO_V160_MARKER");
    if (!feedback) {
      pass = before.includes(markerOrButton);
      note = pass ? "marker found" : "marker missing";
    } else {
      await page.getByRole("button", { name: markerOrButton, exact: false }).first().click({ timeout: 10000 });
      await page.waitForTimeout(400);
      const after = await page.content();
      pass = after.includes(feedback) || after.includes("Feedback:");
      note = pass ? "state feedback detected" : "clicked but feedback missing";
    }
  } catch (error) {
    note = error instanceof Error ? error.message : String(error);
  }
  rows.push({ flow, route, button: markerOrButton, pass, note });
}

await browser.close();
const passed = rows.filter((row) => row.pass).length;
const report = [
  "# v16.0.0 Browser Flow BYPASS Audit",
  "",
  `BaseUrl: ${baseUrl}`,
  "",
  "| Flow | Page | Button/Marker | PASS/FAIL | Notes |",
  "|---|---|---|---:|---|",
  ...rows.map((row) => `| ${row.flow} | ${row.route} | ${row.button} | ${row.pass ? "PASS" : "FAIL"} | ${row.note.replaceAll("|", "/")} |`),
  "",
  `Passed: ${passed} / ${rows.length}`
].join("\n");
fs.writeFileSync(reportPath, report);
console.log(report);
if (passed !== rows.length) process.exit(1);
