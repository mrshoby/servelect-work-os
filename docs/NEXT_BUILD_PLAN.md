# NEXT BUILD PLAN — SERVELECT WORK OS

Current version: v7.5.0
Previous version: v7.4.0

## What changed in v7.5.0

- Added conflict resolution for optimistic locking.
- Added access inheritance rules for workspace/project/task/ticket/document scopes.
- Added R2/S3-ready attachment metadata and permission checks.
- Updated release manifest/version to v7.5.0.

## Current scores

- GoodDay parity totală: 87%
- Funcționalitate reală locală: 93%
- Backend/API real: 82%
- Production readiness: 82%
- UX/design maturity: 86%
- QA confidence: 86%
- Screenshot audit coverage target: 100% after Vercel audit

## Remaining issues

- Primary Prisma writes remain gated.
- Signed R2/S3 URLs are not yet implemented.
- Email/push/websocket notification providers are not active.
- Field-level conflict merge still needs deeper task drawer UI.

## Next build

v7.6.0 — Signed Attachment URLs, Provider Delivery & Access-Enforced Mutation API

## Scope for next build

1. Signed upload/download URL API for R2/S3-ready attachments.
2. Provider delivery switchboard for email/push/websocket readiness.
3. Enforce inherited access rules in mutation endpoints.
4. File versioning and delete/restore evidence.
5. Screenshot audit for attachment and access routes.

## Do not do next

- No redesign.
- No separate demo pages.
- No unrelated modules.
- Do not enable primary Prisma writes without backup and rollback evidence.
