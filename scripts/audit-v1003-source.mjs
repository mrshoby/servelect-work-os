import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const tablePage = path.join(root, "apps/web/app/taskuri/table/page.tsx");
const apiRoot = path.join(root, "apps/web/app/api/v1/work-os/v100-goodday-ui-functional-parity/route.ts");
const requiredSubroutes = ["health", "routes", "scores", "buttons", "flows", "readiness"];
const failures = [];

if (!fs.existsSync(tablePage)) {
  failures.push("missing /taskuri/table page.tsx");
} else {
  const text = fs.readFileSync(tablePage, "utf8");
  if (text.includes("V100GoodDayTaskuriMatureWorkspace")) failures.push("/taskuri/table still imports missing V100 component");
  if (!text.includes("redirect(\"/taskuri/tabel\")")) failures.push("/taskuri/table does not redirect to /taskuri/tabel");
}

if (!fs.existsSync(apiRoot)) failures.push("missing v100 API root route");
for (const name of requiredSubroutes) {
  const route = path.join(root, `apps/web/app/api/v1/work-os/v100-goodday-ui-functional-parity/${name}/route.ts`);
  if (!fs.existsSync(route)) failures.push(`missing v100 API subroute: ${name}`);
}

const forbidden = ["STATIC_UI", "separate demo", "demo app", "GoodDay logo", "GoodDay asset"];
for (const rel of [
  "apps/web/app/taskuri/table/page.tsx",
  "apps/web/app/api/v1/work-os/v100-goodday-ui-functional-parity/route.ts",
]) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  for (const token of forbidden) {
    if (text.includes(token)) failures.push(`forbidden marker ${token} in ${rel}`);
  }
}

if (failures.length) throw new Error(`v10.0.3 source audit failed: ${failures.join("; ")}`);
console.log("PASS: v10.0.3 table/API build source audit clean");
