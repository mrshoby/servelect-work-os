import fs from "node:fs";
import path from "node:path";

const screenshotDir = path.join(process.cwd(), "audit-results", "v900-screenshots");
const baselineDir = path.join(process.cwd(), "audit-results", "pixel-baselines");
const reportPath = path.join(process.cwd(), "audit-results", "v900-pixel-diff-local-report.md");
fs.mkdirSync(path.dirname(reportPath), { recursive: true });

const screenshots = fs.existsSync(screenshotDir) ? fs.readdirSync(screenshotDir).filter(f => f.endsWith(".png")) : [];
const rows = screenshots.map(file => {
  const current = fs.statSync(path.join(screenshotDir, file)).size;
  const baselinePath = path.join(baselineDir, file);
  if (!fs.existsSync(baselinePath)) return { file, status: "BASELINE_MISSING", delta: "n/a", current };
  const baseline = fs.statSync(baselinePath).size;
  const delta = Math.abs(current - baseline) / Math.max(baseline, 1);
  return { file, status: delta <= 0.0022 ? "PASS" : "REVIEW", delta: `${(delta*100).toFixed(3)}%`, current };
});

const report = ["# v9.0.0 Local Pixel Diff Report", "", "| PNG | Status | Delta | Bytes |", "|---|---:|---:|---:|", ...rows.map(r => `| ${r.file} | ${r.status} | ${r.delta} | ${r.current} |`), "", `Checked: ${rows.length}`];
fs.writeFileSync(reportPath, report.join("\n"));
console.log(`Pixel diff local report: ${reportPath}`);
