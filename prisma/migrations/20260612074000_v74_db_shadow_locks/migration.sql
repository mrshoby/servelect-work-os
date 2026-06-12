-- SERVELECT WORK OS v7.4.0
-- DB-backed shadow writes, notification worker queue and optimistic locking scaffold.
-- Primary writes remain gated. Apply only in a controlled shadow database first.

CREATE TABLE IF NOT EXISTS work_os_shadow_write_locks (
  id TEXT PRIMARY KEY,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  owner_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(entity, entity_id, version)
);

CREATE TABLE IF NOT EXISTS work_os_db_shadow_writes (
  id TEXT PRIMARY KEY,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'shadow_written',
  lock_id TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  before_hash TEXT NOT NULL,
  after_hash TEXT NOT NULL,
  rollback_id TEXT NOT NULL,
  queue_id TEXT,
  actor_id TEXT NOT NULL,
  department TEXT NOT NULL,
  route TEXT NOT NULL,
  payload_json TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS work_os_notification_worker_queue (
  id TEXT PRIMARY KEY,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  channel TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  route TEXT NOT NULL,
  payload_title TEXT NOT NULL,
  last_error TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  delivered_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_work_os_shadow_write_locks_entity ON work_os_shadow_write_locks(entity, entity_id, status);
CREATE INDEX IF NOT EXISTS idx_work_os_db_shadow_writes_entity ON work_os_db_shadow_writes(entity, entity_id, status);
CREATE INDEX IF NOT EXISTS idx_work_os_notification_worker_queue_status ON work_os_notification_worker_queue(status, channel);
