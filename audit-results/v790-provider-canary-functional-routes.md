# v7.9.0 Provider Canary Functional Route Smoke

BaseUrl: https://servelect-work-os-web.vercel.app
Bypass secret used: True
AllowDeploymentProtection401: False

| Route | Result | HTTP | Bytes | Note |
|---|---:|---:|---:|---|
| /taskuri | PASS | 200 | 39123 | OK |
| /taskuri/overview | PASS | 200 | 39572 | OK |
| /taskuri/my-work | PASS | 200 | 44251 | OK |
| /taskuri/inbox | PASS | 200 | 44236 | OK |
| /taskuri/tickets-notificari | PASS | 200 | 41750 | OK |
| /taskuri/board | PASS | 200 | 44310 | OK |
| /taskuri/tabel | PASS | 200 | 44244 | OK |
| /taskuri/calendar-gantt | PASS | 200 | 44333 | OK |
| /taskuri/workload-aprobari | PASS | 200 | 42276 | OK |
| /taskuri/forms | PASS | 200 | 41652 | OK |
| /taskuri/timesheets | PASS | 200 | 42228 | OK |
| /taskuri/reports | PASS | 200 | 46374 | OK |
| /taskuri/automations | PASS | 200 | 42056 | OK |
| /admin/workflows | PASS | 200 | 45969 | OK |
| /admin/custom-fields | PASS | 200 | 45996 | OK |
| /admin/goodday-observability | PASS | 200 | 49909 | OK |
| /admin/server-saved-views | PASS | 200 | 47735 | OK |
| /admin/provider-telemetry | PASS | 200 | 43079 | OK |
| /admin/provider-canary | PASS | 200 | 49872 | OK |
| /admin/shared-view-acl | PASS | 200 | 47716 | OK |
| /admin/primary-write-pilot | PASS | 200 | 46042 | OK |
| /work-os/goodday-ui-parity | PASS | 200 | 43083 | OK |
| /work-os/provider-rehearsal | PASS | 200 | 45555 | OK |
| /work-os/primary-write-dry-run | PASS | 200 | 46060 | OK |
| /work-os/provider-telemetry | PASS | 200 | 43089 | OK |
| /work-os/mutation-canary | PASS | 200 | 46022 | OK |
| /work-os/provider-canary | PASS | 200 | 49879 | OK |
| /work-os/shared-view-acl | PASS | 200 | 47724 | OK |
| /work-os/primary-write-pilot | PASS | 200 | 46049 | OK |
| /api/v1/work-os/v79-primary-write-pilot | PASS | 200 | 14231 | OK |
| /api/v1/work-os/v79-primary-write-pilot/health | PASS | 200 | 701 | OK |
| /api/v1/work-os/v79-primary-write-pilot/provider-canary | PASS | 200 | 2035 | OK |
| /api/v1/work-os/v79-primary-write-pilot/shared-view-acl | PASS | 200 | 903 | OK |
| /api/v1/work-os/v79-primary-write-pilot/mutation-pilot | PASS | 200 | 1197 | OK |
| /api/v1/work-os/v79-primary-write-pilot/observability | PASS | 200 | 6481 | OK |
