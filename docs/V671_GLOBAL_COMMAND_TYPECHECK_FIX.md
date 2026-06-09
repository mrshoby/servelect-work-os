# SERVELECT WORK OS v6.7.2 - Global Command Typecheck Fix

This hotfix repairs the v6.7.0 Global Command Integration typecheck failure.

## Fixed

- Replaced non-existing workload property `loadPercent` with existing `utilization`.
- Replaced non-existing workload property `assignedMinutes` with existing `estimated`.
- Replaced non-existing workload property `capacityMinutes` with existing `weeklyCapacity`.
- Updated package versions from 6.7.0 to 6.7.2 where applicable.

## Scope

No visual redesign. No functional workflow change. Only type-safe property alignment with `calculateWorkload()`.
