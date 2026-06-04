import {
  approvals,
  iotAlerts,
  maintenanceTickets,
  projects as seedProjects,
  tasks as seedTasks
} from "@servelect/shared";
import type { ApprovalRequest, IoTAlert, MaintenanceTicket, Project, Task, TaskStatus } from "@servelect/shared";
import type {
  BackendSnapshot,
  CreateTaskFromAlertInput,
  DashboardAggregate,
  ProjectCreateInput,
  ProjectUpdateInput,
  SearchResult,
  TaskCreateInput,
  TaskUpdateInput
} from "./api-types";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

type MutableDb = {
  projects: Project[];
  tasks: Task[];
  alerts: IoTAlert[];
  tickets: MaintenanceTicket[];
  approvals: ApprovalRequest[];
};

declare global {
  // eslint-disable-next-line no-var
  var __servelectWorkOsMockDb: MutableDb | undefined;
}

function db(): MutableDb {
  if (!globalThis.__servelectWorkOsMockDb) {
    globalThis.__servelectWorkOsMockDb = {
      projects: clone(seedProjects),
      tasks: clone(seedTasks),
      alerts: clone(iotAlerts),
      tickets: clone(maintenanceTickets),
      approvals: clone(approvals)
    };
  }

  return globalThis.__servelectWorkOsMockDb;
}

