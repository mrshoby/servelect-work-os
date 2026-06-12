-- SERVELECT WORK OS v7.3.0
-- Shadow records, rollback checkpoints and notification delivery queue.
-- Safe migration scaffold only. Primary writes stay gated by application feature flags.

CREATE TABLE IF NOT EXISTS work_os_shadow_records (
  id TEXT PRIMARY KEY,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  source TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  department TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  before_hash TEXT,
  after_hash TEXT,
  rollback_id TEXT,
  status TEXT NOT NULL DEFAULT 'shadow_written',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS work_os_rollback_checkpoints (
  id TEXT PRIMARY KEY,
  shadow_record_id TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  rollback_mode TEXT NOT NULL,
  evidence_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  used_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS work_os_notification_delivery_queue (
  id TEXT PRIMARY KEY,
  notification_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  entity TEXT,
  entity_id TEXT,
  route TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'in_app',
  status TEXT NOT NULL DEFAULT 'queued',
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  delivered_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_work_os_shadow_records_entity ON work_os_shadow_records(entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_work_os_shadow_records_created ON work_os_shadow_records(created_at);
CREATE INDEX IF NOT EXISTS idx_work_os_queue_user_status ON work_os_notification_delivery_queue(user_id, status);
CREATE INDEX IF NOT EXISTS idx_work_os_rollback_shadow ON work_os_rollback_checkpoints(shadow_record_id);
