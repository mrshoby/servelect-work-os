import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const reportDir = path.join(root, "audit-results");
fs.mkdirSync(reportDir, { recursive: true });
const reportPath = path.join(reportDir, "v1203-taskuri-route-binding-source-audit.md");

const failures = [];
const forbidden = [
  "Work OS · Taskuri",
  "Workspace hierarchy",
  "Canonical Work",
  "hidden w-72",
  "xl:flex",
];

const taskuriDir = path.join(root, "apps", "web", "app", "taskuri");
const pages = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) walk(full);
    if (item.isFile() && item.name === "page.tsx") pages.push(full);
  }
}
walk(taskuriDir);

for (const file of pages) {
  const text = fs.readFileSync(file, "utf8");
  if (!text.includes("V120SingleSidebarTaskuriWorkspace")) failures.push(`page not bound to V120: ${path.relative(root, file)}`);
  for (const marker of forbidden) {
    if (text.includes(marker)) failures.push(`forbidden marker in page: ${marker} :: ${path.relative(root, file)}`);
  }
}

const componentPath = path.join(root, "apps", "web", "components", "tasks", "V120SingleSidebarTaskuriWorkspace.tsx");
const componentText = fs.existsSync(componentPath) ? fs.readFileSync(componentPath, "utf8") : "";
if (!componentText.includes("data-v120-single-canonical-sidebar")) failures.push("V120 marker missing from component");
if (!componentText.includes("Meniul intern a fost eliminat")) failures.push("internal menu removal text missing from component");
for (const marker of ["Workspace hierarchy", "Canonical Work", "hidden w-72", "xl:flex"]) {
  if (componentText.includes(marker)) failures.push(`forbidden internal shell marker in component: ${marker}`);
}

const report = [
  "# v12.0.3 Taskuri Route Binding Source Audit",
  "",
  failures.length ? "FAIL" : "PASS",
  "",
  `Checked pages: ${pages.length}`,
  ...failures.map((failure) => `- ${failure}`),
];
fs.writeFileSync(reportPath, report.join("\n"));
if (failures.length) throw new Error(`v12.0.3 taskuri binding source audit failed: ${failures.join("; ")}`);
console.log("PASS: v12.0.3 Taskuri route binding source audit clean");
console.log(`Report: ${reportPath}`);
