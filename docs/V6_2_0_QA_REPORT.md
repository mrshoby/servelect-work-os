# V6.2.0 QA Report

## Expected commands run by apply script
- `pnpm typecheck`
- `pnpm build`

## Manual checks
- `/work-os/department-command`
- `/work-os/department-task-routing`
- `/work-os/department-workload`
- `/work-os/department-approvals`
- `/admin/departments-v2`
- `/api/v1/work-os/departments`
- `/api/v1/work-os/departments/tasks?userId=u3`
- `/api/v1/work-os/departments/visibility?userId=u6&taskId=T-PRD-007`

## Notes
This build is intentionally focused on the company model and department access rules. It does not enable destructive DB writes.
