# v8.0.0 Production Pilot Functional Route/API Test

BaseUrl: https://servelect-work-os-web.vercel.app
Passed: 16 / 24

| Route | Result | HTTP | Bytes | Note |
|---|---:|---:|---:|---|
| /taskuri | PASS | 200 | 39164 | OK |
| /taskuri/overview | PASS | 200 | 39613 | OK |
| /taskuri/my-work | PASS | 200 | 44304 | OK |
| /taskuri/tickets-notificari | PASS | 200 | 41797 | OK |
| /taskuri/board | PASS | 200 | 44354 | OK |
| /taskuri/tabel | PASS | 200 | 44297 | OK |
| /taskuri/calendar-gantt | PASS | 200 | 44377 | OK |
| /taskuri/workload-aprobari | PASS | 200 | 42326 | OK |
| /taskuri/forms | PASS | 200 | 41699 | OK |
| /taskuri/timesheets | PASS | 200 | 42278 | OK |
| /taskuri/reports | PASS | 200 | 46428 | OK |
| /taskuri/automations | PASS | 200 | 42106 | OK |
| /admin/workflows | PASS | 200 | 46023 | OK |
| /admin/custom-fields | PASS | 200 | 46050 | OK |
| /admin/primary-write-pilot | PASS | 200 | 46096 | OK |
| /admin/production-pilot-readiness | FAIL | ERR | 0 | Response status code does not indicate success: 404 (Not Found). |
| /work-os/primary-write-pilot | PASS | 200 | 46103 | OK |
| /work-os/production-pilot-readiness | FAIL | ERR | 0 | Response status code does not indicate success: 404 (Not Found). |
| /api/v1/work-os/v80-production-pilot | FAIL | ERR | 0 | Response status code does not indicate success: 404 (Not Found). |
| /api/v1/work-os/v80-production-pilot/health | FAIL | ERR | 0 | Response status code does not indicate success: 404 (Not Found). |
| /api/v1/work-os/v80-production-pilot/acl-evaluation | FAIL | ERR | 0 | Response status code does not indicate success: 404 (Not Found). |
| /api/v1/work-os/v80-production-pilot/mutation-guard | FAIL | ERR | 0 | Response status code does not indicate success: 404 (Not Found). |
| /api/v1/work-os/v80-production-pilot/rollback-drill | FAIL | ERR | 0 | Response status code does not indicate success: 404 (Not Found). |
| /api/v1/work-os/v80-production-pilot/provider-readiness | FAIL | ERR | 0 | Response status code does not indicate success: 404 (Not Found). |
