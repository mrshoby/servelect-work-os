import fs from "fs";
import path from "path";

const root = process.cwd();
const routePath = path.join(root, "apps/web/app/api/v1/work-os/v110-major-taskuri-goodday-redesign/[section]/route.ts");
const reportDir = path.join(root, "audit-results");
fs.mkdirSync(reportDir, { recursive: true });
const reportPath = path.join(reportDir, "v1101-next15-route-context-source-audit.md");

const failures = [];
if (!fs.existsSync(routePath)) {
  failures.push("missing dynamic [section] route");
} else {
  const source = fs.readFileSync(routePath, "utf8");
  if (!source.includes("params: Promise")) failures.push("dynamic route context params is not Promise-based for Next.js 15");
  if (!source.includes("await context.params")) failures.push("dynamic route does not await context.params");
  if (source.includes("params: { section: string }")) failures.push("old non-Promise params signature still present");
  if (!source.includes("NextResponse.json")) failures.push("dynamic route does not return NextResponse.json");
}

const lines = [
  "# v11.0.1 Next.js 15 Route Context Source Audit",
  "",
  failures.length ? "FAIL" : "PASS",
  "",
  ...failures.map((failure) => `- ${failure}`),
];
fs.writeFileSync(reportPath, `${lines.join("\n")}\n`, "utf8");
if (failures.length) throw new Error(`v11.0.1 source audit failed: ${failures.join("; ")}`);
console.log(`PASS: v11.0.1 Next.js 15 route context source audit clean`);
console.log(`Report: ${reportPath}`);
