# SERVELECT WORK OS v12.0.1 — Route Export Build Fix

## Verdict
v12.0.0 failed `pnpm build` because the Next.js route file exported an extra symbol named `payload`. Next.js App Router route files must not export arbitrary values.

## Fix
- Replaced `apps/web/app/api/v1/work-os/v120-single-canonical-sidebar-taskuri/route.ts`.
- Replaced `apps/web/app/api/v1/work-os/v120-single-canonical-sidebar-taskuri/[section]/route.ts`.
- Kept helper functions internal/non-exported.
- Kept only `GET` as the route export.
- Preserved the Next.js 15 `params: Promise<{ section: string }>` dynamic route context.

## Scope
This is a build hotfix only. It does not lower the UI acceptance bar. The single canonical sidebar rule remains mandatory.

## Expected QA
- `pnpm typecheck` PASS.
- `pnpm build` PASS.
- `node scripts/audit-v1201-route-export-source.mjs` PASS.
- `scripts/work-os-v1201-functional-test.ps1` 29/29 after Vercel deploy.

## Next
Continue with v13.0.0 only after v12 single-sidebar UI is visible and verified on Vercel.
