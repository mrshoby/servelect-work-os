export type DatabaseActivationStatus = "ready" | "partial" | "mock" | "blocked";
export type DatabaseActivationPriority = "critical" | "high" | "medium" | "low";

export type DatabaseEntityReadiness = {
  key: string;
  label: string;
  module: string;
  status: DatabaseActivationStatus;
  readiness: number;
  source: "mock" | "localStorage" | "api-ready" | "db-ready";
  priority: DatabaseActivationPriority;
  notes: string;
};

export type DatabaseActivationLayer = {
  key: string;
  label: string;
  status: DatabaseActivationStatus;
  readiness: number;
  purpose: string;
  nextAction: string;
};

export type DatabaseActivationRelease = {
  version: "1.3.0";
  name: string;
  generatedAt: string;
  overallReadiness: number;
  productionDatabaseEnabled: boolean;
  recommendedProvider: "PostgreSQL + Prisma";
  requiredEnvironment: string[];
  layers: DatabaseActivationLayer[];
  entities: DatabaseEntityReadiness[];
  apiRoutes: string[];
  nextMilestone: string;
};

const layers: DatabaseActivationLayer[] = [
  {
    key: "schema",
    label: "Prisma/PostgreSQL schema map",
    status: "partial",
    readiness: 76,
    purpose: "Definește entitățile care trebuie mutate din mock/localStorage în PostgreSQL.",
    nextAction: "Stabilizează schema.prisma și pregătește migrări controlate."
  },
  {
    key: "repository",
    label: "Repository abstraction",
    status: "partial",
    readiness: 70,
    purpose: "Permite comutarea între mock provider și database provider fără să rescriem UI-ul.",
    nextAction: "Activează provider selectat prin env: SERVELECT_DATA_PROVIDER=mock|postgres."
  },
  {
    key: "seed",
    label: "Seed & demo tenant",
    status: "partial",
    readiness: 64,
    purpose: "Populează workspace demo Servelect cu utilizatori, proiecte, taskuri și approvals.",
    nextAction: "Adaugă script de seed idempotent pentru PostgreSQL."
  },
  {
    key: "audit",
    label: "Persistent audit log",
    status: "mock",
    readiness: 45,
    purpose: "Înregistrează acțiuni reale: creare task, schimbare status, impersonare, workflow run.",
    nextAction: "Creează tabel audit_events și folosește-l în admin/audit."
  },
  {
    key: "auth",
    label: "User/session persistence",
    status: "partial",
    readiness: 58,
    purpose: "Leagă demo auth/RBAC de utilizatori reali și roluri persistente.",
    nextAction: "Introduce Auth.js/NextAuth + adapter Prisma în v1.4/v1.5."
  }
];

const entities: DatabaseEntityReadiness[] = [
  {
    key: "workspace",
    label: "Workspace / tenant",
    module: "Administrare",
    status: "ready",
    readiness: 82,
    source: "api-ready",
    priority: "critical",
    notes: "Necesită model central pentru izolarea datelor pe companie/client."
  },
  {
    key: "users",
    label: "Users, roles, permissions",
    module: "HR & Admin",
    status: "partial",
    readiness: 72,
    source: "api-ready",
    priority: "critical",
    notes: "v0.7 a introdus user management demo; următorul pas este persistarea reală."
  },
  {
    key: "projects",
    label: "Projects",
    module: "Proiecte",
    status: "partial",
    readiness: 78,
    source: "api-ready",
    priority: "critical",
    notes: "Proiectele sunt nucleul Work OS și trebuie mutate primele în DB."
  },
  {
    key: "tasks",
    label: "Tasks, subtasks, checklists",
    module: "Taskuri",
    status: "partial",
    readiness: 74,
    source: "localStorage",
    priority: "critical",
    notes: "Pagina /taskuri a fost optimizată; persistarea reală este următorul pas major."
  },
  {
    key: "comments",
    label: "Comments & activity log",
    module: "Taskuri / Proiecte",
    status: "mock",
    readiness: 48,
    source: "mock",
    priority: "high",
    notes: "Necesar pentru colaborare reală tip GoodDay/ClickUp."
  },
  {
    key: "approvals",
    label: "Approvals",
    module: "Action Center",
    status: "partial",
    readiness: 67,
    source: "api-ready",
    priority: "high",
    notes: "v0.9 a introdus action center; approvals trebuie mutate în DB."
  },
  {
    key: "audit-events",
    label: "Audit events",
    module: "Audit / Governance",
    status: "mock",
    readiness: 42,
    source: "mock",
    priority: "high",
    notes: "Trebuie să devină persistent pentru enterprise governance."
  },
  {
    key: "workflow-executions",
    label: "Workflow executions",
    module: "Workflow-uri",
    status: "mock",
    readiness: 46,
    source: "mock",
    priority: "high",
    notes: "Executările workflow trebuie urmărite cu status, input/output și audit."
  },
  {
    key: "iot-alerts",
    label: "IoT alerts",
    module: "Monitorizare IoT",
    status: "mock",
    readiness: 52,
    source: "mock",
    priority: "medium",
    notes: "Va fi legat ulterior la TimescaleDB/MQTT/Modbus."
  },
  {
    key: "maintenance-tickets",
    label: "Maintenance tickets",
    module: "Mentenanță",
    status: "partial",
    readiness: 60,
    source: "api-ready",
    priority: "medium",
    notes: "Ticketele trebuie să fie generate din alerte IoT și solicitări client."
  },
  {
    key: "equipment",
    label: "Equipment, serials, inventory",
    module: "Echipamente",
    status: "mock",
    readiness: 54,
    source: "mock",
    priority: "medium",
    notes: "Stocurile trebuie legate de proiecte/taskuri, nu transformate într-un ERP separat."
  }
];

