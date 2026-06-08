import {
  approvals,
  auditCases,
  clients,
  crmLeads,
  energyInstallations,
  equipments,
  fundingCases,
  inventory,
  iotAlerts,
  maintenanceTickets,
  projects,
  tasks,
  users,
  type TaskStatus,
  type Priority
} from "@servelect/shared";

export type V58Domain =
  | "tasks"
  | "projects"
  | "users"
  | "materials"
  | "approvals"
  | "crm"
  | "iot"
  | "maintenance"
  | "funding"
  | "audit";

export type V58AdapterKind = "mock" | "localStorage" | "api" | "prisma" | "external";
export type V58Readiness = "ready" | "warning" | "blocked" | "shadow";
export type V58MutationState = "ready" | "shadowed" | "queued" | "blocked" | "needs-review";
export type V58RiskTone = "low" | "medium" | "high" | "critical";

export type V58AdapterLane = {
  id: string;
  domain: V58Domain;
  title: string;
  currentAdapter: V58AdapterKind;
  targetAdapter: V58AdapterKind;
  readiness: V58Readiness;
  sourceRecords: number;
  targetRecords: number;
  parityPercent: number;
  mutationCoveragePercent: number;
  rollbackCoveragePercent: number;
  owner: string;
  writeMode: "off" | "shadow" | "pilot" | "production";
  route: string;
  prismaModel: string;
  seedFile: string;
  blockers: string[];
  nextAction: string;
};

export type V58MutationContract = {
  id: string;
  domain: V58Domain;
  title: string;
  method: "POST" | "PATCH" | "PUT" | "DELETE";
  endpoint: string;
  state: V58MutationState;
  requiredPermission: string;
  writeModeGuard: string;
  auditEvent: string;
  rollbackPlan: string;
  idempotencyKey: string;
  samplePayload: Record<string, string | number | boolean>;
};

export type V58SeedParityCheck = {
  id: string;
  domain: V58Domain;
  label: string;
  mockCount: number;
  seedCount: number;
  apiCount: number;
  parityPercent: number;
  status: V58Readiness;
  evidence: string;
};

export type V58AuditEvent = {
  id: string;
  createdAt: string;
  domain: V58Domain;
  actor: string;
  action: string;
  target: string;
  mode: "shadow" | "pilot" | "production";
  result: "accepted" | "blocked" | "rolled-back" | "queued";
  evidence: string;
};

export type V58RollbackDrill = {
  id: string;
  title: string;
  domain: V58Domain;
  risk: V58RiskTone;
  coveragePercent: number;
  rpoMinutes: number;
  rtoMinutes: number;
  drillStatus: "not-run" | "scheduled" | "passed" | "failed";
  steps: string[];
};

export type V58CutoverWave = {
  id: string;
  title: string;
  date: string;
  domains: V58Domain[];
  gate: V58Readiness;
  goal: string;
  exitCriteria: string[];
};

export type V58StatusMetric = {
  label: string;
  percent: number;
  note: string;
};

const domainCounts: Record<V58Domain, number> = {
  tasks: tasks.length,
  projects: projects.length,
  users: users.length,
  materials: inventory.length + equipments.length,
  approvals: approvals.length,
  crm: crmLeads.length + clients.length,
  iot: energyInstallations.length + iotAlerts.length,
  maintenance: maintenanceTickets.length,
  funding: fundingCases.length,
  audit: auditCases.length
};

const ownerByDomain: Record<V58Domain, string> = {
  tasks: "Product Ops",
  projects: "PMO",
  users: "Admin/RBAC",
  materials: "Logistică",
  approvals: "Management",
  crm: "Vânzări",
  iot: "Energy Ops",
  maintenance: "Field Ops",
  funding: "Financiar/ESG",
  audit: "Platform Governance"
};

const prismaModelByDomain: Record<V58Domain, string> = {
  tasks: "Task",
  projects: "Project",
  users: "User",
  materials: "InventoryItem + Equipment",
  approvals: "ApprovalRequest",
  crm: "Client + CRMLead + Opportunity",
  iot: "EnergyInstallation + IoTAlert",
  maintenance: "MaintenanceTicket",
  funding: "FundingCase + AuditCase",
  audit: "ActivityLog + AuditEvent"
};

const seedFileByDomain: Record<V58Domain, string> = {
  tasks: "prisma/seed.tasks.ts",
  projects: "prisma/seed.projects.ts",
  users: "prisma/seed.users.ts",
  materials: "prisma/seed.materials.ts",
  approvals: "prisma/seed.approvals.ts",
  crm: "prisma/seed.crm.ts",
  iot: "prisma/seed.iot.ts",
  maintenance: "prisma/seed.maintenance.ts",
  funding: "prisma/seed.funding.ts",
  audit: "prisma/seed.audit.ts"
};

