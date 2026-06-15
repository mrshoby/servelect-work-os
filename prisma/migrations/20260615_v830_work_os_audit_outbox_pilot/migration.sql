-- v8.3.0 Work OS audit/outbox transaction pilot
-- Additive only. Does not enable global production writes.

CREATE TABLE IF NOT EXISTS "WorkOsAuditEvent" (
  "id" TEXT PRIMARY KEY,
  "transactionId" TEXT NOT NULL,
  "actorId" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "decision" TEXT NOT NULL,
  "beforeHash" TEXT NOT NULL,
  "afterHash" TEXT NOT NULL,
  "rollbackId" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "WorkOsProviderOutboxEvent" (
  "id" TEXT PRIMARY KEY,
  "transactionId" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "channelTarget" TEXT NOT NULL,
  "payload" JSONB,
  "status" TEXT NOT NULL DEFAULT 'queued',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "lastError" TEXT,
  "lastAttemptAt" TIMESTAMP(3),
  "nextRetryAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "WorkOsWriteTransactionPilot" (
  "id" TEXT PRIMARY KEY,
  "lane" TEXT NOT NULL,
  "actorId" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "lockVersion" INTEGER NOT NULL,
  "status" TEXT NOT NULL,
  "policyDecision" TEXT NOT NULL,
  "rollbackCheckpoint" TEXT NOT NULL,
  "runtimeProofId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "WorkOsRuntimeProof" (
  "id" TEXT PRIMARY KEY,
  "environment" TEXT NOT NULL,
  "baseUrl" TEXT NOT NULL,
  "apiRoute" TEXT NOT NULL,
  "lastSmokeStatus" TEXT NOT NULL DEFAULT 'pending',
  "evidence" JSONB,
  "nextProofRequired" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "WorkOsAuditEvent_transactionId_idx" ON "WorkOsAuditEvent"("transactionId");
CREATE INDEX IF NOT EXISTS "WorkOsProviderOutboxEvent_transactionId_idx" ON "WorkOsProviderOutboxEvent"("transactionId");
CREATE INDEX IF NOT EXISTS "WorkOsProviderOutboxEvent_status_idx" ON "WorkOsProviderOutboxEvent"("status");
CREATE INDEX IF NOT EXISTS "WorkOsWriteTransactionPilot_status_idx" ON "WorkOsWriteTransactionPilot"("status");
