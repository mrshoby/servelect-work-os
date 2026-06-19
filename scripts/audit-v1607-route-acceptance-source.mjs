import fs from "fs";
import path from "path";

const repo = process.cwd();
const componentPath = path.join(repo, "apps", "web", "components", "tasks", "V160RealProviderMutationTaskuriWorkspace.tsx");
const source = fs.readFileSync(componentPath, "utf8");
const checks = [
  ["component version label", "v16.0.7"],
  ["raw acceptance function", "function routeAcceptanceHtml(family: PageFamily)"],
  ["raw acceptance panel", "data-v1607-route-acceptance-raw"],
  ["route panel rendered", "<RouteAcceptancePanel family={family} />"],
  ["inbox acceptance", "Inbox & Action Required"],
  ["active project acceptance", "Delivery portfolio"],
  ["workload acceptance", "Capacity planner"],
  ["route visual marker", "data-v160-route-specific-visual"],
  ["provider mutation marker", "data-v160-real-provider-mutation"]
];
const rows = checks.map(([name, marker]) => ({ name, marker, pass: source.includes(marker) }));
const passed = rows.filter((row) => row.pass).length;
const report = [
  "# v16.0.7 Route Acceptance Source Audit",
  "",
  "| Check | Marker | PASS/FAIL |",
  "|---|---|---:|",
  ...rows.map((row) => `| ${row.name} | \`${row.marker.replaceAll("|", "\\|")}\` | ${row.pass ? "PASS" : "FAIL"} |`),
  "",
  `Passed: ${passed} / ${rows.length}`
].join("\n");
const out = path.join(repo, "audit-results", "v1607-route-acceptance-source-audit.md");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, report, "utf8");
console.log(report);
if (passed !== rows.length) throw new Error(`v16.0.7 source audit failed: ${passed}/${rows.length}`);
