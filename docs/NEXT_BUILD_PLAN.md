# NEXT BUILD PLAN — SERVELECT WORK OS

## Current version
v7.3.0 — Prisma Schema Migration, Shadow Table Writes & Notification Delivery Queue

## Build completed
- Added schema migration SQL scaffold for shadow records, rollback checkpoints and notification delivery queue.
- Added v7.3 Work OS and Admin pages.
- Added v7.3 API contracts.
- Added client-side shadow write/rollback/queue evidence UI.
- Updated release manifest/version to v7.3.0.
- Kept primary DB writes gated.

## Current percentage status
| Category | Current | Previous | Next required |
|---|---:|---:|---|
| GoodDay public feature parity | 85% | 84% | live collaboration/access inheritance |
| Task management core | 93% | 92% | DB-backed mutation + optimistic locking |
| Tickets / Requests / Forms | 83% | 81% | portal/storage persistence |
| Notifications | 90% | 87% | delivery worker + retry |
| Backend / API / persistence | 72% | 66% | DB-backed shadow adapter |
| Production readiness | 73% | 68% | migration rehearsal, backup, monitoring |

## Problems remaining
- Primary Prisma writes are still blocked.
- Notification queue is in-app/shadow, not email/push/websocket.
- Attachments do not use real storage.
- No optimistic lock/version conflict checks yet.
- No production DB migration application evidence yet.

## Next build
v7.4.0 — DB-backed Shadow Writes, Notification Worker & Optimistic Locking

## Scope for next build
1. Add DB-backed shadow repository adapter behind write-mode gate.
2. Add optimistic version field/check for task/ticket/saved view updates.
3. Add notification queue worker simulation with retries/dead-letter state.
4. Add migration rehearsal report and rollback verification flow.
5. Extend screenshot audit with v7.0 + v7.1 + v7.2 + v7.3 critical route set.

## Do not do next
- No redesign.
- No demo route separate from Work OS/Admin.
- No primary DB enablement without gates.
- No new module unrelated to backend/persistence.

## GitHub/Vercel
After apply and QA, commit and push to main. Vercel should deploy from GitHub.
