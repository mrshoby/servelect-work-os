import fs from "node:fs";
import path from "node:path";

const repo = process.cwd();
const taskuriRoot = path.join(repo, "apps", "web", "app", "taskuri");
const component = path.join(repo, "apps", "web", "components", "tasks", "V130UnifiedTaskuriWorkspace.tsx");
const reportDir = path.join(repo, "audit-results");
fs.mkdirSync(reportDir, { recursive: true });
const reportPath = path.join(reportDir, "v1300-taskuri-route-unification-source-audit.md");

const forbidden = [
  ["Work OS", "Taskuri"].join(" · "),
  ["Workspace", "hierarchy"].join(" "),
  ["Canonical", "Work"].join(" "),
  ["SERVELECT", "EMP"].join(" "),
  ["hidden", "w-72"].join(" "),
  ["xl", "flex"].join(":"),
];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return full.endsWith("page.tsx") ? [full] : [];
  });
}

const pages = walk(taskuriRoot);
const failures = [];
if (!fs.existsSync(component)) failures.push("missing V130UnifiedTaskuriWorkspace component");

for (const page of pages) {
  const text = fs.readFileSync(page, "utf8");
  if (!text.includes("V130UnifiedTaskuriWorkspace")) failures.push(`page not bound to V130: ${path.relative(repo, page)}`);
  for (const marker of forbidden) {
    if (text.includes(marker)) failures.push(`forbidden marker in page ${path.relative(repo, page)}: ${marker}`);
  }
}

if (fs.existsSync(component)) {
  const text = fs.readFileSync(component, "utf8");
  if (!text.includes("data-v130-taskuri-route-unification")) failures.push("missing v130 route-unification marker");
  if (!text.includes("data-v120-single-canonical-sidebar")) failures.push("missing v120 single-sidebar marker");
  for (const marker of forbidden) {
    if (text.includes(marker)) failures.push(`forbidden marker in V130 component: ${marker}`);
  }
}

const report = [
  "# v13.0.0 Taskuri Route Unification Source Audit",
  "",
  failures.length ? "FAIL" : "PASS",
  "",
  `Checked Taskuri pages: ${pages.length}`,
  ...failures.map((item) => `- ${item}`),
];
fs.writeFileSync(reportPath, report.join("\n"));
if (failures.length) throw new Error(`v13.0.0 source audit failed: ${failures.length} issue(s). Report: ${reportPath}`);
console.log(`PASS: v13.0.0 all Taskuri pages bound to V130 (${pages.length} pages)`);
console.log(`Report: ${reportPath}`);
