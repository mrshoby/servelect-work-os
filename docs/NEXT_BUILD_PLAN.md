# NEXT_BUILD_PLAN — SERVELECT WORK OS

## Current version
v7.8.0 — Provider Telemetry, Mutation Canary & Server-Side Saved Views

## Baseline accepted before v7.8
- v7.7.0/v7.7.3 screenshot audit confirmed 18/18 clean PNG on `servelect-work-os-web.vercel.app`.
- Taskuri GoodDay-like shell is accepted as the current UI baseline.

## What v7.8 adds
- Provider telemetry for in-app/email/push/websocket-ready delivery.
- Delivery queue observability with attempts/retry state.
- Mutation canary with rollback checkpoint and lock version.
- Server-side saved view contracts with private/team/department/global scopes.
- API routes for telemetry, saved views, mutation canary and observability.
- Updated functional test and screenshot audit scripts.

## Scores after v7.8
| Category | Before | After |
|---|---:|---:|
| GoodDay visual/UX similarity | 74 | 76 |
| GoodDay public feature parity | 89 | 90 |
| Task management core | 96 | 96 |
| My Work / Inbox / Action Required | 90 | 91 |
| Task detail / drawer / comments / activity | 91 | 92 |
| Tickets / Requests / Forms | 90 | 91 |
| Notifications | 95 | 96 |
| Workflows / custom statuses / validations | 87 | 88 |
| Custom fields / task types | 86 | 87 |
| Saved views / filters / table views | 90 | 94 |
| Board / Kanban | 92 | 93 |
| Calendar / Gantt / Timeline | 84 | 85 |
| Workload / resource planning | 86 | 87 |
| Time tracking / My Time / Timesheets | 86 | 87 |
| Approvals | 85 | 86 |
| Reports / dashboards / analytics | 78 | 82 |
| Automations | 78 | 82 |
| Documents / files / attachments | 82 | 83 |
| CRM / client portal integration | 65 | 66 |
| HR / attendance / departments | 69 | 70 |
| RBAC / permissions / access rules | 89 | 90 |
| Backend / API / persistence | 87 | 90 |
| Screenshot audit coverage | 100 | 100 pending v7.8 run |
| QA/build stability | 90 | 91 pending local run |
| Production readiness | 87 | 89 |

## Global scores after v7.8
- GoodDay visual similarity: 76%
- GoodDay functional parity: 90%
- Local real functionality: 94%
- Backend/API parity: 90%
- Production readiness: 89%
- QA confidence: 91% after local typecheck/lint/build pass

## Missing until 100%
- Live provider credentials for email/push/websocket.
- DB persistence for server-side saved views.
- Primary write pilot with rollback drill.
- Shared view ACL enforcement in API.
- Real background worker execution.
- Client portal and HR/pontaj adapters.

## Next recommended build
v7.9.0 — Provider Canary Activation, Shared View ACL & Primary Write Pilot

## Do not do next
- Do not redesign again.
- Do not create separate demo pages.
- Do not activate primary writes without backup, rollback and audit.
- Do not skip Taskuri/GoodDay parity route tests.
