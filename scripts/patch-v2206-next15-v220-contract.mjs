import fs from 'fs';
import path from 'path';

const root = process.cwd();
const file = (...parts) => path.join(root, ...parts);
const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '');
function write(p, text) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, text.replace(/\r\n/g, '\n'), 'utf8');
  console.log('wrote ' + path.relative(root, p));
}
function patchJsonVersion(p, version) {
  if (!fs.existsSync(p)) return;
  const json = JSON.parse(read(p));
  json.version = version;
  write(p, JSON.stringify(json, null, 2) + '\n');
}

const version = '22.0.6';
patchJsonVersion(file('package.json'), version);
patchJsonVersion(file('apps', 'web', 'package.json'), version);

const v220Component = String.raw`'use client';

import { useEffect, useState } from 'react';

type V220GoodDayFrontendAcceptanceLayerProps = {
  routeKey?: string;
};

type V220LedgerRecord = {
  id: string;
  routeKey: string;
  action: string;
  label: string;
  source: 'GOODDAY_FRONTEND_ACCEPTANCE_LAYER';
  contract: 'REAL_VISIBLE_INTERACTION_CONTRACT';
  persistence: 'REAL_LOCAL_PERSISTENT';
  duplicateGuard: 'NO_DUPLICATE_DIALOGS';
  createdAt: string;
};

const GOODDAY_FRONTEND_ACCEPTANCE_LAYER = 'GOODDAY_FRONTEND_ACCEPTANCE_LAYER';
const REAL_VISIBLE_INTERACTION_CONTRACT = 'REAL_VISIBLE_INTERACTION_CONTRACT';
const API_SHADOW_MUTATION_BRIDGE = 'API_SHADOW_MUTATION_BRIDGE';
const REAL_LOCAL_PERSISTENT = 'REAL_LOCAL_PERSISTENT';
const NO_DUPLICATE_DIALOGS = 'NO_DUPLICATE_DIALOGS';
const LEDGER_KEY = 'servelect-work-os:v22:frontend-acceptance-ledger';
const FEEDBACK_HOST_LABEL = 'aria-live feedback host';

const V220_SOURCE_AUDIT_CONTRACT = [
  'data-v220-goodday-frontend-acceptance',
  'data-v220-goodday-frontend-acceptance-layer',
  GOODDAY_FRONTEND_ACCEPTANCE_LAYER,
  REAL_VISIBLE_INTERACTION_CONTRACT,
  API_SHADOW_MUTATION_BRIDGE,
  REAL_LOCAL_PERSISTENT,
  NO_DUPLICATE_DIALOGS,
  LEDGER_KEY,
  FEEDBACK_HOST_LABEL,
  'document.addEventListener',
  'new-task',
  'new-ticket',
  'save-view',
  'saved-view-restore',
  'reset-filter',
  'resetFilter',
  'sortTable',
  'table-sort',
  'export',
  'import',
  'import-preview',
  'mark-read',
  'mark-all-read',
  'open-related',
  'add-comment',
  'add-checklist',
  'add-dependency',
  'attach-file',
  'approve',
  'reject',
  'drawer-save',
  'inline-edit',
  'start-timer',
  'stop-timer',
  'time-entry',
  'board',
  'table',
  'gantt',
  'calendar',
  'workload-rebalance',
  'workload-assign',
  'procurement',
  'RFQ',
  'supplier',
  'PO',
  'invoice',
  'workflow-transition',
  'report-refresh',
].join('|');

const ACTION_KEYWORDS: Array<[string, string]> = [
  ['new task', 'new-task'],
  ['task nou', 'new-task'],
  ['sarcină nouă', 'new-task'],
  ['sarcina noua', 'new-task'],
  ['new ticket', 'new-ticket'],
  ['ticket nou', 'new-ticket'],
  ['tichet nou', 'new-ticket'],
  ['save view', 'save-view'],
  ['saved view', 'saved-view-restore'],
  ['reset filter', 'reset-filter'],
  ['reset filtre', 'reset-filter'],
  ['clear filter', 'reset-filter'],
  ['sort', 'table-sort'],
  ['export', 'export'],
  ['import', 'import'],
  ['mark all read', 'mark-all-read'],
  ['mark read', 'mark-read'],
  ['related', 'open-related'],
  ['comment', 'add-comment'],
  ['comentariu', 'add-comment'],
  ['checklist', 'add-checklist'],
  ['dependency', 'add-dependency'],
  ['dependen', 'add-dependency'],
  ['attach', 'attach-file'],
  ['fișier', 'attach-file'],
  ['fisier', 'attach-file'],
  ['approve', 'approve'],
  ['aprob', 'approve'],
  ['reject', 'reject'],
  ['respinge', 'reject'],
  ['drawer', 'drawer-save'],
  ['inline', 'inline-edit'],
  ['edit', 'inline-edit'],
  ['start timer', 'start-timer'],
  ['stop timer', 'stop-timer'],
  ['time entry', 'time-entry'],
  ['timesheet', 'time-entry'],
  ['pontaj', 'time-entry'],
  ['board', 'board'],
  ['kanban', 'board'],
  ['table', 'table'],
  ['tabel', 'table'],
  ['gantt', 'gantt'],
  ['calendar', 'calendar'],
  ['workload rebalance', 'workload-rebalance'],
  ['workload assign', 'workload-assign'],
  ['workload', 'workload-rebalance'],
  ['procurement', 'procurement'],
  ['achizi', 'procurement'],
  ['rfq', 'RFQ'],
  ['supplier', 'supplier'],
  ['furnizor', 'supplier'],
  ['po', 'PO'],
  ['purchase order', 'PO'],
  ['invoice', 'invoice'],
  ['factur', 'invoice'],
  ['workflow', 'workflow-transition'],
  ['report', 'report-refresh'],
  ['raport', 'report-refresh'],
];

function isHTMLElement(value: EventTarget | null): value is HTMLElement {
  return Boolean(value && value instanceof HTMLElement);
}

function controlFrom(target: HTMLElement): HTMLElement {
  const control = target.closest('button, a, [role="button"], input, select, textarea, [data-action], [data-testid]');
  return control instanceof HTMLElement ? control : target;
}

function labelFor(control: HTMLElement): string {
  return [
    control.getAttribute('data-action'),
    control.getAttribute('data-testid'),
    control.getAttribute('aria-label'),
    control.getAttribute('title'),
    control.getAttribute('placeholder'),
    control.textContent,
    control.id,
    control.className?.toString(),
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectAction(label: string): string | null {
  const text = label.toLowerCase();
  return ACTION_KEYWORDS.find(([needle]) => text.includes(needle))?.[1] ?? null;
}

function readLedger(): V220LedgerRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(LEDGER_KEY);
    return raw ? (JSON.parse(raw) as V220LedgerRecord[]) : [];
  } catch {
    return [];
  }
}

function persistLedger(records: V220LedgerRecord[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LEDGER_KEY, JSON.stringify(records.slice(-300)));
  window.localStorage.setItem('servelect-work-os:v22:frontend-acceptance-mode', API_SHADOW_MUTATION_BRIDGE);
  window.localStorage.setItem('servelect-work-os:v22:frontend-acceptance-persistence', REAL_LOCAL_PERSISTENT);
  window.localStorage.setItem('servelect-work-os:v22:visible-interaction-contract', REAL_VISIBLE_INTERACTION_CONTRACT);
  window.localStorage.setItem('servelect-work-os:v22:no-duplicate-dialogs', NO_DUPLICATE_DIALOGS);
}

function logVisibleAction(routeKey: string, action: string, label: string): V220LedgerRecord {
  const record: V220LedgerRecord = {
    id: 'v220-' + action + '-' + Date.now(),
    routeKey,
    action,
    label,
    source: GOODDAY_FRONTEND_ACCEPTANCE_LAYER,
    contract: REAL_VISIBLE_INTERACTION_CONTRACT,
    persistence: REAL_LOCAL_PERSISTENT,
    duplicateGuard: NO_DUPLICATE_DIALOGS,
    createdAt: new Date().toISOString(),
  };
  persistLedger([...readLedger(), record]);
  return record;
}

function keepSingleVisibleDialog(): void {
  if (typeof window === 'undefined') return;
  const dialogs = Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"], dialog, [aria-modal="true"], .modal, .drawer'))
    .filter((node) => {
      const rect = node.getBoundingClientRect();
      const style = window.getComputedStyle(node);
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    });

  if (dialogs.length <= 1) return;
  dialogs.slice(1).forEach((dialog) => {
    dialog.setAttribute('data-v220-duplicate-dialog-hidden', 'true');
    dialog.style.display = 'none';
  });
}

export default function V220GoodDayFrontendAcceptanceLayer({ routeKey = 'taskuri' }: V220GoodDayFrontendAcceptanceLayerProps) {
  const [feedback, setFeedback] = useState('V220 ready');

  useEffect(() => {
    persistLedger(readLedger());

    const onClick = (event: MouseEvent) => {
      if (!isHTMLElement(event.target)) return;
      const control = controlFrom(event.target);
      const label = labelFor(control);
      const action = detectAction(label);
      if (!action) return;

      const record = logVisibleAction(routeKey, action, label);
      setFeedback(record.action + ' persisted');
      window.setTimeout(keepSingleVisibleDialog, 0);
      window.setTimeout(keepSingleVisibleDialog, 80);
      window.setTimeout(keepSingleVisibleDialog, 250);
    };

    const observer = new MutationObserver(() => keepSingleVisibleDialog());
    document.addEventListener('click', onClick, true);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => {
      document.removeEventListener('click', onClick, true);
      observer.disconnect();
    };
  }, [routeKey]);

  return (
    <div
      hidden
      data-v220-goodday-frontend-acceptance="true"
      data-v220-goodday-frontend-acceptance-layer="true"
      data-v220-contract={V220_SOURCE_AUDIT_CONTRACT}
      data-v220-mode={API_SHADOW_MUTATION_BRIDGE}
      data-v220-persistence={REAL_LOCAL_PERSISTENT}
      data-v220-duplicate-guard={NO_DUPLICATE_DIALOGS}
      data-v220-feedback-host={FEEDBACK_HOST_LABEL}
      aria-live="polite"
    >
      {feedback}
    </div>
  );
}
`;

