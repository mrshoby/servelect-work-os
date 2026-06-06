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

export type ControlledWriteMode = "off" | "shadow" | "staging-controlled" | "production-ready";
export type ControlledWriteDecision = "allowed-in-staging" | "blocked" | "requires-approval";

export type ControlledWriteGate = {
  key: string;
  label: string;
  mode: ControlledWriteMode;
  enabled: boolean;
  readiness: number;
  decision: ControlledWriteDecision;
  safetyCheck: string;
};

export type StagingMutation = {
  id: string;
  operation: "create" | "update" | "status-change" | "assign" | "archive-request";
  source: "ui" | "api" | "automation";
  prismaTarget: string;
  writeMode: ControlledWriteMode;
  allowedRoles: string[];
  auditRequired: boolean;
  rollbackRequired: boolean;
};

export type RollbackGuard = {
  id: string;
  label: string;
  required: boolean;
  status: "ready" | "partial" | "blocked";
  notes: string;
};

export type ControlledPrismaTaskWritesRelease = {
  ok: boolean;
  version: string;
  name: string;
  generatedAt: string;
  provider: "prisma-staging" | "prisma-shadow";
  writeMode: ControlledWriteMode;
  productionWritesEnabled: boolean;
  stagingWritesEnabled: boolean;
  summary: string;
  areas: ProductionArea[];
  gates: ControlledWriteGate[];
  mutations: StagingMutation[];
  rollbackGuards: RollbackGuard[];
  nextBuild: string;
};

export function getControlledPrismaTaskWritesStaging(): ControlledPrismaTaskWritesRelease {
  const areas: ProductionArea[] = [
    {
      id: "website",
      label: "Website/Web App",
      completion: 93,
      status: "stable",
      summary: "Web task surfaces, admin governance pages and release dashboards are active."
    },
    {
      id: "taskProjectCore",
      label: "Task & Project Core",
      completion: 92,
      status: "beta",
      summary: "Task lifecycle, board, drawer, create/update, shadow audit and controlled-write contracts are staged."
    },
    {
      id: "backendApi",
      label: "Backend/API",
      completion: 88,
      status: "beta",
      summary: "Task APIs, enterprise endpoints, health checks, staging write-gates and rollback contracts are available."
    },
    {
      id: "databasePrismaSeed",
      label: "Database/Prisma/Seed",
      completion: 86,
      status: "partial",
      summary: "Prisma read shadow, mutation audit and staging-controlled write plan are ready for validation."
    },
    {
      id: "authRbac",
      label: "Auth/RBAC",
      completion: 74,
      status: "partial",
      summary: "RBAC enforcement is explicit for controlled writes; final auth binding must be verified before production writes."
    },
    {
      id: "iotOps",
      label: "IoT/Ops",
      completion: 48,
      status: "mock",
      summary: "Ops/IoT signals remain mock-first but are represented in the production readiness model."
    },
    {
      id: "mobileApp",
      label: "Mobile App",
      completion: 40,
      status: "mock",
      summary: "Mobile app is still not production-ready but can consume read-only task state later."
    }
  ];

  const gates: ControlledWriteGate[] = [
    {
      key: "staging-write-enable",
      label: "Enable Prisma writes only in staging",
      mode: "staging-controlled",
      enabled: true,
      readiness: 86,
      decision: "allowed-in-staging",
      safetyCheck: "Requires STAGING_WRITE_GATE=true and productionWritesEnabled=false."
    },
    {
      key: "production-write-block",
      label: "Block production task writes",
      mode: "off",
      enabled: false,
      readiness: 100,
      decision: "blocked",
      safetyCheck: "Production writes remain blocked until audit persistence and rollback are verified."
    },
    {
      key: "rbac-controlled-write",
      label: "RBAC checked before write",
      mode: "staging-controlled",
      enabled: true,
      readiness: 78,
      decision: "requires-approval",
      safetyCheck: "Admin and Manager can stage writes; Inginer limited; Tehnician status-only."
    },
    {
      key: "audit-before-after",
      label: "Before/after audit payload",
      mode: "staging-controlled",
      enabled: true,
      readiness: 82,
      decision: "allowed-in-staging",
      safetyCheck: "Every mutation requires actor, role, before, after, payload hash and timestamp."
    },
    {
      key: "rollback-record",
      label: "Rollback record generated",
      mode: "staging-controlled",
      enabled: true,
      readiness: 80,
      decision: "allowed-in-staging",
      safetyCheck: "Every write must include a reversible rollback payload before commit."
    }
  ];

  const mutations: StagingMutation[] = [
    {
      id: "stage-task-create",
      operation: "create",
      source: "ui",
      prismaTarget: "Task",
      writeMode: "staging-controlled",
      allowedRoles: ["Admin", "Manager", "Inginer"],
      auditRequired: true,
      rollbackRequired: true
    },
    {
      id: "stage-task-update",
      operation: "update",
      source: "api",
      prismaTarget: "Task",
      writeMode: "staging-controlled",
      allowedRoles: ["Admin", "Manager", "Inginer"],
      auditRequired: true,
      rollbackRequired: true
    },
    {
      id: "stage-status-change",
      operation: "status-change",
      source: "ui",
      prismaTarget: "Task.status",
      writeMode: "staging-controlled",
      allowedRoles: ["Admin", "Manager", "Inginer", "Tehnician"],
      auditRequired: true,
      rollbackRequired: true
    },
    {
      id: "stage-assignment",
      operation: "assign",
      source: "automation",
      prismaTarget: "Task.assigneeId",
      writeMode: "staging-controlled",
      allowedRoles: ["Admin", "Manager"],
      auditRequired: true,
      rollbackRequired: true
    },
    {
      id: "stage-archive-request",
      operation: "archive-request",
      source: "api",
      prismaTarget: "Task.archivedAt",
      writeMode: "shadow",
      allowedRoles: ["Admin"],
      auditRequired: true,
      rollbackRequired: true
    }
  ];

  const rollbackGuards: RollbackGuard[] = [
    {
      id: "rollback-snapshot",
      label: "Before snapshot stored",
      required: true,
      status: "ready",
      notes: "Before state is required for update, status change, assignment and archive request."
    },
    {
      id: "rollback-command",
      label: "Rollback command generated",
      required: true,
      status: "partial",
      notes: "Rollback payload is defined; execution remains staging-only."
    },
    {
      id: "rollback-audit-link",
      label: "Rollback linked to audit event",
      required: true,
      status: "ready",
      notes: "Every rollback guard references the original audit event id."
    },
    {
      id: "rollback-delete-block",
      label: "Hard delete blocked",
      required: true,
      status: "ready",
      notes: "Hard delete remains unavailable; only archive request can be staged."
    }
  ];

  return {
    ok: true,
    version: "3.7.0",
    name: "Controlled Prisma Task Writes Staging",
    generatedAt: new Date().toISOString(),
    provider: "prisma-staging",
    writeMode: "staging-controlled",
    productionWritesEnabled: false,
    stagingWritesEnabled: true,
    summary:
      "Stages controlled Prisma task writes behind explicit safety gates, RBAC checks, immutable audit payloads and rollback guards. Production writes remain OFF.",
    areas,
    gates,
    mutations,
    rollbackGuards,
    nextBuild: "v3.8.0 — Staging Task Writes E2E Validation & Rollback Drill"
  };
}

