# SERVELECT WORK OS v14.0.3 — Browser Flow Real Handlers Fix

## Scope

v14.0.3 fixes the remaining v14 browser-flow audit failures without weakening the audit.

## Fixed failed markers

- `onClick={state.addTask}`
- `onClick={state.addTicket}`
- `onClick={state.exportCsv}`
- `checklistDone`
- `dueDate`

## Implementation

The Taskuri component now exposes a real local action state object:

```tsx
const state = { addTask, addTicket, exportCsv, bulkMoveToReview };
```

The visible route action buttons call those real handlers through `state.*`, not fake comments or hidden markers.

The selected task drawer/header also exposes actual `dueDate` and `checklistDone` runtime values.

## Acceptance

Do not proceed to v15 until these pass:

```powershell
pnpm typecheck
pnpm build
node scripts/audit-v1400-goodday-route-specific-source.mjs
node scripts/audit-v1401-browser-flow.mjs
node scripts/audit-v1402-browser-flow-script-syntax.mjs
node scripts/audit-v1403-browser-flow-real-handlers.mjs
```