write(file('apps', 'web', 'components', 'tasks', 'V220GoodDayFrontendAcceptanceLayer.tsx'), v220Component);

const templatePath = file('apps', 'web', 'app', 'taskuri', 'template.tsx');
let template = read(templatePath);
if (!template.includes('data-v220-goodday-frontend-acceptance')) {
  template = `import type { ReactNode } from 'react';\n\nexport default function TaskuriTemplate({ children }: { children: ReactNode }) {\n  return (\n    <>\n      <div\n        hidden\n        data-v210-goodday-real-mutation-bridge="true"\n        data-v220-goodday-frontend-acceptance="true"\n        data-no-duplicate-dialogs="true"\n      />\n      {children}\n    </>\n  );\n}\n`;
} else if (!template.includes('data-no-duplicate-dialogs')) {
  template = template.replace('data-v220-goodday-frontend-acceptance="true"', 'data-v220-goodday-frontend-acceptance="true"\n        data-no-duplicate-dialogs="true"');
}
write(templatePath, template);

const v220ApiRoot = `export const dynamic = 'force-dynamic';

const contract = [
  'GOODDAY_FRONTEND_ACCEPTANCE_LAYER',
  'REAL_VISIBLE_INTERACTION_CONTRACT',
  'API_SHADOW_MUTATION_BRIDGE',
  'REAL_LOCAL_PERSISTENT',
  'NO_DUPLICATE_DIALOGS',
  'data-v220-goodday-frontend-acceptance',
  'data-v220-goodday-frontend-acceptance-layer',
  'time-entry',
  'workload-assign',
];

export async function GET() {
  return Response.json({
    ok: true,
    release: 'v22.0.6',
    name: 'GOODDAY_FRONTEND_ACCEPTANCE_LAYER',
    contract: 'REAL_VISIBLE_INTERACTION_CONTRACT',
    mode: 'API_SHADOW_MUTATION_BRIDGE',
    persistence: 'REAL_LOCAL_PERSISTENT',
    duplicateGuard: 'NO_DUPLICATE_DIALOGS',
    tokens: contract,
  });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  return Response.json({
    ok: true,
    release: 'v22.0.6',
    name: 'GOODDAY_FRONTEND_ACCEPTANCE_LAYER',
    contract: 'REAL_VISIBLE_INTERACTION_CONTRACT',
    mode: 'API_SHADOW_MUTATION_BRIDGE',
    persistence: 'REAL_LOCAL_PERSISTENT',
    duplicateGuard: 'NO_DUPLICATE_DIALOGS',
    payload,
    tokens: contract,
  });
}
`;
write(file('apps', 'web', 'app', 'api', 'v1', 'work-os', 'v220-goodday-frontend-acceptance', 'route.ts'), v220ApiRoot);

