import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const taskuriRoot = path.join(root, "apps", "web", "app", "taskuri");
const componentPath = path.join(root, "apps", "web", "components", "tasks", "V150GoodDayStructuralTaskuriWorkspace.tsx");
const reportPath = path.join(root, "audit-results", "v1500-taskuri-source-audit.md");
fs.mkdirSync(path.dirname(reportPath), { recursive: true });

const pages = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    if (entry.isFile() && entry.name === "page.tsx") pages.push(full);
  }
}
walk(taskuriRoot);
const component = fs.existsSync(componentPath) ? fs.readFileSync(componentPath, "utf8") : "";
const failures = [];
for (const page of pages) {
  const text = fs.readFileSync(page, "utf8");
  if (!text.includes("V150GoodDayStructuralTaskuriWorkspace")) failures.push(`page not bound to V150: ${path.relative(root, page)}`);
}
for (const marker of [
  "data-v150-goodday-structural-parity",
  "resolveFamily",
  "renderOverview",
  "renderMyWork",
  "renderInbox",
  "renderTickets",
  "renderProjects",
  "renderBoard",
  "renderTable",
  "renderCalendar",
  "renderWorkload",
  "renderReports",
  "renderTaskDrawer",
  "const state = { addTask, addTicket, addRequest, saveView, exportCsv, bulkMoveToReview }",
]) {
  if (!component.includes(marker)) failures.push(`missing component marker: ${marker}`);
}
for (const forbidden of ["Enterprise table/list peste tot", "STATIC_UI", "GoodDay logo", "GoodDay asset", "copy GoodDay branding", "Work OS · Taskuri", "Workspace hierarchy"]) {
  if (component.includes(forbidden)) failures.push(`forbidden marker present: ${forbidden}`);
}
const report = [`# v15.0.0 Taskuri Source Audit`, ``, failures.length ? "FAIL" : "PASS", ``, `Checked Taskuri pages: ${pages.length}`, ...failures.map((failure) => `- ${failure}`)];
fs.writeFileSync(reportPath, report.join("\n"), "utf8");
if (failures.length) throw new Error(`v15.0.0 source audit failed: ${failures.length}. Report: ${reportPath}`);
console.log(`PASS: v15.0.0 Taskuri source audit clean (${pages.length} pages)`);
console.log(`Report: ${reportPath}`);
