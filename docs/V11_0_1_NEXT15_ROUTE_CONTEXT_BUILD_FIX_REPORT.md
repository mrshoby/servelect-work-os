# v11.0.1 — Next.js 15 Route Context Build Fix

## Verdict

v11.0.0 did not reach Vercel because `pnpm build` failed in the dynamic API route:

`apps/web/app/api/v1/work-os/v110-major-taskuri-goodday-redesign/[section]/route.ts`

Next.js 15 expects dynamic route `params` to be Promise-based in the generated route context. The old route used a synchronous params object.

## Fix

- Replaced the dynamic route handler context with `params: Promise<{ section: string }>`.
- Awaited `context.params` inside `GET`.
- Kept the v11 API boundary and sections: `health`, `routes`, `scores`, `buttons`, `flows`, `readiness`, `workspace`, `manual-ui`.
- Added source audit `scripts/audit-v1101-source.mjs`.
- Added route/API smoke `scripts/work-os-v1101-functional-test.ps1`.

## Important

This is a technical build hotfix. It does not declare visual acceptance. The manual UI audit must be rerun after a successful Vercel deploy.

## Expected checks

```powershell
pnpm typecheck
pnpm build
node scripts/audit-v1101-source.mjs
.\scripts\work-os-v1101-functional-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
```

Expected:

```text
PASS: v11.0.1 Next.js 15 route context source audit clean
v11.0.1 route/API smoke passed: 29 / 29
```