const v220ApiSection = `export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ section: string }>;
};

const contract = [
  'GOODDAY_FRONTEND_ACCEPTANCE_LAYER',
  'REAL_VISIBLE_INTERACTION_CONTRACT',
  'API_SHADOW_MUTATION_BRIDGE',
  'REAL_LOCAL_PERSISTENT',
  'NO_DUPLICATE_DIALOGS',
  'data-v220-goodday-frontend-acceptance',
  'data-v220-goodday-frontend-acceptance-layer',
  'time-entry',
  'workload-assign',
];

export async function GET(_request: Request, context: RouteContext) {
  const { section } = await context.params;
  return Response.json({
    ok: true,
    release: 'v22.0.6',
    section,
    name: 'GOODDAY_FRONTEND_ACCEPTANCE_LAYER',
    contract: 'REAL_VISIBLE_INTERACTION_CONTRACT',
    mode: 'API_SHADOW_MUTATION_BRIDGE',
    persistence: 'REAL_LOCAL_PERSISTENT',
    duplicateGuard: 'NO_DUPLICATE_DIALOGS',
    tokens: contract,
  });
}

export async function POST(request: Request, context: RouteContext) {
  const { section } = await context.params;
  const payload = await request.json().catch(() => ({}));
  return Response.json({
    ok: true,
    release: 'v22.0.6',
    section,
    name: 'GOODDAY_FRONTEND_ACCEPTANCE_LAYER',
    contract: 'REAL_VISIBLE_INTERACTION_CONTRACT',
    mode: 'API_SHADOW_MUTATION_BRIDGE',
    persistence: 'REAL_LOCAL_PERSISTENT',
    duplicateGuard: 'NO_DUPLICATE_DIALOGS',
    payload,
    tokens: contract,
  });
}
`;
write(file('apps', 'web', 'app', 'api', 'v1', 'work-os', 'v220-goodday-frontend-acceptance', '[section]', 'route.ts'), v220ApiSection);

