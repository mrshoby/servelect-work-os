import {
  approvals,
  energyInstallations,
  inventory,
  iotAlerts,
  maintenanceTickets,
  projects,
  tasks,
  users,
  type Task
} from "@servelect/shared";

export type V56MaturityAreaId =
  | "website-web-app"
  | "task-project-core"
  | "backend-api"
  | "database-prisma-seed"
  | "auth-rbac"
  | "iot-ops"
  | "mobile-app";

export type V56MaturityArea = {
  id: V56MaturityAreaId;
  label: string;
  completion: number;
  status: "ready" | "active" | "partial" | "planned";
  codeEvidence: string;
  siteEvidence: string;
  nextAction: string;
};

export type V56RecordFamily = {
  id: string;
  label: string;
  records: number;
  persistenceMode: "localStorage demo" | "mock API" | "prisma-ready" | "write-mode gated";
  inlineEditing: "ready" | "partial" | "planned";
  activityComments: "ready" | "partial" | "planned";
  route: string;
  nextBackendStep: string;
};

export type V56InlineEditRecord = {
  id: string;
  taskId: string;
  title: string;
  project: string;
  status: Task["status"];
  priority: Task["priority"];
  assigneeName: string;
  dueDate: string;
  trackedHours: number;
  estimateHours: number;
  comments: number;
  attachments: number;
  activityEvents: number;
  persistenceState: "local draft" | "saved locally" | "ready for DB mutation";
};

export type V56ActivityComment = {
  id: string;
  recordId: string;
  author: string;
  kind: "comment" | "status" | "assignment" | "time" | "attachment" | "approval";
  body: string;
  createdAt: string;
};

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function avg(values: number[]) {
  return clamp(values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1));
}

export function getV56MaturityAreas(): V56MaturityArea[] {
  const openTasks = tasks.filter((task) => task.status !== "Finalizat" && task.status !== "Anulat");
  const tasksWithActivity = tasks.filter((task) => task.activityLog.length > 0 || task.comments.length > 0);
  const tasksWithRelations = tasks.filter((task) => task.dependencies.length > 0 || task.attachments.length > 0 || task.subtasks.length > 0);
  const iotLinkedAlerts = iotAlerts.filter((alert) => alert.linkedTaskId || alert.recommendedAction.toLowerCase().includes("task"));
  const assignedUsers = users.filter((user) => user.permissions.length > 0);

  return [
    {
      id: "website-web-app",
      label: "Website/Web App",
      completion: 92,
      status: "ready",
      codeEvidence: "Next.js 15 App Router, pagini Work OS, taskuri, proiecte, CRM, IoT, mentenanță, admin și release console.",
      siteEvidence: "Dashboard, /work-os, /work-os/tasks, /taskuri și modulele operaționale sunt navigabile pe site.",
      nextAction: "Polish UI cross-module, accesibilitate, loading states și responsive final pe 1440/1920/tablet/mobile."
    },
    {
      id: "task-project-core",
      label: "Task & Project Core",
      completion: avg([86, (tasksWithRelations.length / tasks.length) * 100, (tasksWithActivity.length / tasks.length) * 100]),
      status: "active",
      codeEvidence: `${tasks.length} taskuri demo, ${projects.length} proiecte, ${openTasks.length} taskuri active, dependencies/subtaskuri/atașamente/comment activity în model.`,
      siteEvidence: "Task drawer, quick edit, bulk operations, saved views și v5.6 inline editing cockpit.",
      nextAction: "Persistență reală per record, conflict handling și activity comments DB-backed."
    },
    {
      id: "backend-api",
      label: "Backend/API",
      completion: 74,
      status: "active",
      codeEvidence: "Route handlers Next.js pentru Work OS, auth demo, task execution, release manifest și endpoints enterprise.",
      siteEvidence: "API-urile pot alimenta dashboardurile, release statusul și interacțiunile task-first.",
      nextAction: "Mutations reale controlate prin adapter switchboard și contracte OpenAPI/typed client."
    },
    {
      id: "database-prisma-seed",
      label: "Database/Prisma/Seed",
      completion: 66,
      status: "partial",
      codeEvidence: "Prisma-ready repository, seed/data foundation și write-mode gates există, dar mock/local rămâne default sigur.",
      siteEvidence: "Admin database/source-of-truth pages și v5.6 record families arată ce trece din local către DB.",
      nextAction: "Activare controlată PostgreSQL/Prisma pe domenii și audit trail persistent."
    },
    {
      id: "auth-rbac",
      label: "Auth/RBAC",
      completion: avg([70, (assignedUsers.length / users.length) * 100]),
      status: "partial",
      codeEvidence: `${users.length} utilizatori demo cu roluri/permisiuni, protected app foundation și RBAC matrix.`,
      siteEvidence: "Controale Admin/Manager/Tehnician/Employee/Client vizibile în task execution.",
      nextAction: "Înlocuire demo auth cu Auth.js/SSO, 2FA și permission gates server-side."
    },
    {
      id: "iot-ops",
      label: "IoT/Ops",
      completion: avg([58, (iotLinkedAlerts.length / Math.max(iotAlerts.length, 1)) * 100, energyInstallations.length * 8]),
      status: "partial",
      codeEvidence: `${energyInstallations.length} instalații, ${iotAlerts.length} alerte IoT, ${maintenanceTickets.length} tickete și legături către taskuri/tickete.`,
      siteEvidence: "IoT/Ops este integrat operațional prin task/ticket creation paths, nu ca dashboard separat.",
      nextAction: "Conectori reali MQTT/Modbus/API, TimescaleDB ingest și alert rules persistente."
    },
    {
      id: "mobile-app",
      label: "Mobile App",
      completion: 46,
      status: "planned",
      codeEvidence: "Expo skeleton, field technician/dispatch screens și shared types pregătite pentru offline-first.",
      siteEvidence: "Preview mobile și fluxuri teren există conceptual; sync offline real este încă next phase.",
      nextAction: "WatermelonDB/offline queue, QR/camera/GPS real și mobile task detail cu comments/attachments."
    }
  ];
}

