import fs from "node:fs";

const required = [
  ["apps/web/app/taskuri/layout.tsx", "V180ProcurementFlowRuntime"],
  ["apps/web/app/taskuri/layout.tsx", "V171V15InPlaceFunctionalRuntime"],
  ["apps/web/components/procurement/V180ProcurementFlowRuntime.tsx", "data-v180-procurement-functional-flow"],
  ["apps/web/components/procurement/V180ProcurementFlowRuntime.tsx", "servelect:v18:procurement-flow"],
  ["apps/web/components/procurement/V180ProcurementFlowRuntime.tsx", "createRequest"],
  ["apps/web/components/procurement/V180ProcurementFlowRuntime.tsx", "convertToRfq"],
  ["apps/web/components/procurement/V180ProcurementFlowRuntime.tsx", "generatePurchaseOrder"],
  ["apps/web/components/procurement/V180ProcurementFlowRuntime.tsx", "attachWarranty"],
  ["apps/web/app/api/v1/work-os/v180-procurement-flow/route.ts", "PROCUREMENT_COSTURI_ACHIZITII_BUGETARE_FULL_FLOW_ON_V15_BASELINE"],
  ["docs/NEXT_BUILD_PLAN.md", "v19.0.0"]
];

const forbidden = [
  ["apps/web/app/taskuri/layout.tsx", "Taskuri Workspace"],
  ["apps/web/app/taskuri/layout.tsx", "WORKSPACE HIERARCHY"],
  ["apps/web/components/procurement/V180ProcurementFlowRuntime.tsx", "data-v170-goodday-functional-parity"]
];

const rows = [];
let ok = true;
for (const [file, marker] of required) {
  const text = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  const pass = text.includes(marker);
  if (!pass) ok = false;
  rows.push({ file, marker, result: pass ? "PASS" : "FAIL" });
}
for (const [file, marker] of forbidden) {
  const text = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  const pass = !text.includes(marker);
  if (!pass) ok = false;
  rows.push({ file, marker: `forbidden:${marker}`, result: pass ? "PASS" : "FAIL" });
}

fs.mkdirSync("audit-results", { recursive: true });
const report = [
  "# v18.0.0 Source Audit",
  "",
  "| File | Marker | PASS/FAIL |",
  "|---|---|---:|",
  ...rows.map((row) => `| ${row.file} | ${row.marker.replaceAll("|", "\\|")} | ${row.result} |`),
  "",
  `Passed: ${rows.filter((row) => row.result === "PASS").length} / ${rows.length}`
].join("\n");
fs.writeFileSync("audit-results/v1800-source-audit.md", report);
console.log(report);
if (!ok) process.exit(1);
