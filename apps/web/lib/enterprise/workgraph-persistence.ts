export type WorkGraphEntityKind =
  | "workspace"
  | "user"
  | "project"
  | "task"
  | "subtask"
  | "comment"
  | "attachment"
  | "time-entry"
  | "approval"
  | "workflow-execution"
  | "audit-event"
  | "iot-alert"
  | "maintenance-ticket"
  | "equipment"
  | "crm-opportunity";

export type WorkGraphReadinessStatus = "ready" | "api-ready" | "partial" | "mock" | "blocked" | "planned" | "draft" | "shadow-ready";
export type WorkGraphPriority = "critical" | "high" | "medium" | "low";

export type WorkGraphTablePlan = {
  entity: WorkGraphEntityKind;
  label: string;
  targetTable: string;
  currentSource: "mock-data" | "localStorage" | "route-handler" | "repository-layer" | "not-started";
  status: WorkGraphReadinessStatus;
  readiness: number;
  priority: WorkGraphPriority;
  ownerModule: string;
  requiredFor: string[];
  nextAction: string;
};

export type WorkGraphRelease = {
  version: "1.4.0";
  name: string;
  generatedAt: string;
  objective: string;
  globalReadiness: number;
  dataMode: "mock-first-db-ready";
  tables: WorkGraphTablePlan[];
  blockers: string[];
  nextBuild: {
    version: "1.5.0";
    name: string;
    focus: string[];
  };
};

const tables: WorkGraphTablePlan[] = [
  {
    entity: "workspace",
    label: "Workspace / tenant",
    targetTable: "workspaces",
    currentSource: "repository-layer",
    status: "db-ready",
    readiness: 88,
    priority: "critical",
    ownerModule: "Administrare",
    requiredFor: ["multi-tenant", "RBAC", "audit"],
    nextAction: "Mapare tenantId pe toate entitățile importante."
  },
  {
    entity: "user",
    label: "Utilizatori & roluri",
    targetTable: "users, roles, permissions, memberships",
    currentSource: "route-handler",
    status: "api-ready",
    readiness: 78,
    priority: "critical",
    ownerModule: "HR & Admin",
    requiredFor: ["auth real", "RBAC", "workload", "approvals"],
    nextAction: "Mutare user management din demo în Prisma + session provider real."
  },
  {
    entity: "project",
    label: "Proiecte",
    targetTable: "projects, project_members, milestones, risks",
    currentSource: "mock-data",
    status: "partial",
    readiness: 72,
    priority: "critical",
    ownerModule: "Proiecte",
    requiredFor: ["task graph", "Gantt", "calendar", "documents"],
    nextAction: "Adăugare repository persistent pentru projects și project details."
  },
  {
    entity: "task",
    label: "Taskuri principale",
    targetTable: "tasks, task_dependencies, task_tags",
    currentSource: "localStorage",
    status: "partial",
    readiness: 69,
    priority: "critical",
    ownerModule: "Taskuri",
    requiredFor: ["Work OS core", "Action Center", "workflow engine"],
    nextAction: "Persistență Prisma pentru create/update/status/timer."
  },
  {
    entity: "subtask",
    label: "Subtaskuri & checklist",
    targetTable: "subtasks, checklist_items",
    currentSource: "mock-data",
    status: "partial",
    readiness: 58,
    priority: "high",
    ownerModule: "Taskuri",
    requiredFor: ["task detail", "field technician", "quality gates"],
    nextAction: "Normalizare subtasks/checklist în tabele separate."
  },
  {
    entity: "comment",
    label: "Comentarii / updates",
    targetTable: "comments, activity_logs",
    currentSource: "mock-data",
    status: "mock",
    readiness: 45,
    priority: "high",
    ownerModule: "Colaborare",
    requiredFor: ["chat proiect", "audit", "notifications"],
    nextAction: "API POST comment + event log atomic."
  },
  {
    entity: "attachment",
    label: "Atașamente & documente",
    targetTable: "attachments, documents, document_versions",
    currentSource: "mock-data",
    status: "mock",
    readiness: 40,
    priority: "high",
    ownerModule: "Documente",
    requiredFor: ["rapoarte", "PV recepție", "contracte", "field photos"],
    nextAction: "Integrare Cloudflare R2 + metadata DB."
  },
  {
    entity: "time-entry",
    label: "Timesheet / timer",
    targetTable: "time_entries, timers, approvals",
    currentSource: "localStorage",
    status: "partial",
    readiness: 56,
    priority: "high",
    ownerModule: "Taskuri / HR",
    requiredFor: ["pontaj", "cost proiect", "workload"],
    nextAction: "Pornire/oprire timer cu audit și aprobare manager."
  },
  {
    entity: "approval",
    label: "Aprobări",
    targetTable: "approval_requests, approval_steps",
    currentSource: "mock-data",
    status: "partial",
    readiness: 54,
    priority: "high",
    ownerModule: "Workflow-uri",
    requiredFor: ["ofertare", "buget", "HR", "documente"],
    nextAction: "Workflow de aprobare configurabil per tip de entitate."
  },
  {
    entity: "workflow-execution",
    label: "Workflow executions",
    targetTable: "workflow_templates, workflow_executions, workflow_events",
    currentSource: "route-handler",
    status: "api-ready",
    readiness: 63,
    priority: "critical",
    ownerModule: "Workflow-uri",
    requiredFor: ["automation", "Action Center", "audit"],
    nextAction: "Persistare executions și retry policy."
  },
  {
    entity: "audit-event",
    label: "Audit log",
    targetTable: "audit_events",
    currentSource: "route-handler",
    status: "api-ready",
    readiness: 61,
    priority: "critical",
    ownerModule: "Administrare",
    requiredFor: ["security", "compliance", "debug"],
    nextAction: "Scriere audit event la fiecare mutație importantă."
  },
  {
    entity: "iot-alert",
    label: "Alerte IoT",
    targetTable: "energy_installations, iot_alerts, measurements",
    currentSource: "mock-data",
    status: "mock",
    readiness: 43,
    priority: "medium",
    ownerModule: "Monitorizare IoT",
    requiredFor: ["ticket automation", "maintenance", "SLA"],
    nextAction: "Bridge alertă IoT → task/ticket persistent."
  },
  {
    entity: "maintenance-ticket",
    label: "Tickete mentenanță",
    targetTable: "maintenance_tickets, dispatch_assignments, service_reports",
    currentSource: "mock-data",
    status: "partial",
    readiness: 52,
    priority: "medium",
    ownerModule: "Mentenanță",
    requiredFor: ["dispatch", "SLA", "field app"],
    nextAction: "Ticket lifecycle persistent cu SLA timestamps."
  },
  {
    entity: "equipment",
    label: "Echipamente & seriale",
    targetTable: "equipment, inventory_items, stock_movements, reservations",
    currentSource: "mock-data",
    status: "mock",
    readiness: 48,
    priority: "medium",
    ownerModule: "Echipamente",
    requiredFor: ["QR", "garanții", "proiecte", "mentenanță"],
    nextAction: "Inventory reservation model legat de task/proiect."
  },
  {
    entity: "crm-opportunity",
    label: "CRM oportunități",
    targetTable: "clients, leads, opportunities, offers",
    currentSource: "mock-data",
    status: "partial",
    readiness: 50,
    priority: "medium",
    ownerModule: "CRM & Vânzări",
    requiredFor: ["pipeline", "ofertare", "task follow-up"],
    nextAction: "Legare opportunity → project → task graph."
  }
];

