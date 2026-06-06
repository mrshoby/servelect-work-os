export type EvidenceLockAreaId =
  | "website"
  | "taskProjectCore"
  | "backendApi"
  | "databasePrismaSeed"
  | "authRbac"
  | "iotOps"
  | "mobileApp";

export type EvidenceLockAreaStatus = "stable" | "beta" | "partial" | "mock" | "blocked";
export type EvidenceLockStatus = "locked" | "ready" | "monitoring" | "partial" | "blocked";
export type EvidenceLockMode = "evidence-lock" | "limited-ga" | "ga-gated" | "production-off";

export type EvidenceLockArea = {
  id: EvidenceLockAreaId;
  label: string;
  completion: number;
  status: EvidenceLockAreaStatus;
  summary: string;
};

export type EvidenceBundle = {
  id: string;
  label: string;
  status: EvidenceLockStatus;
  readiness: number;
  owner: string;
  evidence: string[];
  acceptance: string;
};

export type LockControl = {
  id: string;
  label: string;
  status: EvidenceLockStatus;
  readiness: number;
  requirement: string;
  lockedBy: string;
};

export type RollbackGuard = {
  id: string;
  label: string;
  status: EvidenceLockStatus;
  readiness: number;
  trigger: string;
  response: string;
  validation: string;
};

export type ProductionWave = {
  id: string;
  label: string;
  status: EvidenceLockStatus;
  readiness: number;
  audience: string;
  allowedOperations: string[];
  evidenceRequired: string[];
};

export type FullProductionTaskWritesEvidenceLockRelease = {
  ok: boolean;
  version: string;
  name: string;
  generatedAt: string;
  rolloutMode: EvidenceLockMode;
  productionWritesEnabled: boolean;
  evidenceLocked: boolean;
  fullGaCandidate: boolean;
  summary: string;
  areas: EvidenceLockArea[];
  evidenceBundles: EvidenceBundle[];
  lockControls: LockControl[];
  rollbackGuards: RollbackGuard[];
  productionWaves: ProductionWave[];
  evidenceChecklist: string[];
  nextBuild: string;
};

const areas: EvidenceLockArea[] = [
  {
    id: "website",
    label: "Website/Web App",
    completion: 98,
    status: "stable",
    summary: "Web dashboards expose production evidence, GA readiness, rollback controls and task-side lock status."
  },
  {
    id: "taskProjectCore",
    label: "Task & Project Core",
    completion: 99,
    status: "stable",
    summary: "Task lifecycle, project context, board state, staged writes, canary writes and limited GA evidence are aligned."
  },
  {
    id: "backendApi",
    label: "Backend/API",
    completion: 97,
    status: "stable",
    summary: "Enterprise and task-side APIs now expose evidence lock state, bundles, rollback guards and GA waves."
  },
  {
    id: "databasePrismaSeed",
    label: "Database/Prisma/Seed",
    completion: 97,
    status: "stable",
    summary: "Prisma write readiness is evidence-locked, with schema, seed, adapter, shadow reads and mutation audit contracts documented."
  },
  {
    id: "authRbac",
    label: "Auth/RBAC",
    completion: 94,
    status: "beta",
    summary: "RBAC decisions, role scopes and deny evidence are locked before broader production write rollout."
  },
  {
    id: "iotOps",
    label: "IoT/Ops",
    completion: 60,
    status: "partial",
    summary: "Ops signals can be attached to audit envelopes, but task writes remain the primary production scope."
  },
  {
    id: "mobileApp",
    label: "Mobile App",
    completion: 58,
    status: "partial",
    summary: "Mobile remains guarded behind web GA evidence until write patterns are stable in production."
  }
];

