# SERVELECT WORK OS v6.7.1 Global Command Typecheck Fix

Status: patch applied locally.

Fixed workload property mismatches introduced in v6.7.0:

- loadPercent -> utilization
- assignedMinutes -> estimated
- capacityMinutes -> weeklyCapacity

Run QA:

- pnpm typecheck
- pnpm lint
- pnpm build
- .\scripts\work-os-v671-global-command-functional-test.ps1 -BaseUrl "http://127.0.0.1:3100"
