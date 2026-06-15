# v8.5.0 Functional Test Report

Functional smoke script:

`./scripts/work-os-v850-functional-test.ps1`

Routes covered:

- Taskuri baseline routes
- Admin control routes v8.0-v8.5
- Work OS control routes v8.0-v8.5
- API v80-v85 core endpoints
- v85 sub-endpoints for session adapter, RLS proof, department write scopes, bulk actions, provider runtime, RBAC drill and runtime proof

Expected acceptance threshold: all routes PASS on Vercel after GitHub deployment.
