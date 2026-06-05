import {
  approvals,
  auditCases,
  clients,
  energyInstallations,
  equipments,
  fundingCases,
  inventory,
  iotAlerts,
  maintenanceTickets,
  projects,
  tasks,
  users
} from "@servelect/shared";

export const SERVELECT_ENTERPRISE_VERSION = "1.1.0";

export type EnterpriseReadinessStatus = "ready" | "partial" | "planned" | "risk";

export type EnterpriseCapability = {
  id: string;
  name: string;
  area: string;
  status: EnterpriseReadinessStatus;
  score: number;
  owner: string;
  description: string;
  nextStep: string;
};

export const enterpriseCapabilities: EnterpriseCapability[] = [
  {
    id: "work-os-core",
    name: "Work OS task-first core",
    area: "Platformă",
    status: "ready",
    score: 86,
    owner: "Product / PMO",
    description: "Dashboard, proiecte, taskuri, board, tabel, action center, workflow-uri și audit operațional integrate într-o singură aplicație.",
    nextStep: "Mutare progresivă de la mock/localStorage la repository persistent Prisma."
  },
  {
    id: "project-task-ops",
    name: "Project + Task Operations",
    area: "PMO",
    status: "ready",
    score: 82,
    owner: "Manager proiect",
    description: "Proiectele, taskurile, riscurile, aprobările și calendarul sunt legate de același model operațional.",
    nextStep: "Adăugare Project Detail complet cu buget, documente, chat și timeline persistent."
  },
  {
    id: "performance-stability",
    name: "Site-wide performance guard",
    area: "Calitate",
    status: "ready",
    score: 78,
    owner: "Engineering",
    description: "Pagina Taskuri a fost refăcută să randeze controlat și a fost adăugat audit de rute pentru slowdowns.",
    nextStep: "Adăugare Playwright/Lighthouse CI pentru bugete reale pe Vercel."
  },
  {
    id: "crm-sales",
    name: "CRM & Sales pipeline",
    area: "Vânzări",
    status: "partial",
    score: 68,
    owner: "Sales",
    description: "Pipeline, oportunități și next steps există ca modul task-first, dar au nevoie de formulare persistente și aprobări ofertă reale.",
    nextStep: "Adăugare Opportunity Detail + Quote workflow + e-signature placeholders."
  },
  {
    id: "iot-energy",
    name: "IoT / Energy operations",
    area: "Energie",
    status: "partial",
    score: 64,
    owner: "Operations",
    description: "Instalații, alerte și acțiuni recomandate există în mock. Alarmele pot fi reprezentate în Action Center.",
    nextStep: "Conector real MQTT/Modbus/API invertor + TimescaleDB."
  },
  {
    id: "equipment-logistics",
    name: "Equipment & logistics",
    area: "Logistică",
    status: "partial",
    score: 62,
    owner: "Depozit / Logistică",
    description: "Catalog, inventar, seriale, QR și alocări sunt modelate în date. Persistența și scanarea reală vin în următorul pachet.",
    nextStep: "Activare rezervări pe proiect/task și jurnal de mișcare echipamente."
  },
  {
    id: "maintenance-dispatch",
    name: "Maintenance, tickets & dispatch",
    area: "Service",
    status: "partial",
    score: 66,
    owner: "Service Manager",
    description: "Tickete, SLA, alocare tehnician și flux teren sunt modelate și centralizate în Action Center.",
    nextStep: "Ticket detail persistent, dispatch map real și raport intervenție PDF."
  },
  {
    id: "auth-rbac",
    name: "Auth, RBAC & governance",
    area: "Securitate",
    status: "partial",
    score: 70,
    owner: "Admin",
    description: "Protected app, demo session, user management și audit foundation există, dar nu sunt încă SSO/DB production.",
    nextStep: "Auth.js / Microsoft Entra + Prisma User/Role/Permission persistence."
  }
];

