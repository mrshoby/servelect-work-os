-- SERVELECT WORK OS v7.8.0 provider telemetry / mutation canary / server saved views scaffold
-- Primary writes remain gated. Apply only after DB migration policy is confirmed.

CREATE TABLE IF NOT EXISTS work_os_provider_telemetry_shadow (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  status TEXT NOT NULL,
  last_probe_at TIMESTAMP,
  p95_ms INTEGER NOT NULL DEFAULT 0,
  success_rate INTEGER NOT NULL DEFAULT 0,
  queued INTEGER NOT NULL DEFAULT 0,
  delivered INTEGER NOT NULL DEFAULT 0,
  failed INTEGER NOT NULL DEFAULT 0,
  evidence TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS work_os_server_saved_views_shadow (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  route TEXT NOT NULL,
  scope TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  department TEXT NOT NULL,
  filters_json TEXT NOT NULL,
  columns_json TEXT NOT NULL,
  density TEXT NOT NULL,
  server_state TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS work_os_mutation_canary_shadow (
  id TEXT PRIMARY KEY,
  entity TEXT NOT NULL,
  action TEXT NOT NULL,
  state TEXT NOT NULL,
  lock_version INTEGER NOT NULL DEFAULT 1,
  read_replica_ok BOOLEAN NOT NULL DEFAULT FALSE,
  rollback_checkpoint TEXT NOT NULL,
  evidence TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
