# v21.0.1 — Next 15 Route Context Build Fix

## Problem
`pnpm --filter @servelect/web typecheck` and `next build` failed after v21.0.0 because the dynamic API route used a union route context:

```ts
params: Promise<{ section: string }> | { section: string }
```

Next.js 15 generated route types require `params` to be a Promise for dynamic API route context.

## Fix
`apps/web/app/api/v1/work-os/v210-real-mutation-bridge/[section]/route.ts` now uses:

```ts
type RouteContext = {
  params: Promise<{ section: string }>;
};
```

The route still awaits params via `await context.params` and preserves the v21 mutation bridge behavior.

## Visual safety
This hotfix does not change the V15/V200 visible Taskuri shell. It only fixes route typing/build compatibility.

Expected after apply:

- `pnpm --filter @servelect/web typecheck` PASS
- `pnpm --filter @servelect/web build` PASS
- `node scripts/audit-v2100-source.mjs` PASS
- `node scripts/audit-v2100-dead-buttons.mjs` PASS