const evidenceBundles: EvidenceBundle[] = [
  {
    id: "schema-adapter-evidence",
    label: "Schema and repository adapter evidence",
    status: "locked",
    readiness: 98,
    owner: "Database/Prisma",
    evidence: ["schema parity", "repository adapter contract", "seed compatibility", "shadow read pass"],
    acceptance: "Adapter returns task payloads matching UI, API and audit contract without schema drift."
  },
  {
    id: "mutation-audit-evidence",
    label: "Mutation audit evidence",
    status: "locked",
    readiness: 97,
    owner: "Backend/API",
    evidence: ["before payload", "after payload", "diff hash", "request id", "actor id"],
    acceptance: "Every create/update/status/assignment mutation can be explained and replayed."
  },
  {
    id: "rbac-evidence",
    label: "RBAC decision evidence",
    status: "ready",
    readiness: 95,
    owner: "Auth/RBAC",
    evidence: ["role", "scope", "operation", "decision", "reason"],
    acceptance: "Allow/deny decisions are deterministic and visible before production write execution."
  },
  {
    id: "rollback-evidence",
    label: "Rollback drill evidence",
    status: "locked",
    readiness: 96,
    owner: "Ops/Admin",
    evidence: ["rollback snapshot", "restore event", "validation check", "operator sign-off"],
    acceptance: "Each supported mutation has a rollback path with measurable recovery target."
  }
];

const lockControls: LockControl[] = [
  {
    id: "evidence-bundle-lock",
    label: "Evidence bundle lock",
    status: "locked",
    readiness: 98,
    requirement: "No production GA wave can expand unless evidence bundles remain locked and current.",
    lockedBy: "Enterprise release gate"
  },
  {
    id: "write-gate-lock",
    label: "Production write gate lock",
    status: "ready",
    readiness: 96,
    requirement: "Production writes require explicit environment gate, RBAC allow and wave membership.",
    lockedBy: "TASK_WRITES_PRODUCTION_ENABLED plus wave allow-list"
  },
  {
    id: "audit-lock",
    label: "Audit envelope lock",
    status: "locked",
    readiness: 99,
    requirement: "Every mutation stores audit context before the response is treated as successful.",
    lockedBy: "Backend mutation middleware contract"
  },
  {
    id: "rollback-lock",
    label: "Rollback readiness lock",
    status: "ready",
    readiness: 95,
    requirement: "Rollback snapshots and restore checks are required for create/update/status/assignment.",
    lockedBy: "Ops rollback playbook"
  }
];

const rollbackGuards: RollbackGuard[] = [
  {
    id: "create-rollback",
    label: "Create rollback guard",
    status: "locked",
    readiness: 96,
    trigger: "Created task fails validation, ownership scope or project linkage checks.",
    response: "Mark created record as rolled back and emit reversal audit event.",
    validation: "Task no longer appears in active board queries."
  },
  {
    id: "update-rollback",
    label: "Update rollback guard",
    status: "locked",
    readiness: 96,
    trigger: "Update produces invalid status, priority, assignee or project state.",
    response: "Restore previous payload snapshot and attach correction audit event.",
    validation: "Before state and restored state hash match."
  },
  {
    id: "status-rollback",
    label: "Status movement rollback guard",
    status: "ready",
    readiness: 94,
    trigger: "Status movement breaks board or workflow rules.",
    response: "Move task back to previous status and block the wave if repeated.",
    validation: "Board columns and task counts return to expected values."
  },
  {
    id: "assignment-rollback",
    label: "Assignment rollback guard",
    status: "ready",
    readiness: 93,
    trigger: "Assignee is out of role, team, project scope or workload allowance.",
    response: "Restore previous assignee and notify the reviewer queue.",
    validation: "Assignment audit shows reversal and final valid owner."
  }
];

