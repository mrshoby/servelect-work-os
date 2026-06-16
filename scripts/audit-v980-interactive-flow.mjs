import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "https://servelect-work-os-ky01ppafk-mrshoby1.vercel.app";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 1100 } });
const flows = [];
async function step(name, fn) {
  try {
    await fn();
    flows.push({ name, status: "PASS", notes: "OK" });
  } catch (error) {
    flows.push({ name, status: "FAIL", notes: String(error).replace(/\|/g, "/").slice(0, 180) });
  }
}
await page.goto(`${baseUrl.replace(/\/$/, "")}/taskuri`, { waitUntil: "networkidle", timeout: 45000 });
await page.evaluate(() => localStorage.removeItem("servelect.v98.taskuri.goodday.parity.state"));
await page.reload({ waitUntil: "networkidle" });
await step("Create task", async () => { await page.getByTestId("new-task").click(); await page.getByTestId("task-drawer").waitFor(); });
await step("Open task drawer", async () => { await page.locator('[data-testid^="open-tsk-"]').first().click(); await page.getByTestId("task-drawer").waitFor(); });
await step("Edit status", async () => { await page.getByTestId("drawer-save").click(); });
await step("Edit title", async () => { await page.getByTestId("drawer-title").fill("Task actualizat din audit flow v9.8"); });
await step("Add comment", async () => { await page.getByTestId("comment-input").fill("Comentariu din audit flow v9.8"); await page.getByTestId("add-comment").click(); });
await step("Toggle checklist", async () => { await page.locator('[data-testid^="checklist-"]').first().click(); });
await step("Add dependency", async () => { await page.getByTestId("add-dependency").click(); });
await step("Start timer", async () => { await page.getByTestId("start-timer").click(); });
await step("Stop timer", async () => { await page.getByTestId("stop-timer").click(); });
await step("Save view", async () => { await page.getByTestId("save-view").click(); });
await step("Create ticket", async () => { await page.goto(`${baseUrl.replace(/\/$/, "")}/taskuri/tickets-notificari`, { waitUntil: "networkidle" }); await page.getByTestId("new-ticket").click(); });
await step("Escalate ticket", async () => { await page.locator('[data-testid^="escalate-"]').first().click(); });
await step("Convert ticket", async () => { await page.locator('[data-testid^="convert-"]').first().click(); });
await step("Mark notification read", async () => { await page.locator('[data-testid^="mark-read-"]').first().click(); });
await step("Board status action", async () => { await page.goto(`${baseUrl.replace(/\/$/, "")}/taskuri/board`, { waitUntil: "networkidle" }); await page.getByText("Work").first().click(); });
await step("Table select and bulk", async () => { await page.goto(`${baseUrl.replace(/\/$/, "")}/taskuri/tabel`, { waitUntil: "networkidle" }); await page.locator('[data-testid^="select-"]').nth(0).click(); await page.locator('[data-testid^="select-"]').nth(1).click(); await page.getByTestId("bulk-status").click(); });
await step("Calendar change due", async () => { await page.goto(`${baseUrl.replace(/\/$/, "")}/taskuri/calendar-gantt`, { waitUntil: "networkidle" }); await page.getByText("Move due").first().click(); });
await step("Workload approve", async () => { await page.goto(`${baseUrl.replace(/\/$/, "")}/taskuri/workload-aprobari`, { waitUntil: "networkidle" }); await page.locator('[data-testid^="approve-"]').first().click(); });
await step("Persistence after refresh", async () => { await page.reload({ waitUntil: "networkidle" }); const raw = await page.evaluate(() => localStorage.getItem("servelect.v98.taskuri.goodday.parity.state")); if (!raw) throw new Error("localStorage state missing"); });
await browser.close();
const pass = flows.filter((flow) => flow.status === "PASS").length;
const report = [];
report.push("# v9.8.0 Browser Interactive Flow Audit");
report.push("");
report.push(`BaseUrl: ${baseUrl}`);
report.push("");
report.push("| Flow | PASS/FAIL | Notes |");
report.push("|---|---:|---|");
for (const flow of flows) report.push(`| ${flow.name} | ${flow.status} | ${flow.notes} |`);
report.push("");
report.push(`Passed: ${pass} / ${flows.length}`);
const outDir = path.join(process.cwd(), "audit-results");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "v980-browser-interactive-flow-audit.md");
fs.writeFileSync(outPath, report.join("\n"));
console.log(`v9.8.0 browser interactive flow audit passed: ${pass} / ${flows.length}`);
console.log(`Report: ${outPath}`);
if (pass !== flows.length) process.exit(1);
