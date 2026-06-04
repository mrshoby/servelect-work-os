import { repository } from "@/lib/backend/repository";
import { jsonError, jsonOk, readJson } from "@/lib/backend/http";
import { getSessionFromRequest, hasPermission } from "@/lib/backend/rbac";
import { writeAuditEvent } from "@/lib/backend/audit";
import type { TaskUpdateInput } from "@/lib/backend/api-types";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const task = await repository.getTask(id);
  if (!task) return jsonError("NOT_FOUND", "Taskul nu a fost găsit.", 404);
  return jsonOk(task);
}

export async function PATCH(request: Request, { params }: Params) {
  const session = getSessionFromRequest(request);
  if (!hasPermission(session, "task:write")) return jsonError("FORBIDDEN", "Nu ai permisiune pentru editare task.", 403);

  const { id } = await params;
  const body = await readJson<TaskUpdateInput>(request);
  if (!body) return jsonError("BAD_REQUEST", "Body JSON invalid.", 400);

  const task = await repository.updateTask(id, body);
  if (!task) return jsonError("NOT_FOUND", "Taskul nu a fost găsit.", 404);

  writeAuditEvent(session, { action: "a actualizat taskul", target: task.title, entityType: "task", entityId: task.id, metadata: { status: task.status } });
  return jsonOk(task);
}

export async function DELETE(request: Request, { params }: Params) {
  const session = getSessionFromRequest(request);
  if (!hasPermission(session, "task:write")) return jsonError("FORBIDDEN", "Nu ai permisiune pentru ștergere task.", 403);

  const { id } = await params;
  const deleted = await repository.deleteTask(id);
  if (!deleted) return jsonError("NOT_FOUND", "Taskul nu a fost găsit.", 404);
  writeAuditEvent(session, { action: "a șters taskul", target: id, entityType: "task", entityId: id });
  return jsonOk({ deleted: true });
}
