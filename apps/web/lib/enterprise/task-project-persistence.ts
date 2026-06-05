export type TaskProjectPersistenceStatus = "production-ready" | "api-ready" | "partial" | "mock" | "blocked";
export type TaskProjectPersistencePriority = "critical" | "high" | "medium" | "low";
export type TaskProjectDomain =
  | "Workspace"
  | "Project"
  | "Task"
  | "Subtask"
  | "Comment"
  | "Attachment"
  | "TimeEntry"
  | "ActivityLog"
  | "Approval"
  | "CalendarEvent";

export type TaskProjectPersistenceCapability = {
  key: string;
  label: string;
  domain: TaskProjectDomain;
  status: TaskProjectPersistenceStatus;
  readiness: number;
  priority: TaskProjectPersistencePriority;
  currentState: string;
  targetState: string;
  nextAction: string;
  apiContract: string[];
  persistenceTarget: string[];
};

export type WorkGraphTable = {
  table: string;
  ownerModule: string;
  purpose: string;
  status: TaskProjectPersistenceStatus;
  readiness: number;
  priority: TaskProjectPersistencePriority;
  requiredIndexes: string[];
  auditEvents: string[];
};

export type TaskProjectRepositoryMethod = {
  method: string;
  owner: "ProjectRepository" | "TaskRepository" | "CommentRepository" | "TimeRepository" | "AuditRepository";
  status: TaskProjectPersistenceStatus;
  description: string;
  rollback: string;
};

export type TaskProjectPersistenceRelease = {
  version: "1.6.0";
  name: string;
  objective: string;
  globalReadiness: number;
  providerMode: "mock-safe" | "api-contract-ready" | "database-ready";
  capabilities: TaskProjectPersistenceCapability[];
  tables: WorkGraphTable[];
  repositoryMethods: TaskProjectRepositoryMethod[];
  migrationPlan: string[];
  risks: string[];
  nextBuild: {
    version: string;
    name: string;
    focus: string[];
  };
};

