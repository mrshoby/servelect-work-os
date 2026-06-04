import { projects, tasks, users } from "@servelect/shared";
import { getDataProviderMode } from "@/lib/backend/data-provider";
import { jsonError, jsonOk } from "@/lib/backend/http";
import { getPrisma } from "@/lib/backend/prisma-client";
import { healthToDb, priorityToDb, projectPhaseToDb, taskStatusToDb, toDateInput } from "@/lib/backend/prisma-mappers";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  const token = process.env.SERVELECT_SEED_TOKEN;
  if (!token) return false;
  return request.headers.get("x-servelect-seed-token") === token;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) return jsonError("UNAUTHORIZED", "Seed token invalid sau lipsă.", 401);
  if (getDataProviderMode() !== "prisma") return jsonError("BAD_REQUEST", "Seed-ul DB real cere SERVELECT_DATA_PROVIDER=prisma și DATABASE_URL.", 400);

  const prisma = await getPrisma();

  const workspace = await prisma.workspace.upsert({
    where: { tenantSlug: "servelect" },
    update: { name: "SERVELECT EMP" },
    create: { id: "workspace-servelect-main", name: "SERVELECT EMP", tenantSlug: "servelect" }
  });

  const userMap = new Map<string, string>();
  for (const user of users) {
    const row = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role === "Vânzări" ? "Vanzari" : user.role,
        title: user.title,
        team: user.team,
        avatar: user.avatar,
        workload: user.workload,
        online: user.online
      },
      create: {
        id: user.id,
        workspaceId: workspace.id,
        name: user.name,
        email: user.email,
        role: user.role === "Vânzări" ? "Vanzari" : user.role,
        title: user.title,
        team: user.team,
        avatar: user.avatar,
        workload: user.workload,
        online: user.online
      }
    });
    userMap.set(user.id, row.id);
  }

  const projectMap = new Map<string, string>();
  for (const project of projects) {
    const client = await prisma.client.upsert({
      where: { id: project.clientId },
      update: { name: project.clientName, location: project.location },
      create: { id: project.clientId, name: project.clientName, location: project.location }
    });

    const row = await prisma.project.upsert({
      where: { code: project.code },
      update: {
        name: project.name,
        clientId: client.id,
        clientName: project.clientName,
        location: project.location,
        powerKwp: project.powerKwp,
        phase: projectPhaseToDb[String(project.phase)] ?? "Planificat",
        progress: project.progress,
        health: healthToDb[String(project.health)] ?? "Bun",
        ownerId: userMap.get(project.ownerId) ?? undefined,
        deadline: toDateInput(project.deadline),
        budgetRon: project.budgetRon,
        workedHours: project.workedHours
      },
      create: {
        id: project.id,
        workspaceId: workspace.id,
        clientId: client.id,
        code: project.code,
        name: project.name,
        clientName: project.clientName,
        location: project.location,
        powerKwp: project.powerKwp,
        phase: projectPhaseToDb[String(project.phase)] ?? "Planificat",
        progress: project.progress,
        health: healthToDb[String(project.health)] ?? "Bun",
        ownerId: userMap.get(project.ownerId) ?? undefined,
        deadline: toDateInput(project.deadline),
        budgetRon: project.budgetRon,
        workedHours: project.workedHours
      }
    });

    projectMap.set(project.id, row.id);
  }

  let taskCount = 0;
  for (const task of tasks) {
    const projectId = projectMap.get(task.projectId) ?? projectMap.values().next().value;
    if (!projectId) continue;
    await prisma.task.upsert({
      where: { id: task.id },
      update: {
        title: task.title,
        description: task.description,
        projectId,
        status: taskStatusToDb[task.status],
        priority: priorityToDb[task.priority],
        assigneeId: userMap.get(task.assigneeId) ?? undefined,
        ownerId: userMap.get(task.ownerId) ?? undefined,
        startDate: toDateInput(task.startDate),
        dueDate: toDateInput(task.dueDate),
        estimateHours: task.estimateHours,
        trackedHours: task.trackedHours,
        tags: task.tags,
        dependencies: task.dependencies
      },
      create: {
        id: task.id,
        title: task.title,
        description: task.description,
        projectId,
        status: taskStatusToDb[task.status],
        priority: priorityToDb[task.priority],
        assigneeId: userMap.get(task.assigneeId) ?? undefined,
        ownerId: userMap.get(task.ownerId) ?? undefined,
        startDate: toDateInput(task.startDate),
        dueDate: toDateInput(task.dueDate),
        estimateHours: task.estimateHours,
        trackedHours: task.trackedHours,
        tags: task.tags,
        dependencies: task.dependencies
      }
    });
    taskCount += 1;
  }

  return jsonOk({ workspace: workspace.tenantSlug, users: userMap.size, projects: projectMap.size, tasks: taskCount });
}