export const enterpriseRoadmap = [
  {
    version: "1.1",
    title: "Enterprise Operations Release",
    status: "current",
    goals: [
      "Stabilizare /taskuri și topbar",
      "Audit site-wide pentru rute și slowdowns",
      "Document AI continuation complet",
      "Release board cu ce e făcut și ce urmează"
    ]
  },
  {
    version: "1.2",
    title: "Database Activation Pack",
    status: "next",
    goals: [
      "Prisma/PostgreSQL real pentru users, tasks, projects, audit events",
      "Seed real pentru date Servelect",
      "Repository mode: mock/local/database",
      "Migrations + scripts de validare DB"
    ]
  },
  {
    version: "1.3",
    title: "Task & Project Production Core",
    status: "planned",
    goals: [
      "CRUD complet proiect/task/subtask/comment/attachment",
      "Project detail complet",
      "Kanban persistent cu drag/drop",
      "Calendar și workload cu date reale"
    ]
  },
  {
    version: "1.4",
    title: "Operations Modules Production",
    status: "planned",
    goals: [
      "CRM oportunități și workflow ofertă",
      "IoT alerts → tickets/tasks persistente",
      "Equipment reservation + serial traceability",
      "Maintenance ticket detail + SLA"
    ]
  },
  {
    version: "1.5",
    title: "Mobile Field App Pack",
    status: "planned",
    goals: [
      "Expo mobile screens complete",
      "Field technician checklist",
      "QR/camera/GPS/offline mock-to-real path",
      "Timesheet mobile"
    ]
  }
];

export const enterpriseQualityGates = [
  { id: "build", name: "Next.js production build", status: "required", target: "pnpm --filter @servelect/web build", owner: "Engineering" },
  { id: "routes", name: "Site route smoke test", status: "required", target: "scripts/site-deep-audit.ps1", owner: "QA" },
  { id: "performance", name: "Route response budget", status: "required", target: "< 2500ms pentru rutele principale", owner: "Engineering" },
  { id: "continuation", name: "AI continuation document", status: "required", target: "docs/AI_CONTINUATION_SERVELECT_WORK_OS.md", owner: "Product" },
  { id: "rbac", name: "RBAC coverage map", status: "partial", target: "100% acțiuni critice protejate", owner: "Security" },
  { id: "db", name: "Persistent database", status: "planned", target: "Prisma + PostgreSQL", owner: "Backend" }
];

export function getEnterpriseReleaseManifest() {
  const criticalTasks = tasks.filter((task) => task.priority === "Critic" || task.priority === "Urgent").length;
  const blockedTasks = tasks.filter((task) => task.status === "Blocat").length;
  const activeProjects = projects.filter((project) => project.phase !== "Finalizat").length;
  const openAlerts = iotAlerts.filter((alert) => alert.status !== "Închis").length;
  const openTickets = maintenanceTickets.filter((ticket) => ticket.status !== "Închis").length;
  const pendingApprovals = approvals.filter((approval) => approval.status === "În așteptare").length;

  const avgCapabilityScore = Math.round(
    enterpriseCapabilities.reduce((sum, capability) => sum + capability.score, 0) / enterpriseCapabilities.length
  );

  return {
    version: SERVELECT_ENTERPRISE_VERSION,
    name: "SERVELECT WORK OS v1.1 — Enterprise Operations Release",
    generatedAt: new Date().toISOString(),
    summary: {
      avgCapabilityScore,
      activeProjects,
      totalTasks: tasks.length,
      criticalTasks,
      blockedTasks,
      openAlerts,
      openTickets,
      pendingApprovals,
      clients: clients.length,
      users: users.length,
      equipmentTypes: equipments.length,
      inventoryItems: inventory.length,
      fundingCases: fundingCases.length,
      auditCases: auditCases.length
    },
    capabilities: enterpriseCapabilities,
    roadmap: enterpriseRoadmap,
    qualityGates: enterpriseQualityGates
  };
}