export const taskProjectCapabilities: TaskProjectPersistenceCapability[] = [
  {
    key: "project-persistence-contract",
    label: "Project persistence contract",
    domain: "Project",
    status: "api-ready",
    readiness: 82,
    priority: "critical",
    currentState: "Proiectele există în mock data și sunt afișate în dashboard/proiecte/taskuri, dar nu sunt încă sursa unică de adevăr în DB.",
    targetState: "projects, project_members, project_risks, project_milestones și project_documents persistate în PostgreSQL prin repository layer.",
    nextAction: "Introducere ProjectRepository cu read/write provider mock + prisma, apoi mutare pagini Proiecte pe API contract.",
    apiContract: ["GET /api/v1/projects", "GET /api/v1/projects/:id", "POST /api/v1/projects", "PATCH /api/v1/projects/:id"],
    persistenceTarget: ["projects", "project_members", "project_milestones", "project_risks", "project_documents"]
  },
  {
    key: "task-crud-contract",
    label: "Task CRUD contract",
    domain: "Task",
    status: "api-ready",
    readiness: 86,
    priority: "critical",
    currentState: "Taskurile sunt task-first în UI și au filtre/drawer/table/board optimizate, dar încă depind de mock/localStorage pentru demo.",
    targetState: "tasks, task_assignees, task_tags, task_dependencies și task_custom_fields persistate real, cu optimistic UI și rollback.",
    nextAction: "Construire TaskRepository + API route handlers pentru create/update/status/timer; păstrare fallback mock când DATABASE_URL lipsește.",
    apiContract: ["GET /api/v1/tasks", "POST /api/v1/tasks", "PATCH /api/v1/tasks/:id", "POST /api/v1/tasks/:id/status"],
    persistenceTarget: ["tasks", "task_assignees", "task_tags", "task_dependencies", "task_custom_fields"]
  },
  {
    key: "subtask-checklist-persistence",
    label: "Subtasks & checklist persistence",
    domain: "Subtask",
    status: "partial",
    readiness: 72,
    priority: "high",
    currentState: "Subtaskurile există în modelul task detail, dar nu au încă operații granulare persistente.",
    targetState: "Subtasks și checklist items cu update atomic, sort order, completion audit și sync către mobile.",
    nextAction: "Separare subtasks de payload-ul task și adăugare endpoint-uri pentru reorder/complete/bulk update.",
    apiContract: ["POST /api/v1/tasks/:id/subtasks", "PATCH /api/v1/subtasks/:id", "POST /api/v1/subtasks/reorder"],
    persistenceTarget: ["subtasks", "checklist_items"]
  },
  {
    key: "comments-updates-persistence",
    label: "Comments, updates & activity feed",
    domain: "Comment",
    status: "partial",
    readiness: 68,
    priority: "high",
    currentState: "Comentariile și activitatea sunt prezente ca mock/activity log, dar nu sunt încă timeline persistent per task/proiect.",
    targetState: "Thread-uri de comentarii, @mentions, activity log și audit events persistente, cu paginare și live refresh.",
    nextAction: "Introducere comments + activity_events + notifications writer pe create/update/status change.",
    apiContract: ["GET /api/v1/tasks/:id/comments", "POST /api/v1/tasks/:id/comments", "GET /api/v1/activity?scope=task|project"],
    persistenceTarget: ["comments", "activity_events", "notifications"]
  },
  {
    key: "time-entry-persistence",
    label: "Time entries & timers",
    domain: "TimeEntry",
    status: "partial",
    readiness: 70,
    priority: "critical",
    currentState: "Timerul demo există în task drawer/store, dar nu este încă time ledger persistent.",
    targetState: "Start/stop timer și timesheet entries persistente, cu overlap guard, approval și raportare per task/proiect/client.",
    nextAction: "Adăugare time_entries + timer_sessions + guards server-side pentru un singur timer activ per user.",
    apiContract: ["POST /api/v1/time/start", "POST /api/v1/time/stop", "GET /api/v1/time/day", "POST /api/v1/time/submit"],
    persistenceTarget: ["time_entries", "timer_sessions", "timesheet_submissions"]
  },
  {
    key: "attachments-documents-bridge",
    label: "Attachments & project documents bridge",
    domain: "Attachment",
    status: "mock",
    readiness: 56,
    priority: "medium",
    currentState: "Documentele sunt încă manifest/mock; upload real și storage R2/S3 nu sunt activate.",
    targetState: "Atașamente task/proiect în Cloudflare R2, metadata în DB, thumbnails, audit și permisiuni per workspace.",
    nextAction: "Definire attachments table + signed upload URLs + scan/metadata pipeline.",
    apiContract: ["POST /api/v1/attachments/sign-upload", "POST /api/v1/attachments/complete", "GET /api/v1/projects/:id/documents"],
    persistenceTarget: ["attachments", "document_versions", "storage_objects"]
  },
  {
    key: "approvals-workflow-persistence",
    label: "Approvals linked to tasks/projects",
    domain: "Approval",
    status: "partial",
    readiness: 64,
    priority: "high",
    currentState: "Aprobările există în Action Center/workflows ca manifest, dar nu sunt încă o coadă persistentă cu decizii auditate.",
    targetState: "Approval requests persistente, legate de task/proiect/oportunitate/finanțare, cu decizie, motiv și audit trail.",
    nextAction: "Adăugare approval_requests + approval_decisions + workflow_executions persistent.",
    apiContract: ["GET /api/v1/approvals", "POST /api/v1/approvals/:id/approve", "POST /api/v1/approvals/:id/reject"],
    persistenceTarget: ["approval_requests", "approval_decisions", "workflow_executions"]
  },
  {
    key: "calendar-milestone-sync",
    label: "Calendar & milestone sync",
    domain: "CalendarEvent",
    status: "mock",
    readiness: 52,
    priority: "medium",
    currentState: "Calendarul există ca ecran/preview, dar evenimentele și milestone-urile nu sunt sincronizate bidirecțional cu taskurile.",
    targetState: "Calendar events generate task reminders, project milestones și technician dispatch schedule.",
    nextAction: "Model calendar_events + task_schedule + project_milestones, apoi sincronizare cu view-ul Calendar.",
    apiContract: ["GET /api/v1/calendar", "POST /api/v1/calendar/events", "PATCH /api/v1/calendar/events/:id"],
    persistenceTarget: ["calendar_events", "task_schedule", "project_milestones"]
  }
];