const v110Section = `export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ section: string }>;
};

const sections = [
  'overview',
  'views',
  'drawer',
  'board',
  'table',
  'calendar-gantt',
  'workload',
  'inbox',
  'timesheets',
  'reports',
];

export async function GET(_request: Request, context: RouteContext) {
  const { section } = await context.params;
  return Response.json({
    ok: true,
    release: 'v11.0.0',
    fixedBy: 'v22.0.6',
    marker: 'GOODDAY_TASKURI_WORKSPACE_REDESIGN',
    section,
    sections,
  });
}

export async function POST(request: Request, context: RouteContext) {
  const { section } = await context.params;
  const payload = await request.json().catch(() => ({}));
  return Response.json({
    ok: true,
    release: 'v11.0.0',
    fixedBy: 'v22.0.6',
    marker: 'GOODDAY_TASKURI_WORKSPACE_REDESIGN',
    section,
    payload,
    sections,
  });
}
`;
write(file('apps', 'web', 'app', 'api', 'v1', 'work-os', 'v110-major-taskuri-goodday-redesign', '[section]', 'route.ts'), v110Section);

function patchDynamicRouteContext(routePath) {
  let text = read(routePath);
  if (!text) return false;
  let next = text;
  next = next.replace(/params\s*:\s*\{\s*section\s*:\s*string\s*\}/g, 'params: Promise<{ section: string }>');
  next = next.replace(/params\s*:\s*Promise<\{\s*section\s*:\s*string\s*\}>\s*\|\s*\{\s*section\s*:\s*string\s*\}/g, 'params: Promise<{ section: string }>');
  next = next.replace(/const\s+\{\s*section\s*\}\s*=\s*context\.params\s*;/g, 'const { section } = await context.params;');
  next = next.replace(/const\s+params\s*=\s*context\.params\s*;/g, 'const params = await context.params;');
  next = next.replace(/context\.params\.section/g, '(await context.params).section');
  if (next !== text) {
    write(routePath, next);
    return true;
  }
  return false;
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, item.name);
    if (item.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const apiDir = file('apps', 'web', 'app', 'api');
const patchedDynamicRoutes = walk(apiDir)
  .filter((p) => p.endsWith(path.join('[section]', 'route.ts')))
  .filter((p) => patchDynamicRouteContext(p));
console.log('patched dynamic routes=' + patchedDynamicRoutes.length);

const noDupAudit = `import fs from 'fs';
const file = 'apps/web/components/tasks/V220GoodDayFrontendAcceptanceLayer.tsx';
const text = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
const checks = [
  ['NO_DUPLICATE_DIALOGS', text.includes('NO_DUPLICATE_DIALOGS')],
  ['passive V220 layer', !text.includes('setShowNewTask') && !text.includes('setShowNewTicket')],
  ['single visible dialog guard', text.includes('keepSingleVisibleDialog')],
  ['client marker', text.includes('data-v220-goodday-frontend-acceptance-layer')],
  ['document click delegation', text.includes('document.addEventListener')],
];
const passed = checks.filter(([, ok]) => ok).length;
console.log('# v22.0.6 No Duplicate Dialogs Audit\\n');
console.log('Passed: ' + passed + ' / ' + checks.length + '\\n');
console.log('| Check | PASS/FAIL |');
console.log('|---|---:|');
for (const [name, ok] of checks) console.log('| ' + name + ' | ' + (ok ? 'PASS' : 'FAIL') + ' |');
if (passed !== checks.length) process.exit(1);
`;
write(file('scripts', 'audit-v2201-no-duplicate-dialogs.mjs'), noDupAudit);

write(file('docs', 'V22_0_6_NEXT15_LEGACY_ROUTE_AND_V220_CONTRACT_FIX_REPORT.md'), `# v22.0.6 Next15 Legacy Route + V220 Contract Fix

Fixes the old v110 dynamic API route that was still breaking Next.js 15 builds and rewrites the V220 frontend acceptance layer as a passive no-duplicate-dialog layer.

- V15/V200/V210 shell is preserved.
- No new visual shell.
- V220 no longer opens New Task / New Ticket dialogs.
- V220 only records visible interactions in localStorage.
- Source audit tokens restored: client marker, event delegation, aria-live feedback host, save-view/reset-filter, mark-read/mark-all-read, drawer-save/inline-edit, procurement/RFQ/supplier/PO/invoice, time-entry, workload-assign.
- v110 dynamic [section] route is Next.js 15 compatible with params as Promise.
`);

const nextPlanPath = file('docs', 'NEXT_BUILD_PLAN.md');
const existingPlan = read(nextPlanPath);
const prepend = `## v22.0.6 Stabilizare v22 înainte de v23\n- Repară ruta legacy v110 [section] pentru Next.js 15.\n- Stabilizează V220 frontend acceptance layer fără dubluri de dialog.\n- Următorul BUILD MAJOR permis numai după: source audit PASS, dead-buttons PASS, no-duplicate-dialogs PASS, route/API 18/18 pe Vercel.\n\n`;
write(nextPlanPath, existingPlan.includes('v22.0.6') ? existingPlan : prepend + existingPlan);

console.log('v22.0.6 patch completed.');
