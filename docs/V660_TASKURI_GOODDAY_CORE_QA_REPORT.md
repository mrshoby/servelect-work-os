# SERVELECT WORK OS v6.6.0 - QA Report

## Commands in apply script

- `pnpm install` only if dependency installation is not skipped and Playwright was added.
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- optional route smoke test
- optional Playwright screenshot audit

## Screenshot rule

No visual parity score is valid until the Playwright script produces 10/10 PNG files.

## Screenshot command

`pnpm screenshot:audit`

or

`pnpm audit:taskuri:screenshots`

## Expected screenshot outputs

- `SCREENSHOT_AUDIT_REPORT_v6.6.0.md`
- `SCREENSHOT_AUDIT_RESULTS_v6.6.0.csv`
- 10 PNG files for the real `/taskuri/...` routes.