const routeByDomain: Record<V58Domain, string> = {
  tasks: "/api/v1/tasks",
  projects: "/api/v1/projects",
  users: "/api/v1/auth/users",
  materials: "/api/v1/work-os/stock",
  approvals: "/api/v1/work-os/approvals",
  crm: "/api/v1/work-os/crm",
  iot: "/api/v1/work-os/operations",
  maintenance: "/api/v1/work-os/field-ops",
  funding: "/api/v1/work-os/reports",
  audit: "/api/v1/work-os/audit"
};

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function readinessFromParity(parity: number, blockers: number): V58Readiness {
  if (blockers > 1) return "blocked";
  if (parity >= 92) return "ready";
  if (parity >= 70) return "warning";
  return "shadow";
}

export const v58AdapterLanes: V58AdapterLane[] = (Object.keys(domainCounts) as V58Domain[]).map((domain, index) => {
  const sourceRecords = domainCounts[domain];
  const targetRecords = Math.max(0, sourceRecords - (index % 3 === 0 ? 0 : 1));
  const parityPercent = sourceRecords === 0 ? 100 : clamp((targetRecords / sourceRecords) * 100 - (index % 4) * 3);
  const blockers = [
    ...(parityPercent < 75 ? ["Seed parity sub pragul de activare"] : []),
    ...(domain === "iot" ? ["Conectorii reali MQTT/Modbus rămân în shadow mode"] : []),
    ...(domain === "users" ? ["SSO/Auth.js nu este încă activat pentru producție"] : [])
  ];

  return {
    id: `lane-${domain}`,
    domain,
    title: `${prismaModelByDomain[domain]} cutover lane`,
    currentAdapter: index % 2 === 0 ? "api" : "localStorage",
    targetAdapter: "prisma",
    readiness: readinessFromParity(parityPercent, blockers.length),
    sourceRecords,
    targetRecords,
    parityPercent,
    mutationCoveragePercent: clamp(58 + index * 4),
    rollbackCoveragePercent: clamp(52 + index * 5),
    owner: ownerByDomain[domain],
    writeMode: domain === "tasks" || domain === "projects" ? "shadow" : "off",
    route: routeByDomain[domain],
    prismaModel: prismaModelByDomain[domain],
    seedFile: seedFileByDomain[domain],
    blockers,
    nextAction: blockers.length ? "Rezolvă blocker-ele înainte de pilot write" : "Pregătește pilot wave cu shadow replay și rollback drill"
  };
});