export const workGraphTables: WorkGraphTable[] = [
  {
    table: "projects",
    ownerModule: "Proiecte",
    purpose: "Sursa centrală pentru proiecte FV, faze, client, locație, putere kWp, buget, deadline și status sănătate.",
    status: "api-ready",
    readiness: 82,
    priority: "critical",
    requiredIndexes: ["workspace_id", "client_id", "owner_id", "status", "deadline"],
    auditEvents: ["project.created", "project.updated", "project.phase_changed", "project.archived"]
  },
  {
    table: "tasks",
    ownerModule: "Taskuri",
    purpose: "Taskuri și work items pentru toate modulele: proiecte, CRM, IoT, mentenanță, finanțări, HR.",
    status: "api-ready",
    readiness: 86,
    priority: "critical",
    requiredIndexes: ["workspace_id", "project_id", "assignee_id", "status", "priority", "due_date"],
    auditEvents: ["task.created", "task.updated", "task.status_changed", "task.completed", "task.deleted"]
  },
  {
    table: "subtasks",
    ownerModule: "Taskuri",
    purpose: "Checklist și subtaskuri cu ordine, status, responsabil și due date.",
    status: "partial",
    readiness: 72,
    priority: "high",
    requiredIndexes: ["task_id", "assignee_id", "sort_order", "done"],
    auditEvents: ["subtask.created", "subtask.completed", "subtask.reordered"]
  },
  {
    table: "comments",
    ownerModule: "Colaborare",
    purpose: "Comentarii, update-uri, @mentions și conversații task/proiect.",
    status: "partial",
    readiness: 68,
    priority: "high",
    requiredIndexes: ["entity_type", "entity_id", "created_by", "created_at"],
    auditEvents: ["comment.created", "comment.edited", "comment.deleted"]
  },
  {
    table: "time_entries",
    ownerModule: "Timesheet",
    purpose: "Ore lucrate pe task/proiect, timer sessions, submit/approval flow.",
    status: "partial",
    readiness: 70,
    priority: "critical",
    requiredIndexes: ["workspace_id", "user_id", "task_id", "project_id", "started_at", "ended_at"],
    auditEvents: ["timer.started", "timer.stopped", "time_entry.submitted", "time_entry.approved"]
  },
  {
    table: "activity_events",
    ownerModule: "Audit & feed",
    purpose: "Feed operațional și audit user-facing pentru schimbări relevante în WorkGraph.",
    status: "partial",
    readiness: 66,
    priority: "high",
    requiredIndexes: ["workspace_id", "entity_type", "entity_id", "actor_id", "created_at"],
    auditEvents: ["activity.logged", "activity.exported"]
  },
  {
    table: "attachments",
    ownerModule: "Documente",
    purpose: "Metadata pentru fișiere task/proiect/ticket, cu obiectele stocate în R2/S3.",
    status: "mock",
    readiness: 56,
    priority: "medium",
    requiredIndexes: ["workspace_id", "entity_type", "entity_id", "uploaded_by"],
    auditEvents: ["attachment.uploaded", "attachment.deleted", "attachment.downloaded"]
  },
  {
    table: "approval_requests",
    ownerModule: "Workflow-uri",
    purpose: "Coadă de aprobări pentru oferte, bugete, taskuri critice, finanțări, rapoarte.",
    status: "partial",
    readiness: 64,
    priority: "high",
    requiredIndexes: ["workspace_id", "requested_by", "approver_id", "status", "due_at"],
    auditEvents: ["approval.requested", "approval.approved", "approval.rejected", "approval.escalated"]
  }
];

