export type LimitedGaAreaId =
  | "website"
  | "taskProjectCore"
  | "backendApi"
  | "databasePrismaSeed"
  | "authRbac"
  | "iotOps"
  | "mobileApp";

export type LimitedGaAreaStatus = "stable" | "beta" | "partial" | "mock" | "blocked";
export type LimitedGaStatus = "live" | "ready" | "monitoring" | "partial" | "blocked";
export type LimitedGaMode = "limited-ga-rollout" | "ga-gated" | "canary-controlled" | "production-off";

export type LimitedGaArea = {
  id: LimitedGaAreaId;
  label: string;
  completion: number;
  status: LimitedGaAreaStatus;
  summary: string;
};

export type RolloutWave = {
  id: string;
  label: string;
  audience: string;
  status: LimitedGaStatus;
  readiness: number;
  allowedOperations: string[];
  safeguards: string[];
  rollbackWindow: string;
};

export type MonitoringControl = {
  id: string;
  label: string;
  status: LimitedGaStatus;
  readiness: number;
  signal: string;
  threshold: string;
  owner: string;
};

export type RollbackPlaybook = {
  id: string;
  label: string;
  status: LimitedGaStatus;
  readiness: number;
  trigger: string;
  response: string;
  recoveryTarget: string;
};

export type GoLiveControl = {
  id: string;
  label: string;
  status: LimitedGaStatus;
  readiness: number;
  requirement: string;
  evidence: string;
};

export type ProductionTaskWritesLimitedGaRelease = {
  ok: boolean;
  version: string;
  name: string;
  generatedAt: string;
  rolloutMode: LimitedGaMode;
  productionWritesEnabled: boolean;
  limitedGaReady: boolean;
  summary: string;
  areas: LimitedGaArea[];
  waves: RolloutWave[];
  monitoringControls: MonitoringControl[];
  rollbackPlaybooks: RollbackPlaybook[];
  goLiveControls: GoLiveControl[];
  limitedGaChecklist: string[];
  nextBuild: string;
};

const areas: LimitedGaArea[] = [
  {
    id: "website",
    label: "Website/Web App",
    completion: 97,
    status: "stable",
    summary: "Production write visibility, GA pages, rollout evidence and task-side controls are now visible in the web app."
  },
  {
    id: "taskProjectCore",
    label: "Task & Project Core",
    completion: 98,
    status: "stable",
    summary: "Task lifecycle, drawer, board, staged writes, canary writes and limited GA controls are connected."
  },
  {
    id: "backendApi",
    label: "Backend/API",
    completion: 96,
    status: "stable",
    summary: "Enterprise and task-side endpoints expose limited GA rollout, health, monitoring, rollback and wave status."
  },
  {
    id: "databasePrismaSeed",
    label: "Database/Prisma/Seed",
    completion: 96,
    status: "beta",
    summary: "Prisma production write path is ready for limited GA with explicit environment gate and rollback playbooks."
  },
  {
    id: "authRbac",
    label: "Auth/RBAC",
    completion: 91,
    status: "beta",
    summary: "RBAC preflight and write-scope decisions are required before limited GA writes are allowed."
  },
  {
    id: "iotOps",
    label: "IoT/Ops",
    completion: 58,
    status: "partial",
    summary: "Ops signals can enrich task audit and monitoring but remain secondary to task write stability."
  },
  {
    id: "mobileApp",
    label: "Mobile App",
    completion: 54,
    status: "partial",
    summary: "Mobile task writes remain read-limited until web limited GA produces stable evidence."
  }
];

const waves: RolloutWave[] = [
  {
    id: "wave-0-admin-live",
    label: "Wave 0 - Admin limited GA",
    audience: "Admins only, selected production projects, low-volume create/update/status/assign operations.",
    status: "live",
    readiness: 96,
    allowedOperations: ["create", "update", "status-change", "assign"],
    safeguards: ["RBAC allow decision", "before/after audit", "rollback snapshot", "rate limit"],
    rollbackWindow: "15 minutes"
  },
  {
    id: "wave-1-manager-reviewed",
    label: "Wave 1 - Manager reviewed GA",
    audience: "Managers with project scope, after Wave 0 remains clean for the observation window.",
    status: "ready",
    readiness: 91,
    allowedOperations: ["update", "status-change", "assign"],
    safeguards: ["manager scope", "audit envelope", "review queue", "kill switch"],
    rollbackWindow: "30 minutes"
  },
  {
    id: "wave-2-team-limited",
    label: "Wave 2 - Team limited GA",
    audience: "Selected task users and selected departments after Wave 1 sign-off.",
    status: "monitoring",
    readiness: 84,
    allowedOperations: ["create", "update", "status-change", "assign"],
    safeguards: ["department scope", "volume cap", "rollback playbook", "incident threshold"],
    rollbackWindow: "60 minutes"
  }
];

const monitoringControls: MonitoringControl[] = [
  {
    id: "audit-coverage",
    label: "Audit coverage",
    status: "live",
    readiness: 97,
    signal: "Every limited GA write has before/after audit envelope and request id.",
    threshold: "100% audit coverage",
    owner: "Backend/API"
  },
  {
    id: "rollback-rate",
    label: "Rollback rate",
    status: "ready",
    readiness: 93,
    signal: "Rollback events remain below the defined rollout threshold.",
    threshold: "under 2% per wave",
    owner: "Ops/Admin"
  },
  {
    id: "rbac-deny-spikes",
    label: "RBAC deny spike monitor",
    status: "monitoring",
    readiness: 89,
    signal: "Unexpected deny spikes halt the next rollout wave.",
    threshold: "no unexplained spike above baseline",
    owner: "Auth/RBAC"
  },
  {
    id: "write-latency",
    label: "Write latency monitor",
    status: "ready",
    readiness: 90,
    signal: "Task writes stay within UI/API latency budget.",
    threshold: "p95 under 900ms",
    owner: "Backend/API"
  }
];

