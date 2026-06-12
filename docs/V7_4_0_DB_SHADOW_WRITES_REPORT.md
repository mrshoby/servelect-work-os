# v7.4.0 DB Shadow Writes Report

v7.4.0 moves from schema/readiness into DB-backed shadow write contracts:

- Shadow writes include entity, action, version, lock id, hashes and rollback id.
- Optimistic locks are created before each shadow write.
- Rollback evidence is created with previous/next hash pairs.
- Notification jobs can be queued and processed in in-app readiness mode.
- Primary database writes remain blocked by design.

Status: REAL_LOCAL_PERSISTENT / API_SHADOW_READY, not primary production writes.
