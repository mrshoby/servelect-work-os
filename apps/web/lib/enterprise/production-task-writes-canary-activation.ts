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

export type CanaryRingStatus = "ready" | "active" | "partial" | "blocked";
export type CanaryWriteMode = "canary-controlled" | "staging" | "production-off";
export type CanaryOperation = "create" | "update" | "status-change" | "assign";

export type CanaryRing = {
  id: string;
  label: string;
  scope: string;
  status: CanaryRingStatus;
  readiness: number;
  maxWritesPerHour: number;
  allowedOperations: CanaryOperation[];
  killSwitch: string;
};

export type CanarySafetyRule = {
  id: string;
  label: string;
  status: CanaryRingStatus;
  readiness: number;
  enforcement: string;
  evidence: string;
};

export type CanaryRollbackGuard = {
  id: string;
  label: string;
  status: CanaryRingStatus;
  readiness: number;
  trigger: string;
  action: string;
};

export type ProductionTaskWritesCanaryRelease = {
  ok: boolean;
  version: string;
  name: string;
  generatedAt: string;
  writeMode: CanaryWriteMode;
  productionWritesEnabled: boolean;
  canaryWritesEnabled: boolean;
  summary: string;
  areas: ProductionArea[];
  canaryRings: CanaryRing[];
  safetyRules: CanarySafetyRule[];
  rollbackGuards: CanaryRollbackGuard[];
  promotionCriteria: string[];
  nextBuild: string;
};

const areas: ProductionArea[] = [
  {
    id: "website",
    label: "Website/Web App",
    completion: 95,
    status: "stable",
    summary: "Web task pages, canary dashboards, governance and release visibility are active."
  },
  {
    id: "taskProjectCore",
    label: "Task & Project Core",
    completion: 96,
    status: "beta",
    summary: "Task lifecycle, board, drawer, staged writes, rollback drill and canary scopes are prepared."
  },
  {
    id: "backendApi",
    label: "Backend/API",
    completion: 93,
    status: "beta",
    summary: "API routes expose canary write mode, health, rollback guard and task-side status contracts."
  },
  {
    id: "databasePrismaSeed",
    label: "Database/Prisma/Seed",
    completion: 92,
    status: "partial",
    summary: "Prisma repository path is ready for limited canary writes behind explicit gates and rollback safeguards."
  },
  {
    id: "authRbac",
    label: "Auth/RBAC",
    completion: 83,
    status: "partial",
    summary: "RBAC enforcement is required for every canary operation before write execution."
  },
  {
    id: "iotOps",
    label: "IoT/Ops",
    completion: 52,
    status: "mock",
    summary: "Operations signals remain read-only and can enrich task context after production task writes stabilize."
  },
  {
    id: "mobileApp",
    label: "Mobile App",
    completion: 46,
    status: "mock",
    summary: "Mobile task write surfaces remain disabled until the web canary path is stable."
  }
];

const canaryRings: CanaryRing[] = [
  {
    id: "ring-0-admin-only",
    label: "Ring 0 - Admin only",
    scope: "Internal admins, test project bucket, non-destructive task create/update.",
    status: "active",
    readiness: 92,
    maxWritesPerHour: 10,
    allowedOperations: ["create", "update"],
    killSwitch: "TASK_WRITES_CANARY=false"
  },
  {
    id: "ring-1-manager-review",
    label: "Ring 1 - Manager reviewed writes",
    scope: "Managers can update status/assignee only after audit and RBAC checks pass.",
    status: "ready",
    readiness: 88,
    maxWritesPerHour: 25,
    allowedOperations: ["update", "status-change", "assign"],
    killSwitch: "TASK_WRITES_CANARY_RING=0"
  },
  {
    id: "ring-2-team-limited",
    label: "Ring 2 - Limited team canary",
    scope: "Selected team members, selected projects, rollback evidence mandatory.",
    status: "partial",
    readiness: 74,
    maxWritesPerHour: 50,
    allowedOperations: ["create", "update", "status-change", "assign"],
    killSwitch: "TASK_WRITES_CANARY_RING=1"
  }
];