export function getV56RecordFamilies(): V56RecordFamily[] {
  return [
    {
      id: "tasks",
      label: "Task records",
      records: tasks.length,
      persistenceMode: "localStorage demo",
      inlineEditing: "ready",
      activityComments: "partial",
      route: "/work-os/tasks",
      nextBackendStep: "Mapare Task → Prisma + mutation gate pentru status/priority/assignee/dueDate."
    },
    {
      id: "projects",
      label: "Project records",
      records: projects.length,
      persistenceMode: "mock API",
      inlineEditing: "partial",
      activityComments: "partial",
      route: "/work-os/projects",
      nextBackendStep: "Project phase/health/progress mutations cu audit."
    },
    {
      id: "approvals",
      label: "Approval records",
      records: approvals.length,
      persistenceMode: "write-mode gated",
      inlineEditing: "partial",
      activityComments: "planned",
      route: "/work-os/approvals",
      nextBackendStep: "Approve/reject comments persistente și RBAC server-side."
    },
    {
      id: "materials",
      label: "Materials / inventory records",
      records: inventory.length,
      persistenceMode: "prisma-ready",
      inlineEditing: "planned",
      activityComments: "planned",
      route: "/work-os/materials-planning",
      nextBackendStep: "Rezervări materiale pe proiect cu stock movement audit."
    },
    {
      id: "iot-maintenance",
      label: "IoT alert / maintenance records",
      records: iotAlerts.length + maintenanceTickets.length,
      persistenceMode: "mock API",
      inlineEditing: "partial",
      activityComments: "planned",
      route: "/work-os/field-ops",
      nextBackendStep: "Alertă IoT → ticket/task persistent + SLA comments."
    }
  ];
}

export function getV56InlineEditRecords(): V56InlineEditRecord[] {
  return tasks.slice(0, 8).map((task, index) => ({
    id: `v56-record-${task.id}`,
    taskId: task.id,
    title: task.title,
    project: `${task.projectCode} · ${task.projectName}`,
    status: task.status,
    priority: task.priority,
    assigneeName: task.assigneeName,
    dueDate: task.dueDate,
    trackedHours: task.trackedHours,
    estimateHours: task.estimateHours,
    comments: task.comments.length,
    attachments: task.attachments.length,
    activityEvents: task.activityLog.length,
    persistenceState: index % 3 === 0 ? "ready for DB mutation" : index % 2 === 0 ? "saved locally" : "local draft"
  }));
}

export function getV56ActivityComments(): V56ActivityComment[] {
  const demoTimeEntryCount = tasks.filter((task) => task.trackedHours > 0).length;
  const base: V56ActivityComment[] = tasks.flatMap((task) => [
    ...task.comments.map((comment) => ({
      id: `comment-${comment.id}`,
      recordId: task.id,
      author: comment.authorName,
      kind: "comment" as const,
      body: comment.body,
      createdAt: comment.createdAt
    })),
    ...task.activityLog.map((event) => ({
      id: `activity-${event.id}-${task.id}`,
      recordId: task.id,
      author: event.userName,
      kind: "status" as const,
      body: `${event.action} · ${event.target}`,
      createdAt: event.createdAt
    }))
  ]);

  return [
    ...base,
    {
      id: "v56-inline-1",
      recordId: "t10",
      author: "George Stan",
      kind: "time" as const,
      body: `Pontaj pregătit pentru ${demoTimeEntryCount} intrări demo legate de taskuri.`,
      createdAt: "2024-05-18T10:15:00"
    },
    {
      id: "v56-approval-1",
      recordId: "t9",
      author: "Alexandra Rusu",
      kind: "approval" as const,
      body: "Comentariu de aprobare pregătit pentru ofertă și buget proiect.",
      createdAt: "2024-05-18T11:35:00"
    }
  ].slice(0, 10);
}

export function getV56PersistentRecordsReport() {
  const maturityAreas = getV56MaturityAreas();
  const recordFamilies = getV56RecordFamilies();
  const inlineRecords = getV56InlineEditRecords();
  const activityComments = getV56ActivityComments();
  const overall = avg(maturityAreas.map((area) => area.completion));

  return {
    version: "5.6.0",
    title: "Real Persistent Records, Inline Editing & Activity Comments",
    generatedAt: new Date().toISOString(),
    writeMode: process.env.SERVELECT_WORK_OS_WRITE_MODE ?? "shadow-safe/off",
    overall,
    maturityAreas,
    recordFamilies,
    inlineRecords,
    activityComments,
    nextRecommendedVersion: {
      version: "5.7.0",
      title: "Real Database Adapter Switchboard & Record Mutations",
      focus: "Adapter switchboard pentru PostgreSQL/Prisma, mutations controlate, audit persistent și fallback shadow-safe."
    }
  };
}
