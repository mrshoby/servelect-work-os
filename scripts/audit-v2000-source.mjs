import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const checks = [];
function check(name, ok, detail) { checks.push({ name, ok: Boolean(ok), detail }); }
function exists(p) { return fs.existsSync(path.join(root, p)); }
function read(p) { return fs.readFileSync(path.join(root, p), "utf8"); }

const componentPath = "apps/web/components/tasks/V200GoodDayCompleteInteractionLayer.tsx";
const v150Path = "apps/web/components/tasks/V150GoodDayStructuralTaskuriWorkspace.tsx";
const component = exists(componentPath) ? read(componentPath) : "";

check("V200 in-place runtime exists", exists(componentPath), componentPath);
check("V150 shell preserved", exists(v150Path), v150Path);
check("V20 marker", component.includes("data-v200-goodday-complete-interaction-layer"), "data-v200-goodday-complete-interaction-layer");
check("Local persistence", component.includes("localStorage") && component.includes("REAL_LOCAL_PERSISTENT"), "localStorage + REAL_LOCAL_PERSISTENT");
check("No forbidden v17/v16 shell text", !component.includes("Taskuri Workspace") && !component.includes("WORKSPACE HIERARCHY") && !component.includes("V160RealProviderMutationTaskuriWorkspace"), "no bad shell");
check("Task/ticket creation", component.includes("createWorkItem") && component.includes("New Task") && component.includes("New Ticket"), "createWorkItem");
check("Saved views", component.includes("saveView") && component.includes("SavedView"), "saveView");
check("Filters and sort", component.includes("resetFilter") && component.includes("sortTable"), "resetFilter + sortTable");
check("Import/export", component.includes("importPreview") && component.includes("exportCsv"), "import/export");
check("Notifications", component.includes("markRead") && component.includes("notifications"), "markRead");
check("Approvals", component.includes("approve") && component.includes("confirmReject"), "approve/reject");
check("Task drawer", component.includes("data-v200-task-drawer") && component.includes("Drawer save"), "drawer");
check("Time tracking", component.includes("startTimer") && component.includes("stopTimer") && component.includes("TimeEntry"), "timer");
check("Procurement flow", component.includes("procurementRequest") && component.includes("RFQ"), "procurement");
check("API route exists", exists("apps/web/app/api/v1/work-os/v200-goodday-complete-interaction-layer/route.ts"), "api root");
check("API section route exists", exists("apps/web/app/api/v1/work-os/v200-goodday-complete-interaction-layer/[section]/route.ts"), "api section");

const pagesRoot = path.join(root, "apps/web/app/taskuri");
let pageCount = 0;
let patched = 0;
if (fs.existsSync(pagesRoot)) {
  const stack = [pagesRoot];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      if (entry.isFile() && entry.name === "page.tsx") {
        pageCount++;
        const content = fs.readFileSync(full, "utf8");
        if (content.includes("V150GoodDayStructuralTaskuriWorkspace") && content.includes("V200GoodDayCompleteInteractionLayer")) patched++;
      }
    }
  }
}
check("Taskuri pages patched in-place", pageCount > 0 && patched === pageCount, `${patched}/${pageCount}`);

const docs = [
  "docs/V20_0_0_RELEASE_REPORT.md",
  "docs/V20_0_0_PROGRESS_SCORECARD.md",
  "docs/V_NEXT_FULL_FRONTEND_FUNCTIONAL_AUDIT.md",
  "docs/V_NEXT_DEAD_BUTTONS_ZERO_TOLERANCE_AUDIT.md",
  "docs/NEXT_BUILD_PLAN.md",
];
check("Docs exist", docs.every(exists), docs.join(", "));

const passed = checks.filter((c) => c.ok).length;
const report = [
  "# v20.0.0 Source Audit",
  "",
  `Passed: ${passed} / ${checks.length}`,
  "",
  "| Check | Detail | PASS/FAIL |",
  "|---|---|---:|",
  ...checks.map((c) => `| ${c.name} | ${String(c.detail).replace(/\|/g, "/")} | ${c.ok ? "PASS" : "FAIL"} |`),
  "",
].join("\n");

fs.mkdirSync(path.join(root, "audit-results"), { recursive: true });
fs.writeFileSync(path.join(root, "audit-results/v2000-source-audit.md"), report);
console.log(report);
if (passed !== checks.length) process.exit(1);
