CREATE TABLE IF NOT EXISTS "WorkOsAuthRuntimeClaim" (
  "id" TEXT PRIMARY KEY,
  "actorId" TEXT NOT NULL,
  "actorName" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "departmentId" TEXT NOT NULL,
  "teamId" TEXT,
  "clientScope" TEXT NOT NULL DEFAULT 'internal',
  "writeScopes" JSONB NOT NULL DEFAULT '[]',
  "policyDecision" TEXT NOT NULL DEFAULT 'dry_run',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "WorkOsRlsMiddlewareProof" (
  "id" TEXT PRIMARY KEY,
  "policyName" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "actorId" TEXT NOT NULL,
  "departmentId" TEXT NOT NULL,
  "decision" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "beforeHash" TEXT,
  "afterHash" TEXT,
  "rollbackCheckpoint" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "WorkOsDepartmentPilotWrite" (
  "id" TEXT PRIMARY KEY,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "departmentId" TEXT NOT NULL,
  "actorId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "lockVersion" INTEGER NOT NULL DEFAULT 1,
  "policyDecision" TEXT NOT NULL DEFAULT 'dry_run',
  "rollbackCheckpoint" TEXT NOT NULL,
  "providerOutboxState" TEXT NOT NULL DEFAULT 'queued_for_dry_run',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "WorkOsAuthRuntimeClaim_actorId_idx" ON "WorkOsAuthRuntimeClaim"("actorId");
CREATE INDEX IF NOT EXISTS "WorkOsRlsMiddlewareProof_departmentId_idx" ON "WorkOsRlsMiddlewareProof"("departmentId");
CREATE INDEX IF NOT EXISTS "WorkOsDepartmentPilotWrite_departmentId_idx" ON "WorkOsDepartmentPilotWrite"("departmentId");