export function getWorkGraphPersistenceRelease(): WorkGraphRelease {
  const globalReadiness = Math.round(tables.reduce((sum, table) => sum + table.readiness, 0) / tables.length);

  return {
    version: "1.4.0",
    name: "Enterprise WorkGraph Persistence Core",
    generatedAt: new Date().toISOString(),
    objective:
      "Transformă SERVELECT WORK OS dintr-un MVP task-first bazat pe mock/localStorage într-un model coerent WorkGraph pregătit pentru persistare reală pe PostgreSQL/Prisma.",
    globalReadiness,
    dataMode: "mock-first-db-ready",
    tables,
    blockers: [
      "DATABASE_URL real nu este încă obligatoriu în production.",
      "Task/project mutations încă trebuie mutate complet în repository persistent.",
      "Document storage real R2/S3 nu este încă activat.",
      "Auth.js/SSO real și user sessions persistente sunt planificate pentru v1.5."
    ],
    nextBuild: {
      version: "1.5.0",
      name: "Auth & RBAC Production Pack",
      focus: [
        "Auth.js / Microsoft login real",
        "users + memberships persistente",
        "route guards server-side",
        "RBAC UI enforcement",
        "audit event pentru login/impersonate/admin changes"
      ]
    }
  };
}

export function getWorkGraphHealth() {
  const release = getWorkGraphPersistenceRelease();
  const critical = release.tables.filter((table) => table.priority === "critical");
  const blocked = release.tables.filter((table) => table.status === "blocked");
  const mock = release.tables.filter((table) => table.status === "mock");
  const dbReady = release.tables.filter((table) => table.status === "db-ready");

  return {
    ok: blocked.length === 0,
    version: release.version,
    generatedAt: release.generatedAt,
    globalReadiness: release.globalReadiness,
    criticalReadiness: Math.round(critical.reduce((sum, table) => sum + table.readiness, 0) / Math.max(critical.length, 1)),
    counters: {
      totalTables: release.tables.length,
      dbReady: dbReady.length,
      mock: mock.length,
      blocked: blocked.length,
      critical: critical.length
    },
    recommendation:
      release.globalReadiness >= 70
        ? "Poți începe v1.5 Auth/RBAC Production Pack în paralel cu repository persistent pentru task/project."
        : "Finalizează repository persistent pentru task/project înainte de features noi."
  };
}

export function getWorkGraphMigrationPlan() {
  const release = getWorkGraphPersistenceRelease();

  return {
    version: release.version,
    generatedAt: release.generatedAt,
    phases: [
      {
        id: "phase-1-core",
        title: "Core Work OS persistence",
        entities: release.tables.filter((table) => ["workspace", "user", "project", "task", "subtask", "time-entry"].includes(table.entity)),
        exitCriteria: ["Task CRUD persistent", "Project detail persistent", "Timer persistent", "Audit events pentru mutații"]
      },
      {
        id: "phase-2-collaboration",
        title: "Collaboration & approvals",
        entities: release.tables.filter((table) => ["comment", "attachment", "approval", "workflow-execution", "audit-event"].includes(table.entity)),
        exitCriteria: ["Comments persistente", "Workflow execution log", "Approvals cu owner și deadline"]
      },
      {
        id: "phase-3-operations",
        title: "Operational modules",
        entities: release.tables.filter((table) => ["iot-alert", "maintenance-ticket", "equipment", "crm-opportunity"].includes(table.entity)),
        exitCriteria: ["IoT alert → ticket/task", "Equipment reservation", "Opportunity → project handoff"]
      }
    ]
  };
}

