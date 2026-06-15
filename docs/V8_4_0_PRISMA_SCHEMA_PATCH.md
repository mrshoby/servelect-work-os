# V8.4.0 Prisma Schema Patch

Append these additive models to `prisma/schema.prisma` if the project uses Prisma migrations.

```prisma
model WorkOsAdapterExecution {
  id                 String   @id
  adapterId          String
  mode               String
  entityType         String
  entityId           String
  actorId            String
  department         String
  lockVersion        Int      @default(0)
  policyDecision     String
  rollbackCheckpoint String
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  @@index([department])
}

model WorkOsDispatchLease {
  id            String   @id
  outboxEventId String
  provider      String
  workerId      String
  leaseUntil    DateTime
  attempt       Int      @default(0)
  status        String
  lastError     String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([provider, status])
}

model WorkOsDeadLetterEvent {
  id             String    @id
  sourceQueueId  String
  provider       String
  entityId       String
  reason         String
  recoveryAction String
  createdAt      DateTime  @default(now())
  resolvedAt     DateTime?

  @@index([provider])
}
```

This remains additive-only and does not enable global production writes.
