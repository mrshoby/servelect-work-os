export type ProductionAreaId =
  | "website"
  | "taskProjectCore"
  | "backendApi"
  | "databasePrismaSeed"
  | "authRbac"
  | "iotOps"
  | "mobileApp";

export type ProductionAreaStatus = "stable" | "beta" | "partial" | "mock" | "blocked";

export type ProductionArea = {
  id: ProductionAreaId;
  label: string;
  completion: number;
  status: ProductionAreaStatus;
  summary: string;
};

export type RbacRole = "Admin" | "Manager" | "Inginer" | "Tehnician" | "Viewer";
export type RbacPermission = "allow" | "limited" | "deny";

export type RbacRule = {
  role: RbacRole;
  createTask: RbacPermission;
  updateTask: RbacPermission;
  changeStatus: RbacPermission;
  assignTask: RbacPermission;
  deleteTask: RbacPermission;
  auditAccess: RbacPermission;
  notes: string;
};

export type AuditEvent = {
  id: string;
  event: string;
  mode: "shadow" | "enforced" | "blocked";
  actor: RbacRole;
  target: string;
  decision: "accepted" | "requires-review" | "blocked";
  auditFields: string[];
};

export type EnforcementGate = {
  key: string;
  label: string;
  enabled: boolean;
  mode: "off" | "shadow" | "controlled" | "production";
  readiness: number;
  reason: string;
};

export type PersistentTaskAuditRbacRelease = {
  ok: boolean;
  version: string;
  name: string;
  generatedAt: string;
  isProductionWriteEnabled: boolean;
  provider: "mock-memory" | "prisma-shadow" | "prisma-controlled";
  summary: string;
  areas: ProductionArea[];
  rbac: RbacRule[];
  auditEvents: AuditEvent[];
  enforcementGates: EnforcementGate[];
  nextBuild: string;
};

