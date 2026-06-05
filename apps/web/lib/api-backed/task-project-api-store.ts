import {
  projects as seedProjects,
  tasks as seedTasks,
  users,
  type ActivityLog,
  type Project,
  type ProjectHealth,
  type ProjectPhase,
  type Task,
  type TaskStatus,
  type Priority
} from "@servelect/shared";

export type ApiBackedStoreProvider = "mock-memory" | "http-api" | "database";
export type ApiCrudStatus = "active" | "planned" | "blocked" | "ready";

export type TaskCreateInput = Partial<Omit<Task, "id" | "activityLog" | "comments" | "attachments" | "subtasks">> & {
  title: string;
  projectId?: string;
  status?: TaskStatus;
  priority?: Priority;
};

export type TaskUpdateInput = Partial<Omit<Task, "id">> & { id?: string };
export type ProjectCreateInput = Partial<Omit<Project, "id">> & { name: string };
export type ProjectUpdateInput = Partial<Omit<Project, "id">> & { id?: string };

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const nowIso = () => new Date().toISOString();
const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

let taskRows: Task[] = clone(seedTasks);
let projectRows: Project[] = clone(seedProjects);

function getDefaultProject() {
  return projectRows[0] ?? seedProjects[0];
}

function getDefaultUser() {
  return users[0];
}

function appendLog(task: Task, action: string, target = task.title): Task {
  const actor = getDefaultUser();
  const log: ActivityLog = {
    id: makeId("log"),
    userId: actor.id,
    userName: actor.name,
    action,
    target,
    createdAt: nowIso()
  };

  return {
    ...task,
    activityLog: [log, ...(task.activityLog ?? [])].slice(0, 40)
  };
}

export function getTaskCrudRelease() {
  const totalTracked = taskRows.reduce((sum, task) => sum + task.trackedHours, 0);
  const totalEstimate = taskRows.reduce((sum, task) => sum + task.estimateHours, 0);
  const openTasks = taskRows.filter((task) => task.status !== "Finalizat" && task.status !== "Anulat");
  const apiBackedFields = [
    "tasks.list",
    "tasks.create",
    "tasks.patch",
    "tasks.delete",
    "projects.list",
    "projects.create",
    "projects.patch",
    "projects.delete",
    "activityLog.append",
    "localStorage.fallback"
  ];

  return {
    version: "1.7.0",
    name: "Real Task CRUD & API-backed Store",
    generatedAt: nowIso(),
    provider: "mock-memory" as ApiBackedStoreProvider,
    productionMode: false,
    summary: {
      tasks: taskRows.length,
      openTasks: openTasks.length,
      projects: projectRows.length,
      trackedHours: Number(totalTracked.toFixed(1)),
      estimateHours: Number(totalEstimate.toFixed(1)),
      apiBackedFields: apiBackedFields.length,
      persistenceReadiness: 78
    },
    apiBackedFields,
    routes: [
      "/api/v1/tasks",
      "/api/v1/projects",
      "/api/v1/enterprise/task-crud",
      "/api/v1/enterprise/task-crud-health",
      "/api/v1/enterprise/task-crud-schema",
      "/admin/task-crud"
    ],
    nextRequiredBuild: "v1.8.0 — API-backed UI Store Integration Pack"
  };
}

export function getTaskCrudHealth() {
  const release = getTaskCrudRelease();

  return {
    ok: true,
    version: release.version,
    generatedAt: nowIso(),
    provider: release.provider,
    checks: [
      { id: "task-api", label: "Task CRUD API", status: "ready" as ApiCrudStatus, details: "GET/POST/PATCH/DELETE disponibile pe /api/v1/tasks." },
      { id: "project-api", label: "Project CRUD API", status: "ready" as ApiCrudStatus, details: "GET/POST/PATCH/DELETE disponibile pe /api/v1/projects." },
      { id: "activity-log", label: "Activity log append", status: "ready" as ApiCrudStatus, details: "Create/update/delete task generează log intern." },
      { id: "db-provider", label: "Database provider", status: "planned" as ApiCrudStatus, details: "Providerul curent este mock-memory. Urmează PostgreSQL/Prisma." },
      { id: "ui-binding", label: "UI store binding", status: "planned" as ApiCrudStatus, details: "Pagina /taskuri încă folosește Zustand/localStorage ca fallback." }
    ],
    risk: "medium",
    recommendation: "Activează treptat UI-ul să consume /api/v1/tasks, păstrând localStorage ca fallback până la DB real."
  };
}

