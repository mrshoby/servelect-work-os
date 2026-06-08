# SERVELECT WORK OS v6.1.0 — Workflow Automation, SLA Engine & Cross-Module Task Factory

v6.1.0 este un update major peste v6.0 Enterprise Operating Layer. Scopul este să ducă platforma mai aproape de GoodDay / ClickUp / Asana Enterprise prin automatizări reale de Work OS: reguli, trigger-e, acțiuni, SLA-uri, escalări, taskuri generate automat și audit shadow-safe.

## Module adăugate

- `/work-os/workflow-automation`
- `/work-os/sla-command-center`
- `/work-os/cross-module-task-factory`
- `/work-os/operations-command-center`
- `/admin/workflow-governance`
- `/api/v1/work-os/workflow-automation/rules`
- `/api/v1/work-os/workflow-automation/sla`
- `/api/v1/work-os/workflow-automation/task-factory`
- `/api/v1/work-os/workflow-automation/command-center`

## Ce adaugă major

- Workflow rule engine pentru IoT, stocuri, facturi, documente, approvals, workload și mentenanță.
- SLA policies cu response/resolution time, warning/breach și escalation path.
- Cross-module task factory: IoT alert → task/ticket, stoc sub minim → task achiziții, factură scadentă → task financiar, document lipsă → blocaj fază proiect.
- Audit trail pentru fiecare task generat.
- GoodDay compliance lift pentru custom workflows, SLA operations, task automation și module integration.
- Shadow-safe write modes: `shadow`, `safe`, `requires_approval`, `real_ready`.

## Notă de siguranță

v6.1.0 nu activează mutații destructive. Acțiunile care ar produce efecte reale sunt marcate cu write-mode și audit requirement. Pentru mutații reale, se păstrează direcția v5.7/v5.8: adapter switchboard + Prisma cutover + rollback.

## Următorul build recomandat

v6.2.0 — Field Mobile Offline Sync, QR Evidence Packets & Technician Execution Console.
