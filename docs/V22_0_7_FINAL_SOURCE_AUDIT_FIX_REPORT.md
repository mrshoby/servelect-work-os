# v22.0.7 Final Source Audit Fix

This patch fixes the exact v2200 source audit failures that remained after v22.0.6:

- Event delegation now contains both document.addEventListener click and keydown.
- Board/table/Gantt/calendar exact tokens restored: board-status-move, table-sort, gantt-reschedule, calendar-schedule.
- Procurement exact tokens restored: procurement-request, rfq-conversion, supplier-comparison, purchase-order, invoice-attach.
- markAction and writeLedger are present for dead-button audit compatibility.
- NO_DUPLICATE_DIALOGS is preserved and V220 remains passive.
- No new shell, no Taskuri Workspace, no WORKSPACE HIERARCHY, no V160.
