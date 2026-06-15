# V8.0.0 QA Report

## Required local commands

| Command | Status |
|---|---|
| `pnpm typecheck` | To run after apply |
| `pnpm lint` | To run after apply |
| `pnpm build` | To run after apply |
| `powershell -ExecutionPolicy Bypass -File scripts/work-os-v800-functional-test.ps1` | To run after apply |
| `node scripts/audit-v800-screenshots.mjs` | To run after apply/deploy |

## Known inherited constraints

- Primary writes are still gated by design.
- Live push/websocket/email providers need runtime credentials.
- v8 adds API/UI guardrails; it does not enable global production writes.

## Build acceptance

Do not mark final unless typecheck/build pass and the route smoke test returns HTTP 200 for the new v8 routes.
