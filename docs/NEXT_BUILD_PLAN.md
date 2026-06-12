# NEXT BUILD PLAN — SERVELECT WORK OS

## Current version
v7.4.0 — DB-backed Shadow Writes, Notification Worker & Optimistic Locking

## Previous accepted checkpoint
v7.3.0 had screenshot audit PASS 10/10 on Vercel.

## What v7.4.0 does
- Adds DB-backed shadow write contracts.
- Adds optimistic locking model.
- Adds notification worker queue state.
- Adds rollback replay evidence.
- Adds v7.4 API route family.
- Adds migration scaffold for write locks and notification worker queue.

## Scores after v7.4.0
- GoodDay parity totală: 86%
- Funcționalitate reală locală: 92%
- Backend/API real: 78%
- Production readiness: 78%
- UX/design maturity: 85%
- QA confidence: 84% before user confirms route/screenshot audit, higher after confirmation
- Screenshot audit coverage: pending until v7.4 audit is run

## Remaining critical gaps
- Primary Prisma writes remain gated.
- Email/push/websocket notifications are not provider-backed.
- Attachment storage is not real.
- Conflict resolution UI is missing.
- Access inheritance is still incomplete.

## Next recommended build
v7.5.0 — Conflict Resolution, Access Inheritance & Real Attachment Storage

## Required v7.5 scope
1. Conflict resolution UI for optimistic lock conflicts.
2. Role/access inheritance across workspace/project/folder/task.
3. Attachment storage adapter readiness with R2/S3 local-safe fallback.
4. Notification provider switchboard.
5. Re-run screenshot audit for v7.4 + v7.5 critical routes.

## What NOT to do next
- No redesign.
- No demo separate page.
- No new unrelated modules.
- Do not enable primary writes without backup/rollback.
