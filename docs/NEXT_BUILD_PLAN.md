## v22.0.7 source-audit stabilizare finală
- Repară exact cele 3 checks rămase din audit-v2200-source: event delegation, board/table/Gantt/calendar, procurement.
- Nu continua la v23 până când source 24/24, dead-buttons 48/48, no-duplicate-dialogs PASS și producție 18/18 sunt toate confirmate.

## v22.0.6 Stabilizare v22 înainte de v23
- Repară ruta legacy v110 [section] pentru Next.js 15.
- Stabilizează V220 frontend acceptance layer fără dubluri de dialog.
- Următorul BUILD MAJOR permis numai după: source audit PASS, dead-buttons PASS, no-duplicate-dialogs PASS, route/API 18/18 pe Vercel.

## v22.0.5 Complete Stable Fix
- Fixed V220 patch script syntax failure, restored source audit contract, and kept duplicate dialog guard.

# NEXT BUILD PLAN — v23.0.0

## Current accepted baseline
- V15 visual shell preserved.
- V200 complete interaction layer present.
- V210 mutation bridge present and production route/API test passed 13/13.
- V22 frontend acceptance layer should pass production route/API test 18/18 before continuing.

## v23.0.0 target
**GoodDay Real Record Persistence + RBAC Mutation Enforcement**

Do not introduce a new shell. Do not create a demo page. Keep the existing V15/V200/V210/V220 shell/layers in place.

### Required scope
1. Real mutation provider adapter for Taskuri records:
   - task create/update
   - ticket create/escalate/convert
   - comment/checklist/dependency/file metadata
   - timer/time entry
   - approval approve/reject
   - procurement request/RFQ/supplier/PO/invoice metadata
2. Server-side mutation validation:
   - user role
   - department
   - action permission
   - audit ID
   - rollback/error message
3. Cross-view state sync:
   - board
   - table/list
   - drawer
   - workload
   - calendar/Gantt
   - inbox/notifications
4. QA:
   - typecheck
   - build
   - source audit
   - dead-buttons audit
   - route/API test
   - browser click audit
   - manual UI audit
   - updated scorecard

### Acceptance target
- No forbidden shell text.
- Existing V15 UI remains accepted.
- All visible systems keep real feedback and persistence.
- Do not declare 100% unless end-to-end DB persistence + RBAC + browser click audit are verified.
