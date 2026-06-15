# v8.0.0 — Production Pilot Readiness, Authenticated ACL Enforcement & Rollback Drill

## Added

- New Work OS/Admin route: `/work-os/production-pilot-readiness`.
- New Admin route: `/admin/production-pilot-readiness`.
- Existing primary write pilot routes updated to v8.0 surfaces: `/work-os/primary-write-pilot`, `/admin/primary-write-pilot`.
- New v8 API family: `/api/v1/work-os/v80-production-pilot/*`.
- Authenticated ACL model for actor/role/department/team/client scope.
- Mutation guard requiring ACL + actor + lockVersion + rollback checkpoint.
- Rollback drill evidence model.
- Provider runtime readiness model for in_app/email/push/websocket.
- v8 screenshot audit script.
- v8 functional route/API smoke test script.
- GoodDay live UI/UX analysis and Servelect design-system refinement.

## Changed

- Versions updated to 8.0.0 in root package, web package and release files.
- Release manifest updated to v8.0.0 and v8.1.0 recommendation.
- NEXT_BUILD_PLAN.md updated to continue toward authenticated session binding + staging DB write pilot.

## Still gated

- Primary writes remain globally closed.
- Push/websocket providers require real credentials/runtime.
- Real session binding to ACL evaluator is not yet wired.
- Staging DB rollback drill still must be executed before broad writes.