export const v58MutationContracts: V58MutationContract[] = [
  {
    id: "mut-task-status",
    domain: "tasks",
    title: "Actualizare status task",
    method: "PATCH",
    endpoint: "/api/v1/tasks/:id/status",
    state: "shadowed",
    requiredPermission: "task:write",
    writeModeGuard: "SERVELECT_WORK_OS_WRITE_MODE=shadow|pilot|production",
    auditEvent: "task.status.changed",
    rollbackPlan: "restore previous status + activity compensation event",
    idempotencyKey: "taskId:status:timestamp",
    samplePayload: { status: "În lucru", taskId: "t1", actorId: "u1" }
  },
  {
    id: "mut-task-assignee",
    domain: "tasks",
    title: "Asignare responsabil task",
    method: "PATCH",
    endpoint: "/api/v1/tasks/:id/assignee",
    state: "shadowed",
    requiredPermission: "task:assign",
    writeModeGuard: "role:Admin|Manager OR assignee:self-update",
    auditEvent: "task.assignee.changed",
    rollbackPlan: "restore old assignee + notify both users",
    idempotencyKey: "taskId:assignee:actorId",
    samplePayload: { assigneeId: "u3", taskId: "t2", notify: true }
  },
  {
    id: "mut-project-phase",
    domain: "projects",
    title: "Schimbare fază proiect",
    method: "PATCH",
    endpoint: "/api/v1/projects/:id/phase",
    state: "queued",
    requiredPermission: "project:write",
    writeModeGuard: "requires project manager + no critical blockers",
    auditEvent: "project.phase.changed",
    rollbackPlan: "restore phase + reopen dependent tasks",
    idempotencyKey: "projectId:phase:approvalId",
    samplePayload: { projectId: "p1", phase: "PIF", approvalRequired: true }
  },
  {
    id: "mut-material-reservation",
    domain: "materials",
    title: "Rezervare materiale pe proiect",
    method: "POST",
    endpoint: "/api/v1/work-os/stock/reservations",
    state: "needs-review",
    requiredPermission: "equipment:write",
    writeModeGuard: "stock must remain >= reserved quantity; shadow first",
    auditEvent: "stock.reservation.created",
    rollbackPlan: "release reservation + restore available stock",
    idempotencyKey: "projectId:itemId:reservationHash",
    samplePayload: { projectId: "p1", itemId: "inv1", quantity: 12 }
  },
  {
    id: "mut-approval-decision",
    domain: "approvals",
    title: "Decizie aprobare/refuz",
    method: "PATCH",
    endpoint: "/api/v1/work-os/approvals/:id/decision",
    state: "queued",
    requiredPermission: "admin:manage",
    writeModeGuard: "requires decision comment + actor role",
    auditEvent: "approval.decision.recorded",
    rollbackPlan: "mark decision void + reopen approval",
    idempotencyKey: "approvalId:decision:actorId",
    samplePayload: { approvalId: "ap1", decision: "Aprobat", comment: "OK pentru execuție" }
  },
  {
    id: "mut-iot-ticket",
    domain: "iot",
    title: "Transformă alertă IoT în task/ticket",
    method: "POST",
    endpoint: "/api/v1/work-os/operations/alerts/:id/create-task",
    state: "shadowed",
    requiredPermission: "maintenance:write",
    writeModeGuard: "alert must be open; prevent duplicate ticket",
    auditEvent: "iot.alert.ticket.created",
    rollbackPlan: "close duplicate task + detach alert link",
    idempotencyKey: "alertId:create-task",
    samplePayload: { alertId: "al1", severity: "Critică", createTicket: true }
  },
  {
    id: "mut-maintenance-close",
    domain: "maintenance",
    title: "Închidere ticket mentenanță",
    method: "PATCH",
    endpoint: "/api/v1/work-os/field-ops/tickets/:id/close",
    state: "blocked",
    requiredPermission: "maintenance:write",
    writeModeGuard: "requires photos + signature + report draft",
    auditEvent: "maintenance.ticket.closed",
    rollbackPlan: "reopen ticket + keep closure evidence as voided",
    idempotencyKey: "ticketId:close:signatureHash",
    samplePayload: { ticketId: "tk1", hasSignature: true, photoCount: 4 }
  }
];

export const v58SeedParityChecks: V58SeedParityCheck[] = v58AdapterLanes.map((lane, index) => ({
  id: `seed-${lane.domain}`,
  domain: lane.domain,
  label: `${lane.prismaModel} seed parity`,
  mockCount: lane.sourceRecords,
  seedCount: lane.targetRecords,
  apiCount: Math.max(0, lane.targetRecords - (index % 2)),
  parityPercent: lane.parityPercent,
  status: lane.readiness,
  evidence: `${lane.sourceRecords} mock records / ${lane.targetRecords} seed candidates / API route ${lane.route}`
}));

export const v58AuditEvents: V58AuditEvent[] = [
  {
    id: "audit-v58-001",
    createdAt: "2026-06-08T08:56:00.000Z",
    domain: "tasks",
    actor: "Andrei Popescu",
    action: "shadow replay task status mutation",
    target: "Verificare amplasament",
    mode: "shadow",
    result: "accepted",
    evidence: "Mock -> Prisma contract matched status, assignee, dueDate"
  },
  {
    id: "audit-v58-002",
    createdAt: "2026-06-08T08:57:00.000Z",
    domain: "materials",
    actor: "Alexandra Rusu",
    action: "material reservation dry-run",
    target: "Jinko Solar Tiger Neo 540W",
    mode: "shadow",
    result: "queued",
    evidence: "Stock guard requires serial allocation before pilot"
  },
  {
    id: "audit-v58-003",
    createdAt: "2026-06-08T08:58:00.000Z",
    domain: "iot",
    actor: "Energy Ops Bot",
    action: "alert to ticket simulation",
    target: "Invertor offline",
    mode: "shadow",
    result: "accepted",
    evidence: "Duplicate ticket guard passed for open alert"
  },
  {
    id: "audit-v58-004",
    createdAt: "2026-06-08T08:59:00.000Z",
    domain: "maintenance",
    actor: "Mihai Ionescu",
    action: "ticket closure mutation blocked",
    target: "Defecțiune invertor FRONIUS",
    mode: "pilot",
    result: "blocked",
    evidence: "Missing client signature and final PDF report"
  }
];

