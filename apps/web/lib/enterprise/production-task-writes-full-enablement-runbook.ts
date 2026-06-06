export type FullEnablementAreaId =
  | "website"
  | "taskProjectCore"
  | "backendApi"
  | "databasePrismaSeed"
  | "authRbac"
  | "iotOps"
  | "mobileApp";

export type FullEnablementStatus = "ready" | "locked" | "monitoring" | "warning" | "blocked" | "planned";
export type FullEnablementAreaStatus = "stable" | "beta" | "partial" | "mock" | "blocked";
export type FullEnablementMode = "full-enablement-runbook" | "limited-ga" | "ga-gated" | "production-off";

export type FullEnablementArea = {
  id: FullEnablementAreaId;
  label: string;
  completion: number;
  status: FullEnablementAreaStatus;
  summary: string;
};

export type EnablementRunbookStep = {
  id: string;
  label: string;
  status: FullEnablementStatus;
  readiness: number;
  owner: string;
  objective: string;
  commands: string[];
  exitCriteria: string[];
};

export type EnablementGate = {
  id: string;
  label: string;
  status: FullEnablementStatus;
  readiness: number;
  requiredEvidence: string[];
  goDecision: string;
  noGoDecision: string;
};

export type RollbackCommand = {
  id: string;
  label: string;
  status: FullEnablementStatus;
  trigger: string;
  action: string;
  validation: string;
};

export type MonitoringSlo = {
  id: string;
  label: string;
  status: FullEnablementStatus;
  target: string;
  threshold: string;
  escalation: string;
};

export type FullEnablementRolloutWave = {
  id: string;
  label: string;
  status: FullEnablementStatus;
  scope: string;
  writesAllowed: string[];
  promotionCriteria: string[];
};

export type ProductionTaskWritesFullEnablementRunbookRelease = {
  ok: boolean;
  version: string;
  name: string;
  generatedAt: string;
  mode: FullEnablementMode;
  productionWritesEnabled: boolean;
  fullEnablementReady: boolean;
  requiresExplicitEnvGate: boolean;
  summary: string;
  areas: FullEnablementArea[];
  runbookSteps: EnablementRunbookStep[];
  enablementGates: EnablementGate[];
  rollbackCommands: RollbackCommand[];
  monitoringSlos: MonitoringSlo[];
  rolloutWaves: FullEnablementRolloutWave[];
  nextBuild: string;
};

const areas: FullEnablementArea[] = [
  { id: "website", label: "Website/Web App", completion: 99, status: "stable", summary: "Admin surfaces expose the full enablement runbook, go/no-go gates, monitoring and rollback commands." },
  { id: "taskProjectCore", label: "Task & Project Core", completion: 99, status: "stable", summary: "Task create, update, status movement and assignment have staged, canary and limited GA controls." },
  { id: "backendApi", label: "Backend/API", completion: 99, status: "stable", summary: "APIs expose runbook, enablement gates, rollback commands, monitoring SLOs and task-side full enablement status." },
  { id: "databasePrismaSeed", label: "Database/Prisma/Seed", completion: 99, status: "stable", summary: "Prisma writes are ready for explicit full enablement gate, but still remain OFF by default." },
  { id: "authRbac", label: "Auth/RBAC", completion: 98, status: "stable", summary: "RBAC preflight, role-scoped writes, audit evidence and destructive-action restrictions are enforced by the runbook." },
  { id: "iotOps", label: "IoT/Ops", completion: 70, status: "partial", summary: "Operational command concepts are connected to incident controls, while IoT task automation remains out of production write scope." },
  { id: "mobileApp", label: "Mobile App", completion: 66, status: "partial", summary: "Mobile write enablement remains gated behind web production stability and RBAC parity." }
];

