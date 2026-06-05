import { approvals, fundingCases, iotAlerts, maintenanceTickets, projects, tasks } from "@servelect/shared";

export type ActionCenterSource = "Task" | "IoT" | "Aprobare" | "Mentenanță" | "Finanțări" | "Proiect";
export type ActionCenterUrgency = "low" | "medium" | "high" | "critical";
export type ActionCenterStatus = "nou" | "în lucru" | "în așteptare" | "gata";

export type ActionCenterItem = {
  id: string;
  title: string;
  description: string;
  source: ActionCenterSource;
  urgency: ActionCenterUrgency;
  status: ActionCenterStatus;
  owner: string;
  route: string;
  dueLabel: string;
  entityId?: string;
  projectCode?: string;
  recommendedNextStep: string;
};

function urgencyRank(urgency: ActionCenterUrgency) {
  return { critical: 4, high: 3, medium: 2, low: 1 }[urgency];
}

function taskUrgency(priority: string, status: string): ActionCenterUrgency {
  if (priority === "Critic" || status === "Blocat") return "critical";
  if (priority === "Urgent") return "high";
  if (priority === "Ridicat") return "medium";
  return "low";
}

export function getActionCenterItems(): ActionCenterItem[] {
  const taskItems: ActionCenterItem[] = tasks
    .filter((task) => ["Blocat", "De făcut", "În lucru", "Review / QA"].includes(task.status))
    .slice(0, 8)
    .map((task) => ({
      id: `act-task-${task.id}`,
      title: task.title,
      description: `${task.projectCode} · ${task.projectName}`,
      source: "Task",
      urgency: taskUrgency(task.priority, task.status),
      status: task.status === "În lucru" ? "în lucru" : task.status === "Review / QA" ? "în așteptare" : "nou",
      owner: task.assigneeName,
      route: "/taskuri",
      dueLabel: task.dueDate,
      entityId: task.id,
      projectCode: task.projectCode,
      recommendedNextStep: task.status === "Blocat" ? "Deblochează dependența și notifică owner-ul." : "Actualizează statusul sau pornește timerul."
    }));

  const iotItems: ActionCenterItem[] = iotAlerts.slice(0, 5).map((alert) => ({
    id: `act-iot-${alert.id}`,
    title: alert.title,
    description: alert.recommendedAction,
    source: "IoT",
    urgency: alert.severity === "Critică" ? "critical" : alert.severity === "Atenționare" ? "high" : "medium",
    status: alert.status === "În lucru" ? "în lucru" : alert.status === "Închis" ? "gata" : "nou",
    owner: "Operațiuni",
    route: "/iot",
    dueLabel: "SLA azi",
    entityId: alert.id,
    recommendedNextStep: "Generează task/ticket și alocă tehnicianul disponibil."
  }));

  const approvalItems: ActionCenterItem[] = approvals.slice(0, 5).map((approval) => ({
    id: `act-approval-${approval.id}`,
    title: approval.title,
    description: `Aprobare ${approval.status}`,
    source: "Aprobare",
    urgency: approval.priority === "Critic" ? "critical" : approval.priority === "Urgent" ? "high" : "medium",
    status: approval.status === "Aprobat" ? "gata" : approval.status === "În așteptare" ? "în așteptare" : "nou",
    owner: approval.ownerId,
    route: "/hr-admin",
    dueLabel: approval.dueDate,
    entityId: approval.id,
    recommendedNextStep: "Revizuiește cererea și aprobă/respinge cu motiv."
  }));

  const maintenanceItems: ActionCenterItem[] = maintenanceTickets.slice(0, 5).map((ticket) => ({
    id: `act-maintenance-${ticket.id}`,
    title: ticket.title,
    description: `Ticket ${ticket.status} · severitate ${ticket.severity}`,
    source: "Mentenanță",
    urgency: ticket.severity === "Critic" ? "critical" : ticket.severity === "Ridicat" ? "high" : "medium",
    status: ticket.status === "Închis" ? "gata" : ticket.status === "În lucru" ? "în lucru" : "nou",
    owner: ticket.assigneeId ?? "Nealocat",
    route: "/mentenanta",
    dueLabel: ticket.slaDueAt,
    entityId: ticket.id,
    recommendedNextStep: ticket.assigneeId ? "Confirmă ETA și actualizează checklist-ul intervenției." : "Alocă cel mai apropiat tehnician."
  }));

  const fundingItems: ActionCenterItem[] = fundingCases.slice(0, 4).map((funding) => ({
    id: `act-funding-${funding.id}`,
    title: `${funding.program} · ${funding.stage}`,
    description: `Valoare eligibilă ${Math.round(funding.valueRon).toLocaleString("ro-RO")} RON`,
    source: "Finanțări",
    urgency: funding.progress < 40 ? "high" : "medium",
    status: funding.progress >= 90 ? "gata" : "în lucru",
    owner: funding.ownerId,
    route: "/finantari-esg",
    dueLabel: funding.deadline,
    entityId: funding.id,
    recommendedNextStep: "Verifică anexele lipsă și creează taskuri pentru owneri."
  }));

  const projectItems: ActionCenterItem[] = projects
    .filter((project) => project.health === "Risc" || project.health === "Critic" || project.risks > 2)
    .map((project) => ({
      id: `act-project-${project.id}`,
      title: `${project.code} · ${project.name}`,
      description: `${project.clientName} · ${project.risks} riscuri deschise`,
      source: "Proiect",
      urgency: project.health === "Critic" ? "critical" : "high",
      status: "în lucru",
      owner: project.ownerName,
      route: "/proiecte",
      dueLabel: project.deadline,
      entityId: project.id,
      projectCode: project.code,
      recommendedNextStep: "Deschide risk register și stabilește owner pentru fiecare risc."
    }));

  return [...iotItems, ...taskItems, ...approvalItems, ...maintenanceItems, ...fundingItems, ...projectItems]
    .sort((a, b) => urgencyRank(b.urgency) - urgencyRank(a.urgency))
    .slice(0, 30);
}

export function getActionCenterSummary() {
  const items = getActionCenterItems();
  return {
    total: items.length,
    critical: items.filter((item) => item.urgency === "critical").length,
    high: items.filter((item) => item.urgency === "high").length,
    waiting: items.filter((item) => item.status === "în așteptare").length,
    bySource: items.reduce<Record<string, number>>((acc, item) => {
      acc[item.source] = (acc[item.source] ?? 0) + 1;
      return acc;
    }, {})
  };
}
