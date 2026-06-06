export type CompletionMetric = {
  label: string;
  value: number;
};

export type SlaMetric = {
  id: string;
  label: string;
  target: string;
  current: string;
  status: "green" | "watch" | "blocked";
  owner: string;
};

export type MonitoringSignal = {
  id: string;
  label: string;
  source: string;
  threshold: string;
  action: string;
  status: "active" | "watch" | "manual";
};

export type IncidentCommand = {
  id: string;
  label: string;
  trigger: string;
  command: string;
  rollback: string;
};

export type PostEnableRunbookStep = {
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
  { label: "IoT/Ops", value: 78 },
  { label: "Mobile App", value: 74 }
];

const slaMetrics: SlaMetric[] = [
  {
    id: "write-success-rate",
    label: "Production write success rate",
    target: ">= 99.5%",
    current: "shadow-ready / monitored",
    status: "green",
    owner: "Backend/API"
  },
  {
    id: "audit-coverage",
    label: "Audit coverage before success response",
    target: "100%",
    current: "required for every mutation",
    status: "green",
    owner: "Auth/RBAC"
  },
  {
    id: "write-latency-p95",
    label: "Task write p95 latency",
    target: "< 800 ms",
    current: "baseline collection enabled",
    status: "watch",
    owner: "Database/Prisma"
  },
  {
    id: "rollback-readiness",
    label: "Rollback readiness",
    target: "create/update/status/assignment covered",
    current: "runbook active",
    status: "green",
    owner: "Operations"
  }
];

const monitoringSignals: MonitoringSignal[] = [
  {
    id: "rbac-deny-spike",
    label: "RBAC deny spike",
    source: "task mutation gateway",
    threshold: "> 5 denied writes in 10 minutes",
    action: "freeze affected role or project scope",
    status: "active"
  },
  {
    id: "audit-missing-event",
    label: "Missing audit event",
    source: "audit envelope validator",
    threshold: "any successful write without audit",
    action: "trigger kill-switch and quarantine mutation class",
    status: "active"
  },
  {
    id: "write-latency-regression",
    label: "Write latency regression",
    source: "API telemetry",
    threshold: "p95 above target for two consecutive windows",
    action: "pause rollout wave and capture traces",
    status: "watch"
  },
  {
    id: "rollback-rate",
    label: "Rollback rate",
    source: "rollback command ledger",
    threshold: "> 2 rollback events per wave",
    action: "stop next wave and require owner review",
    status: "manual"
  }
];

const incidentCommands: IncidentCommand[] = [
  {
    id: "kill-production-writes",
    label: "Kill production writes",
    trigger: "audit gap, RBAC bypass, rollback mismatch, or unexpected write amplification",
    command: "TASK_WRITES_PRODUCTION_KILL_SWITCH=true",
    rollback: "all production mutations stop; reads remain available"
  },
  {
    id: "freeze-rollout-wave",
    label: "Freeze rollout wave",
    trigger: "latency breach, RBAC deny anomaly, or operator report",
    command: "TASK_WRITES_ROLLOUT_FREEZE=true",
    rollback: "active wave stays read-only until incident closure"
  },
  {
    id: "quarantine-mutation-class",
    label: "Quarantine mutation class",
    trigger: "single mutation type fails audit or rollback checks",
    command: "TASK_WRITES_QUARANTINE_CLASS=<create|update|status|assignment>",
    rollback: "only affected mutation type is blocked"
  }
];

const runbook: PostEnableRunbookStep[] = [
  {
    phase: "1",
    title: "Telemetry baseline",
    outcome: "Collect success rate, latency, RBAC denies and audit coverage before expanding writes.",
    required: ["green deploy", "audit endpoint reachable", "write-gate OFF by default", "telemetry dashboard visible"]
  },
  {
    phase: "2",
    title: "Post-enable observation window",
    outcome: "Monitor the first production write window with immediate kill-switch readiness.",
    required: ["owner online", "rollback command tested", "incident command available"]
  },
  {
    phase: "3",
    title: "SLA acceptance",
    outcome: "Approve broader production writes only if SLA metrics stay green.",
    required: ["write success target met", "audit coverage 100%", "p95 latency within budget"]
  },
  {
    phase: "4",
    title: "GA monitoring handoff",
    outcome: "Move production task writes into ongoing operational monitoring.",
    required: ["runbook documented", "incident owners assigned", "weekly telemetry review"]
  }
];

export function getProductionTaskWritesPostEnableMonitoringSlaDashboard() {
  return {
    ok: true,
    version: "4.6.0",
    name: "Production Task Writes Post-Enable Monitoring & SLA Dashboard",
    generatedAt: new Date().toISOString(),
    productionWritesDefault: "OFF",
    dashboardMode: "post-enable-monitoring",
    summary:
      "v4.6 adds the post-enable monitoring and SLA layer for production task writes. It keeps production writes gated while exposing telemetry, SLA targets, incident commands and operational handoff checks.",
    completion,
    slaMetrics,
    monitoringSignals,
    incidentCommands,
    runbook,
    health: {
      ok: true,
      status: "monitoring-ready",
      productionWritesEnabledByDefault: false,
      slaDashboardReady: true,
      incidentCommandReady: true,
      requiredEnvGates: [
        "TASK_WRITES_PRODUCTION_ENABLED=true",
        "TASK_WRITES_AUDIT_REQUIRED=true",
        "TASK_WRITES_RBAC_REQUIRED=true"
      ],
      killSwitch: "TASK_WRITES_PRODUCTION_KILL_SWITCH=true"
    }
  };
}

export function getTaskProductionPostEnableMonitoringPublicStatus() {
  const release = getProductionTaskWritesPostEnableMonitoringSlaDashboard();

  return {
    ok: true,
    version: release.version,
    scope: "tasks",
    mode: release.dashboardMode,
    productionWritesDefault: release.productionWritesDefault,
    health: release.health,
    slaMetrics: release.slaMetrics.map((metric) => ({
      id: metric.id,
      label: metric.label,
      target: metric.target,
      status: metric.status
    })),
    monitoringSignals: release.monitoringSignals.map((signal) => ({
      id: signal.id,
      label: signal.label,
      threshold: signal.threshold,
      status: signal.status
    }))
  };
}
