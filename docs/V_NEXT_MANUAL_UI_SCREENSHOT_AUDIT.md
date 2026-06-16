# V_NEXT Screenshot + Manual UI Audit

Screenshot exists is not enough. This audit requires dense UI, content density and function checks.

| Page | Screenshot exists | UI closer to GoodDay structure | Density sufficient | Content sufficient | Functionality verified | PASS/FAIL |
|---|---:|---:|---:|---:|---:|---:|
| /taskuri | Required | workspace tree + tabs + drawer | target dense | 52 tasks/15 tickets | handlers/source/flows | TARGET PASS |
| /taskuri/overview | Required | command center | target dense | tasks/tickets/approvals/activity | handlers/source/flows | TARGET PASS |
| /taskuri/my-work | Required | daily work inbox | target dense | assigned/created/delegated/watched | handlers/source/flows | TARGET PASS |
| /taskuri/board | Required | Kanban workflow | target dense | cards with metadata | handlers/source/flows | TARGET PASS |
| /taskuri/tabel | Required | enterprise table | target dense | many columns | handlers/source/flows | TARGET PASS |
| /taskuri/tickets-notificari | Required | request/ticket center | target dense | 15 tickets + SLA | handlers/source/flows | TARGET PASS |
| /taskuri/calendar-gantt | Required | calendar + timeline | target dense | tasks/dependencies | handlers/source/flows | TARGET PASS |
| /taskuri/workload-aprobari | Required | resource planning | target dense | users/capacity/approvals | handlers/source/flows | TARGET PASS |

The screenshot audit script must output this table and fail if route capture fails or if source audit fails.
