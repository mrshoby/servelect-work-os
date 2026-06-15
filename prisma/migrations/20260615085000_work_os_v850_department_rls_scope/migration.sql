-- SERVELECT WORK OS v8.5.0
-- Enterprise Department Suite, RLS proof and scoped bulk write pilot.
-- Additive-only migration. Does not enable global writes.

CREATE TABLE IF NOT EXISTS "WorkOsDepartmentWriteScope" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT NOT NULL DEFAULT 'servelect',
  "departmentId" TEXT NOT NULL,
  "departmentName" TEXT NOT NULL,
  "scopeType" TEXT NOT NULL,
  "allowedEntities" TEXT NOT NULL,
  "blockedEntities" TEXT NOT NULL,
  "writeModes" TEXT NOT NULL,
  "requiresApprovalFor" TEXT NOT NULL,
  "maxBulkItems" INTEGER NOT NULL DEFAULT 10,
  "ownerRole" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "WorkOsRlsPolicyProof" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT NOT NULL DEFAULT 'servelect',
  "policyName" TEXT NOT NULL,
  "tableName" TEXT NOT NULL,
  "tenantScope" TEXT NOT NULL,
  "departmentScope" TEXT NOT NULL,
  "teamScope" TEXT NOT NULL,
  "clientScope" TEXT NOT NULL,
  "sampleAllowed" INTEGER NOT NULL DEFAULT 0,
  "sampleBlocked" INTEGER NOT NULL DEFAULT 0,
  "result" TEXT NOT NULL,
  "risk" TEXT NOT NULL,
  "evidenceJson" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "WorkOsBulkActionGuardrail" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT NOT NULL DEFAULT 'servelect',
  "entityType" TEXT NOT NULL,
  "operation" TEXT NOT NULL,
  "affectedCount" INTEGER NOT NULL,
  "requesterActorId" TEXT NOT NULL,
  "departmentId" TEXT NOT NULL,
  "policyDecision" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "dryRunOnly" BOOLEAN NOT NULL DEFAULT true,
  "rollbackCheckpoint" TEXT NOT NULL,
  "notesJson" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "WorkOsDepartmentWriteScope_departmentId_idx" ON "WorkOsDepartmentWriteScope" ("departmentId");
CREATE INDEX IF NOT EXISTS "WorkOsRlsPolicyProof_tableName_idx" ON "WorkOsRlsPolicyProof" ("tableName");
CREATE INDEX IF NOT EXISTS "WorkOsBulkActionGuardrail_departmentId_status_idx" ON "WorkOsBulkActionGuardrail" ("departmentId", "status");