const runbookSteps: EnablementRunbookStep[] = [
  {
    id: "preflight-freeze-window",
    label: "Preflight and freeze window",
    status: "ready",
    readiness: 98,
    owner: "Release manager",
    objective: "Freeze schema, validate environment gates and confirm no active incident before full enablement.",
    commands: ["confirm DATABASE_URL", "confirm production write env gate is OFF before start", "freeze rollout membership"],
    exitCriteria: ["no active incident", "audit coverage is green", "rollback commands tested"]
  },
  {
    id: "enablement-command",
    label: "Enablement command",
    status: "locked",
    readiness: 96,
    owner: "Admin/Ops",
    objective: "Allow production task writes only after explicit go/no-go evidence is approved.",
    commands: ["set explicit env gate", "restart deployment", "verify /api/v1/tasks/full-enablement"],
    exitCriteria: ["write gate reports enabled", "RBAC preflight active", "audit event stream active"]
  },
  {
    id: "post-enable-validation",
    label: "Post-enable validation",
    status: "monitoring",
    readiness: 95,
    owner: "Backend/API",
    objective: "Validate the first production writes and confirm parity across UI, API and audit envelopes.",
    commands: ["run smoke write", "inspect before/after audit", "compare task board refresh"],
    exitCriteria: ["first write succeeded", "audit envelope complete", "rollback command available"]
  }
];

const enablementGates: EnablementGate[] = [
  {
    id: "schema-adapter-gate",
    label: "Schema and adapter gate",
    status: "ready",
    readiness: 99,
    requiredEvidence: ["Prisma schema compatible", "repository adapter selected", "read shadow parity clean"],
    goDecision: "Allow controlled write enablement.",
    noGoDecision: "Stay in limited GA read/write-gated mode."
  },
  {
    id: "rbac-audit-gate",
    label: "RBAC and audit gate",
    status: "locked",
    readiness: 98,
    requiredEvidence: ["RBAC deny paths tested", "audit before success", "delete remains blocked"],
    goDecision: "Permit task create/update/status/assignment writes.",
    noGoDecision: "Block production writes and keep staging only."
  },
  {
    id: "rollback-monitoring-gate",
    label: "Rollback and monitoring gate",
    status: "monitoring",
    readiness: 96,
    requiredEvidence: ["kill-switch tested", "rollback SLO green", "incident command owner assigned"],
    goDecision: "Continue full enablement rollout.",
    noGoDecision: "Freeze writes and revert to read-only mode."
  }
];

const rollbackCommands: RollbackCommand[] = [
  {
    id: "kill-production-writes",
    label: "Kill production writes",
    status: "ready",
    trigger: "Audit coverage loss, RBAC anomaly, write error spike or rollback threshold breach.",
    action: "Disable production writes by env gate and keep task reads online.",
    validation: "Endpoint reports productionWritesEnabled=false and UI stays read-only."
  },
  {
    id: "revert-mutation-class",
    label: "Revert mutation class",
    status: "ready",
    trigger: "One mutation class repeatedly fails validation.",
    action: "Disable the affected create/update/status/assignment class and keep safe classes available.",
    validation: "Affected mutation returns controlled disabled response with audit evidence."
  },
  {
    id: "restore-task-state",
    label: "Restore task state",
    status: "monitoring",
    trigger: "A production mutation must be reversed from audit evidence.",
    action: "Restore the before-state from the audit envelope and append correction event.",
    validation: "Task board, detail drawer and audit trail show corrected state."
  }
];

const monitoringSlos: MonitoringSlo[] = [
  { id: "write-success", label: "Write success rate", status: "monitoring", target: ">= 99.0%", threshold: "below 99.0% over 15 minutes", escalation: "freeze rollout wave and inspect audit samples" },
  { id: "audit-coverage", label: "Audit envelope coverage", status: "locked", target: "100%", threshold: "any missing before/after envelope", escalation: "kill production writes immediately" },
  { id: "rbac-deny", label: "RBAC deny anomaly", status: "monitoring", target: "baseline +/- 20%", threshold: "2x baseline in a role or team", escalation: "disable affected role scope" },
  { id: "write-latency", label: "Write latency", status: "monitoring", target: "inside task write SLO", threshold: "p95 over configured budget", escalation: "disable write expansion and keep reads online" }
];

