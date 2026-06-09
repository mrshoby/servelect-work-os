# SERVELECT WORK OS v6.6.0 - Real Taskuri route functional smoke test

BaseUrl: http://127.0.0.1:3100
Generated: 2026-06-09T11:54:22.1418435+03:00

| Route | HTTP | Bytes | Result |
|---|---:|---:|---|
| /taskuri | 200 | 66008 | PASS |
| /taskuri/overview | 200 | 66455 | PASS |
| /taskuri/my-work | 200 | 72082 | PASS |
| /taskuri/tickets-notificari | 200 | 81585 | PASS |
| /taskuri/proiecte-active | 200 | 61790 | PASS |
| /taskuri/proiecte-viitoare | 200 | 63194 | PASS |
| /taskuri/proiecte-finalizate | 200 | 60728 | PASS |
| /taskuri/board | 200 | 229599 | PASS |
| /taskuri/tabel | 200 | 419608 | PASS |
| /taskuri/calendar-gantt | 200 | 71263 | PASS |
| /taskuri/workload-aprobari | 200 | 59172 | PASS |
| /api/v1/work-os/goodday-parity | 0 | 0 | FAIL: Response status code does not indicate success: 404 (Not Found). |
