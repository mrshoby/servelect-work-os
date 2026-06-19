# v9.0.1 — Provider Canary Activation, Shared View ACL & Primary Write Pilot

Baseline accepted: v7.8.0 screenshot audit 22/22 PASS on Vercel.

## Added
- Provider canary activation layer for in-app/email/push/websocket.
- Shared view ACL model with private/team/department/global scope and read/write/share/admin permissions.
- Narrow primary write pilot records with dry-run SQL, rollback checkpoint and lock version.
- Admin and Work OS routes for provider canary, shared view ACL and primary write pilot.
- API route family `/api/v1/work-os/v79-primary-write-pilot/*`.

## Safety
- Primary writes remain globally disabled.
- Provider canary does not send broad live notifications.
- Push/websocket remain blocked until secrets/runtime are configured.