export function getPersistentTaskAuditRbacEnforcement(): PersistentTaskAuditRbacRelease {
  const areas: ProductionArea[] = [
    {
      id: "website",
      label: "Website/Web App",
      completion: 92,
      status: "stable",
      summary: "Web dashboard, release status, task pages and admin governance panels are active."
    },
    {
      id: "taskProjectCore",
      label: "Task & Project Core",
      completion: 89,
      status: "beta",
      summary: "Task create/update flows, board, drawer, API bridge and production governance are in advanced beta."
    },
    {
      id: "backendApi",
      label: "Backend/API",
      completion: 85,
      status: "beta",
      summary: "Task APIs, enterprise health endpoints, write-gate endpoints and audit endpoints are available."
    },
    {
      id: "databasePrismaSeed",
      label: "Database/Prisma/Seed",
      completion: 82,
      status: "partial",
      summary: "Prisma repository, read shadow, mutation shadow and write-gate layers are staged. Production writes remain controlled."
    },
    {
      id: "authRbac",
      label: "Auth/RBAC",
      completion: 69,
      status: "partial",
      summary: "RBAC matrix is now explicit for task mutation decisions and audit access."
    },
    {
      id: "iotOps",
      label: "IoT/Ops",
      completion: 46,
      status: "mock",
      summary: "Ops/IoT remains mostly mocked but integrated into the readiness model."
    },
    {
      id: "mobileApp",
      label: "Mobile App",
      completion: 36,
      status: "mock",
      summary: "Mobile shell is present but not production-ready."
    }
  ];

  const rbac: RbacRule[] = [
    {
      role: "Admin",
      createTask: "allow",
      updateTask: "allow",
      changeStatus: "allow",
      assignTask: "allow",
      deleteTask: "limited",
      auditAccess: "allow",
      notes: "Full operational control, destructive actions still require audit trail."
    },
    {
      role: "Manager",
      createTask: "allow",
      updateTask: "allow",
      changeStatus: "allow",
      assignTask: "allow",
      deleteTask: "deny",
      auditAccess: "allow",
      notes: "Can manage team work, assignments and status flow."
    },
    {
      role: "Inginer",
      createTask: "allow",
      updateTask: "limited",
      changeStatus: "allow",
      assignTask: "limited",
      deleteTask: "deny",
      auditAccess: "limited",
      notes: "Can create and update technical work within project scope."
    },
    {
      role: "Tehnician",
      createTask: "limited",
      updateTask: "limited",
      changeStatus: "allow",
      assignTask: "deny",
      deleteTask: "deny",
      auditAccess: "deny",
      notes: "Can update execution status and field notes."
    },
    {
      role: "Viewer",
      createTask: "deny",
      updateTask: "deny",
      changeStatus: "deny",
      assignTask: "deny",
      deleteTask: "deny",
      auditAccess: "deny",
      notes: "Read-only access."
    }
  ];

  const auditEvents: AuditEvent[] = [
    {
      id: "audit-create-task",
      event: "task.create",
      mode: "shadow",
      actor: "Manager",
      target: "tasks",
      decision: "accepted",
      auditFields: ["actorId", "role", "payloadHash", "createdAt", "workspaceId"]
    },
    {
      id: "audit-update-task",
      event: "task.update",
      mode: "shadow",
      actor: "Inginer",
      target: "tasks",
      decision: "requires-review",
      auditFields: ["actorId", "before", "after", "changedFields", "updatedAt"]
    },
    {
      id: "audit-status-change",
      event: "task.status.change",
      mode: "enforced",
      actor: "Tehnician",
      target: "task.status",
      decision: "accepted",
      auditFields: ["actorId", "fromStatus", "toStatus", "device", "timestamp"]
    },
    {
      id: "audit-delete-request",
      event: "task.delete.request",
      mode: "blocked",
      actor: "Viewer",
      target: "tasks",
      decision: "blocked",
      auditFields: ["actorId", "role", "reason", "blockedAt"]
    }
  ];

  const enforcementGates: EnforcementGate[] = [
    {
      key: "rbac-mutation-check",
      label: "RBAC mutation authorization",
      enabled: true,
      mode: "controlled",
      readiness: 78,
      reason: "Role matrix is defined; final user/session binding still needs production auth integration."
    },
    {
      key: "persistent-audit-events",
      label: "Persistent task audit events",
      enabled: true,
      mode: "shadow",
      readiness: 74,
      reason: "Audit contract is ready; DB persistence remains in controlled rollout."
    },
    {
      key: "prisma-write-gate",
      label: "Prisma production write gate",
      enabled: false,
      mode: "shadow",
      readiness: 68,
      reason: "Write gate remains OFF until audited writes are verified in staging."
    },
    {
      key: "destructive-actions",
      label: "Destructive task actions",
      enabled: false,
      mode: "off",
      readiness: 30,
      reason: "Delete/archive flows must require dual approval and immutable audit records."
    }
  ];

  return {
    ok: true,
    version: "3.6.0",
    name: "Persistent Task Audit Events & RBAC Enforcement",
    generatedAt: new Date().toISOString(),
    isProductionWriteEnabled: false,
    provider: "prisma-shadow",
    summary:
      "Introduces explicit RBAC enforcement rules and persistent audit event contracts for task mutations. Prisma writes remain controlled and disabled by default.",
    areas,
    rbac,
    auditEvents,
    enforcementGates,
    nextBuild: "v3.7.0 — Controlled Prisma Task Writes Staging"
  };
}

export function getPersistentTaskAuditRbacHealth() {
  const release = getPersistentTaskAuditRbacEnforcement();
  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    provider: release.provider,
    isProductionWriteEnabled: release.isProductionWriteEnabled,
    readiness: Math.round(release.areas.reduce((sum, area) => sum + area.completion, 0) / release.areas.length),
    gates: release.enforcementGates,
    summary: release.summary
  };
}

export function getPersistentTaskAuditRbacMatrix() {
  const release = getPersistentTaskAuditRbacEnforcement();
  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    rbac: release.rbac
  };
}

export function getPersistentTaskAuditEvents() {
  const release = getPersistentTaskAuditRbacEnforcement();
  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    auditEvents: release.auditEvents,
    persistenceMode: "shadow-contract"
  };
}

export function getPersistentTaskAuditRbacPlan() {
  const release = getPersistentTaskAuditRbacEnforcement();
  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    plan: [
      "Bind RBAC decisions to real authenticated user/session.",
      "Persist task mutation audit entries through Prisma in staging.",
      "Compare mock-memory state versus Prisma shadow audit trail.",
      "Enable controlled writes for selected task mutations only.",
      "Keep destructive actions disabled until dual approval is implemented."
    ],
    nextBuild: release.nextBuild
  };
}