export function getTaskCrudSchema() {
  return {
    ok: true,
    version: "1.7.0",
    generatedAt: nowIso(),
    tables: [
      {
        name: "tasks",
        status: "api-ready",
        primaryKey: "id",
        requiredFields: ["id", "title", "projectId", "status", "priority", "assigneeId", "ownerId", "dueDate"],
        relationships: ["projectId -> projects.id", "assigneeId -> users.id", "ownerId -> users.id", "parentTaskId -> tasks.id"]
      },
      {
        name: "projects",
        status: "api-ready",
        primaryKey: "id",
        requiredFields: ["id", "code", "name", "clientName", "phase", "progress", "health", "ownerId", "deadline"],
        relationships: ["clientId -> clients.id", "ownerId -> users.id"]
      },
      {
        name: "subtasks",
        status: "planned",
        primaryKey: "id",
        requiredFields: ["id", "taskId", "title", "done"],
        relationships: ["taskId -> tasks.id"]
      },
      {
        name: "task_comments",
        status: "planned",
        primaryKey: "id",
        requiredFields: ["id", "taskId", "authorId", "body", "createdAt"],
        relationships: ["taskId -> tasks.id", "authorId -> users.id"]
      },
      {
        name: "task_activity_log",
        status: "planned",
        primaryKey: "id",
        requiredFields: ["id", "taskId", "userId", "action", "createdAt"],
        relationships: ["taskId -> tasks.id", "userId -> users.id"]
      }
    ],
    apiContract: {
      listTasks: "GET /api/v1/tasks?status=&projectId=&priority=&search=",
      createTask: "POST /api/v1/tasks",
      updateTask: "PATCH /api/v1/tasks { id, patch }",
      deleteTask: "DELETE /api/v1/tasks { id } sau ?id=",
      listProjects: "GET /api/v1/projects?phase=&health=&search=",
      createProject: "POST /api/v1/projects",
      updateProject: "PATCH /api/v1/projects { id, patch }",
      deleteProject: "DELETE /api/v1/projects { id } sau ?id="
    }
  };
}

export function listApiTasks(filters?: { status?: string | null; projectId?: string | null; priority?: string | null; search?: string | null }) {
  let rows = taskRows;

  if (filters?.status) rows = rows.filter((task) => task.status === filters.status);
  if (filters?.projectId) rows = rows.filter((task) => task.projectId === filters.projectId);
  if (filters?.priority) rows = rows.filter((task) => task.priority === filters.priority);

  const q = filters?.search?.trim().toLowerCase();
  if (q) {
    rows = rows.filter((task) => [task.title, task.description, task.projectCode, task.projectName, task.assigneeName, ...task.tags].join(" ").toLowerCase().includes(q));
  }

  return clone(rows);
}

export function getApiTask(id: string) {
  const task = taskRows.find((row) => row.id === id);
  return task ? clone(task) : null;
}

export function createApiTask(input: TaskCreateInput) {
  const project = projectRows.find((row) => row.id === input.projectId) ?? getDefaultProject();
  const actor = getDefaultUser();
  const assignee = users.find((user) => user.id === input.assigneeId) ?? actor;
  const id = makeId("task");

  const task: Task = appendLog({
    id,
    title: input.title,
    description: input.description ?? "Task creat prin API-backed Store v1.7.",
    projectId: project.id,
    projectCode: project.code,
    projectName: project.name,
    parentTaskId: input.parentTaskId,
    status: input.status ?? "De făcut",
    priority: input.priority ?? "Mediu",
    assigneeId: assignee.id,
    assigneeName: assignee.name,
    ownerId: input.ownerId ?? actor.id,
    startDate: input.startDate ?? nowIso().slice(0, 10),
    dueDate: input.dueDate ?? nowIso().slice(0, 10),
    estimateHours: Number(input.estimateHours ?? 2),
    trackedHours: Number(input.trackedHours ?? 0),
    tags: input.tags ?? ["api-backed"],
    dependencies: input.dependencies ?? [],
    customFields: input.customFields ?? { Source: "v1.7 API" },
    subtasks: [],
    comments: [],
    attachments: [],
    activityLog: []
  }, "created task");

  taskRows = [task, ...taskRows];
  return clone(task);
}

