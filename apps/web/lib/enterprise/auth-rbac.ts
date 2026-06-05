export type AuthRbacStatus = "production-ready" | "api-ready" | "partial" | "mock" | "blocked";
export type AuthRbacPriority = "critical" | "high" | "medium" | "low";

export type AuthRbacCapability = {
  key: string;
  label: string;
  area: string;
  status: AuthRbacStatus;
  readiness: number;
  priority: AuthRbacPriority;
  currentState: string;
  targetState: string;
  nextAction: string;
};

export type PermissionMatrixRow = {
  permission: string;
  label: string;
  module: string;
  admin: boolean;
  manager: boolean;
  technician: boolean;
  sales: boolean;
  finance: boolean;
  auditor: boolean;
  client: boolean;
  viewer: boolean;
};

export type AuthRbacRelease = {
  version: "1.5.0";
  name: string;
  objective: string;
  globalReadiness: number;
  authMode: "demo-cookie" | "production-provider-ready";
  capabilities: AuthRbacCapability[];
  permissionMatrix: PermissionMatrixRow[];
  risks: string[];
  nextBuild: {
    version: string;
    name: string;
    focus: string[];
  };
};

export const authRbacCapabilities: AuthRbacCapability[] = [
  {
    key: "session-contract",
    label: "Session contract",
    area: "Auth API",
    status: "api-ready",
    readiness: 88,
    priority: "critical",
    currentState: "Demo cookie/session endpoint existent, folosit de Topbar și guard-uri.",
    targetState: "Contract stabil pentru Auth.js / Microsoft Entra / Google Workspace.",
    nextAction: "Standardizare payload user/role/permissions și semnare session token."
  },
  {
    key: "protected-routes",
    label: "Protected routes",
    area: "Middleware",
    status: "partial",
    readiness: 72,
    priority: "critical",
    currentState: "Middleware demo/protected app existent, dar nu toate rutele au policy granulară.",
    targetState: "Protecție pe route groups și API scopes, cu redirect controlat /unauthorized.",
    nextAction: "Mapare route -> required permissions și test automat pe toate rutele critice."
  },
  {
    key: "rbac-matrix",
    label: "RBAC matrix",
    area: "Permissions",
    status: "api-ready",
    readiness: 84,
    priority: "critical",
    currentState: "Roluri demo și user management există în UI/API.",
    targetState: "Matrice centrală de permisiuni folosită în UI, API și audit log.",
    nextAction: "Persistare role_permissions în DB și helper can(permission)."
  },
  {
    key: "user-management",
    label: "User management",
    area: "Admin",
    status: "partial",
    readiness: 68,
    priority: "high",
    currentState: "Admin/users demo disponibil, fără persistență DB completă.",
    targetState: "CRUD user/role/team persistent, invite flow și dezactivare cont.",
    nextAction: "Mutare useri în Prisma + audit pe invite/update/disable."
  },
  {
    key: "audit-security-events",
    label: "Security audit events",
    area: "Audit",
    status: "mock",
    readiness: 58,
    priority: "high",
    currentState: "Audit log mock/manifest disponibil în admin/audit.",
    targetState: "Audit persistent pentru login/logout/impersonate/role change/API denied.",
    nextAction: "Tabel audit_events + writer server-side pentru evenimente security."
  },
  {
    key: "tenant-boundaries",
    label: "Tenant boundaries",
    area: "Multi-tenant",
    status: "blocked",
    readiness: 42,
    priority: "critical",
    currentState: "Concept definit, dar fără DB/RLS activ.",
    targetState: "Workspace/tenant ID obligatoriu în toate entitățile și query-urile.",
    nextAction: "Activare PostgreSQL + model Workspace + policies RLS."
  }
];

export const permissionMatrix: PermissionMatrixRow[] = [
  { permission: "dashboard.view", label: "Vizualizare Dashboard", module: "Dashboard", admin: true, manager: true, technician: true, sales: true, finance: true, auditor: true, client: false, viewer: true },
  { permission: "tasks.manage", label: "Administrare taskuri", module: "Taskuri", admin: true, manager: true, technician: true, sales: true, finance: false, auditor: false, client: false, viewer: false },
  { permission: "projects.manage", label: "Administrare proiecte", module: "Proiecte", admin: true, manager: true, technician: false, sales: false, finance: false, auditor: false, client: false, viewer: false },
  { permission: "crm.manage", label: "CRM & oportunități", module: "CRM", admin: true, manager: true, technician: false, sales: true, finance: false, auditor: false, client: false, viewer: false },
  { permission: "iot.alerts.manage", label: "Alerte IoT -> task/ticket", module: "IoT", admin: true, manager: true, technician: true, sales: false, finance: false, auditor: true, client: false, viewer: false },
  { permission: "inventory.manage", label: "Echipamente & logistică", module: "Echipamente", admin: true, manager: true, technician: true, sales: false, finance: true, auditor: false, client: false, viewer: false },
  { permission: "maintenance.dispatch", label: "Dispatch mentenanță", module: "Mentenanță", admin: true, manager: true, technician: false, sales: false, finance: false, auditor: false, client: false, viewer: false },
  { permission: "finance.approve", label: "Aprobări financiare", module: "Finanțări", admin: true, manager: true, technician: false, sales: false, finance: true, auditor: false, client: false, viewer: false },
  { permission: "admin.users.manage", label: "User management", module: "Administrare", admin: true, manager: false, technician: false, sales: false, finance: false, auditor: false, client: false, viewer: false },
  { permission: "admin.security.manage", label: "Auth & RBAC", module: "Administrare", admin: true, manager: false, technician: false, sales: false, finance: false, auditor: false, client: false, viewer: false }
];