export const repositoryMethods: TaskProjectRepositoryMethod[] = [
  {
    method: "projectRepository.listProjects(filters)",
    owner: "ProjectRepository",
    status: "api-ready",
    description: "Returnează proiectele filtrate după workspace, owner, fază, deadline, client și sănătate.",
    rollback: "Fallback la mock projects din @servelect/shared dacă provider=db nu este configurat."
  },
  {
    method: "projectRepository.createProject(input, actor)",
    owner: "ProjectRepository",
    status: "partial",
    description: "Creează proiect cu owner, client, fază inițială, milestone-uri și audit event.",
    rollback: "În MVP scrie în localStorage/mock; în DB trebuie tranzacție Prisma."
  },
  {
    method: "taskRepository.listTasks(filters)",
    owner: "TaskRepository",
    status: "api-ready",
    description: "Returnează taskuri pentru table/board/my work/action center cu paginare și status filters.",
    rollback: "Fallback la mock tasks și paginare client-side limitată pentru performanță."
  },
  {
    method: "taskRepository.updateTaskStatus(taskId, status, actor)",
    owner: "TaskRepository",
    status: "partial",
    description: "Schimbă status task, creează activity event, notifică assignee/owner și poate declanșa workflow.",
    rollback: "Optimistic UI + revert dacă API eșuează."
  },
  {
    method: "timeRepository.startTimer(taskId, actor)",
    owner: "TimeRepository",
    status: "partial",
    description: "Pornește timer pe task și verifică să nu existe alt timer activ pentru user.",
    rollback: "Demo timer local rămâne disponibil până la DB time_entries."
  },
  {
    method: "auditRepository.log(event)",
    owner: "AuditRepository",
    status: "partial",
    description: "Scrie audit/activity event pentru create/update/delete/status/timer/approval.",
    rollback: "Manifest mock în admin/audit dacă DB lipsește."
  }
];

export const migrationPlan = [
  "1. Stabilizare contracte API: tasks/projects/comments/time fără schimbări UI majore.",
  "2. Introducere repository provider switch: mock | prisma, controlat prin env WORKOS_DATA_PROVIDER.",
  "3. Migrări Prisma pentru projects, tasks, subtasks, comments, time_entries, activity_events.",
  "4. Seed inițial cu proiectele și taskurile Servelect existente în mock data.",
  "5. Mutare /taskuri pe API-backed store cu TanStack Query și fallback localStorage.",
  "6. Mutare /proiecte și project detail pe ProjectRepository.",
  "7. Activare audit events pentru task/project CRUD și status changes.",
  "8. Adăugare test Playwright smoke pentru create task -> change status -> open drawer -> timer demo.",
  "9. Menținere rollback: dacă DATABASE_URL lipsește, aplicația rămâne complet navigabilă pe mock data."
];

export function getTaskProjectPersistenceRelease(): TaskProjectPersistenceRelease {
  return {
    version: "1.6.0",
    name: "Task & Project Persistence Pack",
    objective:
      "Definește contractul real de persistență pentru nucleul Work OS: proiecte, taskuri, subtaskuri, comentarii, timp lucrat, activitate și aprobări, pregătind migrarea controlată din mock/localStorage către PostgreSQL/Prisma.",
    globalReadiness: calculateAverageReadiness(taskProjectCapabilities),
    providerMode: "api-contract-ready",
    capabilities: taskProjectCapabilities,
    tables: workGraphTables,
    repositoryMethods,
    migrationPlan,
    risks: [
      "Nu activa DB writes fără rollback mock, ca să nu strici demo-ul public.",
      "Taskurile sunt nucleul aplicației; schimbarea store-ului trebuie făcută incremental, întâi read, apoi write.",
      "Time tracking necesită guard server-side pentru un singur timer activ per utilizator.",
      "Atașamentele nu trebuie salvate în DB ca blob-uri; doar metadata DB + object storage R2/S3.",
      "RBAC din v1.5 trebuie aplicat pe API înainte de CRUD real în producție."
    ],
    nextBuild: {
      version: "v1.7.0",
      name: "Real Task CRUD & API-backed Store",
      focus: [
        "Implementare route handlers pentru tasks/projects CRUD cu provider mock/prisma.",
        "Conectare /taskuri la TanStack Query pentru read operations.",
        "Mutare task create/status update prin API cu optimistic UI.",
        "Audit events pentru task create/update/status/timer."
      ]
    }
  };
}

