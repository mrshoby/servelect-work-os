# SERVELECT WORK OS v22.0.1 — Duplicate Dialog Guard

## Problem
After v22.0.0 route/API checks passed, clicking **New Task** and **New Ticket** opened duplicate windows. The cause is layered click handling: the original V15/V200/V210 visible UI owns the modal, while V220 must only observe/persist/audit visible interactions.

## Fix
v22.0.1 replaces `V220GoodDayFrontendAcceptanceLayer.tsx` with a non-invasive acceptance layer:

- keeps `data-v220-goodday-frontend-acceptance`
- keeps `GOODDAY_FRONTEND_ACCEPTANCE_LAYER`
- keeps `REAL_VISIBLE_INTERACTION_CONTRACT`
- keeps `API_SHADOW_MUTATION_BRIDGE`
- keeps `REAL_LOCAL_PERSISTENT`
- adds `NO_DUPLICATE_DIALOGS`
- does not own modal state
- does not open New Task/New Ticket windows
- records visible actions to localStorage ledger
- adds MutationObserver fallback to hide duplicate task/ticket dialogs if a stale layer creates a second one

## Visual shell policy
No new visual shell is introduced. V15/V200/V210 remain preserved. No `Taskuri Workspace`, no `WORKSPACE HIERARCHY`, no V160 marker.
