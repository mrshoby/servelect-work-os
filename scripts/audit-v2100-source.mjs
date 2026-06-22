import fs from "node:fs";
import path from "node:path";

const checks = [];
const repo = process.cwd();
function read(rel) { return fs.existsSync(path.join(repo, rel)) ? fs.readFileSync(path.join(repo, rel), "utf8") : ""; }
function exists(rel) { return fs.existsSync(path.join(repo, rel)); }
function add(name, detail, pass) { checks.push({ name, detail, pass: Boolean(pass) }); }

const v210 = read("apps/web/components/tasks/V210GoodDayRealMutationBridge.tsx");
const v150 = read("apps/web/components/tasks/V150GoodDayStructuralTaskuriWorkspace.tsx");
const api = read("apps/web/app/api/v1/work-os/v210-real-mutation-bridge/route.ts");
const apiSection = read("apps/web/app/api/v1/work-os/v210-real-mutation-bridge/[section]/route.ts");

add("V210 bridge exists", "apps/web/components/tasks/V210GoodDayRealMutationBridge.tsx", v210.includes("data-v210-goodday-real-mutation-bridge"));
add("V15 shell preserved", "data-v150-goodday-structural-parity", v150.includes("data-v150-goodday-structural-parity"));
add("No bad shell text", "no Taskuri Workspace / WORKSPACE HIERARCHY", !v210.includes("Taskuri Workspace") && !v210.includes("WORKSPACE HIERARCHY"));
add("V21 build marker", "GOODDAY_REAL_MUTATION_BRIDGE_ON_V15_V200_SHELL", v210.includes("GOODDAY_REAL_MUTATION_BRIDGE_ON_V15_V200_SHELL"));
add("API shadow bridge marker", "API_SHADOW_MUTATION_BRIDGE", v210.includes("API_SHADOW_MUTATION_BRIDGE") && api.includes("API_SHADOW_MUTATION_BRIDGE"));
add("Persistence marker", "REAL_LOCAL_PERSISTENT", v210.includes("REAL_LOCAL_PERSISTENT") && api.includes("REAL_LOCAL_PERSISTENT"));
add("Bridge exposes window API", "window.__servelectV210Bridge", v210.includes("__servelectV210Bridge"));
add("Delegated click handler", "addEventListener click", v210.includes("addEventListener(\"click\"") && v210.includes("delegatedClickHandler"));
add("Mutation persistence", "persistState + localStorage", v210.includes("persistState") && v210.includes("localStorage.setItem"));
add("Task creation action", "createWorkItem", v210.includes("createWorkItem"));
add("Saved views action", "saveView / restoreSavedView", v210.includes("saveView") && v210.includes("restoreSavedView"));
add("Filters and table sort actions", "resetFilter / sortTable", v210.includes("resetFilter") && v210.includes("sortTable"));
add("Workflow actions", "approve / reject / workflowTransition", v210.includes("approve") && v210.includes("reject") && v210.includes("workflowTransition"));
add("Time tracking actions", "startTimer / stopTimer", v210.includes("startTimer") && v210.includes("stopTimer"));
add("Board/Drawer/Workload actions", "boardStatusMove / drawerSave / workloadRebalance", v210.includes("boardStatusMove") && v210.includes("drawerSave") && v210.includes("workloadRebalance"));
add("Procurement actions", "procurementRequest / purchaseOrder / invoiceAttach", v210.includes("procurementRequest") && v210.includes("purchaseOrder") && v210.includes("invoiceAttach"));
add("API root exists", "v210 route.ts", exists("apps/web/app/api/v1/work-os/v210-real-mutation-bridge/route.ts") && api.includes("GOODDAY_REAL_MUTATION_BRIDGE_ON_V15_V200_SHELL"));
add("API section exists", "v210 [section]/route.ts", exists("apps/web/app/api/v1/work-os/v210-real-mutation-bridge/[section]/route.ts") && apiSection.includes("REAL_LOCAL_PERSISTENT"));

const taskuriPages = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    if (entry.isFile() && entry.name === "page.tsx") taskuriPages.push(full);
  }
}
walk(path.join(repo, "apps", "web", "app", "taskuri"));
const patched = taskuriPages.filter((file) => fs.readFileSync(file, "utf8").includes("V210GoodDayRealMutationBridge")).length;
add("Taskuri pages patched in-place", `${patched}/${taskuriPages.length}`, patched >= 17);
add("Docs exist", "v21 docs", exists("docs/V21_0_0_RELEASE_REPORT.md") && exists("docs/V21_0_0_PROGRESS_SCORECARD.md") && exists("docs/NEXT_BUILD_PLAN.md"));

const passed = checks.filter(c => c.pass).length;
let md = `# v21.0.0 Source Audit\n\nPassed: ${passed} / ${checks.length}\n\n| Check | Detail | PASS/FAIL |\n|---|---|---:|\n`;
for (const c of checks) md += `| ${c.name} | ${c.detail} | ${c.pass ? "PASS" : "FAIL"} |\n`;
fs.mkdirSync(path.join(repo, "audit-results"), { recursive: true });
fs.writeFileSync(path.join(repo, "audit-results", "v2100-source-audit.md"), md);
console.log(md);
if (passed !== checks.length) process.exit(1);
