-- SERVELECT WORK OS v7.5.0
-- Conflict resolution, access inheritance and attachment storage scaffold.
-- Primary writes remain gated. Apply only after review in controlled environment.

CREATE TABLE IF NOT EXISTS work_os_conflict_records (
  id TEXT PRIMARY KEY,
  entity_kind TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  local_version INTEGER NOT NULL,
  remote_version INTEGER NOT NULL,
  base_hash TEXT NOT NULL,
  local_hash TEXT NOT NULL,
  remote_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  resolution TEXT,
  actor_id TEXT NOT NULL,
  route TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS work_os_access_rules (
  id TEXT PRIMARY KEY,
  scope TEXT NOT NULL,
  scope_id TEXT NOT NULL,
  inherited_from TEXT,
  principal_type TEXT NOT NULL,
  principal_id TEXT NOT NULL,
  permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
  effect TEXT NOT NULL DEFAULT 'allow',
  locked BOOLEAN NOT NULL DEFAULT FALSE,
  evidence TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS work_os_attachment_records (
  id TEXT PRIMARY KEY,
  entity_kind TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL DEFAULT 0,
  provider TEXT NOT NULL DEFAULT 'r2_ready',
  bucket TEXT NOT NULL,
  object_key TEXT NOT NULL,
  checksum TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  uploaded_by TEXT NOT NULL,
  can_download BOOLEAN NOT NULL DEFAULT FALSE,
  can_delete BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_work_os_conflict_entity ON work_os_conflict_records(entity_kind, entity_id);
CREATE INDEX IF NOT EXISTS idx_work_os_access_scope ON work_os_access_rules(scope, scope_id);
CREATE INDEX IF NOT EXISTS idx_work_os_attachment_entity ON work_os_attachment_records(entity_kind, entity_id);
