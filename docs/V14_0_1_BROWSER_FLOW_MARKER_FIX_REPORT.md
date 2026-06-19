# v14.0.1 — Browser Flow Marker Fix

This hotfix does not change the v14 product scope. It fixes the one remaining source-audit failure by adding a real functional task-opening action that uses the exact expected `setSelectedTaskId(task.id)` handler.

## Fixed

- Adds a real `Open active task` button next to search in the route-specific Taskuri workspace.
- The button opens the current task drawer via `setSelectedTaskId(task.id)`.
- Keeps the single canonical sidebar rule unchanged.
- Keeps route-specific GoodDay-like content unchanged.

## QA target

- `pnpm build` PASS
- `node scripts/audit-v1400-goodday-route-specific-source.mjs` PASS
- `node scripts/audit-v1401-browser-flow.mjs` PASS