export const v58RollbackDrills: V58RollbackDrill[] = [
  {
    id: "rollback-task-status",
    title: "Rollback task status / assignee mutation",
    domain: "tasks",
    risk: "medium",
    coveragePercent: 88,
    rpoMinutes: 5,
    rtoMinutes: 12,
    drillStatus: "passed",
    steps: ["capture before snapshot", "apply mutation in shadow", "compare activity event", "restore previous status", "emit rollback audit"]
  },
  {
    id: "rollback-stock-reservation",
    title: "Rollback material reservation",
    domain: "materials",
    risk: "high",
    coveragePercent: 72,
    rpoMinutes: 10,
    rtoMinutes: 25,
    drillStatus: "scheduled",
    steps: ["freeze reservation", "release serials", "restore stock state", "notify project owner", "append stock ledger compensation"]
  },
  {
    id: "rollback-approval-decision",
    title: "Void approval decision",
    domain: "approvals",
    risk: "critical",
    coveragePercent: 64,
    rpoMinutes: 3,
    rtoMinutes: 20,
    drillStatus: "not-run",
    steps: ["void approval decision", "reopen approval", "invalidate dependent mutation", "notify decision chain"]
  },
  {
    id: "rollback-iot-ticket",
    title: "Detach IoT alert generated ticket",
    domain: "iot",
    risk: "medium",
    coveragePercent: 80,
    rpoMinutes: 15,
    rtoMinutes: 18,
    drillStatus: "passed",
    steps: ["detect duplicate task", "detach alert link", "close generated ticket", "preserve alert evidence"]
  }
];

export const v58CutoverWaves: V58CutoverWave[] = [
  {
    id: "wave-1-task-project",
    title: "Wave 1 — Tasks + Projects shadow replay",
    date: "2026-06-10",
    domains: ["tasks", "projects"],
    gate: "ready",
    goal: "Mutations task/project rulează în shadow cu parity >= 90% și audit complet.",
    exitCriteria: ["typecheck/build green", "no duplicate task events", "rollback task status passed", "project phase gate documented"]
  },
  {
    id: "wave-2-materials-approvals",
    title: "Wave 2 — Materials + Approvals pilot guard",
    date: "2026-06-14",
    domains: ["materials", "approvals"],
    gate: "warning",
    goal: "Rezervări materiale și decizii aprobare cu write gate și ledger compensator.",
    exitCriteria: ["stock never below zero", "approval comment required", "rollback drill scheduled", "audit evidence export ready"]
  },
  {
    id: "wave-3-iot-maintenance",
    title: "Wave 3 — IoT alert to field ticket",
    date: "2026-06-18",
    domains: ["iot", "maintenance"],
    gate: "warning",
    goal: "Alertele IoT creează task/ticket shadow-safe cu deduplicare și SLA.",
    exitCriteria: ["duplicate guard passed", "SLA owner assigned", "signature/report gate blocks close", "field activity audit visible"]
  },
  {
    id: "wave-4-crm-funding-audit",
    title: "Wave 4 — CRM/Funding/Audit evidence bridge",
    date: "2026-06-22",
    domains: ["crm", "funding", "audit"],
    gate: "shadow",
    goal: "Leagă oportunități, dosare și evidence ledger de taskurile Work OS.",
    exitCriteria: ["client/project links resolved", "funding tasks generated", "evidence ledger export", "manager approval gate"]
  }
];

export const v58StatusMetrics: V58StatusMetric[] = [
  { label: "Website/Web App", percent: 94, note: "UI Work OS, pagini module, status cockpit și admin readiness active." },
  { label: "Task & Project Core", percent: 90, note: "Task/project execution are drawer, bulk, saved views, records și cutover contracts." },
  { label: "Backend/API", percent: 80, note: "API route handlers + mutation contracts + switchboard; writes reale rămân gated." },
  { label: "Database/Prisma/Seed", percent: 74, note: "Prisma cutover, seed parity, rollback drills și adapter lanes pregătite." },
  { label: "Auth/RBAC", percent: 73, note: "Roluri, permisiuni și write gates vizibile; SSO/Auth.js încă neactivat." },
  { label: "IoT/Ops", percent: 64, note: "IoT alert -> ticket bridge shadow-safe; conectorii reali rămân în roadmap." },
  { label: "Mobile App", percent: 50, note: "Structura mobile și teren există; offline sync real urmează după data cutover." }
];

