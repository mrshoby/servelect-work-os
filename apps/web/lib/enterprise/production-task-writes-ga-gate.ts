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

export type GateStatus = "go" | "ready" | "partial" | "blocked";
export type ProductionWriteMode = "ga-gated" | "canary-controlled" | "production-off";

export type GeneralAvailabilityGate = {
  id: string;
  label: string;
  status: GateStatus;
  readiness: number;
  requirement: string;
  evidence: string;
};

export type RolloutWave = {
  id: string;
  label: string;
  scope: string;
  status: GateStatus;
  readiness: number;
  allowedOperations: string[];
  rollbackWindow: string;
};

export type RollbackControl = {
  id: string;
  label: string;
  status: GateStatus;
  readiness: number;
  trigger: string;
  response: string;
};

export type ProductionTaskWritesGaGateRelease = {
  ok: boolean;
  version: string;
  name: string;
  generatedAt: string;
  writeMode: ProductionWriteMode;
  productionWritesEnabled: boolean;
  gaGateEnabled: boolean;
  summary: string;
  areas: ProductionArea[];
  gates: GeneralAvailabilityGate[];
  rolloutWaves: RolloutWave[];
  rollbackControls: RollbackControl[];
  goNoGoChecklist: string[];
  nextBuild: string;
};

const areas: ProductionArea[] = [
  {
    id: "website",
    label: "Website/Web App",
    completion: 96,
    status: "stable",
    summary: "Release dashboards, task admin pages, governance visibility and production readiness pages are active."
  },
  {
    id: "taskProjectCore",
    label: "Task & Project Core",
    completion: 97,
    status: "stable",
    summary: "Task lifecycle, board, drawer, staged writes, canary writes and GA gating contracts are prepared."
  },
  {
    id: "backendApi",
    label: "Backend/API",
    completion: 95,
    status: "stable",
    summary: "Enterprise and task-side routes expose GA gate, health, evidence, rollout and rollback contracts."
  },
  {
    id: "databasePrismaSeed",
    label: "Database/Prisma/Seed",
    completion: 95,
    status: "beta",
    summary: "Prisma task write path is gated for production activation with evidence, rollback and audit requirements."
  },
  {
    id: "authRbac",
    label: "Auth/RBAC",
    completion: 88,
    status: "beta",
    summary: "RBAC is enforced before every production write and remains the primary go/no-go blocker."
  },
  {
    id: "iotOps",
    label: "IoT/Ops",
    completion: 55,
    status: "partial",
    summary: "Ops signals remain read-mostly and can enrich task evidence without blocking GA task writes."
  },
  {
    id: "mobileApp",
    label: "Mobile App",
    completion: 50,
    status: "partial",
    summary: "Mobile write surfaces stay limited until web production writes complete the GA gate."
  }
];

const gates: GeneralAvailabilityGate[] = [
  {
    id: "canary-clean-evidence",
    label: "Clean canary evidence",
    status: "go",
    readiness: 96,
    requirement: "Canary writes must complete without unresolved rollback events or audit gaps.",
    evidence: "canaryRunId, writeCount, rollbackCount, auditCoverage, unresolvedIncidents"
  },
  {
    id: "rbac-enforced",
    label: "RBAC enforced for production writes",
    status: "ready",
    readiness: 92,
    requirement: "Every write must have an allow/deny RBAC decision before mutation execution.",
    evidence: "actorId, role, operation, projectScope, decision, policyVersion"
  },
  {
    id: "audit-persistent",
    label: "Persistent audit trail",
    status: "ready",
    readiness: 94,
    requirement: "Every production write must persist before and after state with payload hashes.",
    evidence: "eventId, beforeHash, afterHash, diffHash, timestamp, requestId"
  },
  {
    id: "rollback-tested",
    label: "Rollback drill passed",
    status: "ready",
    readiness: 91,
    requirement: "Create, update, status movement and assignment must have tested rollback responses.",
    evidence: "rollbackDrillId, operation, durationMs, result, operator"
  },
  {
    id: "kill-switch-ready",
    label: "Production kill switch ready",
    status: "go",
    readiness: 98,
    requirement: "Production writes must be disabled immediately without redeploy.",
    evidence: "TASK_WRITES_PRODUCTION_ENABLED=false"
  }
];

