import { repository } from "@/lib/backend/repository";
import { writeAuditEvent } from "@/lib/backend/audit";
import { jsonError, jsonOk, readJson } from "@/lib/backend/http";
import { getSessionFromRequest, hasPermission } from "@/lib/backend/rbac";
import { getWorkflowTemplate } from "@/lib/workflows/templates";
import { createWorkflowExecution } from "@/lib/workflows/executions";

export const dynamic = "force-dynamic";

type RunWorkflowBody = {
  templateId?: string;
  projectId?: string;
  projectCode?: string;
  projectName?: string;
  assigneeId?: string;
  assigneeName?: string;
};

export async function POST(request: Request) {
  const session = getSessionFromRequest(request);
  const body = await readJson<RunWorkflowBody>(request);
  const templateId = String(body?.templateId ?? "");
  const template = getWorkflowTemplate(templateId);

  if (!template) return jsonError("NOT_FOUND", "Workflow template inexistent.", 404);
  if (!hasPermission(session, template.requiredPermission)) {
    return jsonError("FORBIDDEN", `Nu ai permisiunea ${template.requiredPermission} pentru acest workflow.`, 403);
  }

  const task = await Promise.resolve(repository.createTask({
    title: template.defaultTask.title,
    description: `${template.description}\n\nWorkflow v0.9: ${template.name}\nTrigger: ${template.trigger}`,
    projectId: body?.projectId,
    projectCode: body?.projectCode,
    projectName: body?.projectName,
    status: template.defaultTask.status,
    priority: template.defaultTask.priority,
    assigneeId: body?.assigneeId ?? session.user.id,
    assigneeName: body?.assigneeName ?? session.user.name,
    ownerId: session.user.id,
    estimateHours: template.defaultTask.estimateHours,
    tags: template.defaultTask.tags
  }));

  const execution = createWorkflowExecution({
    template,
    actor: session.user.name,
    entityType: "task",
    entityId: task.id,
    projectCode: body?.projectCode ?? task.projectCode,
    message: `Workflow rulat: task ${task.title} creat pentru ${body?.projectCode ?? task.projectCode ?? "proiect"}.`
  });

  const auditEvent = writeAuditEvent(session, {
    action: "a rulat workflow-ul",
    target: template.name,
    entityType: "task",
    entityId: task.id,
    metadata: { templateId: template.id, category: template.category, executionId: execution.id, version: "0.9.0" }
  });

  return jsonOk({
    workflow: template,
    execution,
    auditEvent,
    task,
    persisted: true,
    note: "Taskul a fost creat prin repository layer. Jurnalul de execuție și auditul sunt disponibile în v0.9. În mock rămân în memoria serverului; în Prisma se vor salva în DB."
  }, { status: 201 });
}
