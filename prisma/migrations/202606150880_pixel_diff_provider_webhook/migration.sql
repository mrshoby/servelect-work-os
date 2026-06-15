-- v8.8.0 additive-only migration: pixel diff, provider secrets metadata, inbound webhook drills.
-- No real secret values are stored here. Only metadata and ENV binding names.

CREATE TABLE IF NOT EXISTS "WorkOsPixelDiffBaseline" (
  "id" TEXT PRIMARY KEY,
  "route" TEXT NOT NULL,
  "baselineFile" TEXT NOT NULL,
  "threshold" DOUBLE PRECISION NOT NULL DEFAULT 0.2,
  "lastResult" TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "WorkOsProviderSecretBinding" (
  "id" TEXT PRIMARY KEY,
  "provider" TEXT NOT NULL,
  "envName" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'missing_or_masked',
  "owner" TEXT NOT NULL,
  "rotationDays" INTEGER NOT NULL DEFAULT 45,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "WorkOsInboundWebhookDrill" (
  "id" TEXT PRIMARY KEY,
  "source" TEXT NOT NULL,
  "signatureStatus" TEXT NOT NULL,
  "payloadHash" TEXT,
  "idempotencyKey" TEXT,
  "result" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "WorkOsDeadLetterRecovery" (
  "id" TEXT PRIMARY KEY,
  "reason" TEXT NOT NULL,
  "recovery" TEXT NOT NULL,
  "approvalGate" TEXT NOT NULL DEFAULT 'manager_required',
  "rollbackCheckpoint" TEXT,
  "state" TEXT NOT NULL DEFAULT 'waiting',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
