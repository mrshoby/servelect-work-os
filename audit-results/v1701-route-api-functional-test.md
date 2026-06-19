# v17.0.1 Vercel Route/API Functional Test

BaseUrl: https://servelect-work-os-web.vercel.app

Note: HTML entities are decoded before marker matching, so &amp; is treated as &.

| Page | Marker | PASS/FAIL |
|---|---|---:|
| /taskuri | data-v170-goodday-functional-parity | PASS |
| /taskuri/board | Board / Kanban | PASS |
| /taskuri/tabel | Enterprise Table | PASS |
| /taskuri/inbox | Inbox & Action Required | PASS |
| /taskuri/workload | Capacity planner | PASS |
| /api/v1/work-os/v170-goodday-functional-parity | GOODDAY_FUNCTIONAL_PARITY_ON_V15_BASELINE | PASS |

Passed: 6 / 6
