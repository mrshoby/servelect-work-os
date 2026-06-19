import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourcePath = path.join(root, "apps/web/components/tasks/V120SingleSidebarTaskuriWorkspace.tsx");
const source = fs.readFileSync(sourcePath, "utf8");
const checks = [
  ["createTask", "New Task handler"],
  ["createTicket", "New Ticket handler"],
  ["saveView", "Save View handler"],
  ["exportCsv", "Export CSV handler"],
  ["bulkStatus", "Bulk Action handler"],
  ["updateTask", "Task update handler"],
  ["addComment", "Add comment handler"],
  ["toggleChecklist", "Checklist handler"],
  ["convertTicket", "Convert ticket handler"],
  ["markNotification", "Read/unread notification handler"],
  ["approve", "Approve/reject handler"],
  ["attachFile", "Attach file handler"],
  ["setActiveTimer", "Timer handler"],
  ["localStorage.setItem", "Persistence writer"],
  ["localStorage.getItem", "Persistence reader"],
];
const failures = checks.filter(([marker]) => !source.includes(marker)).map(([, label]) => label);
const reportDir = path.join(root, "audit-results");
fs.mkdirSync(reportDir, { recursive: true });
const reportPath = path.join(reportDir, "v1200-interactive-flow-audit.md");
if (failures.length) {
  fs.writeFileSync(reportPath, `# v12.0.0 Interactive Flow Audit\n\nFAIL\n\n${failures.map((f) => `- ${f}`).join("\n")}\n`);
  throw new Error(`v12.0.0 interactive flow audit failed: ${failures.join("; ")}`);
}
fs.writeFileSync(reportPath, `# v12.0.0 Interactive Flow Audit\n\nPASS\n\nChecked: ${checks.length} / ${checks.length}\n`);
console.log(`PASS: v12.0.0 interactive flow source audit clean (${checks.length} / ${checks.length})`);
console.log(`Report: ${reportPath}`);
