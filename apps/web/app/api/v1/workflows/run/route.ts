import { repository } from "@/lib/backend/repository";
import { writeAuditEvent } from "@/lib/backend/audit";
import { jsonError, jsonOk, readJson } from "@/lib/backend/http";
import { getSessionFromRequest, hasPermission } from "@/lib/backend/rbac";
import { getWorkflowTemplate } from "@/lib/workflows/templates";

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

  const task = await repository.createTask({
    title: template.defaultTask.title,
    description: `${template.description}\n\nWorkflow v0.8: ${template.name}\nTrigger: ${template.trigger}`,
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
  });

  writeAuditEvent(session, {
    action: "a rulat workflow-ul",
    target: template.name,
    entityType: "task",
    entityId: task.id,
    metadata: { templateId: template.id, category: template.category }
  });

  return jsonOk({
    workflow: template,
    task,
    persisted: true,
    note: "Taskul a fost creat prin repository layer. În mock rămâne în memoria serverului; în prisma se salvează în DB."
  }, { status: 201 });
}
