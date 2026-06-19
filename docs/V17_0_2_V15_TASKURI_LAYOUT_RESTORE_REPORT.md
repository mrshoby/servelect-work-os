# v17.0.2 — V15 Taskuri Layout Restore Hotfix

## Scope
Restores the visible Taskuri layout to the accepted v15 GoodDay structural baseline.

## Reason
v17.0.0 introduced an extra visible middle workspace panel (Taskuri Workspace, WORKSPACE HIERARCHY, route list) that changed the accepted v15 layout and made the UI visually worse. That was not acceptable.

## Fixed
- Taskuri routes restored from 	askuri-ui-v15-goodday-baseline-restored / 91c4036.
- V150GoodDayStructuralTaskuriWorkspace restored as the visible Taskuri UI baseline.
- V170GoodDayFunctionalParityWorkspace removed from visible route usage.
- Production acceptance must show data-v150-goodday-structural-parity and must not show data-v170-goodday-functional-parity, Taskuri Workspace, or WORKSPACE HIERARCHY.

## Rule for the next major build
Functional parity must be integrated inside the existing V150 visual structure. Do not add a second sidebar/hierarchy panel and do not replace the V150 layout shell.
