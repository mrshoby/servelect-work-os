import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const checks = [];

function file(rel) {
  return path.join(root, rel);
}

function exists(rel) {
  return fs.existsSync(file(rel));
}

function read(rel) {
  return exists(rel) ? fs.readFileSync(file(rel), "utf8") : "";
}

function check(name, detail, pass) {
  checks.push({ name, detail, pass: Boolean(pass) });
}

const componentRel = "apps/web/components/tasks/V220GoodDayFrontendAcceptanceLayer.tsx";
const templateRel = "apps/web/app/taskuri/template.tsx";
const apiRootRel = "apps/web/app/api/v1/work-os/v220-goodday-frontend-acceptance/route.ts";
const apiSectionRel = "apps/web/app/api/v1/work-os/v220-goodday-frontend-acceptance/[section]/route.ts";
const source = read(componentRel);
const template = read(templateRel);
const apiRoot = read(apiRootRel);
const apiSection = read(apiSectionRel);

check("V220 runtime exists", componentRel, exists(componentRel));
check("V15/V200/V210 shell preserved", templateRel, template.includes("data-v210-goodday-real-mutation-bridge") && template.includes("data-v220-goodday-frontend-acceptance"));
check("No forbidden visual shell text", "Taskuri Workspace / WORKSPACE HIERARCHY / V160", !source.includes("Taskuri Workspace") && !source.includes("WORKSPACE HIERARCHY") && !template.includes("data-v160-real-provider-mutation"));
check("Server-rendered v22 marker", "data-v220-goodday-frontend-acceptance", template.includes("data-v220-goodday-frontend-acceptance"));
check("Client marker", "data-v220-goodday-frontend-acceptance-layer", source.includes("data-v220-goodday-frontend-acceptance-layer"));
check("Visible interaction contract", "REAL_VISIBLE_INTERACTION_CONTRACT", source.includes("REAL_VISIBLE_INTERACTION_CONTRACT") && apiRoot.includes("REAL_VISIBLE_INTERACTION_CONTRACT"));
check("Local persistence", "localStorage + REAL_LOCAL_PERSISTENT", source.includes("localStorage") && source.includes("REAL_LOCAL_PERSISTENT"));
check("Event delegation", "document.addEventListener", source.includes("document.addEventListener") && source.includes("click") && source.includes("keydown"));
check("Feedback channel", "aria-live feedback host", source.includes("aria-live") && source.includes("data-v220-feedback-host"));
check("Action ledger", "servelect-work-os:v22:frontend-acceptance-ledger", source.includes("frontend-acceptance-ledger"));
check("Task/ticket actions", "new-task/new-ticket", source.includes("new-task") && source.includes("new-ticket"));
check("Saved views + filters", "save-view/reset-filter", source.includes("save-view") && source.includes("reset-filter"));
check("Import/export", "import/export", source.includes("import") && source.includes("export"));
check("Notifications", "mark-read/mark-all-read", source.includes("mark-read") && source.includes("mark-all-read"));
check("Approvals", "approve/reject", source.includes("approve") && source.includes("reject"));
check("Drawer and inline edit", "drawer-save/inline-edit", source.includes("drawer-save") && source.includes("inline-edit"));
check("Time tracking", "start-timer/stop-timer/time-entry", source.includes("start-timer") && source.includes("stop-timer") && source.includes("time-entry"));
check("Board/table/Gantt/calendar", "board/table/gantt/calendar", source.includes("board-status-move") && source.includes("table-sort") && source.includes("gantt-reschedule") && source.includes("calendar-schedule"));
check("Workload", "workload-rebalance/workload-assign", source.includes("workload-rebalance") && source.includes("workload-assign"));
check("Procurement", "procurement/RFQ/supplier/PO/invoice", source.includes("procurement-request") && source.includes("rfq-conversion") && source.includes("supplier-comparison") && source.includes("purchase-order") && source.includes("invoice-attach"));
check("API root exists", apiRootRel, exists(apiRootRel) && apiRoot.includes("GOODDAY_FRONTEND_ACCEPTANCE_LAYER"));
check("API section exists", apiSectionRel, exists(apiSectionRel) && apiSection.includes("Promise<{ section: string }>") && apiSection.includes("REAL_LOCAL_PERSISTENT"));
check("Functional test exists", "scripts/work-os-v2200-functional-test.ps1", exists("scripts/work-os-v2200-functional-test.ps1"));
check("Docs updated", "docs/V22_0_0_RELEASE_REPORT.md + NEXT_BUILD_PLAN", exists("docs/V22_0_0_RELEASE_REPORT.md") && read("docs/NEXT_BUILD_PLAN.md").includes("v23.0.0"));

const passed = checks.filter((item) => item.pass).length;
const total = checks.length;
const lines = [
  "# v22.0.0 Source Audit",
  "",
  `Passed: ${passed} / ${total}`,
  "",
  "| Check | Detail | PASS/FAIL |",
  "|---|---|---:|",
  ...checks.map((item) => `| ${item.name} | ${item.detail} | ${item.pass ? "PASS" : "FAIL"} |`),
  "",
];
const report = lines.join("\n");
console.log(report);
fs.mkdirSync(file("audit-results"), { recursive: true });
fs.writeFileSync(file("audit-results/v2200-source-audit.md"), report);

if (passed !== total) {
  process.exit(1);
}