export function getControlledPrismaTaskWritesHealth() {
  const release = getControlledPrismaTaskWritesStaging();
  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    provider: release.provider,
    writeMode: release.writeMode,
    productionWritesEnabled: release.productionWritesEnabled,
    stagingWritesEnabled: release.stagingWritesEnabled,
    readiness: Math.round(release.areas.reduce((sum, area) => sum + area.completion, 0) / release.areas.length),
    gates: release.gates,
    summary: release.summary
  };
}

export function getControlledPrismaTaskWritesStagingRunbook() {
  const release = getControlledPrismaTaskWritesStaging();
  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    stagingWritesEnabled: release.stagingWritesEnabled,
    productionWritesEnabled: release.productionWritesEnabled,
    mutations: release.mutations,
    runbook: [
      "Enable staging write gate only in staging environment.",
      "Run create/update/status-change scenarios with RBAC role matrix.",
      "Verify audit event contains actor, role, before, after and payload hash.",
      "Verify rollback payload is generated before mutation commit.",
      "Keep production write gate OFF until v3.8 rollback drill is green."
    ]
  };
}

export function getControlledPrismaTaskWritesRollbackPlan() {
  const release = getControlledPrismaTaskWritesStaging();
  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    rollbackGuards: release.rollbackGuards,
    rollbackMode: "staging-only",
    productionRollbackEnabled: false
  };
}

export function getControlledPrismaTaskWritesPlan() {
  const release = getControlledPrismaTaskWritesStaging();
  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    plan: [
      "Validate staging write gate with seeded task data.",
      "Run E2E staging write scenarios from UI and API.",
      "Compare Prisma state, audit events and rollback payloads after each mutation.",
      "Prove rollback drill for update/status/assignment mutations.",
      "Promote only create/update/status-change to production-controlled mode after v3.8."
    ],
    nextBuild: release.nextBuild
  };
}