export function getV58CutoverSummary() {
  const totalRecords = v58AdapterLanes.reduce((sum, lane) => sum + lane.sourceRecords, 0);
  const ready = v58AdapterLanes.filter((lane) => lane.readiness === "ready").length;
  const warnings = v58AdapterLanes.filter((lane) => lane.readiness === "warning").length;
  const blocked = v58AdapterLanes.filter((lane) => lane.readiness === "blocked").length;
  const shadow = v58AdapterLanes.filter((lane) => lane.readiness === "shadow").length;
  const avgParity = clamp(v58AdapterLanes.reduce((sum, lane) => sum + lane.parityPercent, 0) / v58AdapterLanes.length);
  const avgMutationCoverage = clamp(v58AdapterLanes.reduce((sum, lane) => sum + lane.mutationCoveragePercent, 0) / v58AdapterLanes.length);
  const avgRollbackCoverage = clamp(v58AdapterLanes.reduce((sum, lane) => sum + lane.rollbackCoveragePercent, 0) / v58AdapterLanes.length);
  const productionReadyScore = clamp(avgParity * 0.35 + avgMutationCoverage * 0.3 + avgRollbackCoverage * 0.25 + ready * 1.4 - blocked * 6);

  return {
    version: "5.8.0",
    title: "Controlled Prisma Cutover, Seed Parity & Live Mutation Audit",
    generatedAt: new Date().toISOString(),
    writeMode: process.env.SERVELECT_WORK_OS_WRITE_MODE ?? "off",
    totals: {
      domains: v58AdapterLanes.length,
      totalRecords,
      mutationContracts: v58MutationContracts.length,
      rollbackDrills: v58RollbackDrills.length,
      cutoverWaves: v58CutoverWaves.length,
      auditEvents: v58AuditEvents.length
    },
    readiness: { ready, warnings, blocked, shadow },
    scores: {
      seedParity: avgParity,
      mutationCoverage: avgMutationCoverage,
      rollbackCoverage: avgRollbackCoverage,
      productionReady: productionReadyScore
    },
    nextRecommendedBuild: {
      version: "5.9.0",
      title: "Mobile Offline Field Operations, QR Evidence & Sync Queue",
      focus: "Aplicație mobilă de teren mult mai avansată: checklist offline, scan QR, poze, semnătură, sync queue și evidence packets."
    }
  };
}

export function getV58CutoverPayload() {
  return {
    ok: true,
    summary: getV58CutoverSummary(),
    statusMetrics: v58StatusMetrics,
    adapterLanes: v58AdapterLanes,
    mutationContracts: v58MutationContracts,
    seedParityChecks: v58SeedParityChecks,
    auditEvents: v58AuditEvents,
    rollbackDrills: v58RollbackDrills,
    cutoverWaves: v58CutoverWaves
  };
}

export function simulateV58Mutation(contractId: string) {
  const contract = v58MutationContracts.find((item) => item.id === contractId);
  if (!contract) {
    return {
      ok: false,
      mode: process.env.SERVELECT_WORK_OS_WRITE_MODE ?? "off",
      message: "Mutation contract not found",
      contractId
    };
  }

  const writeMode = process.env.SERVELECT_WORK_OS_WRITE_MODE ?? "off";
  const hardBlocked = contract.state === "blocked" || writeMode === "off";

  return {
    ok: !hardBlocked,
    shadowSafe: writeMode !== "production",
    mode: writeMode,
    contract,
    acceptedState: hardBlocked ? "blocked" : contract.state,
    auditEvent: {
      id: `audit-${contract.id}-${Date.now()}`,
      domain: contract.domain,
      action: contract.auditEvent,
      result: hardBlocked ? "blocked" : "queued",
      rollbackPlan: contract.rollbackPlan
    },
    message: hardBlocked
      ? "Write blocked by v5.8 safety gate. Enable shadow/pilot/production intentionally."
      : "Mutation accepted into v5.8 controlled queue."
  };
}

export function getV58StatusByDomain(domain: V58Domain) {
  return {
    domain,
    lane: v58AdapterLanes.find((lane) => lane.domain === domain),
    mutations: v58MutationContracts.filter((contract) => contract.domain === domain),
    seedParity: v58SeedParityChecks.find((check) => check.domain === domain),
    auditEvents: v58AuditEvents.filter((event) => event.domain === domain),
    rollbackDrills: v58RollbackDrills.filter((drill) => drill.domain === domain),
    waves: v58CutoverWaves.filter((wave) => wave.domains.includes(domain))
  };
}

export function deriveTaskMutationPreview(status: TaskStatus, priority: Priority) {
  return tasks.slice(0, 6).map((task, index) => ({
    taskId: task.id,
    title: task.title,
    oldStatus: task.status,
    nextStatus: index % 2 === 0 ? status : task.status,
    oldPriority: task.priority,
    nextPriority: index % 3 === 0 ? priority : task.priority,
    auditPreview: `task.${task.id}.v58.preview`,
    canRollback: true
  }));
}
