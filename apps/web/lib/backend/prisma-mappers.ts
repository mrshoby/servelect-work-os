import type { ActivityLog, Project, Task, Priority, TaskStatus } from "@servelect/shared";

export const taskStatusToDb: Record<TaskStatus, string> = {
  Backlog: "Backlog",
  "De făcut": "De_facut",
  "În lucru": "In_lucru",
  "Review / QA": "Review_QA",
  Blocat: "Blocat",
  Finalizat: "Finalizat",
  Anulat: "Anulat"
};

export const taskStatusFromDb: Record<string, TaskStatus> = {
  Backlog: "Backlog",
  De_facut: "De făcut",
  In_lucru: "În lucru",
  Review_QA: "Review / QA",
  Blocat: "Blocat",
  Finalizat: "Finalizat",
  Anulat: "Anulat"
};

export const priorityToDb: Record<Priority, string> = {
  Scăzut: "Scazut",
  Mediu: "Mediu",
  Ridicat: "Ridicat",
  Urgent: "Urgent",
  Critic: "Critic"
};

export const priorityFromDb: Record<string, Priority> = {
  Scazut: "Scăzut",
  Mediu: "Mediu",
  Ridicat: "Ridicat",
  Urgent: "Urgent",
  Critic: "Critic"
};

export const projectPhaseToDb: Record<string, string> = {
  Planificat: "Planificat",
  Proiectare: "Proiectare",
  Avizare: "Avizare",
  Montaj: "Montaj",
  Testare: "Testare",
  PIF: "PIF",
  "În desfășurare": "In_desfasurare",
  Finalizat: "Finalizat",
  Blocat: "Blocat"
};

export const projectPhaseFromDb: Record<string, string> = {
  Planificat: "Planificat",
  Proiectare: "Proiectare",
  Avizare: "Avizare",
  Montaj: "Montaj",
  Testare: "Testare",
  PIF: "PIF",
  In_desfasurare: "În desfășurare",
  Finalizat: "Finalizat",
  Blocat: "Blocat"
};

export const healthToDb: Record<string, string> = {
  Bun: "Bun",
  Atenție: "Atentie",
  Risc: "Risc",
  Critic: "Critic"
};

export const healthFromDb: Record<string, string> = {
  Bun: "Bun",
  Atentie: "Atenție",
  Risc: "Risc",
  Critic: "Critic"
};

export function toDateInput(value?: string | null) {
  return value ? new Date(value) : undefined;
}

export function toIsoDate(value?: Date | string | null) {
  if (!value) return new Date().toISOString().slice(0, 10);
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toISOString().slice(0, 10);
}

export function mapProjectFromPrisma(row: any): Project {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    clientId: row.clientId ?? row.client?.id ?? `client-${row.id}`,
    clientName: row.clientName ?? row.client?.name ?? "Client necunoscut",
    location: row.location ?? "—",
    powerKwp: Number(row.powerKwp ?? 0),
    phase: projectPhaseFromDb[String(row.phase)] ?? String(row.phase ?? "Planificat"),
    progress: Number(row.progress ?? 0),
    health: (healthFromDb[String(row.health)] ?? String(row.health ?? "Bun")) as Project["health"],
    ownerId: row.ownerId ?? row.owner?.id ?? "u1",
    ownerName: row.owner?.name ?? "Andrei Popescu",
    deadline: toIsoDate(row.deadline),
    budgetRon: Number(row.budgetRon ?? 0),
    workedHours: Number(row.workedHours ?? 0),
    risks: Array.isArray(row.riskRegister) ? row.riskRegister.length : Number(row.risks ?? 0),
    documents: Array.isArray(row.documents) ? row.documents.length : Number(row.documentsCount ?? row.documents ?? 0)
  };
}

export function mapTaskFromPrisma(row: any): Task {
  const activityLog: ActivityLog[] = (row.activityLog ?? row.auditEvents ?? []).map((event: any) => ({
    id: event.id,
    userId: event.userId ?? "system",
    userName: event.user?.name ?? event.userName ?? "SERVELECT API",
    action: event.action ?? "a actualizat taskul",
    target: event.target ?? row.title,
    createdAt: event.createdAt instanceof Date ? event.createdAt.toISOString() : event.createdAt ?? new Date().toISOString()
  }));

  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    projectId: row.projectId,
    projectCode: row.project?.code ?? row.projectCode ?? "P-0000",
    projectName: row.project?.name ?? row.projectName ?? "Proiect",
    parentTaskId: row.parentTaskId ?? undefined,
    status: taskStatusFromDb[String(row.status)] ?? "De făcut",
    priority: priorityFromDb[String(row.priority)] ?? "Mediu",
    assigneeId: row.assigneeId ?? row.assignee?.id ?? "u1",
    assigneeName: row.assignee?.name ?? "Andrei Popescu",
    ownerId: row.ownerId ?? row.owner?.id ?? "u1",
    startDate: toIsoDate(row.startDate),
    dueDate: toIsoDate(row.dueDate),
    estimateHours: Number(row.estimateHours ?? 0),
    trackedHours: Number(row.trackedHours ?? 0),
    tags: row.tags ?? [],
    dependencies: row.dependencies ?? [],
    customFields: row.customFields ?? {},
    subtasks: Array.isArray(row.subtasks) ? row.subtasks.map(mapTaskFromPrisma) : [],
    comments: (row.comments ?? []).map((comment: any) => ({
      id: comment.id,
      userId: comment.authorId,
      userName: comment.author?.name ?? "Utilizator",
      body: comment.body,
      createdAt: comment.createdAt instanceof Date ? comment.createdAt.toISOString() : comment.createdAt
    })),
    attachments: (row.attachments ?? []).map((doc: any) => ({
      id: doc.id,
      name: doc.name,
      type: doc.type,
      size: doc.size ?? "—",
      url: doc.url ?? "#",
      uploadedBy: doc.uploadedBy ?? "SERVELECT",
      createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt
    })),
    activityLog
  };
}
