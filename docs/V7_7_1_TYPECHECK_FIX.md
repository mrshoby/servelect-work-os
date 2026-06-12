# v7.7.1 - GoodDay UI Functional Parity Typecheck Fix

## Fix
Fixed JSX parser/typecheck error in `components/work-os/V77GoodDayUiParityClient.tsx`.

The raw JSX text arrow between automation trigger and action was changed from raw text into a JSX string expression:

- before: `{automation.trigger} -> {automation.action}`
- after: `{automation.trigger} {" -> "} {automation.action}`

## Scope
No redesign, no route changes, no new features. This is a strict typecheck hotfix for v7.7.0.

## QA
This apply script runs:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
