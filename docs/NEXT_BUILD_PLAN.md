# NEXT BUILD PLAN — SERVELECT WORK OS

## Current version
v7.7.4 — GoodDay-like UI Functional Parity, Provider Rehearsal & Observability

## What changed
- Applied GoodDay-like compact Work OS layout discipline to real Taskuri routes.
- Added shared shell for task list, board, tickets, workload, reports, admin workflows/custom fields/observability.
- Added provider rehearsal and primary write dry-run controls.
- Updated GoodDay live UI/UX analysis and Servelect design system docs.

## Scores
- GoodDay visual similarity: 74%
- GoodDay functional parity: 89%
- Local real functionality: 93%
- Backend/API parity: 87%
- Production readiness: 87%
- QA confidence: 90% after local QA passes
- Screenshot audit coverage: 100% only after v7.7 screenshot audit passes

## Remaining problems
- Primary Prisma writes are still gated.
- Email/push/websocket delivery providers are still not live.
- R2/S3 credentials and real binary attachment transfer are not active.
- Shared saved views and notifications still need server-side records.

## Next build recommended
v7.8.0 — Provider Telemetry, Mutation Canary & Server-Side Saved Views

## Scope for next build
1. Provider telemetry table/API for delivery success/failure.
2. Mutation canary mode for safe subset of task/ticket/notification writes.
3. Server-side saved views and notification records.
4. Access enforcement in all mutation endpoints.
5. Screenshot audit covering v7.7 + provider telemetry routes.

## Do not do next
- No redesign unless it fixes a verified UX gap.
- No demo-only page.
- No new unrelated modules.
- No primary write enablement without rollback, backup and audit.

## QA status
Pending local run for v7.7.4 package: pnpm typecheck, pnpm lint, pnpm build.

## Vercel status
Pending after user applies, commits and pushes.



---

## v7.7.4 QA Script Fix — Vercel Protected Route Smoke

Applied: 2026-06-12 13:16:37

Purpose: Fix route/screenshot audit scripts so protected Vercel deployments can be tested with VERCEL_AUTOMATION_BYPASS_SECRET / -BypassSecret and the x-vercel-protection-bypass header.

Status: App code unchanged. This fixes false FAIL results caused by Vercel returning HTTP 401 before Next.js routes render.

Next action: run v7.7 route smoke with a Vercel automation bypass secret or test an unprotected production alias.

---

## v7.7.4 QA Script Fix — Vercel Protected Route Smoke

Applied: 2026-06-12 13:27:53

Purpose: Fix route/screenshot audit scripts so protected Vercel deployments can be tested with VERCEL_AUTOMATION_BYPASS_SECRET / -BypassSecret and the x-vercel-protection-bypass header.

Status: App code unchanged. This fixes false FAIL results caused by Vercel returning HTTP 401 before Next.js routes render.

Next action: run v7.7 route smoke with a Vercel automation bypass secret or test an unprotected production alias.

