# v16.0.3 — Literal Path Deploy Fix

This hotfix repairs the v16.0.2 apply failure on Windows PowerShell caused by square brackets in the Next.js dynamic route folder `[section]`.

## Fixed

- Uses `Test-Path -LiteralPath` for pack files.
- Uses `Copy-Item -LiteralPath` so `[section]` is treated as a real folder name, not a wildcard expression.
- Uses `git add` on the whole v160 API folder instead of a wildcard-sensitive single `[section]` path.
- Keeps v16 major roadmap scope: real provider mutation adapter, drag/drop persistence, Gantt reschedule engine and RBAC browser QA.
- Updates API/UI version marker to `16.0.3`.

## Expected gates

- `pnpm --filter @servelect/web typecheck`
- `pnpm --filter @servelect/web build`
- `node scripts/audit-v1600-source.mjs`
- Git commit/push
- `vercel deploy --prod --yes`
- route/API verification
- browser/screenshot bypass audits when Vercel bypass token is available locally.
