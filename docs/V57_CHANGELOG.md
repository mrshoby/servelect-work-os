# V57 Changelog

## Added

- `apps/web/lib/enterprise/work-os-data-switchboard.ts`
- `apps/web/components/work-os/V57DatabaseAdapterSwitchboard.tsx`
- `/work-os/data-switchboard`
- `/admin/work-os-data-switchboard`
- `/api/v1/work-os/data-switchboard`
- `/api/v1/work-os/data-switchboard/mutations`
- Sidebar entry: DB Switchboard 5.7
- PowerShell route smoke test: `scripts/work-os-data-switchboard-test.ps1`

## Changed

- Package versions updated to `5.7.0` by apply script.
- Sidebar visible brand changes from older Enterprise label to `Work OS · v5.7`.

## Safety

- No destructive production writes enabled.
- Mutation endpoint returns shadow-safe payload unless write mode is explicitly enabled.
- Prisma adapter remains blocked/shadow unless `DATABASE_URL` exists and write mode allows it.

## Known warnings

Existing lint warnings about unused imports may remain in older admin pages. The v5.7 patch avoids adding new blocking lint/type errors.