export function updateApiTask(id: string, patch: TaskUpdateInput) {
  const index = taskRows.findIndex((task) => task.id === id);
  if (index < 0) return null;

  const current = taskRows[index];
  const project = patch.projectId ? projectRows.find((row) => row.id === patch.projectId) : undefined;
  const assignee = patch.assigneeId ? users.find((user) => user.id === patch.assigneeId) : undefined;

  const next = appendLog({
    ...current,
    ...patch,
    id: current.id,
    projectCode: project?.code ?? patch.projectCode ?? current.projectCode,
    projectName: project?.name ?? patch.projectName ?? current.projectName,
    assigneeName: assignee?.name ?? patch.assigneeName ?? current.assigneeName,
    activityLog: current.activityLog ?? []
  }, "updated task");

  taskRows = taskRows.map((task) => (task.id === id ? next : task));
  return clone(next);
}

export function deleteApiTask(id: string) {
  const exists = taskRows.some((task) => task.id === id);
  if (!exists) return false;
  taskRows = taskRows.filter((task) => task.id !== id && task.parentTaskId !== id);
  return true;
}

export function resetApiTaskStore() {
  taskRows = clone(seedTasks);
  projectRows = clone(seedProjects);
  return getTaskCrudRelease();
}

export function listApiProjects(filters?: { phase?: string | null; health?: string | null; search?: string | null }) {
  let rows = projectRows;

  if (filters?.phase) rows = rows.filter((project) => project.phase === filters.phase);
  if (filters?.health) rows = rows.filter((project) => project.health === filters.health);

  const q = filters?.search?.trim().toLowerCase();
  if (q) rows = rows.filter((project) => [project.code, project.name, project.clientName, project.location, project.phase].join(" ").toLowerCase().includes(q));

  return clone(rows);
}

export function getApiProject(id: string) {
  const project = projectRows.find((row) => row.id === id);
  return project ? clone(project) : null;
}

export function createApiProject(input: ProjectCreateInput) {
  const actor = getDefaultUser();
  const id = makeId("project");
  const project: Project = {
    id,
    code: input.code ?? `P-${new Date().getFullYear()}-${String(projectRows.length + 1).padStart(4, "0")}`,
    name: input.name,
    clientId: input.clientId ?? "c1",
    clientName: input.clientName ?? "Client demo API",
    location: input.location ?? "Cluj-Napoca",
    powerKwp: Number(input.powerKwp ?? 0),
    phase: input.phase ?? "Planificat",
    progress: Number(input.progress ?? 0),
    health: input.health ?? "Bun",
    ownerId: input.ownerId ?? actor.id,
    ownerName: input.ownerName ?? actor.name,
    deadline: input.deadline ?? nowIso().slice(0, 10),
    budgetRon: Number(input.budgetRon ?? 0),
    workedHours: Number(input.workedHours ?? 0),
    risks: Number(input.risks ?? 0),
    documents: Number(input.documents ?? 0),
    coordinates: input.coordinates
  };

  projectRows = [project, ...projectRows];
  return clone(project);
}

export function updateApiProject(id: string, patch: ProjectUpdateInput) {
  const index = projectRows.findIndex((project) => project.id === id);
  if (index < 0) return null;

  const current = projectRows[index];
  const next: Project = { ...current, ...patch, id: current.id };

  projectRows = projectRows.map((project) => (project.id === id ? next : project));
  taskRows = taskRows.map((task) => task.projectId === id ? { ...task, projectCode: next.code, projectName: next.name } : task);

  return clone(next);
}

export function deleteApiProject(id: string) {
  const hasTasks = taskRows.some((task) => task.projectId === id);
  if (hasTasks) return { deleted: false, reason: "Proiectul are taskuri active. Mută sau închide taskurile înainte de ștergere." };

  const exists = projectRows.some((project) => project.id === id);
  if (!exists) return { deleted: false, reason: "Proiectul nu există." };

  projectRows = projectRows.filter((project) => project.id !== id);
  return { deleted: true };
}
