import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const targets = [
  "apps/web/app/taskuri/table/page.tsx",
  "apps/web/app/api/v1/work-os/v100-goodday-ui-functional-parity/route.ts",
  "apps/web/app/api/v1/work-os/v100-goodday-ui-functional-parity/health/route.ts",
  "apps/web/app/api/v1/work-os/v100-goodday-ui-functional-parity/routes/route.ts",
  "apps/web/app/api/v1/work-os/v100-goodday-ui-functional-parity/scores/route.ts",
  "apps/web/app/api/v1/work-os/v100-goodday-ui-functional-parity/buttons/route.ts",
  "apps/web/app/api/v1/work-os/v100-goodday-ui-functional-parity/flows/route.ts",
  "apps/web/app/api/v1/work-os/v100-goodday-ui-functional-parity/readiness/route.ts",
  "docs/NEXT_BUILD_PLAN.md",
  "docs/V10_0_1_ROUTE_API_HOTFIX_REPORT.md",
];

const forbidden = [
  "STATIC_UI",
  "separate demo",
  "GoodDay logo",
  "GoodDay asset",
  "v7.9.0",
  "Provider Canary",
  "Primary Pilot",
];

const failures = [];
for (const rel of targets) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) {
    failures.push(`missing file: ${rel}`);
    continue;
  }
  const text = fs.readFileSync(abs, "utf8");
  for (const marker of forbidden) {
    if (text.includes(marker)) failures.push(`${rel}: forbidden marker ${marker}`);
  }
}

if (failures.length) {
  throw new Error(`v10.0.1 source audit failed: ${failures.join("; ")}`);
}

console.log("PASS: v10.0.1 route/API hotfix source audit clean");