export function getAuthRbacRelease(): AuthRbacRelease {
  return {
    version: "1.5.0",
    name: "Auth & RBAC Production Pack",
    objective:
      "Definește contractul enterprise pentru autentificare, roluri, permisiuni și audit security, pregătind aplicația pentru Auth.js/SSO și DB persistent.",
    globalReadiness: calculateAverageReadiness(authRbacCapabilities),
    authMode: "production-provider-ready",
    capabilities: authRbacCapabilities,
    permissionMatrix,
    risks: [
      "Auth real nu trebuie activat fără persistență user/session în DB.",
      "RBAC UI trebuie dublat de RBAC server-side pe API routes.",
      "Impersonate demo trebuie limitat la admin și auditat înainte de producție.",
      "Tenant/workspace isolation trebuie legat de PostgreSQL/RLS înainte de client portal real."
    ],
    nextBuild: {
      version: "v1.6.0",
      name: "Task & Project Persistence Pack",
      focus: [
        "Persistare reală Task/Project/Comment/TimeEntry prin repository layer.",
        "Înlocuire treptată localStorage cu API-backed store.",
        "Audit pe task create/update/status change/timer events.",
        "Rollback safe: mock provider rămâne disponibil dacă DATABASE_URL lipsește."
      ]
    }
  };
}

export function getAuthRbacHealth() {
  const release = getAuthRbacRelease();
  const counters = release.capabilities.reduce(
    (acc, item) => {
      acc.total += 1;
      acc[item.status] = (acc[item.status] ?? 0) + 1;
      if (item.priority === "critical") acc.critical += 1;
      return acc;
    },
    { total: 0, critical: 0 } as Record<string, number>
  );

  const envChecks = [
    { key: "NEXT_PUBLIC_DEMO_AUTH", present: Boolean(process.env.NEXT_PUBLIC_DEMO_AUTH), purpose: "permite fallback demo auth în preview" },
    { key: "AUTH_SECRET", present: Boolean(process.env.AUTH_SECRET), purpose: "secret pentru Auth.js/session signing" },
    { key: "AUTH_MICROSOFT_ENTRA_ID", present: Boolean(process.env.AUTH_MICROSOFT_ENTRA_ID), purpose: "provider Microsoft Entra ID" },
    { key: "AUTH_GOOGLE_ID", present: Boolean(process.env.AUTH_GOOGLE_ID), purpose: "provider Google Workspace" },
    { key: "DATABASE_URL", present: Boolean(process.env.DATABASE_URL), purpose: "persistență user/session/audit" }
  ];

  return {
    ok: release.globalReadiness >= 70,
    generatedAt: new Date().toISOString(),
    version: release.version,
    providerMode: release.authMode,
    globalReadiness: release.globalReadiness,
    counters,
    envChecks,
    recommendation:
      release.globalReadiness >= 80
        ? "Ready for Auth.js integration planning"
        : "Keep demo auth active until DB/session persistence is ready"
  };
}

export function getPermissionMatrix() {
  return {
    version: "1.5.0",
    generatedAt: new Date().toISOString(),
    roles: ["Administrator", "Manager", "Tehnician", "Vânzări", "Financiar", "Auditor", "Client", "Viewer"],
    permissions: permissionMatrix,
    summary: {
      totalPermissions: permissionMatrix.length,
      adminOnly: permissionMatrix.filter((row) => row.admin && !row.manager && !row.technician && !row.sales && !row.finance && !row.auditor && !row.client && !row.viewer).length,
      operational: permissionMatrix.filter((row) => row.manager || row.technician).length
    }
  };
}

function calculateAverageReadiness(items: Array<{ readiness: number }>) {
  if (!items.length) return 0;
  return Math.round(items.reduce((sum, item) => sum + item.readiness, 0) / items.length);
}