function normalizeText(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export const repository = {
  snapshot(): BackendSnapshot {
    return {
      ...clone(db()),
      auditLog: []
    };
  },

  dashboard(): DashboardAggregate {
    const data = db();
    const statuses: TaskStatus[] = ["Backlog", "De făcut", "În lucru", "Review / QA", "Blocat", "Finalizat", "Anulat"];
    const byStatus = statuses.reduce(
      (acc, status) => ({ ...acc, [status]: data.tasks.filter((task) => task.status === status).length }),
      {} as Record<TaskStatus, number>
    );

    return {
      projects: {
        total: data.projects.length,
        active: data.projects.filter((project) => project.phase !== "Finalizat").length,
        risky: data.projects.filter((project) => project.health === "Risc" || project.health === "Critic").length
      },
      tasks: {
        total: data.tasks.length,
        urgent: data.tasks.filter((task) => task.priority === "Urgent" || task.priority === "Critic" || task.status === "Blocat").length,
        byStatus
      },
      operations: {
        openAlerts: data.alerts.filter((alert) => alert.status !== "Închis").length,
        openTickets: data.tickets.filter((ticket) => ticket.status !== "Închis").length,
        pendingApprovals: data.approvals.filter((approval) => approval.status === "În așteptare").length
      }
    };
  },

  listProjects(query?: string) {
    const data = db().projects;
    if (!query) return data;
    const q = normalizeText(query);
    return data.filter((project) =>
      [project.code, project.name, project.clientName, project.location, project.phase, project.health].some((value) => normalizeText(String(value)).includes(q))
    );
  },

  getProject(id: string) {
    return db().projects.find((project) => project.id === id || project.code === id);
  },

  createProject(input: ProjectCreateInput) {
    const now = Date.now();
    const project: Project = {
      id: `p-${crypto.randomUUID()}`,
      code: input.code ?? `P-${new Date().getFullYear()}-${String(now).slice(-4)}`,
      name: input.name,
      clientId: `client-${now}`,
      clientName: input.clientName,
      location: input.location,
      powerKwp: input.powerKwp ?? 0,
      phase: input.phase ?? "Planificat",
      progress: input.progress ?? 0,
      health: input.health ?? "Bun",
      ownerId: input.ownerId ?? "u1",
      ownerName: input.ownerName ?? "Andrei Popescu",
      deadline: input.deadline ?? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      budgetRon: input.budgetRon ?? 0,
      workedHours: 0,
      risks: 0,
      documents: 0
    };

    db().projects.unshift(project);
    return project;
  },

  updateProject(id: string, input: ProjectUpdateInput) {
    const project = this.getProject(id);
    if (!project) return null;
    Object.assign(project, input);
    return project;
  },

  deleteProject(id: string) {
    const data = db().projects;
    const index = data.findIndex((project) => project.id === id || project.code === id);
    if (index < 0) return false;
    data.splice(index, 1);
    return true;
  },

  listTasks(query?: string, status?: TaskStatus, projectId?: string) {
    let data = db().tasks;
    if (status) data = data.filter((task) => task.status === status);
    if (projectId) data = data.filter((task) => task.projectId === projectId || task.projectCode === projectId);
    if (!query) return data;
    const q = normalizeText(query);
    return data.filter((task) =>
      [task.title, task.description, task.projectCode, task.projectName, task.status, task.priority, task.assigneeName].some((value) => normalizeText(String(value)).includes(q))
    );
  },

  getTask(id: string) {
    return db().tasks.find((task) => task.id === id);
  },

  createTask(input: TaskCreateInput) {
    const project = input.projectId ? this.getProject(input.projectId) : db().projects[0];
    const now = new Date().toISOString();
    const task: Task = {
      id: `task-${crypto.randomUUID()}`,
      title: input.title,
      description: input.description ?? "Task creat prin API v0.4 Backend Foundation.",
      projectId: input.projectId ?? project?.id ?? "p1",
      projectCode: input.projectCode ?? project?.code ?? "P-2024-0187",
      projectName: input.projectName ?? project?.name ?? "Sistem FV 9.6 kWp",
      status: input.status ?? "De făcut",
      priority: input.priority ?? "Mediu",
      assigneeId: input.assigneeId ?? "u1",
      assigneeName: input.assigneeName ?? "Andrei Popescu",
      ownerId: input.ownerId ?? "u1",
      startDate: input.startDate ?? now.slice(0, 10),
      dueDate: input.dueDate ?? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      estimateHours: input.estimateHours ?? 2,
      trackedHours: input.trackedHours ?? 0,
      tags: input.tags ?? ["api", "v0.4"],
      dependencies: input.dependencies ?? [],
      customFields: {},
      subtasks: [],
      comments: [],
      attachments: [],
      activityLog: [
        {
          id: `log-${crypto.randomUUID()}`,
          userId: "system",
          userName: "SERVELECT API",
          action: "a creat taskul prin API",
          target: input.title,
          createdAt: now
        }
      ]
    };

    db().tasks.unshift(task);
    return task;
  },

  updateTask(id: string, input: TaskUpdateInput) {
    const task = this.getTask(id);
    if (!task) return null;
    Object.assign(task, input);
    task.activityLog.unshift({
      id: `log-${crypto.randomUUID()}`,
      userId: "system",
      userName: "SERVELECT API",
      action: "a actualizat taskul prin API",
      target: task.title,
      createdAt: new Date().toISOString()
    });
    return task;
  },

  deleteTask(id: string) {
    const data = db().tasks;
    const index = data.findIndex((task) => task.id === id);
    if (index < 0) return false;
    data.splice(index, 1);
    return true;
  },

  listAlerts() {
    return db().alerts;
  },

  getAlert(id: string) {
    return db().alerts.find((alert) => alert.id === id);
  },

  createTaskFromAlert(id: string, input: CreateTaskFromAlertInput = {}) {
    const alert = this.getAlert(id);
    if (!alert) return null;
    const project = this.getProject(alert.projectId);
    const task = this.createTask({
      title: alert.recommendedAction,
      description: `Creat automat din alerta IoT: ${alert.title}. Severitate: ${alert.severity}.`,
      projectId: alert.projectId,
      projectCode: project?.code,
      projectName: project?.name,
      priority: alert.severity === "Critică" ? "Critic" : "Ridicat",
      status: "De făcut",
      assigneeId: input.assigneeId,
      assigneeName: input.assigneeName,
      dueDate: input.dueDate,
      tags: ["iot", "alertă", "automat"]
    });
    alert.linkedTaskId = task.id;
    alert.status = "În lucru";
    return { alert, task };
  },

  listApprovals() {
    return db().approvals;
  },

  search(query: string): SearchResult[] {
    const q = normalizeText(query);
    if (q.length < 2) return [];

    const projectResults: SearchResult[] = db()
      .projects.filter((project) => normalizeText(`${project.code} ${project.name} ${project.clientName} ${project.location}`).includes(q))
      .slice(0, 8)
      .map((project) => ({ id: project.id, type: "project", title: project.name, subtitle: `${project.code} · ${project.clientName}`, href: "/proiecte", status: project.phase }));

    const taskResults: SearchResult[] = db()
      .tasks.filter((task) => normalizeText(`${task.title} ${task.description} ${task.projectCode} ${task.assigneeName}`).includes(q))
      .slice(0, 8)
      .map((task) => ({ id: task.id, type: "task", title: task.title, subtitle: `${task.projectCode} · ${task.assigneeName}`, href: "/taskuri", status: task.status }));

    const alertResults: SearchResult[] = db()
      .alerts.filter((alert) => normalizeText(`${alert.title} ${alert.recommendedAction}`).includes(q))
      .slice(0, 5)
      .map((alert) => ({ id: alert.id, type: "alert", title: alert.title, subtitle: alert.recommendedAction, href: "/iot", status: alert.status }));

    return [...projectResults, ...taskResults, ...alertResults].slice(0, 20);
  }
};
