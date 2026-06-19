import fs from "fs";
import path from "path";

const root = process.cwd();
const component = path.join(root, "apps/web/components/tasks/V160RealProviderMutationTaskuriWorkspace.tsx");
const apiRoot = path.join(root, "apps/web/app/api/v1/work-os/v160-real-provider-mutation-taskuri/route.ts");
const nextPlan = path.join(root, "docs/NEXT_BUILD_PLAN.md");

const checks = [
  [component, "data-v160-real-provider-mutation"],
  [component, "REAL_PROVIDER_MUTATION_ADAPTER"],
  [component, "DRAG_DROP_PERSISTENCE"],
  [component, "GANTT_RESCHEDULE_ENGINE"],
  [component, "RBAC_BROWSER_QA"],
  [component, "productionReadiness 70% → 100%"],
  [component, "localStorage.setItem"],
  [component, "onDrop"],
  [component, "Reschedule +1 day"],
  [component, "Switch role Viewer"],
  [component, "Rollback last mutation"],
  [apiRoot, "productionReadiness"],
  [apiRoot, "currentPercent: 100"],
  [nextPlan, "v16.0.0"],
  [nextPlan, "v17.0.0"]
];

const failures = [];
for (const [file, needle] of checks) {
  if (!fs.existsSync(file)) {
    failures.push(`Missing file: ${file}`);
    continue;
  }
  const text = fs.readFileSync(file, "utf8");
  if (!text.includes(needle)) failures.push(`Missing marker ${needle} in ${file}`);
}

const taskuriRoot = path.join(root, "apps/web/app/taskuri");
let bound = 0;
let unbound = [];
if (fs.existsSync(taskuriRoot)) {
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      if (entry.isFile() && entry.name === "page.tsx") {
        const text = fs.readFileSync(full, "utf8");
        if (text.includes("V160RealProviderMutationTaskuriWorkspace")) bound += 1;
        else unbound.push(path.relative(root, full));
      }
    }
  };
  walk(taskuriRoot);
} else {
  failures.push("Missing taskuri root");
}
if (bound < 20) failures.push(`Expected at least 20 Taskuri pages rebound to V160, got ${bound}`);
if (unbound.length) failures.push(`Unbound taskuri page(s): ${unbound.slice(0, 20).join(", ")}`);

const report = [
  "# v16.0.0 Source Audit",
  "",
  `Taskuri pages rebound: ${bound}`,
  "",
  failures.length ? "FAIL" : "PASS",
  "",
  ...failures.map((failure) => `- ${failure}`)
].join("\n");
fs.mkdirSync(path.join(root, "audit-results"), { recursive: true });
fs.writeFileSync(path.join(root, "audit-results", "v1600-source-audit.md"), report);
console.log(report);
if (failures.length) process.exit(1);
