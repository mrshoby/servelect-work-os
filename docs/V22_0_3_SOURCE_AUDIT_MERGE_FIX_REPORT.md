# v22.0.3 Source Audit Merge Fix

Purpose: merge the v22.0.1 duplicate-dialog guard with the v22.0.2 time/workload audit contract without changing the visual shell.

Scope:
- keeps V15/V200/V210/V220 shell
- keeps NO_DUPLICATE_DIALOGS
- restores time-entry and workload-assign source audit markers
- preserves GoodDay frontend acceptance layer markers
- no Taskuri Workspace / WORKSPACE HIERARCHY / V160 shell

Expected local checks:
- pnpm --filter @servelect/web typecheck
- pnpm --filter @servelect/web build
- node scripts/audit-v2200-source.mjs
- node scripts/audit-v2200-dead-buttons.mjs
- node scripts/audit-v2201-no-duplicate-dialogs.mjs, when present
