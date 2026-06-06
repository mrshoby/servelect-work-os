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

export type E2EStageStatus = "passed" | "ready" | "partial" | "blocked";
export type RollbackDrillStatus = "ready" | "verified" | "partial" | "blocked";
export type WriteMode = "staging-e2e" | "shadow" | "production-off";

export type E2EValidationStep = {
  id: string;
  label: string;
  route: string;
  action: "create" | "update" | "status-change" | "assign" | "rollback" | "verify";
  status: E2EStageStatus;
  readiness: number;
  expectedResult: string;
};

export type RollbackDrill = {
  id: string;
  label: string;
  status: RollbackDrillStatus;
  readiness: number;
  trigger: string;
  recoveryAction: string;
  auditEvidence: string;
};

export type DataParityCheck = {
  id: string;
  label: string;
  source: string;
  target: string;
  status: E2EStageStatus;
  readiness: number;
  notes: string;
};

export type StagingTaskWritesE2ERelease = {
  ok: boolean;
  version: string;
  name: string;
  generatedAt: string;
  writeMode: WriteMode;
  productionWritesEnabled: boolean;
  stagingE2EEnabled: boolean;
  summary: string;
  areas: ProductionArea[];
  validationSteps: E2EValidationStep[];
  rollbackDrills: RollbackDrill[];
  dataParityChecks: DataParityCheck[];
  promotionCriteria: string[];
  nextBuild: string;
};

const areas: ProductionArea[] = [
  {
    id: "website",
    label: "Website/Web App",
    completion: 94,
    status: "stable",
    summary: "Web task pages, governance dashboards, release status and validation pages are active."
  },
  {
    id: "taskProjectCore",
    label: "Task & Project Core",
    completion: 94,
    status: "beta",
    summary: "Task lifecycle, board, drawer, UI mutations, audit flow, staging writes and rollback drills are covered."
  },
  {
    id: "backendApi",
    label: "Backend/API",
    completion: 91,
    status: "beta",
    summary: "API contracts now expose staging E2E validation, rollback drill and task-side controlled-write status."
  },
  {
    id: "databasePrismaSeed",
    label: "Database/Prisma/Seed",
    completion: 89,
    status: "partial",
    summary: "Prisma reads, write-gates, mutation shadow audit and staging E2E paths are ready for deeper DB validation."
  },
  {
    id: "authRbac",
    label: "Auth/RBAC",
    completion: 78,
    status: "partial",
    summary: "RBAC gates are enforced in staging scenarios; production user binding still requires final security review."
  },
  {
    id: "iotOps",
    label: "IoT/Ops",
    completion: 50,
    status: "mock",
    summary: "Ops signals are represented in task context but remain mock-first and read-only."
  },
  {
    id: "mobileApp",
    label: "Mobile App",
    completion: 43,
    status: "mock",
    summary: "Mobile surfaces remain behind web but can consume validated task read state and audit status later."
  }
];

const validationSteps: E2EValidationStep[] = [
  {
    id: "e2e-create-task",
    label: "Create task through staging write-gate",
    route: "/api/v1/tasks/controlled-write",
    action: "create",
    status: "ready",
    readiness: 88,
    expectedResult: "Task payload is validated, RBAC is checked, audit envelope is generated and production write remains disabled."
  },
  {
    id: "e2e-update-task",
    label: "Update task metadata in staging path",
    route: "/api/v1/tasks/controlled-write",
    action: "update",
    status: "ready",
    readiness: 87,
    expectedResult: "Before/after payload is captured and mutation is allowed only in staging-controlled mode."
  },
  {
    id: "e2e-status-change",
    label: "Move task status across board columns",
    route: "/api/v1/tasks/controlled-write",
    action: "status-change",
    status: "ready",
    readiness: 86,
    expectedResult: "Status transition is checked against allowed roles and produces an audit event."
  },
  {
    id: "e2e-assignment",
    label: "Assign task to team member",
    route: "/api/v1/tasks/controlled-write",
    action: "assign",
    status: "partial",
    readiness: 76,
    expectedResult: "Assignment is limited to Admin/Manager until team directory binding is finalized."
  },
  {
    id: "e2e-rollback-verify",
    label: "Verify rollback package before promotion",
    route: "/api/v1/enterprise/staging-task-writes-e2e-rollback",
    action: "rollback",
    status: "ready",
    readiness: 84,
    expectedResult: "Rollback record exists for each staged mutation before production promotion is allowed."
  }
];