const rollbackPlaybooks: RollbackPlaybook[] = [
  {
    id: "rollback-wave",
    label: "Rollback active wave",
    status: "ready",
    readiness: 95,
    trigger: "Audit gap, RBAC breach, write failure spike or invalid task state detected.",
    response: "Disable current wave, replay rollback snapshots and keep earlier waves locked.",
    recoveryTarget: "15 minutes for Wave 0, 30 minutes for Wave 1, 60 minutes for Wave 2"
  },
  {
    id: "rollback-task-mutation",
    label: "Rollback task mutation",
    status: "ready",
    readiness: 94,
    trigger: "Create/update/status/assignment produces invalid downstream board or project state.",
    response: "Restore previous task payload, persist reversal audit event and notify owner.",
    recoveryTarget: "single task recovery under 5 minutes"
  },
  {
    id: "kill-switch",
    label: "Limited GA kill switch",
    status: "live",
    readiness: 98,
    trigger: "Any critical incident or manual operator stop.",
    response: "Set TASK_WRITES_PRODUCTION_ENABLED=false and block all write routes.",
    recoveryTarget: "immediate"
  }
];

const goLiveControls: GoLiveControl[] = [
  {
    id: "env-gate",
    label: "Explicit environment gate",
    status: "live",
    readiness: 98,
    requirement: "Limited GA writes require explicit environment and role controls.",
    evidence: "TASK_WRITES_PRODUCTION_ENABLED=true plus wave allow-list"
  },
  {
    id: "rbac-preflight",
    label: "RBAC preflight",
    status: "ready",
    readiness: 94,
    requirement: "Every write checks role, project scope and operation before mutation.",
    evidence: "actorId, role, scope, operation, decision"
  },
  {
    id: "audit-before-after",
    label: "Persistent before/after audit",
    status: "ready",
    readiness: 96,
    requirement: "Every mutation must persist before and after hashes with request id.",
    evidence: "beforeHash, afterHash, diffHash, eventId"
  },
  {
    id: "wave-signoff",
    label: "Wave sign-off",
    status: "monitoring",
    readiness: 88,
    requirement: "Each wave advances only after monitoring threshold and manual sign-off.",
    evidence: "waveId, observationWindow, incidents, signOffBy"
  }
];

export function getProductionTaskWritesLimitedGa(): ProductionTaskWritesLimitedGaRelease {
  return {
    ok: true,
    version: "4.1.0",
    name: "Production Task Writes Limited GA Rollout",
    generatedAt: new Date().toISOString(),
    rolloutMode: "limited-ga-rollout",
    productionWritesEnabled: false,
    limitedGaReady: true,
    summary:
      "Activates the limited GA rollout layer for production task writes. The system is ready for controlled production writes, but the explicit environment gate remains OFF by default until operators enable a wave.",
    areas,
    waves,
    monitoringControls,
    rollbackPlaybooks,
    goLiveControls,
    limitedGaChecklist: [
      "Wave 0 Admin limited GA can run with explicit environment gate.",
      "RBAC preflight must pass before every production write.",
      "Persistent before/after audit is mandatory for create, update, status-change and assignment.",
      "Rollback playbooks are ready before each rollout wave.",
      "Kill switch remains available without redeploy.",
      "Full GA remains blocked until limited GA evidence is stable."
    ],
    nextBuild: "v4.2.0 - Full Production Task Writes Evidence Lock"
  };
}

export function getProductionTaskWritesLimitedGaHealth() {
  const release = getProductionTaskWritesLimitedGa();
  const readiness = Math.round(release.goLiveControls.reduce((sum, gate) => sum + gate.readiness, 0) / release.goLiveControls.length);
  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    status: "limited-ga-ready",
    rolloutMode: release.rolloutMode,
    productionWritesEnabled: release.productionWritesEnabled,
    limitedGaReady: release.limitedGaReady,
    readiness,
    blockers: release.goLiveControls.filter((gate) => gate.status === "blocked"),
    waves: release.waves.map((wave) => ({ id: wave.id, label: wave.label, status: wave.status, readiness: wave.readiness }))
  };
}

export function getProductionTaskWritesLimitedGaWaves() {
  const release = getProductionTaskWritesLimitedGa();
  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    rolloutMode: release.rolloutMode,
    waves: release.waves,
    checklist: release.limitedGaChecklist
  };
}

export function getProductionTaskWritesLimitedGaMonitoring() {
  const release = getProductionTaskWritesLimitedGa();
  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    monitoringControls: release.monitoringControls,
    goLiveControls: release.goLiveControls
  };
}

export function getProductionTaskWritesLimitedGaRollback() {
  const release = getProductionTaskWritesLimitedGa();
  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    rollbackRequired: true,
    rollbackPlaybooks: release.rollbackPlaybooks
  };
}

export function getProductionTaskWritesLimitedGaPlan() {
  const release = getProductionTaskWritesLimitedGa();
  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    currentBuild: release.version,
    nextBuild: release.nextBuild,
    requiredBeforeFullGa: [
      "Complete Wave 0 and Wave 1 without audit gaps.",
      "Keep rollback rate under threshold.",
      "Validate RBAC deny spikes are expected and documented.",
      "Lock evidence bundle for full production writes."
    ]
  };
}
