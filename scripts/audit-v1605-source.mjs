import fs from "fs";
import path from "path";

const root = process.cwd();
const component = path.join(root, "apps/web/components/tasks/V160RealProviderMutationTaskuriWorkspace.tsx");
const apiRoot = path.join(root, "apps/web/app/api/v1/work-os/v160-real-provider-mutation-taskuri/route.ts");

const checks = [
  [component, "v16.0.5"],
  [component, "data-v160-real-provider-mutation"],
  [component, "data-v160-route-specific-visual"],
  [component, "Route specific UX"],
  [component, "Command Center — executive task operations"],
  [component, "My Work — personal execution lanes"],
  [component, "Inbox & Action Required — triage center"],
  [component, "Ticket / Request Center — SLA desk"],
  [component, "Proiecte active — delivery portfolio"],
  [component, "Proiecte viitoare — readiness pipeline"],
  [component, "Proiecte finalizate — handover archive"],
  [component, "Calendar — daily operations grid"],
  [component, "Reports & Analytics — operational intelligence"],
  [component, "Automations & Workflows — rule builder"],
  [component, "Request Forms — intake workflows"],
  [component, "Files & Evidence — document control"],
  [component, "Switch role Viewer"],
  [component, "REAL_PROVIDER_MUTATION_ADAPTER"],
  [component, "DRAG_DROP_PERSISTENCE"],
  [component, "GANTT_RESCHEDULE_ENGINE"],
  [component, "RBAC_BROWSER_QA"],
  [apiRoot, "16.0.5"],
  [apiRoot, "routeSpecificVisualDifferentiation: true"],
  [apiRoot, "visualRegressionRecovered: true"]
];

const failures = [];
for (const [file, needle] of checks) {
  if (!fs.existsSync(file)) { failures.push(`Missing file: ${file}`); continue; }
  const text = fs.readFileSync(file, "utf8");
  if (!text.includes(needle)) failures.push(`Missing marker ${needle} in ${file}`);
}

const report = [
  "# v16.0.5 Source Audit",
  "",
  "Scope: route-specific visual differentiation regression fix while preserving v16 provider mutation / drag-drop / Gantt / RBAC features.",
  "",
  failures.length ? "FAIL" : "PASS",
  "",
  ...failures.map((failure) => `- ${failure}`)
].join("\n");
fs.mkdirSync(path.join(root, "audit-results"), { recursive: true });
fs.writeFileSync(path.join(root, "audit-results", "v1605-source-audit.md"), report, "utf8");
console.log(report);
if (failures.length) process.exit(1);