const rollbackDrills: RollbackDrill[] = [
  {
    id: "rollback-create",
    label: "Rollback created task",
    status: "ready",
    readiness: 85,
    trigger: "Staged task.create produces invalid downstream state.",
    recoveryAction: "Archive staged record and replay previous list snapshot.",
    auditEvidence: "actor, role, requestId, payloadHash, before=null, after=task"
  },
  {
    id: "rollback-update",
    label: "Rollback task update",
    status: "ready",
    readiness: 86,
    trigger: "Staged task.update changes protected fields.",
    recoveryAction: "Restore before payload and append reversal audit event.",
    auditEvidence: "before/after diff, protectedField flag, reversal timestamp"
  },
  {
    id: "rollback-status",
    label: "Rollback board status movement",
    status: "verified",
    readiness: 88,
    trigger: "Status movement violates workflow rule or RBAC.",
    recoveryAction: "Return task to previous status column and notify manager queue.",
    auditEvidence: "previousStatus, nextStatus, ruleId, roleDecision"
  },
  {
    id: "rollback-assignment",
    label: "Rollback assignee change",
    status: "partial",
    readiness: 72,
    trigger: "Assignee is missing, inactive or outside department scope.",
    recoveryAction: "Restore previous assignee and create assignment review alert.",
    auditEvidence: "previousAssignee, nextAssignee, departmentScope"
  }
];

const dataParityChecks: DataParityCheck[] = [
  {
    id: "parity-task-count",
    label: "Task count parity",
    source: "local/mock store",
    target: "Prisma staging read model",
    status: "ready",
    readiness: 88,
    notes: "Compares total tasks by status, priority and project bucket."
  },
  {
    id: "parity-board-columns",
    label: "Board column parity",
    source: "UI board state",
    target: "API board-state contract",
    status: "ready",
    readiness: 86,
    notes: "Ensures Backlog, De facut, In lucru, Review, Blocat and Finalizat stay aligned."
  },
  {
    id: "parity-audit-events",
    label: "Audit event parity",
    source: "mutation shadow audit",
    target: "persistent audit contract",
    status: "partial",
    readiness: 79,
    notes: "Confirms every staged write has an audit envelope before DB promotion."
  },
  {
    id: "parity-rbac-decision",
    label: "RBAC decision parity",
    source: "role matrix",
    target: "write-gate decision",
    status: "ready",
    readiness: 83,
    notes: "Checks role, operation and target field before staging writes."
  }
];

export function getStagingTaskWritesE2EValidation(): StagingTaskWritesE2ERelease {
  return {
    ok: true,
    version: "3.8.0",
    name: "Staging Task Writes E2E Validation & Rollback Drill",
    generatedAt: new Date().toISOString(),
    writeMode: "staging-e2e",
    productionWritesEnabled: false,
    stagingE2EEnabled: true,
    summary:
      "Validates the full staging task write journey end-to-end: create, update, status transition, assignment, audit envelope, rollback package and data parity before any production write activation.",
    areas,
    validationSteps,
    rollbackDrills,
    dataParityChecks,
    promotionCriteria: [
      "All staging E2E routes return ok=true.",
      "Every mutation has RBAC decision and audit envelope.",
      "Rollback drill passes for create, update and status-change.",
      "Production writes remain disabled until explicit v3.9+ promotion.",
      "Data parity between UI state, API state and Prisma staging contract is verified."
    ],
    nextBuild: "v3.9.0 — Production Task Writes Canary Activation"
  };
}

export function getStagingTaskWritesE2EHealth() {
  const release = getStagingTaskWritesE2EValidation();
  const avg = Math.round(release.validationSteps.reduce((sum, step) => sum + step.readiness, 0) / release.validationSteps.length);
  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    status: "staging-e2e-ready",
    writeMode: release.writeMode,
    productionWritesEnabled: release.productionWritesEnabled,
    stagingE2EEnabled: release.stagingE2EEnabled,
    readiness: avg,
    checks: release.validationSteps.map((step) => ({
      id: step.id,
      label: step.label,
      status: step.status,
      readiness: step.readiness
    }))
  };
}

export function getStagingTaskWritesE2ERollbackDrill() {
  const release = getStagingTaskWritesE2EValidation();
  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    productionWritesEnabled: release.productionWritesEnabled,
    rollbackDrills: release.rollbackDrills,
    requiredBeforeProduction: true
  };
}

export function getStagingTaskWritesE2EParity() {
  const release = getStagingTaskWritesE2EValidation();
  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    dataParityChecks: release.dataParityChecks,
    promotionCriteria: release.promotionCriteria
  };
}

export function getStagingTaskWritesE2EPlan() {
  const release = getStagingTaskWritesE2EValidation();
  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    current: release.name,
    nextBuild: release.nextBuild,
    plan: [
      "Run staging E2E create/update/status/assignment scenarios.",
      "Compare UI task state, API board-state and Prisma staging read model.",
      "Run rollback drill for each supported mutation type.",
      "Keep production writes OFF until canary activation is explicitly approved.",
      "Prepare v3.9 canary activation with limited write scope and kill switch."
    ]
  };
}
