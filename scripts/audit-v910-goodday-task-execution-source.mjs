import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const targets = ["apps/web/components/tasks/V91GoodDayTaskExecutionParity.tsx", "apps/web/lib/enterprise/work-os-v91-goodday-task-execution.ts", "apps/web/app/taskuri/workspace-command/page.tsx", "apps/web/app/taskuri/action-board/page.tsx", "apps/web/app/taskuri/task-detail-v91/page.tsx", "apps/web/app/admin/taskuri-workspace-governance/page.tsx"];
const stalePatterns = [/v7\.9\.0/i, /Provider Canary\s*\/\s*ACL\s*\/\s*Primary Pilot/i, /hidden\s+w-72/i, /<aside[^>]*bg-slate-950/i];
const required = ["Workspace Command Center", "Action Required", "Workload Planner", "Time Tracking", "Updates Stream", "Request Intake", "productionWrites"];
const failures = [];
for (const rel of targets) { const file = path.join(root, rel); if (!fs.existsSync(file)) { failures.push(`${rel}: missing`); continue; } const text = fs.readFileSync(file, "utf8"); for (const pattern of stalePatterns) { if (pattern.test(text)) failures.push(`${rel}: stale/internal-shell pattern ${pattern}`); } }
const combined = targets.map((rel) => fs.existsSync(path.join(root, rel)) ? fs.readFileSync(path.join(root, rel), "utf8") : "").join("\n");
for (const item of required) { if (!combined.includes(item)) failures.push(`missing required concept: ${item}`); }
fs.mkdirSync(path.join(root, "audit-results"), { recursive: true });
const report = ["# v9.1.0 GoodDay-like Task Execution Source Audit", "", failures.length ? "FAIL" : "PASS", "", ...failures.map((failure) => `- ${failure}`)].join("\n");
fs.writeFileSync(path.join(root, "audit-results", "v910-goodday-task-execution-source-audit.md"), report + "\n");
if (failures.length) { console.error(report); process.exit(1); }
console.log("PASS: v9.1.0 GoodDay-like Task Execution source audit clean");
