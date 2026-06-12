# v7.7.0 / v7.7.3 GoodDay UI Functional Route Smoke

BaseUrl: https://servelect-work-os-ky01ppafk-mrshoby1.vercel.app
Bypass secret used: True
AllowDeploymentProtection401: False



| Route | Result | HTTP | Bytes | Note |
|---|---:|---:|---:|---|
| /taskuri | PASS | 200 | 54410 | OK |
| /taskuri/overview | PASS | 200 | 54857 | OK |
| /taskuri/my-work | PASS | 200 | 49294 | OK |
| /taskuri/inbox | PASS | 200 | 57338 | OK |
| /taskuri/tickets-notificari | PASS | 200 | 46311 | OK |
| /taskuri/board | PASS | 200 | 50884 | OK |
| /taskuri/tabel | PASS | 200 | 55538 | OK |
| /taskuri/calendar-gantt | PASS | 200 | 51461 | OK |
| /taskuri/workload-aprobari | PASS | 200 | 47051 | OK |
| /taskuri/forms | FAIL | 404 | 0 | Response status code does not indicate success: 404 (Not Found). |
| /taskuri/timesheets | FAIL | 404 | 0 | Response status code does not indicate success: 404 (Not Found). |
| /taskuri/reports | FAIL | 404 | 0 | Response status code does not indicate success: 404 (Not Found). |
| /taskuri/automations | FAIL | 404 | 0 | Response status code does not indicate success: 404 (Not Found). |
| /admin/workflows | FAIL | 404 | 0 | Response status code does not indicate success: 404 (Not Found). |
| /admin/custom-fields | FAIL | 404 | 0 | Response status code does not indicate success: 404 (Not Found). |
| /admin/goodday-observability | FAIL | 404 | 0 | Response status code does not indicate success: 404 (Not Found). |
| /work-os/goodday-ui-parity | FAIL | 404 | 0 | Response status code does not indicate success: 404 (Not Found). |
| /work-os/provider-rehearsal | FAIL | 404 | 0 | Response status code does not indicate success: 404 (Not Found). |
| /work-os/primary-write-dry-run | FAIL | 404 | 0 | Response status code does not indicate success: 404 (Not Found). |
| /api/v1/work-os/v77-goodday-ui-parity | FAIL | 404 | 0 | Response status code does not indicate success: 404 (Not Found). |
| /api/v1/work-os/v77-goodday-ui-parity/health | FAIL | 404 | 0 | Response status code does not indicate success: 404 (Not Found). |
| /api/v1/work-os/v77-goodday-ui-parity/observability | FAIL | 404 | 0 | Response status code does not indicate success: 404 (Not Found). |
