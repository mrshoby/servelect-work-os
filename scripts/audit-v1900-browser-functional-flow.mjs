import fs from "node:fs";
import path from "node:path";

const baseUrl = process.env.BASE_URL || process.argv.find((a) => a.startsWith("--baseUrl="))?.split("=")[1] || "https://servelect-work-os-web.vercel.app";
const root = process.cwd();
const rows = [];

async function main() {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    const out = [
      "# v19.0.1 Browser Functional Flow Audit",
      "",
      `BaseUrl: ${baseUrl}`,
      "Status: SKIPPED — Playwright is not installed in this environment.",
      "",
      "This is not a PASS. Run after installing Playwright/browser dependencies.",
    ];
    fs.mkdirSync(path.join(root, "audit-results"), { recursive: true });
    fs.writeFileSync(path.join(root, "audit-results/v1900-browser-functional-flow-audit.md"), out.join("\n"));
    console.log(out.join("\n"));
    process.exit(0);
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`${baseUrl}/taskuri`, { waitUntil: "networkidle" });

  async function test(name, action, expected) {
    try {
      await action();
      const body = await page.textContent("body");
      const storage = await page.evaluate(() => localStorage.getItem("servelect.workos.v190.goodday.inplace.runtime") || "");
      const pass = expected(body || "", storage || "");
      rows.push({ page: "/taskuri", element: name, action: "click/flow", expected: "visible feedback + state/local persistence", actual: pass ? "state changed" : "missing state/feedback", changed: pass ? "YES" : "NO", persisted: storage ? "YES" : "NO", pass });
    } catch (error) {
      rows.push({ page: "/taskuri", element: name, action: "click/flow", expected: "no error", actual: String(error).replace(/\n/g, " ").slice(0, 160), changed: "NO", persisted: "NO", pass: false });
    }
  }

  await test("New Task", async () => { await page.getByText(/New Task|Task nou/i).first().click(); await page.getByLabel(/Titlu task/i).fill("Task audit v19"); await page.getByText(/Create task/i).click(); }, (body, storage) => body.includes("Task creat") && storage.includes("Task audit v19"));
  await test("Save View", async () => { await page.getByText(/Save View|Saved View/i).first().click(); }, (body, storage) => body.includes("Saved View") && storage.includes("Saved"));
  await test("Export", async () => { await page.getByText(/Export/i).first().click(); }, (body, storage) => body.includes("Export CSV") && storage.includes("tasks"));
  await test("Import", async () => { await page.getByText(/Import/i).first().click(); await page.getByText(/Importă date/i).click(); }, (body, storage) => body.includes("Import") && storage.includes("Task importat"));
  await test("Timer", async () => { await page.getByText(/Start timer|Pornește timer/i).first().click(); await page.getByText(/Stop timer|Oprește timer/i).first().click(); }, (body, storage) => body.includes("Timer") && storage.includes("durationMinutes"));

  await browser.close();

  const passed = rows.filter((r) => r.pass).length;
  const out = [
    "# v19.0.1 Browser Functional Flow Audit",
    "",
    `BaseUrl: ${baseUrl}`,
    `Passed: ${passed} / ${rows.length}`,
    "",
    "| Page | Element | Action tested | Expected result | Actual result | State changed | Persisted | PASS/FAIL |",
    "|---|---|---|---|---|---:|---:|---:|",
    ...rows.map((r) => `| ${r.page} | ${r.element} | ${r.action} | ${r.expected} | ${r.actual} | ${r.changed} | ${r.persisted} | ${r.pass ? "PASS" : "FAIL"} |`),
  ];
  fs.mkdirSync(path.join(root, "audit-results"), { recursive: true });
  fs.writeFileSync(path.join(root, "audit-results/v1900-browser-functional-flow-audit.md"), out.join("\n"));
  fs.writeFileSync(path.join(root, "docs/V_NEXT_FULL_FRONTEND_FUNCTIONAL_AUDIT.md"), out.join("\n"));
  console.log(out.join("\n"));
  if (passed !== rows.length) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