export function getDatabaseActivationRelease(): DatabaseActivationRelease {
  const overallReadiness = Math.round(
    [...layers.map((layer) => layer.readiness), ...entities.map((entity) => entity.readiness)].reduce((sum, value) => sum + value, 0) /
      (layers.length + entities.length)
  );

  return {
    version: "1.3.0",
    name: "Enterprise Database Activation Pack",
    generatedAt: new Date().toISOString(),
    overallReadiness,
    productionDatabaseEnabled: process.env.SERVELECT_DATA_PROVIDER === "postgres",
    recommendedProvider: "PostgreSQL + Prisma",
    requiredEnvironment: [
      "DATABASE_URL",
      "DIRECT_URL",
      "SERVELECT_DATA_PROVIDER",
      "NEXTAUTH_SECRET",
      "NEXTAUTH_URL",
      "SERVELECT_ADMIN_EMAILS"
    ],
    layers,
    entities,
    apiRoutes: [
      "/api/v1/enterprise/database-activation",
      "/api/v1/enterprise/database-health",
      "/api/v1/enterprise/database-schema",
      "/admin/database"
    ],
    nextMilestone: "v1.4 — Real Task & Project Persistence"
  };
}

export function getDatabaseHealth() {
  const required = ["DATABASE_URL", "DIRECT_URL", "SERVELECT_DATA_PROVIDER"];
  const checks = required.map((key) => ({
    key,
    present: Boolean(process.env[key]),
    value: process.env[key] ? "configured" : "missing"
  }));

  const provider = process.env.SERVELECT_DATA_PROVIDER ?? "mock";
  const missing = checks.filter((check) => !check.present).map((check) => check.key);

  return {
    ok: missing.length === 0 && provider === "postgres",
    provider,
    mode: provider === "postgres" ? "database-ready" : "mock-safe",
    missing,
    checks,
    warning:
      provider === "postgres"
        ? "Provider postgres selectat. Verifică migrările și seed-ul înainte de producție reală."
        : "Aplicația rulează safe pe mock/localStorage. DB real nu este încă activat."
  };
}

export function getDatabaseSchemaManifest() {
  return {
    generatedAt: new Date().toISOString(),
    schemaVersion: "v1.3.0-draft",
    tables: entities.map((entity) => ({
      table: entity.key.replaceAll("-", "_"),
      label: entity.label,
      module: entity.module,
      priority: entity.priority,
      readiness: entity.readiness,
      migrationStatus: entity.status === "ready" ? "ready" : entity.status === "partial" ? "draft" : "planned"
    })),
    relationships: [
      "workspace -> users",
      "workspace -> projects",
      "projects -> tasks",
      "tasks -> subtasks",
      "tasks -> comments",
      "tasks -> time_entries",
      "iot_alerts -> maintenance_tickets",
      "workflow_executions -> audit_events",
      "equipment -> inventory_items",
      "projects -> documents"
    ]
  };
}






