const safetyRules: CanarySafetyRule[] = [
  {
    id: "rbac-before-write",
    label: "RBAC decision before every write",
    status: "ready",
    readiness: 90,
    enforcement: "Deny by default unless actor role, project scope and operation are allowed.",
    evidence: "actorId, role, operation, projectId, decision, ruleId"
  },
  {
    id: "audit-before-after",
    label: "Before/after audit envelope",
    status: "ready",
    readiness: 91,
    enforcement: "Every canary write must produce immutable before/after payload hashes.",
    evidence: "requestId, beforeHash, afterHash, payloadDiff, timestamp"
  },
  {
    id: "rate-limit-canary",
    label: "Canary write rate limit",
    status: "ready",
    readiness: 86,
    enforcement: "Reject writes beyond canary ring rate limits to prevent runaway mutations.",
    evidence: "ringId, writesThisHour, maxWritesPerHour, rejected"
  },
  {
    id: "hard-delete-block",
    label: "Hard delete blocked",
    status: "ready",
    readiness: 95,
    enforcement: "No hard delete in canary. Only delete requests or archive markers are allowed.",
    evidence: "operation=delete, denied=true, fallback=delete-request"
  }
];

const rollbackGuards: CanaryRollbackGuard[] = [
  {
    id: "rollback-create",
    label: "Rollback canary task.create",
    status: "ready",
    readiness: 89,
    trigger: "Created task fails downstream validation or project scope check.",
    action: "Archive canary task, append reversal audit event and restore previous task count snapshot."
  },
  {
    id: "rollback-update",
    label: "Rollback canary task.update",
    status: "ready",
    readiness: 90,
    trigger: "Protected task field changed or invalid payload diff is detected.",
    action: "Replay before payload through rollback adapter and attach rollback reason."
  },
  {
    id: "rollback-status",
    label: "Rollback canary status movement",
    status: "ready",
    readiness: 88,
    trigger: "Board transition violates workflow or role constraints.",
    action: "Move task back to previous status and notify manager review queue."
  },
  {
    id: "rollback-assignment",
    label: "Rollback canary assignment",
    status: "partial",
    readiness: 80,
    trigger: "Assignee is inactive, missing or outside project department scope.",
    action: "Restore previous assignee and create assignment review event."
  }
];

export function getProductionTaskWritesCanaryActivation(): ProductionTaskWritesCanaryRelease {
  return {
    ok: true,
    version: "3.9.0",
    name: "Production Task Writes Canary Activation",
    generatedAt: new Date().toISOString(),
    writeMode: "canary-controlled",
    productionWritesEnabled: false,
    canaryWritesEnabled: true,
    summary:
      "Activates controlled production task write canaries with RBAC, audit, rate limits, rollback guards and kill-switches. Full production writes remain disabled until canary evidence is clean.",
    areas,
    canaryRings,
    safetyRules,
    rollbackGuards,
    promotionCriteria: [
      "Ring 0 canary writes pass without rollback for 24 hours.",
      "Every write has RBAC decision, audit envelope and before/after payload hashes.",
      "No hard delete path exists in canary mode.",
      "Rollback drill succeeds for create, update, status-change and assignment.",
      "Canary kill switch can disable writes without redeploy."
    ],
    nextBuild: "v4.0.0 - Production Task Writes General Availability Gate"
  };
}

export function getProductionTaskWritesCanaryHealth() {
  const release = getProductionTaskWritesCanaryActivation();
  const readiness = Math.round(release.canaryRings.reduce((sum, ring) => sum + ring.readiness, 0) / release.canaryRings.length);
  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    status: "canary-ready",
    writeMode: release.writeMode,
    productionWritesEnabled: release.productionWritesEnabled,
    canaryWritesEnabled: release.canaryWritesEnabled,
    readiness,
    rings: release.canaryRings.map((ring) => ({
      id: ring.id,
      label: ring.label,
      status: ring.status,
      readiness: ring.readiness,
      maxWritesPerHour: ring.maxWritesPerHour
    }))
  };
}

export function getProductionTaskWritesCanaryRings() {
  const release = getProductionTaskWritesCanaryActivation();
  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    writeMode: release.writeMode,
    canaryRings: release.canaryRings,
    safetyRules: release.safetyRules
  };
}

export function getProductionTaskWritesCanaryRollback() {
  const release = getProductionTaskWritesCanaryActivation();
  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    rollbackRequired: true,
    rollbackGuards: release.rollbackGuards,
    promotionCriteria: release.promotionCriteria
  };
}

export function getProductionTaskWritesCanaryPlan() {
  const release = getProductionTaskWritesCanaryActivation();
  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    current: release.name,
    nextBuild: release.nextBuild,
    plan: [
      "Enable Ring 0 canary for admin-only create/update operations.",
      "Capture RBAC decision, audit envelope, payload diff and rollback record for every write.",
      "Monitor rate limits and rollback triggers before expanding to Ring 1.",
      "Keep full production writes disabled until canary evidence passes.",
      "Prepare v4.0 general availability gate after canary stability."
    ]
  };
}
