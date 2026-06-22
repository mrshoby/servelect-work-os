import fs from "node:fs";
import path from "node:path";

const baseArgIndex = process.argv.findIndex((arg) => arg === "--baseUrl");
const baseUrl = baseArgIndex >= 0 ? process.argv[baseArgIndex + 1] : "https://servelect-work-os-web.vercel.app";
const root = process.cwd();

const routes = [
  "/taskuri",
  "/taskuri/board",
  "/taskuri/tabel",
  "/taskuri/inbox",
  "/taskuri/workload",
  "/taskuri/calendar-gantt",
  "/taskuri/timesheets",
];

const results = [];

for (const route of routes) {
  try {
    const response = await fetch(`${baseUrl}${route}`);
    const html = await response.text();
    results.push({
      route,
      status: response.status,
      hasV15: html.includes("data-v150-goodday-structural-parity"),
      hasV200: html.includes("data-v200-goodday-complete-interaction-layer"),
      hasV210: html.includes("data-v210-goodday-real-mutation-bridge"),
      hasV220: html.includes("data-v220-goodday-frontend-acceptance"),
      badShell: html.includes("Taskuri Workspace") || html.includes("WORKSPACE HIERARCHY") || html.includes("data-v160-real-provider-mutation"),
    });
  } catch (error) {
    results.push({ route, error: String(error), hasV220: false, badShell: true });
  }
}

const passed = results.filter((item) => item.status === 200 && item.hasV15 && item.hasV200 && item.hasV210 && item.hasV220 && !item.badShell).length;
const total = results.length;
const lines = [
  "# v22.0.0 Browser Functional Flow Audit",
  "",
  `BaseUrl: ${baseUrl}`,
  `Passed: ${passed} / ${total}`,
  "",
  "| Route | Status | V15 | V200 | V210 | V220 | Bad shell absent | PASS/FAIL |",
  "|---|---:|---:|---:|---:|---:|---:|---:|",
  ...results.map((item) => {
    const pass = item.status === 200 && item.hasV15 && item.hasV200 && item.hasV210 && item.hasV220 && !item.badShell;
    return `| ${item.route} | ${item.status ?? "ERR"} | ${item.hasV15 ? "YES" : "NO"} | ${item.hasV200 ? "YES" : "NO"} | ${item.hasV210 ? "YES" : "NO"} | ${item.hasV220 ? "YES" : "NO"} | ${!item.badShell ? "YES" : "NO"} | ${pass ? "PASS" : "FAIL"} |`;
  }),
  "",
];
const report = lines.join("\n");
console.log(report);
fs.mkdirSync(path.join(root, "audit-results"), { recursive: true });
fs.writeFileSync(path.join(root, "audit-results/v2200-browser-functional-flow-audit.md"), report);

if (passed !== total) {
  process.exit(1);
}
