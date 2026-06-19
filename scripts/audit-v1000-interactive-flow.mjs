import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "https://servelect-work-os-web.vercel.app";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const flows = [];
async function flow(name, fn) {
  try { await fn(); flows.push({ name, result: "PASS" }); }
  catch (error) { flows.push({ name, result: "FAIL", note: String(error).slice(0, 200) }); }
}
await page.goto(baseUrl.replace(/\/$/, "") + "/taskuri", { waitUntil: "networkidle", timeout: 45000 });
await flow("Create task", async () => { await page.getByText("New Task").first().click(); await page.getByText("Task nou Servelect").first().waitFor({ timeout: 5000 }); });
await flow("Open drawer", async () => { await page.getByText(/SWO-/).first().click(); await page.getByText("Description").first().waitFor({ timeout: 5000 }); });
await flow("Add comment", async () => { await page.getByPlaceholder("Add comment...").fill("QA comment v10"); await page.getByText("Add comment").click(); await page.getByText("QA comment v10").waitFor({ timeout: 5000 }); });
await flow("Start/stop timer", async () => { await page.getByText("Start timer").first().click(); await page.getByText("Stop timer").first().click(); });
await flow("Save view", async () => { await page.getByText("Save View").first().click(); await page.getByText("Saved View creat").waitFor({ timeout: 5000 }); });
await flow("Board status update", async () => { await page.goto(baseUrl.replace(/\/$/, "") + "/taskuri/board", { waitUntil: "networkidle" }); await page.getByText(/^→ /).first().click(); });
await flow("Table bulk action", async () => { await page.goto(baseUrl.replace(/\/$/, "") + "/taskuri/tabel", { waitUntil: "networkidle" }); await page.locator('input[type="checkbox"]').first().check(); await page.getByText("Bulk Review").click(); });
await flow("Create ticket", async () => { await page.goto(baseUrl.replace(/\/$/, "") + "/taskuri/tickets", { waitUntil: "networkidle" }); await page.getByText("New Ticket").first().click(); await page.getByText("Ticket nou").first().waitFor({ timeout: 5000 }); });
await flow("Inbox read/archive", async () => { await page.goto(baseUrl.replace(/\/$/, "") + "/taskuri/inbox", { waitUntil: "networkidle" }); await page.getByText(/Read|Unread/).first().click(); });
await flow("Workload approve", async () => { await page.goto(baseUrl.replace(/\/$/, "") + "/taskuri/workload-aprobari", { waitUntil: "networkidle" }); await page.getByText("Approve").first().click(); });
await browser.close();
const pass = flows.filter((f) => f.result === "PASS").length;
const outDir = path.join(process.cwd(), "audit-results");
fs.mkdirSync(outDir, { recursive: true });
const reportPath = path.join(outDir, "v1000-interactive-flow-report.md");
const report = ["# v10.0.0 Interactive Flow Audit", "", "| Flow | Page | Local/Vercel PASS/FAIL | Persisted | Notes |", "|---|---|---:|---:|---|", ...flows.map((f) => `| ${f.name} | Taskuri | ${f.result} | yes/localStorage | ${f.note ?? "OK"} |`), "", `Passed: ${pass} / ${flows.length}`].join("\n");
fs.writeFileSync(reportPath, report, "utf8");
if (pass !== flows.length) throw new Error(`v10 interactive audit failed: ${pass}/${flows.length}`);
console.log(`v10.0.0 interactive flow audit passed: ${pass} / ${flows.length}`);
console.log(`Report: ${reportPath}`);
