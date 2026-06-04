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
import { getPrisma } from "./prisma-client";
import {
  healthToDb,
  mapProjectFromPrisma,
  mapTaskFromPrisma,
  priorityToDb,
  projectPhaseToDb,
  taskStatusToDb,
  toDateInput
} from "./prisma-mappers";

const DEFAULT_WORKSPACE = {
  id: "workspace-servelect-main",
  name: "SERVELECT EMP",
  tenantSlug: "servelect"
};

const DEFAULT_ADMIN = {
  id: "u1",
  name: "Andrei Popescu",
  email: "admin@servelect.local",
  role: "Administrator",
  title: "Manager proiect",
  team: "Operațiuni",
  avatar: "AP",
  workload: 82,
  online: true
};

function normalizeText(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

async function ensureWorkspaceAndUser(prisma: any) {
  const workspace = await prisma.workspace.upsert({
    where: { tenantSlug: DEFAULT_WORKSPACE.tenantSlug },
    update: {},
    create: DEFAULT_WORKSPACE
  });

  const user = await prisma.user.upsert({
    where: { email: DEFAULT_ADMIN.email },
    update: {},
    create: {
      ...DEFAULT_ADMIN,
      workspaceId: workspace.id
    }
  });

  return { workspace, user };
}

async function ensureClient(prisma: any, name: string, location?: string) {
  const existing = await prisma.client.findFirst({ where: { name } });
  if (existing) return existing;
  return prisma.client.create({ data: { name, location } });
}

async function ensureDefaultProject(prisma: any) {
  const { workspace, user } = await ensureWorkspaceAndUser(prisma);
  const existing = await prisma.project.findFirst({ where: { workspaceId: workspace.id } });
  if (existing) return existing;

  const client = await ensureClient(prisma, "Client Andrei Popescu", "Cluj-Napoca");
  return prisma.project.create({
    data: {
      workspaceId: workspace.id,
      clientId: client.id,
      code: "P-2024-0187",
      name: "Sistem FV 9.6 kWp",
      clientName: client.name,
      location: "Cluj-Napoca",
      powerKwp: 9.6,
      phase: "Montaj",
      progress: 68,
      health: "Bun",
      ownerId: user.id,
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      budgetRon: 74000,
      workedHours: 86
    }
  });
}

async function projectInclude() {
  return {
    owner: true,
    client: true,
    documents: true
  };
}

async function taskInclude() {
  return {
    project: true,
    assignee: true,
    owner: true,
    comments: { include: { author: true }, orderBy: { createdAt: "desc" } },
    attachments: true,
    subtasks: { include: { project: true, assignee: true, owner: true } }
  };
}

export const prismaRepository = {
  async snapshot(): Promise<BackendSnapshot> {
    const prisma = await getPrisma();
    const [projects, tasks, alerts, tickets, approvals] = await Promise.all([
      prisma.project.findMany({ include: await projectInclude(), orderBy: { updatedAt: "desc" }, take: 200 }),
      prisma.task.findMany({ include: await taskInclude(), orderBy: { updatedAt: "desc" }, take: 500 }),
      prisma.ioTAlert?.findMany?.({ orderBy: { createdAt: "desc" }, take: 200 }) ?? Promise.resolve([]),
      prisma.maintenanceTicket?.findMany?.({ orderBy: { createdAt: "desc" }, take: 200 }) ?? Promise.resolve([]),
      prisma.approvalRequest?.findMany?.({ orderBy: { createdAt: "desc" }, take: 200 }) ?? Promise.resolve([])
    ]);

    return {
      projects: projects.map(mapProjectFromPrisma),
      tasks: tasks.map(mapTaskFromPrisma),
      alerts: alerts as IoTAlert[],
      tickets: tickets as MaintenanceTicket[],
      approvals: approvals as ApprovalRequest[],
      auditLog: []
    };
  },

  async dashboard(): Promise<DashboardAggregate> {
    const prisma = await getPrisma();
    const statuses: TaskStatus[] = ["Backlog", "De făcut", "În lucru", "Review / QA", "Blocat", "Finalizat", "Anulat"];
    const [projectTotal, activeProjects, riskyProjects, taskTotal, urgentTasks] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { NOT: { phase: "Finalizat" } } }),
      prisma.project.count({ where: { OR: [{ health: "Risc" }, { health: "Critic" }] } }),
      prisma.task.count(),
      prisma.task.count({ where: { OR: [{ priority: "Urgent" }, { priority: "Critic" }, { status: "Blocat" }] } })
    ]);

    const byStatusEntries = await Promise.all(statuses.map(async (status) => [status, await prisma.task.count({ where: { status: taskStatusToDb[status] } })] as const));

    const openAlerts = prisma.ioTAlert?.count ? await prisma.ioTAlert.count({ where: { NOT: { status: "Închis" } } }) : 0;
    const openTickets = prisma.maintenanceTicket?.count ? await prisma.maintenanceTicket.count({ where: { NOT: { status: "Închis" } } }) : 0;
    const pendingApprovals = prisma.approvalRequest?.count ? await prisma.approvalRequest.count({ where: { status: "In_asteptare" } }) : 0;

    return {
      projects: { total: projectTotal, active: activeProjects, risky: riskyProjects },
      tasks: { total: taskTotal, urgent: urgentTasks, byStatus: Object.fromEntries(byStatusEntries) as Record<TaskStatus, number> },
      operations: { openAlerts, openTickets, pendingApprovals }
    };
  },

  async listProjects(query?: string): Promise<Project[]> {
    const prisma = await getPrisma();
    const where = query
      ? {
          OR: [
            { code: { contains: query, mode: "insensitive" } },
            { name: { contains: query, mode: "insensitive" } },
            { clientName: { contains: query, mode: "insensitive" } },
            { location: { contains: query, mode: "insensitive" } }
          ]
        }
      : undefined;

    const rows = await prisma.project.findMany({ where, include: await projectInclude(), orderBy: { updatedAt: "desc" }, take: 300 });
    return rows.map(mapProjectFromPrisma);
  },

  async getProject(id: string): Promise<Project | undefined> {
    const prisma = await getPrisma();
    const row = await prisma.project.findFirst({ where: { OR: [{ id }, { code: id }] }, include: await projectInclude() });
    return row ? mapProjectFromPrisma(row) : undefined;
  },

  async createProject(input: ProjectCreateInput): Promise<Project> {
    const prisma = await getPrisma();
    const { workspace, user } = await ensureWorkspaceAndUser(prisma);
    const client = await ensureClient(prisma, input.clientName, input.location);
    const code = input.code ?? `P-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;

    const row = await prisma.project.create({
      data: {
        workspaceId: workspace.id,
        clientId: client.id,
        code,
        name: input.name,
        clientName: input.clientName,
        location: input.location,
        powerKwp: input.powerKwp ?? 0,
        phase: projectPhaseToDb[String(input.phase ?? "Planificat")] ?? "Planificat",
        progress: input.progress ?? 0,
        health: healthToDb[String(input.health ?? "Bun")] ?? "Bun",
        ownerId: input.ownerId ?? user.id,
        deadline: toDateInput(input.deadline) ?? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        budgetRon: input.budgetRon ?? 0,
        workedHours: 0
      },
      include: await projectInclude()
    });

    return mapProjectFromPrisma(row);
  },

  async updateProject(id: string, input: ProjectUpdateInput): Promise<Project | null> {
    const prisma = await getPrisma();
    const current = await prisma.project.findFirst({ where: { OR: [{ id }, { code: id }] } });
    if (!current) return null;
    const row = await prisma.project.update({
      where: { id: current.id },
      data: {
        ...("name" in input ? { name: input.name } : {}),
        ...("clientName" in input ? { clientName: input.clientName } : {}),
        ...("location" in input ? { location: input.location } : {}),
        ...("powerKwp" in input ? { powerKwp: input.powerKwp } : {}),
        ...("phase" in input ? { phase: projectPhaseToDb[String(input.phase)] ?? input.phase } : {}),
        ...("progress" in input ? { progress: input.progress } : {}),
        ...("health" in input ? { health: healthToDb[String(input.health)] ?? input.health } : {}),
        ...("deadline" in input ? { deadline: toDateInput(input.deadline) } : {}),
        ...("budgetRon" in input ? { budgetRon: input.budgetRon } : {}),
        ...("workedHours" in input ? { workedHours: input.workedHours } : {})
      },
      include: await projectInclude()
    });
    return mapProjectFromPrisma(row);
  },

  async deleteProject(id: string): Promise<boolean> {
    const prisma = await getPrisma();
    const current = await prisma.project.findFirst({ where: { OR: [{ id }, { code: id }] } });
    if (!current) return false;
    await prisma.project.delete({ where: { id: current.id } });
    return true;
  },

  async listTasks(query?: string, status?: TaskStatus, projectId?: string): Promise<Task[]> {
    const prisma = await getPrisma();
    const where: any = {};
    if (status) where.status = taskStatusToDb[status];
    if (projectId) where.OR = [{ projectId }, { project: { code: projectId } }];
    if (query) {
      const searchOr = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { project: { code: { contains: query, mode: "insensitive" } } },
        { project: { name: { contains: query, mode: "insensitive" } } },
        { assignee: { name: { contains: query, mode: "insensitive" } } }
      ];
      where.AND = [{ OR: searchOr }];
    }
    const rows = await prisma.task.findMany({ where, include: await taskInclude(), orderBy: { updatedAt: "desc" }, take: 600 });
    return rows.map(mapTaskFromPrisma);
  },

  async getTask(id: string): Promise<Task | undefined> {
    const prisma = await getPrisma();
    const row = await prisma.task.findUnique({ where: { id }, include: await taskInclude() });
    return row ? mapTaskFromPrisma(row) : undefined;
  },

  async createTask(input: TaskCreateInput): Promise<Task> {
    const prisma = await getPrisma();
    const { user } = await ensureWorkspaceAndUser(prisma);
    const project = input.projectId
      ? await prisma.project.findFirst({ where: { OR: [{ id: input.projectId }, { code: input.projectId }] } })
      : await ensureDefaultProject(prisma);

    const row = await prisma.task.create({
      data: {
        projectId: project.id,
        title: input.title,
        description: input.description ?? "Task creat prin API v0.5 cu provider Prisma/PostgreSQL.",
        status: taskStatusToDb[input.status ?? "De făcut"],
        priority: priorityToDb[input.priority ?? "Mediu"],
        assigneeId: input.assigneeId ?? user.id,
        ownerId: input.ownerId ?? user.id,
        startDate: toDateInput(input.startDate) ?? new Date(),
        dueDate: toDateInput(input.dueDate) ?? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        estimateHours: input.estimateHours ?? 2,
        trackedHours: input.trackedHours ?? 0,
        tags: input.tags ?? ["api", "v0.5"],
        dependencies: input.dependencies ?? []
      },
      include: await taskInclude()
    });

    return mapTaskFromPrisma(row);
  },

  async updateTask(id: string, input: TaskUpdateInput): Promise<Task | null> {
    const prisma = await getPrisma();
    const current = await prisma.task.findUnique({ where: { id } });
    if (!current) return null;
    const row = await prisma.task.update({
      where: { id },
      data: {
        ...("title" in input ? { title: input.title } : {}),
        ...("description" in input ? { description: input.description } : {}),
        ...("status" in input ? { status: taskStatusToDb[input.status ?? "De făcut"] } : {}),
        ...("priority" in input ? { priority: priorityToDb[input.priority ?? "Mediu"] } : {}),
        ...("assigneeId" in input ? { assigneeId: input.assigneeId } : {}),
        ...("ownerId" in input ? { ownerId: input.ownerId } : {}),
        ...("startDate" in input ? { startDate: toDateInput(input.startDate) } : {}),
        ...("dueDate" in input ? { dueDate: toDateInput(input.dueDate) } : {}),
        ...("estimateHours" in input ? { estimateHours: input.estimateHours } : {}),
        ...("trackedHours" in input ? { trackedHours: input.trackedHours } : {}),
        ...("tags" in input ? { tags: input.tags } : {}),
        ...("dependencies" in input ? { dependencies: input.dependencies } : {})
      },
      include: await taskInclude()
    });
    return mapTaskFromPrisma(row);
  },

  async deleteTask(id: string): Promise<boolean> {
    const prisma = await getPrisma();
    const current = await prisma.task.findUnique({ where: { id } });
    if (!current) return false;
    await prisma.task.delete({ where: { id } });
    return true;
  },

  async listAlerts(): Promise<IoTAlert[]> {
    const prisma = await getPrisma();
    const model = prisma.ioTAlert ?? prisma.iotAlert;
    if (!model?.findMany) return [];
    return model.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  },

  async getAlert(id: string): Promise<IoTAlert | undefined> {
    const prisma = await getPrisma();
    const model = prisma.ioTAlert ?? prisma.iotAlert;
    if (!model?.findUnique) return undefined;
    return model.findUnique({ where: { id } });
  },

  async createTaskFromAlert(id: string, input: CreateTaskFromAlertInput = {}) {
    const alert = await this.getAlert(id);
    if (!alert) return null;
    const project = await this.getProject(alert.projectId);
    const task = await this.createTask({
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

    const prisma = await getPrisma();
    const model = prisma.ioTAlert ?? prisma.iotAlert;
    const updatedAlert = model?.update
      ? await model.update({ where: { id }, data: { linkedTaskId: task.id, status: "În lucru" } })
      : { ...alert, linkedTaskId: task.id, status: "În lucru" };

    return { alert: updatedAlert, task };
  },

  async listApprovals(): Promise<ApprovalRequest[]> {
    const prisma = await getPrisma();
    if (!prisma.approvalRequest?.findMany) return [];
    return prisma.approvalRequest.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  },

  async search(query: string): Promise<SearchResult[]> {
    const q = normalizeText(query);
    if (q.length < 2) return [];
    const [projects, tasks, alerts] = await Promise.all([this.listProjects(query), this.listTasks(query), this.listAlerts()]);

    const projectResults: SearchResult[] = projects.slice(0, 8).map((project) => ({
      id: project.id,
      type: "project",
      title: project.name,
      subtitle: `${project.code} · ${project.clientName}`,
      href: "/proiecte",
      status: project.phase
    }));

    const taskResults: SearchResult[] = tasks.slice(0, 8).map((task) => ({
      id: task.id,
      type: "task",
      title: task.title,
      subtitle: `${task.projectCode} · ${task.assigneeName}`,
      href: "/taskuri",
      status: task.status
    }));

    const alertResults: SearchResult[] = alerts
      .filter((alert) => normalizeText(`${alert.title} ${alert.recommendedAction}`).includes(q))
      .slice(0, 5)
      .map((alert) => ({ id: alert.id, type: "alert", title: alert.title, subtitle: alert.recommendedAction, href: "/iot", status: alert.status }));

    return [...projectResults, ...taskResults, ...alertResults].slice(0, 20);
  }
};
