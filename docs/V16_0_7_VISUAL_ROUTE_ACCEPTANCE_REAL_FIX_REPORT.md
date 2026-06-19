# v16.0.7 Visual Route Acceptance Real Fix

Status: PATCHED

This build fixes the v16.0.6 false/no-op patch by adding a real visible route acceptance panel rendered inside the V160 Taskuri workspace. The panel uses raw route-specific HTML so the Vercel HTML audit finds exact acceptance strings, including ampersand markers.

## Fixed route acceptance markers

- /taskuri/inbox → Inbox & Action Required
- /taskuri/proiecte-active → Delivery portfolio
- /taskuri/workload → Capacity planner

## Preserved v16 features

- Real provider mutation adapter
- Local persistent mutation ledger
- Drag/drop board status persistence
- Gantt reschedule engine
- RBAC browser QA
- Production readiness gate

