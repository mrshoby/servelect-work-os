import { workflowTemplates, type WorkflowTemplate } from "@/lib/workflows/templates";

export type WorkflowExecutionStatus = "success" | "queued" | "failed";

export type WorkflowExecution = {
  id: string;
  templateId: string;
  templateName: string;
  category: string;
  status: WorkflowExecutionStatus;
  createdAt: string;
  actor: string;
  entityType: "task" | "approval" | "ticket" | "notification" | "workflow";
  entityId?: string;
  projectCode?: string;
  message: string;
};

const workflowExecutions: WorkflowExecution[] = [
  {
    id: "wex-001",
    templateId: "iot-inverter-offline-task",
    templateName: "Invertor offline → task mentenanță",
    category: "IoT",
    status: "success",
    createdAt: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
    actor: "Sistem IoT",
    entityType: "task",
    entityId: "t10",
    projectCode: "P-2024-0142",
    message: "Task critic creat pentru verificare randament scăzut."
  },
  {
    id: "wex-002",
    templateId: "crm-offer-approval",
    templateName: "Ofertă emisă → aprobare manager",
    category: "CRM",
    status: "success",
    createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    actor: "Ioana Marinescu",
    entityType: "approval",
    projectCode: "P-2024-0098",
    message: "Aprobare ofertă comercială trimisă către manager."
  },
  {
    id: "wex-003",
    templateId: "maintenance-sla-risk",
    templateName: "SLA în risc → escaladare",
    category: "Mentenanță",
    status: "queued",
    createdAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    actor: "Dispatch",
    entityType: "notification",
    message: "Escaladare pregătită pentru ticket cu SLA apropiat."
  }
];

export function listWorkflowExecutions(limit = 50) {
  return workflowExecutions.slice(0, limit);
}

export function createWorkflowExecution(input: {
  template: WorkflowTemplate;
  actor: string;
  entityType?: WorkflowExecution["entityType"];
  entityId?: string;
  projectCode?: string;
  message?: string;
  status?: WorkflowExecutionStatus;
}) {
  const execution: WorkflowExecution = {
    id: `wex-${crypto.randomUUID()}`,
    templateId: input.template.id,
    templateName: input.template.name,
    category: input.template.category,
    status: input.status ?? "success",
    createdAt: new Date().toISOString(),
    actor: input.actor,
    entityType: input.entityType ?? "workflow",
    entityId: input.entityId,
    projectCode: input.projectCode,
    message: input.message ?? `Workflow ${input.template.name} rulat cu succes.`
  };

  workflowExecutions.unshift(execution);
  if (workflowExecutions.length > 200) workflowExecutions.length = 200;
  return execution;
}

export function getWorkflowExecutionSummary() {
  const executions = listWorkflowExecutions(200);
  return {
    total: executions.length,
    success: executions.filter((item) => item.status === "success").length,
    queued: executions.filter((item) => item.status === "queued").length,
    failed: executions.filter((item) => item.status === "failed").length,
    templates: workflowTemplates.length
  };
}