const rolloutWaves: FullEnablementRolloutWave[] = [
  {
    id: "wave-admin",
    label: "Wave Admin full enablement",
    status: "ready",
    scope: "Admin-only writes after evidence approval.",
    writesAllowed: ["create", "update", "status movement", "assignment"],
    promotionCriteria: ["zero audit gaps", "rollback drill passed", "write success SLO green"]
  },
  {
    id: "wave-manager",
    label: "Wave Manager full enablement",
    status: "planned",
    scope: "Managers with reviewed task scope.",
    writesAllowed: ["create", "update", "status movement", "assignment"],
    promotionCriteria: ["Admin wave clean", "RBAC denies normal", "incident command standby"]
  },
  {
    id: "wave-team",
    label: "Wave Team scoped full enablement",
    status: "planned",
    scope: "Selected teams after manager wave.",
    writesAllowed: ["create", "update", "status movement", "assignment"],
    promotionCriteria: ["Manager wave clean", "mobile/web parity plan ready", "support runbook published"]
  }
];

export function getProductionTaskWritesFullEnablementRunbook(): ProductionTaskWritesFullEnablementRunbookRelease {
  return {
    ok: true,
    version: "4.4.0",
    name: "Production Task Writes Full Enablement Runbook",
    generatedAt: new Date().toISOString(),
    mode: "full-enablement-runbook",
    productionWritesEnabled: false,
    fullEnablementReady: true,
    requiresExplicitEnvGate: true,
    summary: "Defines the full enablement runbook for production task writes with explicit env gate, RBAC, audit, rollback and monitoring controls. Production writes remain OFF by default until the operator enables the gate.",
    areas,
    runbookSteps,
    enablementGates,
    rollbackCommands,
    monitoringSlos,
    rolloutWaves,
    nextBuild: "v4.5.0 — Production Task Writes Real Enable Switch"
  };
}

export function getProductionTaskWritesFullEnablementRunbookHealth() {
  const release = getProductionTaskWritesFullEnablementRunbook();
  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    mode: release.mode,
    productionWritesEnabled: release.productionWritesEnabled,
    fullEnablementReady: release.fullEnablementReady,
    requiresExplicitEnvGate: release.requiresExplicitEnvGate,
    criticalGatesReady: release.enablementGates.filter((gate) => gate.status === "ready" || gate.status === "locked").length,
    totalGates: release.enablementGates.length
  };
}

export function getProductionTaskWritesFullEnablementRunbookSteps() {
  const release = getProductionTaskWritesFullEnablementRunbook();
  return { ok: true, version: release.version, generatedAt: release.generatedAt, runbookSteps: release.runbookSteps };
}

export function getProductionTaskWritesFullEnablementGates() {
  const release = getProductionTaskWritesFullEnablementRunbook();
  return { ok: true, version: release.version, generatedAt: release.generatedAt, enablementGates: release.enablementGates, rolloutWaves: release.rolloutWaves };
}

export function getProductionTaskWritesFullEnablementRollback() {
  const release = getProductionTaskWritesFullEnablementRunbook();
  return { ok: true, version: release.version, generatedAt: release.generatedAt, rollbackCommands: release.rollbackCommands, monitoringSlos: release.monitoringSlos };
}

export function getProductionTaskWritesFullEnablementPlan() {
  const release = getProductionTaskWritesFullEnablementRunbook();
  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    nextBuild: release.nextBuild,
    plan: ["Keep writes OFF by default", "Enable only by explicit env gate", "Validate Admin wave", "Expand after SLO and audit evidence stay green"]
  };
}

export function getProductionTaskWritesFullEnablementTaskSide() {
  const release = getProductionTaskWritesFullEnablementRunbook();
  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    scope: "tasks",
    mode: release.mode,
    productionWritesEnabled: release.productionWritesEnabled,
    fullEnablementReady: release.fullEnablementReady,
    requiresExplicitEnvGate: release.requiresExplicitEnvGate,
    allowedMutationClasses: ["create", "update", "status movement", "assignment"],
    blockedMutationClasses: ["hard delete"],
    nextBuild: release.nextBuild
  };
}
