import { repository } from "@/lib/backend/repository";
import { jsonError, jsonOk, readJson } from "@/lib/backend/http";
import { getSessionFromRequest, hasPermission } from "@/lib/backend/rbac";
import { writeAuditEvent } from "@/lib/backend/audit";
import type { CreateTaskFromAlertInput } from "@/lib/backend/api-types";

type RouteContext = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function POST(request: Request, context: RouteContext) {
  const session = getSessionFromRequest(request);
  if (!hasPermission(session, "maintenance:write")) return jsonError("FORBIDDEN", "Nu ai permisiune pentru creare ticket/task din alertă.", 403);

  const { id } = await context.params;
  const body = (await readJson<CreateTaskFromAlertInput>(request)) ?? {};
  const result = repository.createTaskFromAlert(id, body);
  if (!result) return jsonError("NOT_FOUND", "Alerta IoT nu a fost găsită.", 404);

  writeAuditEvent(session, {
    action: "a generat task din alertă IoT",
    target: result.alert.title,
    entityType: "alert",
    entityId: result.alert.id,
    metadata: { taskId: result.task.id, projectId: result.alert.projectId }
  });

  return jsonOk(result, { status: 201 });
}
