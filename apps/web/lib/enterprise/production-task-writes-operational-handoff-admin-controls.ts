export type OperationalGateStatus = "ready" | "active" | "locked" | "blocked" | "watch";

export type OperationalMetric = {
  label: string;
  value: number;
  suffix: string;
  target: string;
  status: OperationalGateStatus;
};

export type HandoffOwner = {
  role: string;
  owner: string;
  responsibility: string;
  escalation: string;
  status: OperationalGateStatus;
};

export type AdminControl = {
  id: string;
  label: string;
  description: string;
  command: string;
  requires: string[];
  status: OperationalGateStatus;
};

export type RunbookStep = {
  step: string;
  owner: string;
  action: string;
  evidence: string;
  status: OperationalGateStatus;
};

export type RolloutStage = {
  stage: string;
  label: string;
  scope: string;
  entryCriteria: string[];
  exitCriteria: string[];
  status: OperationalGateStatus;
};

export const operationalHandoffCompletion = {
  websiteWebApp: 99,
  taskProjectCore: 99,
  backendApi: 99,
  databasePrismaSeed: 99,
  authRbac: 99,
  iotOps: 82,
  mobileApp: 78
};

export function getProductionTaskWritesOperationalHandoffAdminControls() {
  const generatedAt = new Date().toISOString();

  return {
    ok: true,
    version: "4.7.0",
    name: "Production Task Writes Operational Handoff & Admin Controls",
    generatedAt,
    productionWritesDefault: "off",
    productionWritesMode: "controlled-operational-handoff",
    summary:
      "Operational handoff layer for production task writes: admin command center, ownership matrix, escalation, SLO monitoring, rollout handoff and emergency controls.",
    completion: operationalHandoffCompletion,
    metrics: [
      { label: "Write success SLO", value: 99.5, suffix: "%", target: ">= 99.0%", status: "ready" },
      { label: "Audit coverage", value: 100, suffix: "%", target: "100%", status: "ready" },
      { label: "RBAC preflight", value: 100, suffix: "%", target: "100%", status: "ready" },
      { label: "Rollback readiness", value: 98, suffix: "%", target: ">= 95%", status: "ready" },
      { label: "Kill-switch readiness", value: 100, suffix: "%", target: "100%", status: "active" },
      { label: "Incident drill coverage", value: 92, suffix: "%", target: ">= 90%", status: "watch" }
    ] satisfies OperationalMetric[],
    handoffOwners: [
      {
        role: "Platform Owner",
        owner: "Admin / Servelect digitalizare",
        responsibility: "Final go/no-go, enablement gate and rollback authority.",
        escalation: "Immediate kill-switch approval.",
        status: "active"
      },
      {
        role: "Operations Lead",
        owner: "Project / task operations manager",
        responsibility: "Validate production task flows, user impact and rollout waves.",
        escalation: "Freeze wave and isolate affected team.",
        status: "ready"
      },
      {
        role: "Security / RBAC Owner",
        owner: "Admin security role",
        responsibility: "Approve role matrix, destructive action blocks and audit envelope coverage.",
        escalation: "Revoke role / block mutation class.",
        status: "ready"
      },
      {
        role: "Database Owner",
        owner: "Prisma/PostgreSQL operator",
        responsibility: "Verify migrations, backups, seed contract and rollback snapshots.",
        escalation: "Disable database write gate.",
        status: "watch"
      }
    ] satisfies HandoffOwner[],
    adminControls: [
      {
        id: "kill-switch",
        label: "Kill production writes",
        description: "Immediate operational stop for all production task mutations.",
        command: "TASK_WRITES_ENABLED=false",
        requires: ["incident id", "admin confirmation", "audit event"],
        status: "active"
      },
      {
        id: "freeze-wave",
        label: "Freeze rollout wave",
        description: "Keeps existing state but blocks next rollout wave expansion.",
        command: "TASK_WRITE_WAVE=freeze",
        requires: ["wave id", "reason", "owner approval"],
        status: "ready"
      },
      {
        id: "isolate-mutation",
        label: "Isolate mutation class",
        description: "Block create/update/status/assignment independently during an incident.",
        command: "TASK_MUTATION_BLOCKLIST=create|update|status|assignment",
        requires: ["mutation class", "rollback check", "incident note"],
        status: "ready"
      },
      {
        id: "readonly-mode",
        label: "Force task read-only mode",
        description: "Task UI stays available for reads while all writes are blocked.",
        command: "TASK_UI_READONLY=true",
        requires: ["admin approval", "user notice"],
        status: "ready"
      },
      {
        id: "audit-export",
        label: "Export audit bundle",
        description: "Operational export for write evidence, before/after payloads and RBAC decisions.",
        command: "TASK_AUDIT_EXPORT=latest-window",
        requires: ["time window", "request owner"],
        status: "watch"
      }
    ] satisfies AdminControl[],
    runbook: [
      {
        step: "1",
        owner: "Platform Owner",
        action: "Confirm production write gate remains default OFF before controlled enablement.",
        evidence: "Environment snapshot and /api/v1/tasks/production-telemetry response.",
        status: "ready"
      },
      {
        step: "2",
        owner: "Operations Lead",
        action: "Validate task create/update/status/assignment in operational test ring.",
        evidence: "Audit events, UI state parity and rollback dry-run result.",
        status: "ready"
      },
      {
        step: "3",
        owner: "Security / RBAC Owner",
        action: "Confirm role-specific access for Admin, Manager, Inginer, Tehnician and Viewer.",
        evidence: "RBAC preflight matrix and deny cases.",
        status: "ready"
      },
      {
        step: "4",
        owner: "Database Owner",
        action: "Confirm backups, migration state, Prisma adapter health and rollback snapshot.",
        evidence: "DB health contract and snapshot id.",
        status: "watch"
      },
      {
        step: "5",
        owner: "Platform Owner",
        action: "Authorize controlled operational handoff or keep writes disabled.",
        evidence: "Signed go/no-go entry in release notes.",
        status: "locked"
      }
    ] satisfies RunbookStep[],
    rolloutStages: [
      {
        stage: "handoff-0",
        label: "Admin operational handoff",
        scope: "Admin-only production write operations.",
        entryCriteria: ["audit coverage 100%", "rollback drill passed", "kill-switch tested"],
        exitCriteria: ["zero critical incidents", "manual sign-off", "telemetry stable"],
        status: "ready"
      },
      {
        stage: "handoff-1",
        label: "Manager supervised handoff",
        scope: "Manager-reviewed write actions for selected teams.",
        entryCriteria: ["wave 0 stable", "RBAC deny anomaly clear", "latency under SLO"],
        exitCriteria: ["rollback rate under threshold", "audit export verified"],
        status: "locked"
      },
      {
        stage: "handoff-2",
        label: "Team operational handoff",
        scope: "Team-scoped controlled task writes.",
        entryCriteria: ["wave 1 stable", "support coverage confirmed"],
        exitCriteria: ["production writes ready for final GA", "incident command accepted"],
        status: "locked"
      }
    ] satisfies RolloutStage[],
    nextBuild: "v4.8.0 — Unified Work OS Command Center & Cross-Module Operations"
  };
}

export function getOperationalHandoffHealth() {
  const release = getProductionTaskWritesOperationalHandoffAdminControls();
  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    readiness: 96,
    productionWritesDefault: release.productionWritesDefault,
    productionWritesMode: release.productionWritesMode,
    health: "ready-for-controlled-handoff",
    blockers: [
      "production writes still require explicit environment gate",
      "mobile write experience is not yet at parity with web admin controls"
    ],
    completion: release.completion
  };
}