export function getTaskProjectPersistenceHealth() {
  const release = getTaskProjectPersistenceRelease();
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
    { key: "DATABASE_URL", present: Boolean(process.env.DATABASE_URL), purpose: "PostgreSQL pentru tasks/projects/comments/time_entries" },
    { key: "WORKOS_DATA_PROVIDER", present: Boolean(process.env.WORKOS_DATA_PROVIDER), purpose: "selectare provider mock/prisma" },
    { key: "NEXT_PUBLIC_DEMO_AUTH", present: Boolean(process.env.NEXT_PUBLIC_DEMO_AUTH), purpose: "fallback demo pentru preview" },
    { key: "AUTH_SECRET", present: Boolean(process.env.AUTH_SECRET), purpose: "necesar pentru audit actor real" },
    { key: "R2_BUCKET_NAME", present: Boolean(process.env.R2_BUCKET_NAME), purpose: "atașamente task/proiect în object storage" }
  ];

  const apiReady = release.capabilities.filter((item) => item.status === "api-ready" || item.status === "production-ready").length;

  return {
    ok: release.globalReadiness >= 68,
    generatedAt: new Date().toISOString(),
    version: release.version,
    providerMode: release.providerMode,
    globalReadiness: release.globalReadiness,
    counters,
    envChecks,
    apiReady,
    tablesReady: release.tables.filter((table) => table.status === "api-ready" || table.status === "production-ready").length,
    recommendation:
      Boolean(process.env.DATABASE_URL) && release.globalReadiness >= 70
        ? "Ready to implement v1.7 API-backed Task CRUD"
        : "Keep mock/localStorage fallback active while DB provider is prepared"
  };
}

export function getTaskProjectSchemaPlan() {
  const release = getTaskProjectPersistenceRelease();

  return {
    version: release.version,
    generatedAt: new Date().toISOString(),
    schemaProvider: "Prisma + PostgreSQL",
    tables: release.tables.map((table) => ({
      table: table.table,
      ownerModule: table.ownerModule,
      status: table.status,
      readiness: table.readiness,
      priority: table.priority,
      indexes: table.requiredIndexes,
      auditEvents: table.auditEvents
    })),
    relationships: [
      "workspace -> projects",
      "workspace -> users",
      "project -> tasks",
      "task -> subtasks",
      "task -> comments",
      "task -> time_entries",
      "task/project -> attachments",
      "task/project/opportunity/funding -> approval_requests",
      "all mutable entities -> activity_events"
    ],
    guardrails: [
      "workspace_id obligatoriu pe toate tabelele operaționale",
      "created_by/updated_by obligatoriu pentru audit",
      "soft delete pentru projects/tasks/comments/attachments",
      "status changes scrise în activity_events",
      "API RBAC verificat înainte de write"
    ]
  };
}

export function getTaskProjectMigrationPlan() {
  const release = getTaskProjectPersistenceRelease();

  return {
    version: release.version,
    generatedAt: new Date().toISOString(),
    plan: release.migrationPlan.map((step, index) => ({
      order: index + 1,
      step,
      risk: index < 4 ? "medium" : index < 7 ? "high" : "medium",
      rollback: "Switch WORKOS_DATA_PROVIDER=mock și păstrează localStorage fallback."
    })),
    repositoryMethods: release.repositoryMethods,
    nextBuild: release.nextBuild
  };
}

function calculateAverageReadiness(items: Array<{ readiness: number }>) {
  if (!items.length) return 0;
  return Math.round(items.reduce((sum, item) => sum + item.readiness, 0) / items.length);
}
