# v22.0.2 — Time Tracking & Workload Source Audit Fix

This hotfix keeps the existing V15/V200/V210/V220 visual shell and fixes the v22 source audit failure introduced by the duplicate dialog guard.

## Fixed

- Restores explicit `time-entry` action coverage in `V220GoodDayFrontendAcceptanceLayer.tsx`.
- Restores explicit `workload-assign` action coverage in `V220GoodDayFrontendAcceptanceLayer.tsx`.
- Keeps `start-timer`, `stop-timer`, `workload-rebalance`, duplicate dialog guard and V220 frontend acceptance markers.
- Does not introduce a new shell, `Taskuri Workspace`, `WORKSPACE HIERARCHY`, or V160 layout.

## Required local acceptance

- `pnpm --filter @servelect/web typecheck` must pass.
- `pnpm --filter @servelect/web build` must pass.
- `node scripts/audit-v2200-source.mjs` must pass 24/24.
- `node scripts/audit-v2200-dead-buttons.mjs` must pass 48/48.
- `node scripts/audit-v2201-no-duplicate-dialogs.mjs` must pass.
- Production route/API test should remain 18/18 after deploy.
