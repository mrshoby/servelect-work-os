# SERVELECT WORK OS v9.5.0 — GoodDay Collaboration Files SLA Operations Layer

## Scope

This build continues after v9.4.0 and keeps Taskuri as the single canonical Work OS execution entry. It adds collaboration, checklist quality gates, task files/evidence, SLA escalation inbox, workload forecast, decision register, request bridge, admin governance, API routes and audits.

## Rules kept

- No second visible Work OS shell.
- No separate app surface.
- No global production writes.
- Provider and task mutations remain pilot-gated with audit envelopes and rollback checkpoints.

## New routes

- `/taskuri/collaboration-hub-v95`
- `/taskuri/checklists-quality-v95`
- `/taskuri/files-evidence-v95`
- `/taskuri/sla-escalation-v95`
- `/taskuri/workload-forecast-v95`
- `/taskuri/decision-register-v95`
- `/taskuri/request-portal-bridge-v95`
- `/admin/taskuri-collaboration-governance-v95`
- `/api/v1/work-os/v95-goodday-collaboration-sla/*`

## Expected QA

- `scripts/work-os-v950-functional-test.ps1` -> 17/17 PASS
- `scripts/audit-v950-screenshots.mjs` -> 9/9 clean screenshots
- `scripts/audit-v950-goodday-source.mjs` -> PASS
