-- v9.0.0 additive-only production pilot cutover model.
CREATE TABLE IF NOT EXISTS "WorkOsPilotCutoverGate" (
  "id" TEXT PRIMARY KEY,
  "departmentId" TEXT,
  "gateType" TEXT NOT NULL,
  "gateState" TEXT NOT NULL DEFAULT 'pending',
  "evidenceJson" TEXT,
  "approvedBy" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "WorkOsProviderDispatchLedger" (
  "id" TEXT PRIMARY KEY,
  "provider" TEXT NOT NULL,
  "mode" TEXT NOT NULL,
  "payloadHash" TEXT,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "lastError" TEXT,
  "state" TEXT NOT NULL DEFAULT 'queued',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "WorkOsWebhookIntakeProof" (
  "id" TEXT PRIMARY KEY,
  "eventType" TEXT NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "payloadHash" TEXT NOT NULL,
  "signatureState" TEXT NOT NULL,
  "receivedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "processedAt" TIMESTAMP,
  "resultState" TEXT NOT NULL DEFAULT 'received'
);

CREATE UNIQUE INDEX IF NOT EXISTS "WorkOsWebhookIntakeProof_idempotencyKey_key" ON "WorkOsWebhookIntakeProof"("idempotencyKey");
CREATE INDEX IF NOT EXISTS "WorkOsProviderDispatchLedger_provider_state_idx" ON "WorkOsProviderDispatchLedger"("provider", "state");
CREATE INDEX IF NOT EXISTS "WorkOsPilotCutoverGate_department_gate_idx" ON "WorkOsPilotCutoverGate"("departmentId", "gateType");
