-- v8.7.0 additive-only migration: provider credentials, webhook signatures and pilot mutation replay.
-- Safe to review before applying; does not enable global production writes.

CREATE TABLE IF NOT EXISTS "WorkOsProviderCredentialEvidence" (
  "id" TEXT PRIMARY KEY,
  "provider" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "secretSource" TEXT NOT NULL,
  "scope" TEXT NOT NULL,
  "lastRotation" TEXT,
  "evidence" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "WorkOsWebhookSignatureProof" (
  "id" TEXT PRIMARY KEY,
  "eventId" TEXT NOT NULL,
  "algorithm" TEXT NOT NULL DEFAULT 'HMAC-SHA256',
  "timestamp" TIMESTAMP(3) NOT NULL,
  "verified" BOOLEAN NOT NULL DEFAULT false,
  "replayWindowSeconds" INTEGER NOT NULL DEFAULT 300,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "WorkOsPilotMutationReplay" (
  "id" TEXT PRIMARY KEY,
  "entity" TEXT NOT NULL,
  "actor" TEXT NOT NULL,
  "department" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "decision" TEXT NOT NULL,
  "lockVersion" INTEGER NOT NULL DEFAULT 0,
  "rollbackCheckpoint" TEXT NOT NULL,
  "proof" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "WorkOsPilotMutationReplay_department_state_idx" ON "WorkOsPilotMutationReplay"("department", "state");
CREATE INDEX IF NOT EXISTS "WorkOsProviderCredentialEvidence_provider_status_idx" ON "WorkOsProviderCredentialEvidence"("provider", "status");
