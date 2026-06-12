-- v7.9.0 Provider Canary Activation, Shared View ACL & Primary Write Pilot
-- Safe schema scaffold only. Apply manually after DB review.

CREATE TABLE IF NOT EXISTS work_os_provider_canary_runs (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  mode TEXT NOT NULL,
  health TEXT NOT NULL,
  secret_source TEXT NOT NULL,
  success_rate INTEGER NOT NULL DEFAULT 0,
  p95_ms INTEGER NOT NULL DEFAULT 0,
  queue_depth INTEGER NOT NULL DEFAULT 0,
  evidence TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS work_os_shared_view_acl (
  id TEXT PRIMARY KEY,
  saved_view_id TEXT NOT NULL,
  scope TEXT NOT NULL,
  department TEXT,
  permissions TEXT NOT NULL,
  acl_state TEXT NOT NULL,
  sync_version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS work_os_primary_write_pilots (
  id TEXT PRIMARY KEY,
  entity TEXT NOT NULL,
  action TEXT NOT NULL,
  state TEXT NOT NULL,
  write_state TEXT NOT NULL,
  dry_run_sql TEXT NOT NULL,
  rollback_checkpoint TEXT NOT NULL,
  lock_version INTEGER NOT NULL DEFAULT 1,
  evidence TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
