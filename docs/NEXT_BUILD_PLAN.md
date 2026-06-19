# NEXT_BUILD_PLAN

## Next major build
v17.1.0 — GoodDay Functional Parity Inside V15 Layout

## Non-negotiable baseline
- Use V150GoodDayStructuralTaskuriWorkspace as the visual shell.
- Do not introduce a second left/middle hierarchy panel.
- Do not route Taskuri pages through V170GoodDayFunctionalParityWorkspace or any shell that changes the accepted v15 layout.

## Goal
Add real interaction and persistence inside the accepted v15 layout:
- New Task / New Ticket real handlers.
- Filters / saved views with persistence.
- Board/Table/My Work data connection.
- Drawer save, comments, checklist, dependencies, timer.
- Notifications, approvals, activity log.
- Dead-button audit and browser flow audit.

## Acceptance
Production must keep:
- data-v150-goodday-structural-parity = true
- no data-v170-goodday-functional-parity
- no visible Taskuri Workspace card
- no visible WORKSPACE HIERARCHY middle panel
