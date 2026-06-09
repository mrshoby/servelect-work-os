export type V68DomainId =
  | "tasks"
  | "projects"
  | "tickets"
  | "notifications"
  | "approvals"
  | "crm"
  | "stock"
  | "iot"
  | "pontaj"
  | "documents";

export type V68PersistenceMode = "localStorage" | "apiAdapter" | "prismaShadow" | "prismaPrimary";
export type V68ReadinessTone = "green" | "amber" | "red" | "blue";

export type V68DomainAdapter = {
  id: V68DomainId;
  label: string;
  owner: string;
  currentMode: V68PersistenceMode;
  targetMode: V68PersistenceMode;
  readModelReady: boolean;
  writeModelReady: boolean;
  mutationAuditReady: boolean;
  rbacReady: boolean;
  rollbackReady: boolean;
  apiRoutes: string[];
  entityCount: number;
  mutationCount24h: number;
  failureRate: number;
  readiness: number;
  blockers: string[];
};

export type V68MutationContract = {
  id: string;
  domainId: V68DomainId;
  action: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  route: string;
  rbacGate: string;
  auditEvent: string;
  rollback: string;
  status: "ready" | "shadow" | "blocked";
};

export type V68PersistenceCommand = {
  id: string;
  label: string;
  description: string;
  risk: "low" | "medium" | "high";
  enabled: boolean;
  affects: V68DomainId[];
};