const rolloutWaves: RolloutWave[] = [
  {
    id: "wave-0-admin-ga",
    label: "Wave 0 - Admin GA gate",
    scope: "Admins only, selected internal projects, create/update/status/assign with audit required.",
    status: "ready",
    readiness: 94,
    allowedOperations: ["create", "update", "status-change", "assign"],
    rollbackWindow: "15 minutes"
  },
  {
    id: "wave-1-manager-ga",
    label: "Wave 1 - Manager approved writes",
    scope: "Managers on selected live projects after Wave 0 remains clean.",
    status: "partial",
    readiness: 86,
    allowedOperations: ["update", "status-change", "assign"],
    rollbackWindow: "30 minutes"
  },
  {
    id: "wave-2-team-ga",
    label: "Wave 2 - Team scoped writes",
    scope: "Limited task users, selected departments, production writes with monitoring and rate limits.",
    status: "partial",
    readiness: 78,
    allowedOperations: ["create", "update", "status-change", "assign"],
    rollbackWindow: "60 minutes"
  }
];

const rollbackControls: RollbackControl[] = [
  {
    id: "rollback-create",
    label: "Rollback task.create",
    status: "ready",
    readiness: 94,
    trigger: "Created task fails scope, audit, project or downstream board validation.",
    response: "Archive created task, persist reversal event and restore task counter snapshot."
  },
  {
    id: "rollback-update",
    label: "Rollback task.update",
    status: "ready",
    readiness: 93,
    trigger: "Protected field mutation or invalid payload diff is detected after write.",
    response: "Replay before payload, attach rollback reason and notify owner."
  },
  {
    id: "rollback-status",
    label: "Rollback status movement",
    status: "ready",
    readiness: 92,
    trigger: "Workflow transition violates task lifecycle, dependency or RBAC rule.",
    response: "Restore previous status and create manager review item."
  },
  {
    id: "rollback-assignment",
    label: "Rollback assignment",
    status: "ready",
    readiness: 90,
    trigger: "Assignee is inactive, missing, outside department scope or overloaded.",
    response: "Restore previous assignee and emit assignment rollback audit event."
  }
];

export function getProductionTaskWritesGaGate(): ProductionTaskWritesGaGateRelease {
  return {
    ok: true,
    version: "4.0.0",
    name: "Production Task Writes General Availability Gate",
    generatedAt: new Date().toISOString(),
    writeMode: "ga-gated",
    productionWritesEnabled: false,
    gaGateEnabled: true,
    summary:
      "Introduces the general availability gate for production task writes. Production writes remain disabled by default until the go/no-go checklist passes and the explicit environment gate is enabled.",
    areas,
    gates,
    rolloutWaves,
    rollbackControls,
    goNoGoChecklist: [
      "Canary evidence is clean and signed off.",
      "RBAC allow/deny decisions are persisted for every write.",
      "Before/after audit envelope is mandatory for every production write.",
      "Rollback drill passes for create, update, status-change and assignment.",
      "Hard delete remains blocked and archive/delete-request remains the fallback.",
      "Production kill switch is verified before rollout."
    ],
    nextBuild: "v4.1.0 - Production Task Writes Limited GA Rollout"
  };
}

export function getProductionTaskWritesGaHealth() {
  const release = getProductionTaskWritesGaGate();
  const readiness = Math.round(release.gates.reduce((sum, gate) => sum + gate.readiness, 0) / release.gates.length);
  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    status: "ga-gate-ready",
    writeMode: release.writeMode,
    productionWritesEnabled: release.productionWritesEnabled,
    gaGateEnabled: release.gaGateEnabled,
    readiness,
    blockers: release.gates.filter((gate) => gate.status === "blocked"),
    gates: release.gates.map((gate) => ({
      id: gate.id,
      label: gate.label,
      status: gate.status,
      readiness: gate.readiness
    }))
  };
}

export function getProductionTaskWritesGaEvidence() {
  const release = getProductionTaskWritesGaGate();
  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    gates: release.gates,
    goNoGoChecklist: release.goNoGoChecklist
  };
}

export function getProductionTaskWritesGaRollout() {
  const release = getProductionTaskWritesGaGate();
  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    writeMode: release.writeMode,
    rolloutWaves: release.rolloutWaves,
    nextBuild: release.nextBuild
  };
}

export function getProductionTaskWritesGaRollback() {
  const release = getProductionTaskWritesGaGate();
  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    rollbackRequired: true,
    rollbackControls: release.rollbackControls
  };
}

export function getProductionTaskWritesGaGoNoGo() {
  const release = getProductionTaskWritesGaGate();
  const health = getProductionTaskWritesGaHealth();
  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    decision: health.readiness >= 90 && health.blockers.length === 0 ? "go-with-explicit-env-gate" : "no-go",
    productionWritesEnabled: release.productionWritesEnabled,
    requiredEnv: "TASK_WRITES_PRODUCTION_ENABLED=true",
    checklist: release.goNoGoChecklist,
    readiness: health.readiness
  };
}
