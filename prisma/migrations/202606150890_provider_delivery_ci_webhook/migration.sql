-- v8.9.0 additive-only migration scaffold
-- Real Provider Delivery Worker, GitHub Pixel-Diff CI & Signed Webhook Intake

CREATE TABLE IF NOT EXISTS "WorkOsProviderDeliveryAttempt" (
  "id" TEXT PRIMARY KEY,
  "provider" TEXT NOT NULL,
  "mode" TEXT NOT NULL DEFAULT 'dry_run',
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "attempt" INTEGER NOT NULL DEFAULT 0,
  "nextRetryAt" TIMESTAMP,
  "deadLetterReason" TEXT,
  "rollbackCheckpointId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "WorkOsSignedWebhookEvent" (
  "id" TEXT PRIMARY KEY,
  "provider" TEXT NOT NULL,
  "signatureStatus" TEXT NOT NULL,
  "timestampDriftMs" INTEGER,
  "idempotencyKey" TEXT NOT NULL,
  "payloadHash" TEXT NOT NULL,
  "replayStatus" TEXT NOT NULL DEFAULT 'blocked',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "WorkOsSignedWebhookEvent_idempotencyKey_key"
ON "WorkOsSignedWebhookEvent" ("idempotencyKey");

CREATE TABLE IF NOT EXISTS "WorkOsPixelDiffCiGate" (
  "id" TEXT PRIMARY KEY,
  "route" TEXT NOT NULL,
  "baselinePng" TEXT NOT NULL,
  "currentPng" TEXT,
  "diffPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "thresholdWarn" DOUBLE PRECISION NOT NULL DEFAULT 1.5,
  "thresholdFail" DOUBLE PRECISION NOT NULL DEFAULT 3.0,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
