# v10.0.1 — Route/API Completion Hotfix Report

## Status

v10.0.0 is not an acceptable UI parity release yet.

Uploaded validation showed:

- Route/API: 19 / 27.
- Source audit: PASS.
- Screenshot + manual UI density audit: 0 / 19.

## Fixed in v10.0.1

This package fixes only the missing compatibility route and API endpoints:

- `/taskuri/table`
- `/api/v1/work-os/v100-goodday-ui-functional-parity`
- `/api/v1/work-os/v100-goodday-ui-functional-parity/health`
- `/api/v1/work-os/v100-goodday-ui-functional-parity/routes`
- `/api/v1/work-os/v100-goodday-ui-functional-parity/scores`
- `/api/v1/work-os/v100-goodday-ui-functional-parity/buttons`
- `/api/v1/work-os/v100-goodday-ui-functional-parity/flows`
- `/api/v1/work-os/v100-goodday-ui-functional-parity/readiness`

## Important limitation

This hotfix does not claim visual parity.

The manual UI audit remains the true acceptance gate. The next major release must focus on real Taskuri UI density, task drawer behavior, board/table/workload interaction and browser-level flow verification.

## Next required major build

v11.0.0 — Major GoodDay Taskuri Workspace Redesign, Browser Flow QA & Shared State Hardening

Required scope:

1. Replace remaining simple page surfaces with a truly dense Taskuri shell.
2. Create specific screens for My Work, Inbox, Tickets, Board, Table, Calendar/Gantt and Workload.
3. Add Playwright/browser tests for task drawer, board movement, table bulk edit, ticket conversion, notification read/unread and saved views.
4. Use manual UI density audit as a hard gate, not a screenshot-exists check.
5. Keep global production writes disabled until backend/provider/database gates pass.
