# SERVELECT WORK OS v6.6.2 - Taskuri GoodDay Core Typecheck and Script Fix

## Fix 1 - PowerShell parser

v6.6.1 failed before patching because the apply script used a double-quoted here-string containing markdown backticks. PowerShell interpreted those backticks as escape characters and broke on the word undefined.

This v6.6.2 script avoids that pattern and uses safe quoting.

## Fix 2 - TypeScript nullable selected task/ticket

TaskDrawer requires strict null values, while byId can return undefined. The patch forces both values to resolve to either the entity or null.

Changed file:

- apps/web/components/work-os/TaskuriGoodDayIntegrationClient.tsx

No Taskuri UI, design or layout changes were made in this fix.

## QA

Run:

pnpm typecheck
pnpm lint
pnpm build