export const v68PersistenceDomains: V68DomainAdapter[] = [
  {
    id: "tasks",
    label: "Taskuri / Work OS Core",
    owner: "Super Admin + Team Leads",
    currentMode: "apiAdapter",
    targetMode: "prismaShadow",
    readModelReady: true,
    writeModelReady: true,
    mutationAuditReady: true,
    rbacReady: true,
    rollbackReady: true,
    apiRoutes: ["/api/v1/tasks", "/api/v1/tasks/[id]", "/api/v1/work-os/tasks", "/api/v1/work-os/global-command"],
    entityCount: 184,
    mutationCount24h: 37,
    failureRate: 0,
    readiness: 88,
    blockers: ["Enable Prisma primary only after shadow parity report"],
  },
  {
    id: "projects",
    label: "Proiecte",
    owner: "Project Management",
    currentMode: "apiAdapter",
    targetMode: "prismaShadow",
    readModelReady: true,
    writeModelReady: false,
    mutationAuditReady: true,
    rbacReady: true,
    rollbackReady: true,
    apiRoutes: ["/api/v1/projects", "/api/v1/projects/[id]", "/api/v1/work-os/projects"],
    entityCount: 42,
    mutationCount24h: 11,
    failureRate: 0.2,
    readiness: 76,
    blockers: ["Project phase mutations still need guarded write contract"],
  },
  {
    id: "tickets",
    label: "Tickete / Requests",
    owner: "Mentenanță + Suport",
    currentMode: "localStorage",
    targetMode: "apiAdapter",
    readModelReady: true,
    writeModelReady: true,
    mutationAuditReady: true,
    rbacReady: true,
    rollbackReady: false,
    apiRoutes: ["/api/v1/work-os/forms", "/api/v1/work-os/global-command"],
    entityCount: 29,
    mutationCount24h: 9,
    failureRate: 0,
    readiness: 72,
    blockers: ["Rollback for ticket-to-task conversion needs persisted mapping"],
  },
  {
    id: "notifications",
    label: "Notificări globale",
    owner: "Operations",
    currentMode: "apiAdapter",
    targetMode: "prismaShadow",
    readModelReady: true,
    writeModelReady: true,
    mutationAuditReady: true,
    rbacReady: true,
    rollbackReady: true,
    apiRoutes: ["/api/v1/work-os/notifications", "/api/v1/work-os/global-command"],
    entityCount: 96,
    mutationCount24h: 44,
    failureRate: 0,
    readiness: 84,
    blockers: ["Push transport not enabled; UI/API state only"],
  },
  {
    id: "approvals",
    label: "Aprobări globale",
    owner: "Management",
    currentMode: "apiAdapter",
    targetMode: "prismaShadow",
    readModelReady: true,
    writeModelReady: true,
    mutationAuditReady: true,
    rbacReady: true,
    rollbackReady: true,
    apiRoutes: ["/api/v1/approvals", "/api/v1/work-os/approvals", "/api/v1/work-os/global-command"],
    entityCount: 18,
    mutationCount24h: 6,
    failureRate: 0,
    readiness: 86,
    blockers: ["Digital signature/evidence attachment remains future integration"],
  },
  {
    id: "crm",
    label: "CRM / Vânzări",
    owner: "Comercial",
    currentMode: "localStorage",
    targetMode: "apiAdapter",
    readModelReady: true,
    writeModelReady: false,
    mutationAuditReady: false,
    rbacReady: true,
    rollbackReady: false,
    apiRoutes: ["/api/v1/work-os/crm", "/api/v1/offers/pipeline"],
    entityCount: 73,
    mutationCount24h: 14,
    failureRate: 0.4,
    readiness: 58,
    blockers: ["Offer pipeline must emit task and approval mutations"],
  },
  {
    id: "stock",
    label: "Stoc / Echipamente",
    owner: "Logistică",
    currentMode: "localStorage",
    targetMode: "apiAdapter",
    readModelReady: true,
    writeModelReady: false,
    mutationAuditReady: false,
    rbacReady: true,
    rollbackReady: false,
    apiRoutes: ["/api/v1/stock/core", "/api/v1/stock/reservations"],
    entityCount: 312,
    mutationCount24h: 19,
    failureRate: 0.7,
    readiness: 54,
    blockers: ["Reservation and movement ledger must be separated before primary writes"],
  },
  {
    id: "iot",
    label: "IoT / Monitorizare energie",
    owner: "Automatizări",
    currentMode: "apiAdapter",
    targetMode: "apiAdapter",
    readModelReady: true,
    writeModelReady: true,
    mutationAuditReady: true,
    rbacReady: true,
    rollbackReady: true,
    apiRoutes: ["/api/v1/iot/alerts", "/api/v1/iot/alerts/[id]/create-task"],
    entityCount: 51,
    mutationCount24h: 8,
    failureRate: 0.1,
    readiness: 82,
    blockers: ["Live vendor connector still mocked in local build"],
  },
  {
    id: "pontaj",
    label: "Pontaj / Timesheet",
    owner: "HR + Administrativ",
    currentMode: "apiAdapter",
    targetMode: "prismaShadow",
    readModelReady: true,
    writeModelReady: false,
    mutationAuditReady: true,
    rbacReady: true,
    rollbackReady: true,
    apiRoutes: ["/api/v1/pontaj/core", "/api/v1/pontaj/workload-live"],
    entityCount: 1240,
    mutationCount24h: 86,
    failureRate: 0.3,
    readiness: 68,
    blockers: ["Google Sheets compatibility bridge remains required"],
  },
  {
    id: "documents",
    label: "Documente / Fișiere",
    owner: "Administrativ",
    currentMode: "localStorage",
    targetMode: "apiAdapter",
    readModelReady: false,
    writeModelReady: false,
    mutationAuditReady: false,
    rbacReady: true,
    rollbackReady: false,
    apiRoutes: ["/api/v1/work-os/forms", "/api/v1/work-os/domains/documents/source-of-truth"],
    entityCount: 0,
    mutationCount24h: 0,
    failureRate: 0,
    readiness: 38,
    blockers: ["R2/S3 document store not connected"],
  },
];

export const v68MutationContracts: V68MutationContract[] = [
  {
    id: "task-create",
    domainId: "tasks",
    action: "Create task from global command or module factory",
    method: "POST",
    route: "/api/v1/tasks",
    rbacGate: "task.create + department visibility",
    auditEvent: "task.created",
    rollback: "delete draft task before primary confirmation",
    status: "ready",
  },
  {
    id: "task-status-update",
    domainId: "tasks",
    action: "Update task status / workflow transition",
    method: "PATCH",
    route: "/api/v1/tasks/[id]",
    rbacGate: "task.update + workflow transition guard",
    auditEvent: "task.status.changed",
    rollback: "restore previous status from audit payload",
    status: "ready",
  },
  {
    id: "approval-decision",
    domainId: "approvals",
    action: "Approve or reject management decision",
    method: "PATCH",
    route: "/api/v1/approvals",
    rbacGate: "approval.decide + manager scope",
    auditEvent: "approval.decided",
    rollback: "reopen approval with previous decision snapshot",
    status: "ready",
  },
  {
    id: "notification-read",
    domainId: "notifications",
    action: "Mark notification as read/unread",
    method: "PATCH",
    route: "/api/v1/work-os/notifications",
    rbacGate: "notification.self.update",
    auditEvent: "notification.read.changed",
    rollback: "restore previous read flag",
    status: "ready",
  },
  {
    id: "ticket-convert-task",
    domainId: "tickets",
    action: "Convert request/ticket into operational task",
    method: "POST",
    route: "/api/v1/work-os/global-command",
    rbacGate: "ticket.convert + task.create",
    auditEvent: "ticket.converted_to_task",
    rollback: "remove generated task and reopen ticket",
    status: "shadow",
  },
  {
    id: "stock-reserve",
    domainId: "stock",
    action: "Reserve equipment/materials for project without consuming real stock",
    method: "POST",
    route: "/api/v1/stock/reservations",
    rbacGate: "stock.reserve + project access",
    auditEvent: "stock.reservation.created",
    rollback: "cancel reservation ledger entry",
    status: "blocked",
  },
];

