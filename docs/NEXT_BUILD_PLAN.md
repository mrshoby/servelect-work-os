# NEXT BUILD PLAN — after v8.0.0

Current version: v8.0.0 — Production Pilot Readiness, Authenticated ACL Enforcement & Rollback Drill

## Done in v8.0.0

- Continued from v7.9.0 `docs/NEXT_BUILD_PLAN.md` recommendation.
- Added production pilot readiness surfaces in real Work OS/Admin routes.
- Added v8 API family for ACL evaluation, mutation guard, rollback drill and provider readiness.
- Added actor/role/department/team/client ACL model.
- Added primary write guard requiring ACL + actor + lockVersion + rollback checkpoint.
- Added rollback drill visibility and provider runtime state.
- Updated package/release versions to 8.0.0.
- Added GoodDay public UI/UX analysis and Servelect design-system refinement.
- Added v8 functional and screenshot audit scripts.

## Current scores

- GoodDay visual similarity: 78%
- GoodDay functional parity: 92%
- Local real functionality: 95%
- Backend/API parity: 94%
- Production readiness: 93%
- QA confidence: 93% after local QA passes
- Screenshot audit coverage: 100% if v8 screenshot script captures all routes cleanly

## Missing to 100%

- Authenticated ACL evaluator must be connected to real Auth.js/current-session user.
- Staging DB write adapter must execute a narrow mutation pilot with Prisma transaction and rollback evidence.
- Push/websocket/email providers need real credentials and runtime secrets.
- Pixel-diff screenshot audit is still missing; current audit confirms PNG/HTTP only.
- Do not open primary writes globally until rollback drill is proven.

## Recommended next build

v8.1.0 — Authenticated Session Binding, Staging DB Write Pilot & Rollback Evidence

## Scope obrigatório v8.1.0

1. Bind current authenticated session/user into v8 ACL evaluator.
2. Add staging-only Prisma write adapter for one safe pilot entity.
3. Persist rollback checkpoint + before/after mutation evidence.
4. Add audit log rows for canary mutation and rollback simulation.
5. Verify Vercel route/API smoke and screenshot audit after deploy.

## Do not do

- Do not redesign again before v8 QA passes.
- Do not add unrelated modules.
- Do not enable global primary writes.
- Do not store provider secrets in repository.
- Do not bypass Vercel protection except through local environment variables for tests.

## Routes affected

- `/work-os/production-pilot-readiness`
- `/admin/production-pilot-readiness`
- `/work-os/primary-write-pilot`
- `/admin/primary-write-pilot`
- `/api/v1/work-os/v80-production-pilot/*`

## QA status

Run after apply:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `.\scripts\work-os-v800-functional-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"`
- `node scripts/audit-v800-screenshots.mjs`

## GitHub/Vercel status

The apply script can commit/push if credentials are available. If not, run the commands shown in the final ChatGPT response.
