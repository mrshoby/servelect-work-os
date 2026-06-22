import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const component = path.join(root, "apps/web/components/tasks/V190GoodDayInPlaceInteractionCore.tsx");
const v150 = path.join(root, "apps/web/components/tasks/V150GoodDayStructuralTaskuriWorkspace.tsx");
const routeRoot = path.join(root, "apps/web/app/taskuri");
const docs = [
  "docs/V19_0_2_RELEASE_REPORT.md",
  "docs/V19_0_2_PROGRESS_SCORECARD.md",
  "docs/V_NEXT_FULL_FRONTEND_FUNCTIONAL_AUDIT.md",
  "docs/V_NEXT_DEAD_BUTTONS_ZERO_TOLERANCE_AUDIT.md",
  "docs/NEXT_BUILD_PLAN.md",
];

const rows = [];
function check(name, ok, detail) { rows.push({ name, ok, detail }); }

check("V190 runtime component exists", fs.existsSync(component), component);
check("V150 shell exists", fs.existsSync(v150), v150);
const source = fs.existsSync(component) ? fs.readFileSync(component, "utf8") : "";
check("Runtime marker", source.includes("data-v190-goodday-inplace-runtime"), "data-v190-goodday-inplace-runtime");
check("Local persistence", source.includes("localStorage") && source.includes("REAL_LOCAL_PERSISTENT"), "localStorage + marker");
check("New Task handler", source.includes("createTask") && source.includes("Task creat"), "createTask");
check("New Ticket handler", source.includes("createTicket") && source.includes("Ticket creat"), "createTicket");
check("Saved View handler", source.includes("saveView") && source.includes("Saved View"), "saveView");
check("Timer handler", source.includes("startTimer") && source.includes("stopTimer"), "timer");
check("Notifications handler", source.includes("markAllRead") && source.includes("markOneRead"), "notifications");
check("Import/Export handlers", source.includes("importPreview") && source.includes("downloadCsv"), "import/export");
check("Approvals handlers", source.includes("approve") && source.includes("reject"), "approve/reject");
check("No forbidden visible v17 shell text", !source.includes("Taskuri Workspace") && !source.includes("WORKSPACE HIERARCHY"), "no new shell text");

let routePages = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    if (entry.isFile() && entry.name === "page.tsx") routePages.push(full);
  }
}
walk(routeRoot);
const patched = routePages.filter((file) => fs.readFileSync(file, "utf8").includes("V190GoodDayInPlaceInteractionCore"));
check("Taskuri pages patched with in-place runtime", patched.length >= 8, `${patched.length}/${routePages.length}`);
check("Docs exist", docs.every((doc) => fs.existsSync(path.join(root, doc))), docs.join(", "));

const pass = rows.filter((r) => r.ok).length;
const out = ["# v19.0.2 Source Audit", "", `Passed: ${pass} / ${rows.length}`, "", "| Check | Detail | PASS/FAIL |", "|---|---|---:|", ...rows.map((r) => `| ${r.name} | ${r.detail} | ${r.ok ? "PASS" : "FAIL"} |`)];
fs.mkdirSync(path.join(root, "audit-results"), { recursive: true });
fs.writeFileSync(path.join(root, "audit-results/v1902-source-audit.md"), out.join("\n"));
fs.writeFileSync(path.join(root, "audit-results/v1900-source-audit.md"), out.join("\n"));
console.log(out.join("\n"));
if (pass !== rows.length) process.exit(1);
