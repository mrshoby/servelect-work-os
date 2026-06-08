# v6.1.0 Changelog

## Added

- Workflow automation engine library.
- SLA command center data model and UI.
- Cross-module task factory.
- Operations command center route.
- Admin workflow governance page.
- API routes for rules, SLA, task factory and command center.
- GoodDay parity scorecard for automation/SLA/task factory.
- Smoke test script.

## Changed

- Package versions are updated to 6.1.0 by the apply script.
- Work OS roadmap now continues after v6.0 into workflow automation and custom workflow operations.

## Safety

- No destructive writes are enabled by default.
- Workflow actions are tagged with write modes and audit requirements.
- Approval-required workflows remain non-destructive.
