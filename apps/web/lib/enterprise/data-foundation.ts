export type DataFoundationLayer = {
  id: string;
  title: string;
  status: "ready" | "partial" | "planned";
  score: number;
  description: string;
  entities: string[];
  nextSteps: string[];
};

export type DataFoundationMetric = {
  label: string;
  value: string;
  tone: "green" | "blue" | "orange" | "purple" | "red";
};

export const dataFoundationMetrics: DataFoundationMetric[] = [
  { label: "Domenii operaționale", value: "9", tone: "green" },
  { label: "Entități modelate", value: "27", tone: "blue" },
  { label: "API manifest routes", value: "14", tone: "purple" },
  { label: "Pregătire DB real", value: "72%", tone: "orange" }
];

export const dataFoundationLayers: DataFoundationLayer[] = [
  {
    id: "work-core",
    title: "Work OS Core",
    status: "ready",
    score: 86,
    description: "Modelul central pentru proiecte, taskuri, workflow-uri, acțiuni, audit și ownership operațional.",
    entities: ["Workspace", "Project", "Task", "Subtask", "Comment", "ActivityLog", "TimeEntry"],
    nextSteps: ["Persistență PostgreSQL", "task dependencies reale", "audit per acțiune"]
  },
  {
    id: "operations",
    title: "Operațiuni energie / teren",
    status: "partial",
    score: 68,
    description: "IoT, alerte, mentenanță, tickete, dispatch și intervenții legate de proiecte și taskuri.",
    entities: ["EnergyInstallation", "IoTAlert", "MaintenanceTicket", "Equipment", "InventoryItem"],
    nextSteps: ["conectori MQTT/Modbus", "ticket creat din alertă", "SLA persistent"]
  },
  {
    id: "commercial",
    title: "CRM & vânzări",
    status: "partial",
    score: 64,
    description: "Pipeline de oportunități, client 360°, ofertare și aprobări comerciale task-first.",
    entities: ["Client", "CRMLead", "Opportunity", "ApprovalRequest", "Attachment"],
    nextSteps: ["oportunități editabile", "document ofertă PDF", "aprobare ofertă cu istoric"]
  },
  {
    id: "governance",
    title: "Governance, audit & release",
    status: "ready",
    score: 80,
    description: "Release console, audit events, readiness manifest și document de continuitate pentru dezvoltare.",
    entities: ["AuditEvent", "Notification", "Permission", "Role", "ReleaseManifest"],
    nextSteps: ["audit log în DB", "RBAC aplicat pe componente", "policy matrix"]
  },
  {
    id: "mobile-offline",
    title: "Mobile & offline-first",
    status: "planned",
    score: 35,
    description: "Scheletul există, dar aplicația mobilă reală trebuie extinsă cu ecrane și sync offline.",
    entities: ["MobileTask", "FieldChecklist", "OfflineQueue", "GeoCheckIn"],
    nextSteps: ["Expo app complet", "QR/camera mock", "offline queue + sync conflict policy"]
  }
];

export const v12ReadinessChecklist = [
  { id: "build", label: "Build Next.js fără erori TypeScript", done: true },
  { id: "routes", label: "Rute critice listate în manifestul de audit", done: true },
  { id: "task-performance", label: "Pagina Taskuri randată în mod light/activ-view", done: true },
  { id: "topbar", label: "Topbar fără suprapunere cu search", done: true },
  { id: "continuation", label: "Document de continuitate actualizat", done: true },
  { id: "db", label: "Prisma/PostgreSQL activ în producție", done: false },
  { id: "auth", label: "Auth.js/SSO real + user persistence", done: false },
  { id: "iot", label: "IoT real MQTT/Modbus + TimescaleDB", done: false }
];

export function getDataFoundationRelease() {
  const score = Math.round(dataFoundationLayers.reduce((sum, layer) => sum + layer.score, 0) / dataFoundationLayers.length);

  return {
    version: "1.2.0",
    name: "Enterprise Data Foundation Release",
    generatedAt: new Date().toISOString(),
    score,
    metrics: dataFoundationMetrics,
    layers: dataFoundationLayers,
    checklist: v12ReadinessChecklist,
    nextMajorBuild: {
      version: "1.3.0",
      name: "Database Activation Pack",
      focus: [
        "Prisma schema + seed real",
        "user management persistent",
        "audit log persistent",
        "workflow executions persistent",
        "task/project CRUD pe DB"
      ]
    }
  };
}
