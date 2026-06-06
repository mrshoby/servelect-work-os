export type TelemetryIncidentAreaId =
  | "website"
  | "taskProjectCore"
  | "backendApi"
  | "databasePrismaSeed"
  | "authRbac"
  | "iotOps"
  | "mobileApp";

export type TelemetryIncidentAreaStatus = "stable" | "beta" | "partial" | "mock" | "blocked";
export type TelemetryIncidentStatus = "active" | "ready" | "monitoring" | "locked" | "warning" | "blocked";
export type TelemetryIncidentMode = "telemetry-command" | "limited-ga" | "production-gated" | "production-off";

export type TelemetryIncidentArea = {
  id: TelemetryIncidentAreaId;
  label: string;
  completion: number;
  status: TelemetryIncidentAreaStatus;
  summary: string;
};

export type TelemetrySignal = {
  id: string;
  label: string;
  status: TelemetryIncidentStatus;
  readiness: number;
  source: string;
  metric: string;
  alertThreshold: string;
  action: string;
};

export type IncidentCommandControl = {
  id: string;
  label: string;
  status: TelemetryIncidentStatus;
  owner: string;
  trigger: string;
  commandAction: string;
  evidenceRequired: string[];
};

export type ProductionGuardrail = {
  id: string;
  label: string;
  status: TelemetryIncidentStatus;
  readiness: number;
  guard: string;
  rollbackPath: string;
};

export type TelemetryRolloutStep = {
  id: string;
  label: string;
  status: TelemetryIncidentStatus;
  readiness: number;
  objective: string;
  exitCriteria: string[];
};

export type ProductionTaskWritesTelemetryIncidentCommandRelease = {
  ok: boolean;
  version: string;
  name: string;
  generatedAt: string;
  mode: TelemetryIncidentMode;
  productionWritesEnabled: boolean;
  incidentCommandReady: boolean;
  killSwitchAvailable: boolean;
  summary: string;
  areas: TelemetryIncidentArea[];
  telemetrySignals: TelemetrySignal[];
  incidentCommandControls: IncidentCommandControl[];
  productionGuardrails: ProductionGuardrail[];
  rolloutPlan: TelemetryRolloutStep[];
  nextBuild: string;
};

const areas: TelemetryIncidentArea[] = [
  {
    id: "website",
    label: "Website/Web App",
    completion: 99,
    status: "stable",
    summary: "Web admin surfaces now expose telemetry, incident command readiness, evidence state and task-side production write status."
  },
  {
    id: "taskProjectCore",
    label: "Task & Project Core",
    completion: 99,
    status: "stable",
    summary: "Task lifecycle is covered by staging, canary, limited GA, evidence lock and telemetry command controls."
  },
  {
    id: "backendApi",
    label: "Backend/API",
    completion: 98,
    status: "stable",
    summary: "Enterprise APIs now expose telemetry, incident controls, guardrails, rollback and production readiness."
  },
  {
    id: "databasePrismaSeed",
    label: "Database/Prisma/Seed",
    completion: 98,
    status: "stable",
    summary: "Prisma task writes are still gated, with telemetry signals attached before full GA enablement."
  },
  {
    id: "authRbac",
    label: "Auth/RBAC",
    completion: 96,
    status: "stable",
    summary: "RBAC preflight, deny telemetry and role-scoped production command paths are in place."
  },
  {
    id: "iotOps",
    label: "IoT/Ops",
    completion: 66,
    status: "partial",
    summary: "Incident command can receive operational signals, but task writes remain the controlled production scope."
  },
  {
    id: "mobileApp",
    label: "Mobile App",
    completion: 62,
    status: "partial",
    summary: "Mobile production writes remain behind web evidence and incident command telemetry until final stabilization."
  }
];

const telemetrySignals: TelemetrySignal[] = [
  {
    id: "write-success-rate",
    label: "Production write success rate",
    status: "monitoring",
    readiness: 98,
    source: "Task write API",
    metric: "successful writes / attempted writes",
    alertThreshold: "below 99.0% over 15 minutes",
    action: "pause wave expansion and review audit envelopes"
  },
  {
    id: "rbac-deny-spike",
    label: "RBAC deny spike",
    status: "active",
    readiness: 96,
    source: "RBAC preflight",
    metric: "deny decisions by role and scope",
    alertThreshold: "2x baseline in any rollout wave",
    action: "freeze affected role and export denial evidence"
  },
  {
    id: "rollback-rate",
    label: "Rollback rate",
    status: "monitoring",
    readiness: 97,
    source: "Rollback command log",
    metric: "rollback events / write events",
    alertThreshold: "above 1.5% in canary or limited GA",
    action: "trigger incident command and isolate mutation type"
  },
  {
    id: "audit-envelope-coverage",
    label: "Audit envelope coverage",
    status: "locked",
    readiness: 99,
    source: "Audit event stream",
    metric: "mutations with complete before/after envelope",
    alertThreshold: "less than 100% coverage",
    action: "disable production writes until coverage is restored"
  }
];

