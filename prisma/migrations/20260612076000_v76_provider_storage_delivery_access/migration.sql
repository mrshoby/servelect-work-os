-- SERVELECT WORK OS v7.6.0
-- Signed attachment URLs, provider delivery switchboard and access-enforced mutation API.
-- Scaffold only: do not enable primary writes without backup/rollback approval.

CREATE TABLE IF NOT EXISTS work_os_signed_attachment_urls (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'servelect',
  entity_kind TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_version INTEGER NOT NULL DEFAULT 1,
  provider TEXT NOT NULL,
  bucket TEXT NOT NULL,
  object_key TEXT NOT NULL,
  checksum TEXT NOT NULL,
  status TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS work_os_provider_delivery_queue (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'servelect',
  provider TEXT NOT NULL,
  target_user_id TEXT NOT NULL,
  entity_kind TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  last_error TEXT NULL,
  next_retry_at TIMESTAMP NULL,
  delivered_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS work_os_access_enforced_mutation_guards (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'servelect',
  principal_id TEXT NOT NULL,
  entity_kind TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  requested_action TEXT NOT NULL,
  decision TEXT NOT NULL,
  inherited_from TEXT NOT NULL,
  reason TEXT NOT NULL,
  rollback_token TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_work_os_signed_attachment_entity ON work_os_signed_attachment_urls(entity_kind, entity_id);
CREATE INDEX IF NOT EXISTS idx_work_os_delivery_queue_status ON work_os_provider_delivery_queue(status, next_retry_at);
CREATE INDEX IF NOT EXISTS idx_work_os_access_guard_entity ON work_os_access_enforced_mutation_guards(entity_kind, entity_id);
