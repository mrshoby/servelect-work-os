# SERVELECT WORK OS v6.7.1 Global Command Functional Route Test

Generated: 2026-06-09T12:57:01
BaseUrl: http://127.0.0.1:3100
Routes PASS: 7 / 10

| Name | Route | State | HTTP | Bytes | Error |
|---|---|---:|---:|---:|---|
| dashboard | /work-os/dashboard | FAIL | 0 | 0 | Response status code does not indicate success: 404 (Not Found). |
| notifications | /notifications | PASS | 200 | 45958 |  |
| notification_center | /work-os/notification-center | PASS | 200 | 46481 |  |
| approvals | /work-os/approvals | PASS | 200 | 46306 |  |
| search | /search | FAIL | 0 | 0 | Response status code does not indicate success: 404 (Not Found). |
| action_center | /action-center | PASS | 200 | 50554 |  |
| global_command_api | /api/v1/work-os/global-command | FAIL | 0 | 0 | Response status code does not indicate success: 404 (Not Found). |
| taskuri_overview | /taskuri/overview | PASS | 200 | 66455 |  |
| taskuri_tickets | /taskuri/tickets-notificari | PASS | 200 | 81585 |  |
| taskuri_workload | /taskuri/workload-aprobari | PASS | 200 | 59172 |  |

## Notes
This smoke test validates global Work OS routes introduced in v6.7.1. It does not replace browser-level functional testing.
