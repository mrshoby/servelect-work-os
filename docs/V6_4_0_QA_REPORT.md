# V6.4.0 QA Report

## Automated QA expected from apply script
- pnpm typecheck
- pnpm lint
- pnpm build

## Functional QA checklist included
1. Open `/taskuri`.
2. Go to My Work.
3. Filter urgent/high-priority tasks.
4. Open task drawer.
5. Change status.
6. Change assignee.
7. Add comment.
8. Close drawer and verify list update.
9. Go to Board and move task with status dropdown.
10. Go to Tabel, select rows and apply bulk action.
11. Go to Tickets and escalate ticket.
12. Go to Calendar and open task from calendar/Gantt.
13. Go to Workload and approve/reject approval.
14. Switch demo user and verify role-aware filtering.
15. Refresh and verify localStorage persistence.

## Known limitations
- Full drag-and-drop board is prepared but not implemented; status dropdown is functional fallback.
- Gantt drag-resize is not implemented; timeline and drawer date editing are functional fallback.
- Backend real persistence remains TODO via Prisma/API adapter.
