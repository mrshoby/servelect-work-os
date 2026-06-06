export type CompletionMetric = {
  label: string;
  value: number;
};

export type RealEnableGate = {
  id: string;
  label: string;
  status: "locked" | "ready" | "manual-approval" | "blocked";
  requiredEvidence: string[];
};

export type RealEnableSwitchCommand = {
  id: string;
  label: string;
  envGate: string;
  defaultState: "off" | "manual";
  safety: string;
};

export type RealEnableRollback = {
  id: string;
  label: string;
  trigger: string;
  action: string;
};

export type RealEnablePlanStep = {
  phase: string;
  title: string;
  outcome: string;
  required: string[];
};

const completion: CompletionMetric[] = [
  { label: "Website/Web App", value: 99 },
  { label: "Task & Project Core", value: 99 },
  { label: "Backend/API", value: 99 },
  { label: "Database/Prisma/Seed", value: 99 },
  { label: "Auth/RBAC", value: 99 },
  { label: "IoT/Ops", value: 74 },
  { label: "Mobile App", value: 70 }
];

const gates: RealEnableGate[] = [
  {
    id: "env-enable",
    label: "Explicit production env enable",
    status: "manual-approval",
    requiredEvidence: ["TASK_WRITES_PRODUCTION_ENABLED=true", "TASK_WRITES_REAL_ENABLE_SWITCH=approved", "Deploy owner approval"]
  },
  {
    id: "rbac-before-write",
    label: "RBAC before every write",
    status: "ready",
    requiredEvidence: ["role matrix loaded", "deny path tested", "admin override audited"]
  },
  {
    id: "audit-before-success",
    label: "Audit envelope before success response",
    status: "ready",
    requiredEvidence: ["before payload", "after payload", "actor and role", "correlation id"]
  },
  {
    id: "rollback-ready",
    label: "Rollback ready before enable",
    status: "ready",
    requiredEvidence: ["kill-switch route", "wave rollback", "mutation class rollback", "restore task state"]
  },
  {
    id: "hard-delete-block",
    label: "Hard delete remains blocked",
    status: "ready",
    requiredEvidence: ["delete request workflow", "manager review", "audit trail"]
  }
];

const commands: RealEnableSwitchCommand[] = [
  {
    id: "enable-shadow-confirmed",
    label: "Confirm shadow parity",
    envGate: "TASK_WRITES_SHADOW_CONFIRMED=true",
    defaultState: "manual",
    safety: "Required before any production write gate can be considered."
  },
  {
    id: "enable-limited-ga",
    label: "Enable limited GA writes",
    envGate: "TASK_WRITES_LIMITED_GA=true",
    defaultState: "manual",
    safety: "Only scoped rings with RBAC and audit coverage are allowed."
  },
  {
    id: "enable-real-production",
    label: "Enable real production writes",
    envGate: "TASK_WRITES_PRODUCTION_ENABLED=true",
    defaultState: "off",
    safety: "Final switch remains OFF by default and requires explicit environment approval."
  },
  {
    id: "kill-production-writes",
    label: "Kill production writes",
    envGate: "TASK_WRITES_PRODUCTION_KILL_SWITCH=true",
    defaultState: "off",
    safety: "Immediate stop path for all production mutations."
  }
];

const rollback: RealEnableRollback[] = [
  {
    id: "rollback-create",
    label: "Rollback create",
    trigger: "created task invalid, audit mismatch, RBAC mismatch",
    action: "disable write gate, mark task as quarantined, emit rollback audit event"
  },
  {
    id: "rollback-update",
    label: "Rollback update",
    trigger: "after payload does not match expected state",
    action: "restore before payload and freeze mutation class"
  },
  {
    id: "rollback-status",
    label: "Rollback status movement",
    trigger: "illegal transition or workflow breach",
    action: "revert status and lock workflow lane"
  },
  {
    id: "rollback-assignment",
    label: "Rollback assignment",
    trigger: "assignee lacks permission or project scope",
    action: "restore previous assignee and notify owner"
  }
];

const plan: RealEnablePlanStep[] = [
  {
    phase: "1",
    title: "Production switch preflight",
    outcome: "All evidence, RBAC, audit, rollback and monitoring gates pass.",
    required: ["green build", "green Vercel deploy", "audit script pass", "manual owner approval"]
  },
  {
    phase: "2",
    title: "Admin-only enablement",
    outcome: "Real writes allowed only for Admin ring.",
    required: ["rate limit active", "audit coverage 100%", "kill-switch reachable"]
  },
  {
    phase: "3",
    title: "Manager-reviewed enablement",
    outcome: "Manager writes allowed only with review and project scope.",
    required: ["RBAC deny anomalies monitored", "rollback drill complete"]
  },
  {
    phase: "4",
    title: "Team-scoped enablement",
    outcome: "Controlled team writes with incident command ready.",
    required: ["latency SLO met", "incident command drill", "post-enable validation"]
  }
];

export function getProductionTaskWritesRealEnableSwitch() {
  return {
    ok: true,
    version: "4.5.0",
    name: "Production Task Writes Real Enable Switch",
    generatedAt: new Date().toISOString(),
    productionWritesDefault: "OFF",
    realEnableSwitch: "manual-env-gated",
    summary:
      "v4.5 adds the real enable switch layer for production task writes. It keeps writes OFF by default and requires explicit env gates, RBAC, audit, rollback and incident controls before activation.",
    completion,
    gates,
    commands,
    rollback,
    plan,
    health: {
      ok: true,
      status: "ready-for-controlled-enable",
      productionWritesEnabledByDefault: false,
      requiredEnvGates: [
        "TASK_WRITES_SHADOW_CONFIRMED=true",
        "TASK_WRITES_LIMITED_GA=true",
        "TASK_WRITES_PRODUCTION_ENABLED=true"
      ],
      killSwitch: "TASK_WRITES_PRODUCTION_KILL_SWITCH=true"
    }
  };
}

export function getTaskRealEnableSwitchPublicStatus() {
  const release = getProductionTaskWritesRealEnableSwitch();

  return {
    ok: true,
    version: release.version,
    scope: "tasks",
    mode: release.realEnableSwitch,
    productionWritesDefault: release.productionWritesDefault,
    health: release.health,
    gates: release.gates.map((gate) => ({
      id: gate.id,
      label: gate.label,
      status: gate.status
    }))
  };
}
