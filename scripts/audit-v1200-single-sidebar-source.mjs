import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = [
  "apps/web/components/tasks/V120SingleSidebarTaskuriWorkspace.tsx",
  "apps/web/components/tasks/V110GoodDayTaskuriEnterpriseWorkspace.tsx",
  ...fs.readdirSync(path.join(root, "apps/web/app/taskuri"), { withFileTypes: true }).flatMap((entry) => {
    const page = entry.isDirectory()
      ? `apps/web/app/taskuri/${entry.name}/page.tsx`
      : entry.name === "page.tsx" ? "apps/web/app/taskuri/page.tsx" : null;
    return page ? [page] : [];
  }),
];
const forbidden = [
  "Work OS · Taskuri",
  "Workspace hierarchy",
  "SERVELECT EMP / Taskuri workspace",
  "Canonical Work",
  "hidden w-72",
  "xl:flex",
  "<aside className=\"hidden w-72",
];
const failures = [];
for (const rel of files) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) continue;
  const text = fs.readFileSync(full, "utf8");
  for (const marker of forbidden) {
    if (text.includes(marker)) failures.push(`${rel}: forbidden internal navigation marker ${marker}`);
  }
}
const component = path.join(root, "apps/web/components/tasks/V120SingleSidebarTaskuriWorkspace.tsx");
const source = fs.readFileSync(component, "utf8");
for (const required of ["data-v120-single-canonical-sidebar", "Meniul intern a fost eliminat", "New Task", "Save View", "TaskDrawer", "localStorage"]) {
  if (!source.includes(required)) failures.push(`V120 component missing required marker ${required}`);
}
const reportDir = path.join(root, "audit-results");
fs.mkdirSync(reportDir, { recursive: true });
const reportPath = path.join(reportDir, "v1200-single-sidebar-source-audit.md");
if (failures.length) {
  fs.writeFileSync(reportPath, `# v12.0.0 Single Sidebar Source Audit\n\nFAIL\n\n${failures.map((f) => `- ${f}`).join("\n")}\n`);
  throw new Error(`v12.0.0 single-sidebar source audit failed: ${failures.join("; ")}`);
}
fs.writeFileSync(reportPath, "# v12.0.0 Single Sidebar Source Audit\n\nPASS\n");
console.log("PASS: v12.0.0 single canonical sidebar source audit clean");
console.log(`Report: ${reportPath}`);
