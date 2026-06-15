
// v8.3.0 Work OS audit/outbox transaction pilot models
// Additive-only schema patch. Production writes remain gated by SERVELECT_WORK_OS_WRITE_MODE.
model WorkOsAuditEvent {
  id            String   @id
  transactionId String
  actorId       String
  entityType    String
  entityId      String
  action        String
  decision      String
  beforeHash    String
  afterHash     String
  rollbackId    String
  metadata      Json?
  createdAt     DateTime @default(now())

  @@index([transactionId])
  @@index([entityType, entityId])
}

model WorkOsProviderOutboxEvent {
  id            String   @id
  transactionId String
  provider      String
  channelTarget String
  payload       Json?
  status        String   @default("queued")
  attempts      Int      @default(0)
  lastError     String?
  lastAttemptAt DateTime?
  nextRetryAt   DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([transactionId])
  @@index([provider, status])
}

model WorkOsWriteTransactionPilot {
  id                 String   @id
  lane               String
  actorId            String
  entityType         String
  entityId           String
  lockVersion        Int
  status             String
  policyDecision     String
  rollbackCheckpoint String
  runtimeProofId     String
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  @@index([status])
  @@index([entityType, entityId])
}

model WorkOsRuntimeProof {
  id                String   @id
  environment       String
  baseUrl           String
  apiRoute          String
  lastSmokeStatus   String   @default("pending")
  evidence          Json?
  nextProofRequired String
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
