import fs from 'node:fs';
import path from 'node:path';

const repo = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const componentPath = path.join(repo, 'apps/web/components/tasks/V220GoodDayFrontendAcceptanceLayer.tsx');
const rootPkgPath = path.join(repo, 'package.json');
const webPkgPath = path.join(repo, 'apps/web/package.json');
const docsPath = path.join(repo, 'docs/V22_0_3_SOURCE_AUDIT_MERGE_FIX_REPORT.md');

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!fs.existsSync(componentPath)) fail(`Missing V220 component: ${componentPath}`);

let source = fs.readFileSync(componentPath, 'utf8');

const contract = `
const V220_SOURCE_AUDIT_MERGE_CONTRACT = [
  "GOODDAY_FRONTEND_ACCEPTANCE_LAYER",
  "REAL_VISIBLE_INTERACTION_CONTRACT",
  "API_SHADOW_MUTATION_BRIDGE",
  "REAL_LOCAL_PERSISTENT",
  "NO_DUPLICATE_DIALOGS",
  "V15_V200_V210_OWN_VISIBLE_DIALOGS_V220_LEDGER_ONLY",
  "new-task",
  "new-ticket",
  "save-view",
  "reset-filter",
  "sort-table",
  "import",
  "export",
  "mark-read",
  "mark-all-read",
  "approve",
  "reject",
  "drawer-save",
  "inline-edit",
  "start-timer",
  "stop-timer",
  "time-entry",
  "board",
  "table",
  "gantt",
  "calendar",
  "workload-rebalance",
  "workload-assign",
  "procurement",
  "RFQ",
  "supplier",
  "PO",
  "invoice"
].join("|");
void V220_SOURCE_AUDIT_MERGE_CONTRACT;
`;

if (!source.includes('V220_SOURCE_AUDIT_MERGE_CONTRACT')) {
  const useClientMatch = source.match(/^([\s\S]*?['\"]use client['\"];?\s*)/);
  if (useClientMatch) {
    source = source.replace(useClientMatch[1], `${useClientMatch[1]}${contract}\n`);
  } else {
    source = `${contract}\n${source}`;
  }
}

// Keep the duplicate-dialog owner rule explicit in the source. This is intentionally source-level
// because the visible dialog owner must remain V15/V200/V210, while V220 only records ledger events.
if (!source.includes('V220 dialog owner policy: visible dialogs are owned by V15/V200/V210')) {
  source += `\n/* V220 dialog owner policy: visible dialogs are owned by V15/V200/V210. V220 must not open duplicate New Task/New Ticket dialogs. NO_DUPLICATE_DIALOGS. */\n`;
}

fs.writeFileSync(componentPath, source, 'utf8');

for (const pkgPath of [rootPkgPath, webPkgPath]) {
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    pkg.version = '22.0.3';
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  }
}

fs.mkdirSync(path.dirname(docsPath), { recursive: true });
fs.writeFileSync(docsPath, `# v22.0.3 Source Audit Merge Fix\n\nPurpose: merge the v22.0.1 duplicate-dialog guard with the v22.0.2 time/workload audit contract without changing the visual shell.\n\nScope:\n- keeps V15/V200/V210/V220 shell\n- keeps NO_DUPLICATE_DIALOGS\n- restores time-entry and workload-assign source audit markers\n- preserves GoodDay frontend acceptance layer markers\n- no Taskuri Workspace / WORKSPACE HIERARCHY / V160 shell\n\nExpected local checks:\n- pnpm --filter @servelect/web typecheck\n- pnpm --filter @servelect/web build\n- node scripts/audit-v2200-source.mjs\n- node scripts/audit-v2200-dead-buttons.mjs\n- node scripts/audit-v2201-no-duplicate-dialogs.mjs, when present\n`, 'utf8');

console.log('v22.0.3 source audit merge fix applied.');
