# v7.6.0 — Signed Attachment URLs, Provider Delivery & Access-Enforced Mutation API

## Added
- Signed upload/download URL contracts for R2/S3-ready attachments.
- Provider delivery switchboard for in-app/email/push/websocket readiness.
- Access-enforced mutation API gates before upload/download/delete/restore actions.
- File versioning and delete/restore evidence.
- API routes for signed URLs, providers, access checks and file versions.
- Migration scaffold for signed attachment URLs, provider delivery queue and access guards.

## Not enabled yet
- Primary Prisma writes remain gated.
- Real R2/S3 credentials are not configured in repository.
- Email/push/websocket provider secrets and live delivery are not active.
