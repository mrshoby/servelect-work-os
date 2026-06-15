-- SERVELECT WORK OS v8.4.0
-- Database Adapter Transaction Execution & Provider Dispatch Worker
-- Additive-only runtime tables for adapter execution, dispatch leases and dead-letter recovery.

CREATE TABLE IF NOT EXISTS "WorkOsAdapterExecution" (
  "id" TEXT PRIMARY KEY,
  "adapterId" TEXT NOT NULL,
  "mode" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "actorId" TEXT NOT NULL,
  "department" TEXT NOT NULL,
  "lockVersion" INTEGER NOT NULL DEFAULT 0,
  "policyDecision" TEXT NOT NULL,
  "rollbackCheckpoint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "WorkOsDispatchLease" (
  "id" TEXT PRIMARY KEY,
  "outboxEventId" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "workerId" TEXT NOT NULL,
  "leaseUntil" TIMESTAMP(3) NOT NULL,
  "attempt" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL,
  "lastError" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "WorkOsDeadLetterEvent" (
  "id" TEXT PRIMARY KEY,
  "sourceQueueId" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "recoveryAction" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "resolvedAt" TIMESTAMP(3)
);

CREATE INDEX IF NOT EXISTS "WorkOsAdapterExecution_department_idx" ON "WorkOsAdapterExecution" ("department");
CREATE INDEX IF NOT EXISTS "WorkOsDispatchLease_provider_status_idx" ON "WorkOsDispatchLease" ("provider", "status");
CREATE INDEX IF NOT EXISTS "WorkOsDeadLetterEvent_provider_idx" ON "WorkOsDeadLetterEvent" ("provider");
