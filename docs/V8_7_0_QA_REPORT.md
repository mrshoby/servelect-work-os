# v8.7.0 QA Report

## Expected local QA
- pnpm typecheck
- pnpm lint
- pnpm build
- scripts/work-os-v870-functional-test.ps1 after deploy or against a running local server
- node scripts/audit-v870-screenshots.mjs after deploy or against a running local server

## Route/API scope
Functional smoke target: baseline v8.6 routes plus new v8.7 Taskuri/Admin/Work OS routes and API endpoints.

## Known gates
- Global writes disabled.
- Provider credentials are env/vault readiness only; no secret values are stored.
- Screenshot audit captures UI pages only, not JSON API endpoints.
