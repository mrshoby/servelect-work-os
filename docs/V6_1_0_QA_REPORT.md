# v6.1.0 QA Report

The local apply script runs:

- `pnpm typecheck`
- `pnpm build`

The script does not run `pnpm install` by default, matching the current local workflow.

## Expected manual checks

- `/work-os/workflow-automation`
- `/work-os/sla-command-center`
- `/work-os/cross-module-task-factory`
- `/work-os/operations-command-center`
- `/admin/workflow-governance`
- `/api/v1/work-os/workflow-automation/rules`
- `/api/v1/work-os/workflow-automation/sla`
- `/api/v1/work-os/workflow-automation/task-factory`
- `/api/v1/work-os/workflow-automation/command-center`

## Known notes

Older warnings about unused imports may still exist in legacy pages. The v6.1 patch itself avoids intentional unused imports.