const incidentCommandControls: IncidentCommandControl[] = [
  {
    id: "kill-switch-command",
    label: "Kill-switch command",
    status: "ready",
    owner: "Admin/Ops",
    trigger: "Write error spike, RBAC anomaly, audit coverage loss or rollback threshold breach.",
    commandAction: "Disable production write gate without redeploy and keep read-only task UI online.",
    evidenceRequired: ["incident id", "operator", "reason", "timestamp", "affected wave"]
  },
  {
    id: "wave-freeze-command",
    label: "Wave freeze command",
    status: "ready",
    owner: "Release manager",
    trigger: "A rollout wave fails exit criteria or monitoring enters warning status.",
    commandAction: "Freeze wave membership and stop promotion to the next wave.",
    evidenceRequired: ["wave id", "failed criterion", "linked telemetry", "rollback decision"]
  },
  {
    id: "mutation-isolation-command",
    label: "Mutation isolation command",
    status: "monitoring",
    owner: "Backend/API",
    trigger: "One mutation type causes recurring rollback or validation failures.",
    commandAction: "Disable that mutation class while allowing safe task reads and unaffected operations.",
    evidenceRequired: ["mutation type", "failure sample", "affected task ids", "restoration plan"]
  }
];

const productionGuardrails: ProductionGuardrail[] = [
  {
    id: "no-hard-delete",
    label: "No hard delete",
    status: "locked",
    readiness: 100,
    guard: "Hard delete stays blocked; delete remains a request or soft archive event.",
    rollbackPath: "Restore archived task state through audit envelope."
  },
  {
    id: "rbac-before-write",
    label: "RBAC before write",
    status: "locked",
    readiness: 98,
    guard: "Every production mutation must pass role, scope and assignment checks before execution.",
    rollbackPath: "Deny write and emit decision evidence without touching task state."
  },
  {
    id: "audit-before-success",
    label: "Audit before success",
    status: "locked",
    readiness: 99,
    guard: "A mutation cannot be considered successful until its audit envelope is complete.",
    rollbackPath: "Mark mutation as failed and restore pre-write state."
  },
  {
    id: "latency-budget",
    label: "Latency budget",
    status: "monitoring",
    readiness: 94,
    guard: "Write latency must remain inside production SLO for rollout waves.",
    rollbackPath: "Freeze wave and downgrade to staging writes."
  }
];

const rolloutPlan: TelemetryRolloutStep[] = [
  {
    id: "telemetry-baseline",
    label: "Telemetry baseline",
    status: "ready",
    readiness: 98,
    objective: "Confirm telemetry is stable before expanding production writes.",
    exitCriteria: ["all critical signals green", "audit envelope coverage 100%", "rollback drill available"]
  },
  {
    id: "incident-command-drill",
    label: "Incident command drill",
    status: "monitoring",
    readiness: 95,
    objective: "Run kill-switch, wave freeze and mutation isolation procedures.",
    exitCriteria: ["operator evidence captured", "restore plan verified", "read-only mode validated"]
  },
  {
    id: "full-ga-prep",
    label: "Full GA preparation",
    status: "ready",
    readiness: 94,
    objective: "Prepare the final production write enablement gate with telemetry evidence attached.",
    exitCriteria: ["no unresolved incidents", "limited GA wave stable", "final approval collected"]
  }
];

export function getProductionTaskWritesTelemetryIncidentCommand(): ProductionTaskWritesTelemetryIncidentCommandRelease {
  return {
    ok: true,
    version: "4.3.0",
    name: "Production Task Writes Telemetry and Incident Command",
    generatedAt: new Date().toISOString(),
    mode: "telemetry-command",
    productionWritesEnabled: false,
    incidentCommandReady: true,
    killSwitchAvailable: true,
    summary:
      "Adds telemetry, incident command controls, guardrails and rollout evidence for production task writes before final full-production enablement.",
    areas,
    telemetrySignals,
    incidentCommandControls,
    productionGuardrails,
    rolloutPlan,
    nextBuild: "v4.4.0 — Production Task Writes Full Enablement Runbook"
  };
}

export function getProductionTaskWritesTelemetryIncidentCommandHealth() {
  const release = getProductionTaskWritesTelemetryIncidentCommand();
  const avgReadiness = Math.round(
    [...release.telemetrySignals.map((signal) => signal.readiness), ...release.productionGuardrails.map((guard) => guard.readiness)].reduce(
      (sum, value) => sum + value,
      0
    ) /
      (release.telemetrySignals.length + release.productionGuardrails.length)
  );

  return {
    ok: true,
    version: release.version,
    mode: release.mode,
    productionWritesEnabled: release.productionWritesEnabled,
    incidentCommandReady: release.incidentCommandReady,
    killSwitchAvailable: release.killSwitchAvailable,
    readiness: avgReadiness,
    telemetrySignals: release.telemetrySignals.length,
    incidentControls: release.incidentCommandControls.length,
    guardrails: release.productionGuardrails.length,
    generatedAt: release.generatedAt
  };
}

export function getProductionTaskWritesTelemetrySignals() {
  const release = getProductionTaskWritesTelemetryIncidentCommand();
  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    telemetrySignals: release.telemetrySignals
  };
}

export function getProductionTaskWritesIncidentCommand() {
  const release = getProductionTaskWritesTelemetryIncidentCommand();
  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    incidentCommandReady: release.incidentCommandReady,
    killSwitchAvailable: release.killSwitchAvailable,
    controls: release.incidentCommandControls
  };
}

export function getProductionTaskWritesTelemetryRollback() {
  const release = getProductionTaskWritesTelemetryIncidentCommand();
  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    guardrails: release.productionGuardrails,
    rollbackAvailable: true
  };
}

export function getProductionTaskWritesTelemetryPlan() {
  const release = getProductionTaskWritesTelemetryIncidentCommand();
  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    plan: release.rolloutPlan,
    nextBuild: release.nextBuild
  };
}
