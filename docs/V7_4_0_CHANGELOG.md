# v7.4.0 — DB-backed Shadow Writes, Notification Worker & Optimistic Locking

## Implemented
- Added DB-shadow write runtime and page.
- Added optimistic locking model for shadow writes.
- Added notification worker queue semantics with in-app processing and retry state.
- Added rollback replay evidence for shadow write records.
- Added v7.4 API route family for health, writes, locks, notification worker and rollback replay.
- Added migration scaffold for DB shadow write locks, shadow write records and notification worker queue.
- Updated release manifest/version to 7.4.0.
- Updated NEXT_BUILD_PLAN.md.

## Not enabled
- Primary Prisma writes remain gated.
- Email/push/websocket providers are readiness-only.
- Real attachment storage is still missing.
