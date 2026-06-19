import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const baseUrl = process.env.BASE_URL || "https://servelect-work-os-pfhz44t1c-mrshoby1.vercel.app";
const token = process.env.VERCEL_PROTECTION_BYPASS;

if (!token || token.trim().length === 0) {
  throw new Error("Lipsește VERCEL_PROTECTION_BYPASS.");
}

const reportPath = path.join(process.cwd(), "audit-results", "v1500-functional-browser-flow-bypass-audit.md");
fs.mkdirSync(path.dirname(reportPath), { recursive: true });

const flows = [
  ["Create task", "/taskuri", "New Task", "New task created"],
  ["Create ticket", "/taskuri/tickets", "New Ticket", "New ticket created"],
  ["Create request", "/taskuri", "New Request", "New request"],
  ["Save view", "/taskuri/tabel", "Save View", "Saved view"],
  ["Export CSV", "/taskuri/tabel", "Export", "Exported"],
  ["Bulk action", "/taskuri/board", "Bulk to review", "Bulk moved"],
  ["Start timer", "/taskuri/timesheets", "Start timer", "Timer started"],
  ["Stop timer", "/taskuri/timesheets", "Stop timer", "Timer stopped"],
  ["Create automation", "/taskuri/automations", "Create automation", "Automation created"]
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1500, height: 900 } });
const page = await context.newPage();

const warmUrl = `${baseUrl}/taskuri?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=${encodeURIComponent(token)}`;
await page.goto(warmUrl, { waitUntil: "networkidle", timeout: 60000 });

const rows = [];

for (const [name, route, buttonText, feedbackText] of flows) {
  const url = `${baseUrl}${route}`;
  let pass = false;
  let note = "";

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });

    const htmlBefore = await page.content();
    const isAuth = htmlBefore.includes("Vercel Authentication") || htmlBefore.includes("Authentication Required");
    const hasV15 = htmlBefore.includes("data-v150-goodday-structural-parity");

    if (isAuth) {
      throw new Error("BLOCKED_AUTH: Playwright încă vede login Vercel");
    }

    if (!hasV15) {
      throw new Error("NO_V15_MARKER: pagina nu conține markerul v15");
    }

    await page.getByRole("button", { name: buttonText, exact: false }).first().click({ timeout: 10000 });
    await page.waitForTimeout(500);

    const htmlAfter = await page.content();
    pass = htmlAfter.includes(feedbackText) || htmlAfter.includes("Feedback:");
    note = pass ? "state feedback detected" : "clicked but feedback not detected";
  } catch (error) {
    note = error instanceof Error ? error.message : String(error);
  }

  rows.push({ name, route, buttonText, pass, note });
}

await browser.close();

const passed = rows.filter((row) => row.pass).length;

const lines = [
  "# v15.0.0 Functional Browser Flow BYPASS Audit",
  "",
  `BaseUrl: ${baseUrl}`,
  "",
  "| Flow | Page | Button | PASS/FAIL | Notes |",
  "|---|---|---|---:|---|",
  ...rows.map(row => `| ${row.name} | ${row.route} | ${row.buttonText} | ${row.pass ? "PASS" : "FAIL"} | ${row.note.replaceAll("|", "/")} |`),
  "",
  `Passed: ${passed} / ${rows.length}`
];

fs.writeFileSync(reportPath, lines.join("\n"), "utf8");

console.log(lines.join("\n"));

if (passed !== rows.length) {
  throw new Error(`v15.0.0 functional browser flow BYPASS audit failed: ${passed}/${rows.length}. Report: ${reportPath}`);
}
