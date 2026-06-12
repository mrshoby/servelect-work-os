# v7.8.0 Provider Telemetry Functional Route Smoke

BaseUrl: https://servelect-work-os-web.vercel.app
Bypass secret used: True
AllowDeploymentProtection401: False

| Route | Result | HTTP | Bytes | Note |
|---|---:|---:|---:|---|
| /taskuri | PASS | 200 | 46972 | OK |
| /taskuri/overview | PASS | 200 | 47438 | OK |
| /taskuri/my-work | PASS | 200 | 47473 | OK |
| /taskuri/inbox | PASS | 200 | 47463 | OK |
| /taskuri/tickets-notificari | PASS | 200 | 45120 | OK |
| /taskuri/board | PASS | 200 | 48039 | OK |
| /taskuri/tabel | PASS | 200 | 47456 | OK |
| /taskuri/calendar-gantt | PASS | 200 | 45475 | OK |
| /taskuri/workload-aprobari | PASS | 200 | 46146 | OK |
| /taskuri/forms | PASS | 200 | 45006 | OK |
| /taskuri/timesheets | PASS | 200 | 46086 | OK |
| /taskuri/reports | PASS | 200 | 47437 | OK |
| /taskuri/automations | PASS | 200 | 45240 | OK |
| /admin/workflows | PASS | 200 | 48660 | OK |
| /admin/custom-fields | PASS | 200 | 48693 | OK |
| /admin/goodday-observability | PASS | 200 | 51215 | OK |
| /admin/server-saved-views | PASS | 200 | 50969 | OK |
| /admin/provider-telemetry | PASS | 200 | 51183 | OK |
| /work-os/goodday-ui-parity | PASS | 200 | 50955 | OK |
| /work-os/provider-rehearsal | PASS | 200 | 51200 | OK |
| /work-os/primary-write-dry-run | PASS | 200 | 49346 | OK |
| /work-os/provider-telemetry | PASS | 200 | 51193 | OK |
| /work-os/mutation-canary | PASS | 200 | 49293 | OK |
| /api/v1/work-os/v78-provider-telemetry | PASS | 200 | 7086 | OK |
| /api/v1/work-os/v78-provider-telemetry/health | PASS | 200 | 711 | OK |
| /api/v1/work-os/v78-provider-telemetry/telemetry | PASS | 200 | 1510 | OK |
| /api/v1/work-os/v78-provider-telemetry/saved-views | PASS | 200 | 1130 | OK |
| /api/v1/work-os/v78-provider-telemetry/mutation-canary | PASS | 200 | 828 | OK |
| /api/v1/work-os/v78-provider-telemetry/observability | PASS | 200 | 156 | OK |
