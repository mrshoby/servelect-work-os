# Changelog - v6.6.0 Taskuri GoodDay Core Integration

## Added

- Integrated GoodDay-like task core into real Taskuri routes.
- Added route-specific pages for overview, my-work, tickets, board, table, calendar/gantt, workload/approvals, active/future/finalized projects.
- Added Playwright-first screenshot audit script.
- Added functional route smoke test script.
- Added API status endpoint for GoodDay parity core.

## Changed

- `/taskuri` now renders the integrated GoodDay core instead of the older static/task-only page.
- Standalone GoodDay demo routes now redirect to `/taskuri/overview`.

## Not changed

- No GoodDay branding copied.
- No protected GoodDay assets copied.
- No backend production write mode enabled.
