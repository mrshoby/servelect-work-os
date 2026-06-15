import fs from "node:fs";
import path from "node:path";

const required = [
  "apps/web/app/taskuri/provider-dispatch-ledger-v92/page.tsx",
  "apps/web/app/taskuri/webhook-intake-ledger-v92/page.tsx",
  "apps/web/app/taskuri/task-mutation-pilot-v92/page.tsx",
  "apps/web/app/taskuri/dead-letter-ledger-v92/page.tsx",
  "apps/web/app/taskuri/task-object-model-v92/page.tsx",
  "apps/web/app/taskuri/activity-stream-v92/page.tsx",
  "apps/web/app/admin/provider-ledger-governance-v92/page.tsx",
  "apps/web/app/api/v1/work-os/v92-provider-ledger-task-mutation-pilot/route.ts",
  "apps/web/components/tasks/V92ProviderLedgerTaskMutationPilot.tsx",
  "apps/web/lib/enterprise/work-os-v92-provider-ledger-task-mutation-pilot.ts"
];

const forbiddenFiles = [
  "apps/web/app/work-os/v92-provider-ledger-task-mutation-pilot/page.tsx",
  "apps/web/app/demo/v92-provider-ledger-task-mutation-pilot/page.tsx",
  "apps/web/app/goodday/page.tsx"
];

const errors = [];

for (const file of required) {
  if (!fs.existsSync(file)) errors.push(`Missing required file: ${file}`);
}

for (const file of forbiddenFiles) {
  if (fs.existsSync(file)) errors.push(`Forbidden separate/demo route exists: ${file}`);
}

const scanned = required.filter((file) => fs.existsSync(file));
for (const file of scanned) {
  const text = fs.readFileSync(file, "utf8");
  if (/hidden\s+w-72/.test(text)) errors.push(`Legacy internal sidebar class found in ${file}`);
  if (/Provider Canary\s*\/\s*ACL\s*\/\s*Primary Pilot/i.test(text)) errors.push(`Legacy provider label found in ${file}`);
  if (/v7\.9\.0/i.test(text)) errors.push(`Legacy v7.9.0 label found in ${file}`);
  if (/standalone\s+demo|demo\s+separat|separate\s+demo/i.test(text)) errors.push(`Demo wording found in production source ${file}`);
}

fs.mkdirSync("audit-results", { recursive: true });
const reportPath = path.join("audit-results", "v920-goodday-task-execution-source-audit.md");

if (errors.length) {
  fs.writeFileSync(reportPath, `# v9.2.0 Provider Ledger Source Audit\n\nFAIL\n\n${errors.map((e) => `- ${e}`).join("\n")}\n`, "utf8");
  console.error(errors.join("\n"));
  process.exit(1);
}

fs.writeFileSync(reportPath, "# v9.2.0 Provider Ledger Source Audit\n\nPASS\n", "utf8");
console.log("PASS: v9.2.0 Provider Ledger source audit clean");
console.log(`Report: ${path.resolve(reportPath)}`);
