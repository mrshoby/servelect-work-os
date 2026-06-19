# SERVELECT WORK OS v16.0.4 — Vercel Payload Limit Fix

## Scope

This is a deployment hotfix after v16.0.3 passed local typecheck/build/source audit and pushed to GitHub, but `vercel deploy --prod --yes` failed with:

```text
Error: File size limit exceeded (100 MB)
```

## Fix

- Adds/merges a strict `.vercelignore` at repository root.
- Excludes local-only audit outputs, screenshot archives, backup folders, extracted packs, zip/tar artifacts, caches, build traces and local env files from Vercel CLI upload payload.
- Uses a clean Git worktree deployment path so untracked local files such as `audit-results`, `_backups`, extracted ZIPs and screenshots cannot be uploaded by mistake.
- Keeps v16 roadmap scope intact: provider mutation adapter, drag/drop persistence, Gantt reschedule engine, RBAC browser QA.

## Expected gates

- `pnpm --filter @servelect/web typecheck`
- `pnpm --filter @servelect/web build`
- `node scripts/audit-v1600-source.mjs`
- Git commit/push
- Clean-worktree Vercel production deploy
- Route/API check for `/api/v1/work-os/v160-real-provider-mutation-taskuri`
- HTML marker check for `data-v160-real-provider-mutation`

## Progress status

- Category targeted by v16 roadmap: `productionReadiness`
- v15 baseline: 70%
- v16 local implementation after build/source audit: code-ready, pending Vercel production deploy verification
- v16.0.4 goal: unblock production deployment payload and finish Vercel check
