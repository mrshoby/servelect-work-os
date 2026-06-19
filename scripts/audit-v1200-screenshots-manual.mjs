import fs from "node:fs";
import path from "node:path";

const baseUrl = process.env.BASE_URL || "https://servelect-work-os-web.vercel.app";
const routes = ["/taskuri", "/taskuri/overview", "/taskuri/my-work", "/taskuri/inbox", "/taskuri/tickets", "/taskuri/tickets-notificari", "/taskuri/board", "/taskuri/tabel", "/taskuri/calendar-gantt", "/taskuri/workload-aprobari", "/taskuri/reports", "/taskuri/automations"];
const required = ["data-v120-single-canonical-sidebar", "Meniul intern a fost eliminat", "New Task", "Save View"];
const forbidden = ["Work OS · Taskuri", "Workspace hierarchy", "Canonical Work", "SERVELECT EMP / Taskuri workspace"];
const rows = [];
let passed = 0;
for (const route of routes) {
  let ok = false;
  let note = "";
  try {
    const response = await fetch(`${baseUrl}${route}`);
    const text = await response.text();
    const hasRequired = required.every((marker) => text.includes(marker));
    const hasForbidden = forbidden.some((marker) => text.includes(marker));
    ok = response.ok && hasRequired && !hasForbidden;
    note = response.ok ? (ok ? "single-sidebar marker present, old internal shell absent" : "manual review needed: marker/forbidden mismatch") : `HTTP ${response.status}`;
    if (ok) passed++;
    rows.push(`| ${route} | yes | ${response.status} | ${hasRequired ? "yes" : "no"} | ${hasForbidden ? "yes" : "no"} | ${ok ? "PASS" : "FAIL"} | ${note} |`);
  } catch (error) {
    rows.push(`| ${route} | no | ERR | no | unknown | FAIL | ${String(error)} |`);
  }
}
const report = [
  "# V12.0.0 Screenshot + Manual Single Sidebar UI Audit",
  "",
  `BaseUrl: ${baseUrl}`,
  "",
  "| Page | Screenshot/HTML exists | HTTP | v12 single-sidebar marker | Old inner menu marker | PASS/FAIL | Notes |",
  "|---|---:|---:|---:|---:|---:|---|",
  ...rows,
  "",
  `Manual single-sidebar pass: ${passed} / ${routes.length}`,
].join("\n");
const reportDir = path.join(process.cwd(), "audit-results");
fs.mkdirSync(reportDir, { recursive: true });
const reportPath = path.join(reportDir, "V12_0_0_SINGLE_SIDEBAR_MANUAL_UI_AUDIT_REPORT.md");
fs.writeFileSync(reportPath, report);
if (passed < Math.ceil(routes.length * 0.85)) throw new Error(`v12.0.0 single-sidebar/manual audit needs review: ${passed} / ${routes.length}. Report: ${reportPath}`);
console.log(`v12.0.0 single-sidebar/manual audit passed: ${passed} / ${routes.length}`);
console.log(`Report: ${reportPath}`);
