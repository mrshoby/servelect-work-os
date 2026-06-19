# v16.0.1 — Typecheck Fix for Real Provider Mutation Build

## Why this exists
v16.0.0 applied the major roadmap scope but failed TypeScript on `V160RealProviderMutationTaskuriWorkspace.tsx`.

## Fixed
- `mutate()` now accepts `requiredAction: string`, so RBAC-only actions like `rollback` and `commit-canary` are allowed as RBAC permission checks without being forced into the previous mutation-type union.
- `MutationType` now includes `rollback` and `commit-canary` for a stronger mutation ledger.
- Rollback ledger now records `type: "rollback"` instead of abusing `reschedule`.
- Mutation status updates are typed explicitly as `MutationStatus` inside rollback/replay/canary state updaters.
- Canary commit now creates an explicit `commit-canary` provider mutation entry.

## Required QA after applying
- `pnpm --filter @servelect/web typecheck`
- `pnpm --filter @servelect/web build`
- `node scripts/audit-v1600-source.mjs`
- `node scripts/audit-v1600-browser-flow-bypass.mjs` when `VERCEL_PROTECTION_BYPASS` is set
- Vercel deploy/check after push