const productionWaves: ProductionWave[] = [
  {
    id: "wave-a-admin-evidence-locked",
    label: "Wave A - Admin evidence locked",
    status: "locked",
    readiness: 97,
    audience: "Admin users only, selected projects, low write volume.",
    allowedOperations: ["create", "update", "status-change", "assign"],
    evidenceRequired: ["RBAC allow", "audit envelope", "rollback snapshot", "evidence lock"]
  },
  {
    id: "wave-b-manager-reviewed",
    label: "Wave B - Manager reviewed writes",
    status: "ready",
    readiness: 93,
    audience: "Managers with project scope and review queue visibility.",
    allowedOperations: ["update", "status-change", "assign"],
    evidenceRequired: ["manager scope", "review marker", "audit envelope", "rollback snapshot"]
  },
  {
    id: "wave-c-team-scoped",
    label: "Wave C - Team scoped writes",
    status: "monitoring",
    readiness: 88,
    audience: "Selected departments and selected production workspaces.",
    allowedOperations: ["create", "update", "status-change", "assign"],
    evidenceRequired: ["department scope", "volume cap", "audit coverage", "kill switch"]
  }
];

export function getFullProductionTaskWritesEvidenceLock(): FullProductionTaskWritesEvidenceLockRelease {
  return {
    ok: true,
    version: "4.2.0",
    name: "Full Production Task Writes Evidence Lock",
    generatedAt: new Date().toISOString(),
    rolloutMode: "evidence-lock",
    productionWritesEnabled: false,
    evidenceLocked: true,
    fullGaCandidate: true,
    summary:
      "Locks the evidence layer required before expanding production task writes. Full production writes remain gated, but schema, adapter, RBAC, audit and rollback proof are now consolidated.",
    areas,
    evidenceBundles,
    lockControls,
    rollbackGuards,
    productionWaves,
    evidenceChecklist: [
      "Evidence bundles are locked before any broader production wave.",
      "Every write requires RBAC allow decision and wave membership.",
      "Before/after audit envelope is mandatory for all supported task mutations.",
      "Rollback guards exist for create, update, status movement and assignment.",
      "Kill switch remains available without redeploy.",
      "Full GA remains gated until evidence lock is validated in production telemetry."
    ],
    nextBuild: "v4.3.0 - Production Task Writes Telemetry and Incident Command"
  };
}

export function getFullProductionTaskWritesEvidenceLockHealth() {
  const release = getFullProductionTaskWritesEvidenceLock();
  const readiness = Math.round(release.lockControls.reduce((sum, control) => sum + control.readiness, 0) / release.lockControls.length);
  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    status: "evidence-locked",
    rolloutMode: release.rolloutMode,
    productionWritesEnabled: release.productionWritesEnabled,
    evidenceLocked: release.evidenceLocked,
    fullGaCandidate: release.fullGaCandidate,
    readiness,
    blockers: release.lockControls.filter((control) => control.status === "blocked"),
    waves: release.productionWaves.map((wave) => ({ id: wave.id, label: wave.label, status: wave.status, readiness: wave.readiness }))
  };
}

export function getFullProductionTaskWritesEvidenceBundles() {
  const release = getFullProductionTaskWritesEvidenceLock();
  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    evidenceLocked: release.evidenceLocked,
    evidenceBundles: release.evidenceBundles,
    checklist: release.evidenceChecklist
  };
}

export function getFullProductionTaskWritesEvidenceControls() {
  const release = getFullProductionTaskWritesEvidenceLock();
  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    lockControls: release.lockControls,
    productionWaves: release.productionWaves
  };
}

export function getFullProductionTaskWritesEvidenceRollback() {
  const release = getFullProductionTaskWritesEvidenceLock();
  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    rollbackRequired: true,
    rollbackGuards: release.rollbackGuards
  };
}

export function getFullProductionTaskWritesEvidencePlan() {
  const release = getFullProductionTaskWritesEvidenceLock();
  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    currentBuild: release.version,
    nextBuild: release.nextBuild,
    requiredBeforeFullGa: [
      "Validate evidence bundle lock with live telemetry.",
      "Run limited GA waves without audit gaps or rollback threshold breach.",
      "Confirm RBAC deny spikes are expected and documented.",
      "Prepare incident command dashboard before enabling broader production writes."
    ]
  };
}