export const v68PersistenceCommands: V68PersistenceCommand[] = [
  {
    id: "shadow-write-tasks",
    label: "Enable task Prisma shadow writes",
    description: "Writes task mutations to mock/API state and Prisma shadow table for parity comparison before primary cutover.",
    risk: "medium",
    enabled: true,
    affects: ["tasks", "notifications", "approvals"],
  },
  {
    id: "audit-required-global",
    label: "Require audit payload for all global command mutations",
    description: "Blocks any global mutation that cannot produce actor, department, entity, before/after and rollback metadata.",
    risk: "low",
    enabled: true,
    affects: ["tasks", "projects", "tickets", "notifications", "approvals", "crm", "stock", "iot", "pontaj"],
  },
  {
    id: "block-primary-stock",
    label: "Block stock primary writes",
    description: "Keeps stock/reservations in protected adapter mode until ledger, reservations and real stock movements are separated.",
    risk: "low",
    enabled: true,
    affects: ["stock"],
  },
  {
    id: "department-rbac-enforced",
    label: "Enforce department-aware read/write scope",
    description: "Super Admin sees everything; department admins and managers remain scoped to their departments/teams unless global access is explicitly granted.",
    risk: "medium",
    enabled: true,
    affects: ["tasks", "projects", "tickets", "approvals", "crm", "stock", "pontaj"],
  },
];

export function getV68DomainScore(domain: V68DomainAdapter): number {
  const booleans = [
    domain.readModelReady,
    domain.writeModelReady,
    domain.mutationAuditReady,
    domain.rbacReady,
    domain.rollbackReady,
  ];
  const base = Math.round((booleans.filter(Boolean).length / booleans.length) * 70);
  const stability = Math.max(0, 20 - Math.round(domain.failureRate * 10));
  const routeCoverage = Math.min(10, domain.apiRoutes.length * 2);
  return Math.max(0, Math.min(100, Math.round((base + stability + routeCoverage + domain.readiness) / 2)));
}

export function getV68ReadinessTone(score: number): V68ReadinessTone {
  if (score >= 80) return "green";
  if (score >= 60) return "blue";
  if (score >= 45) return "amber";
  return "red";
}

export function getV68GlobalPersistenceHealth() {
  const domains = v68PersistenceDomains.map((domain) => ({
    ...domain,
    score: getV68DomainScore(domain),
    tone: getV68ReadinessTone(getV68DomainScore(domain)),
  }));
  const averageReadiness = Math.round(domains.reduce((sum, domain) => sum + domain.score, 0) / domains.length);
  const readyForShadow = domains.filter((domain) => domain.score >= 75).length;
  const blocked = domains.filter((domain) => domain.blockers.length > 0 && domain.score < 70).length;
  const primaryAllowed = domains.filter((domain) => domain.targetMode === "prismaPrimary" && domain.score >= 90).length;
  const totalMutations = domains.reduce((sum, domain) => sum + domain.mutationCount24h, 0);
  const contractsReady = v68MutationContracts.filter((contract) => contract.status === "ready").length;

  return {
    version: "6.8.0",
    release: "Real Persistence/API Unification",
    generatedAt: new Date().toISOString(),
    averageReadiness,
    readyForShadow,
    blocked,
    primaryAllowed,
    totalMutations,
    contractsReady,
    contractsTotal: v68MutationContracts.length,
    domains,
    contracts: v68MutationContracts,
    commands: v68PersistenceCommands,
    nextGates: [
      "Run route smoke for persistence API routes",
      "Confirm task/global command API contract under production build",
      "Keep stock and documents blocked from primary writes until ledger/storage is ready",
      "Promote tasks, notifications and approvals to Prisma shadow after parity report",
    ],
  };
}
