# v9.4.0 — Timeline/Gantt Dependency Editor, Calendar Capacity Sync & Drawer Mutation Queue

## Scope

Build major incremental după v9.3.0. Nu creează suprafață separată și nu reintroduce shell paralel. Taskuri rămâne entry-ul canonical pentru execuție.

## Implementat

- Timeline/Gantt dependency editor: `/taskuri/timeline-dependencies-v94`
- Calendar capacity sync: `/taskuri/calendar-capacity-v94`
- Drawer mutation queue: `/taskuri/drawer-mutation-queue-v94`
- Approval workflow builder: `/taskuri/approval-workflow-builder-v94`
- Task templates and recurrence: `/taskuri/task-template-recurrence-v94`
- Saved view policy contracts: `/taskuri/policy-contracts-v94`
- Gantt readiness surface: `/taskuri/gantt-readiness-v94`
- Admin execution governance: `/admin/taskuri-execution-governance-v94`
- API root + subroutes under `/api/v1/work-os/v94-goodday-timeline-drawer-mutation`

## Cleanup inclus

Apply script curăță wordingul v9.3 care a făcut source audit să pice, apoi verifică din nou că nu există wording de suprafață separată în fișierele v93/v94.

## Guardrails

- Global production writes: OFF
- Drawer mutations: queued / shadow / manager-gated
- Timeline dependencies: audit + rollback checkpoint
- Recurring rules: template-policy gated
- No legacy internal Work OS shell

## Next recommended build

v9.5.0 — Live Inline Persistence Adapter, Command Palette Actions & Gantt Interaction Hardening.
