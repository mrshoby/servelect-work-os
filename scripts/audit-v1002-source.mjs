import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const checks = [
  "apps/web/app/taskuri/table/page.tsx",
  "apps/web/app/api/v1/work-os/v100-goodday-ui-functional-parity/route.ts",
  "apps/web/app/api/v1/work-os/v100-goodday-ui-functional-parity/health/route.ts",
  "apps/web/app/api/v1/work-os/v100-goodday-ui-functional-parity/routes/route.ts",
  "apps/web/app/api/v1/work-os/v100-goodday-ui-functional-parity/scores/route.ts",
  "apps/web/app/api/v1/work-os/v100-goodday-ui-functional-parity/buttons/route.ts",
  "apps/web/app/api/v1/work-os/v100-goodday-ui-functional-parity/flows/route.ts",
  "apps/web/app/api/v1/work-os/v100-goodday-ui-functional-parity/readiness/route.ts",
];

const failures = [];
for (const rel of checks) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) failures.push(`missing ${rel}`);
}

const table = fs.existsSync(path.join(root, checks[0])) ? fs.readFileSync(path.join(root, checks[0]), "utf8") : "";
if (table.includes("import V100GoodDayTaskuriMatureWorkspace from")) {
  failures.push("/taskuri/table still uses default import for named component");
}
if (!table.includes("import { V100GoodDayTaskuriMatureWorkspace }")) {
  failures.push("/taskuri/table does not use named V100GoodDayTaskuriMatureWorkspace import");
}
if (!table.includes('initialView="tabel"')) {
  failures.push("/taskuri/table does not load the mature table/list view");
}

const forbidden = ["STATIC_UI", "separate demo", "demo app"];
for (const rel of checks) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  for (const token of forbidden) {
    if (text.includes(token)) failures.push(`${rel} contains forbidden marker ${token}`);
  }
}

if (failures.length) {
  throw new Error(`v10.0.2 source audit failed: ${failures.join("; ")}`);
}
console.log("PASS: v10.0.2 route/API + table import source audit clean");
