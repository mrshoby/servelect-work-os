import fs from 'fs';
const file = 'apps/web/components/tasks/V220GoodDayFrontendAcceptanceLayer.tsx';
const text = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
const checks = [
  ['NO_DUPLICATE_DIALOGS', text.includes('NO_DUPLICATE_DIALOGS')],
  ['passive V220 layer', !text.includes('setShowNewTask') && !text.includes('setShowNewTicket')],
  ['single visible dialog guard', text.includes('keepSingleVisibleDialog')],
  ['client marker', text.includes('data-v220-goodday-frontend-acceptance-layer')],
  ['document click delegation', text.includes('document.addEventListener') && text.includes('click')],
  ['document keydown delegation', text.includes('document.addEventListener') && text.includes('keydown')],
];
const passed = checks.filter(([, ok]) => ok).length;
console.log('# v22.0.7 No Duplicate Dialogs Audit\n');
console.log('Passed: ' + passed + ' / ' + checks.length + '\n');
console.log('| Check | PASS/FAIL |');
console.log('|---|---:|');
for (const [name, ok] of checks) console.log('| ' + name + ' | ' + (ok ? 'PASS' : 'FAIL') + ' |');
if (passed !== checks.length) process.exit(1);
