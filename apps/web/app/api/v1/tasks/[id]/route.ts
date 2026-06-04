import { repository } from "@/lib/backend/repository";
import { jsonError, jsonOk, readJson } from "@/lib/backend/http";
import { getSessionFromRequest, hasPermission } from "@/lib/backend/rbac";
import { writeAuditEvent } from "@/lib/backend/audit";
import type { TaskUpdateInput } from "@/lib/backend/api-types";

type RouteContext = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const task = repository.getTask(id);
  if (!task) return jsonError("NOT_FOUND", "Taskul nu a fost găsit.", 404);
  return jsonOk(task);
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = getSessionFromRequest(request);
  if (!hasPermission(session, "task:write")) return jsonError("FORBIDDEN", "Nu ai permisiune pentru editare task.", 403);

  const { id } = await context.params;
  const body = await readJson<TaskUpdateInput>(request);
  if (!body) return jsonError("BAD_REQUEST", "Payload invalid.", 400);

  const task = repository.updateTask(id, body);
  if (!task) return jsonError("NOT_FOUND", "Taskul nu a fost găsit.", 404);

  writeAuditEvent(session, {
    action: "a actualizat taskul",
    target: task.title,
    entityType: "task",
    entityId: task.id,
    metadata: body
  });

  return jsonOk(task);
}

export async function DELETE(request: Request, context: RouteContext) {
  const session = getSessionFromRequest(request);
  if (!hasPermission(session, "task:write")) return jsonError("FORBIDDEN", "Nu ai permisiune pentru ștergere task.", 403);

  const { id } = await context.params;
  const deleted = repository.deleteTask(id);
  if (!deleted) return jsonError("NOT_FOUND", "Taskul nu a fost găsit.", 404);

  writeAuditEvent(session, {
    action: "a șters taskul",
    target: id,
    entityType: "task",
    entityId: id
  });

  return jsonOk({ deleted: true });
}
