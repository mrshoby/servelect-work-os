import { repository } from "@/lib/backend/repository";
import { jsonError, jsonOk, readJson } from "@/lib/backend/http";
import { getSessionFromRequest, hasPermission } from "@/lib/backend/rbac";
import { writeAuditEvent } from "@/lib/backend/audit";
import type { CreateTaskFromAlertInput } from "@/lib/backend/api-types";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const session = getSessionFromRequest(request);
  if (!hasPermission(session, "maintenance:write") && !hasPermission(session, "task:write")) {
    return jsonError("FORBIDDEN", "Nu ai permisiune pentru creare task din alertă IoT.", 403);
  }

  const { id } = await params;
  const body = (await readJson<CreateTaskFromAlertInput>(request)) ?? {};
  const result = await repository.createTaskFromAlert(id, body);
  if (!result) return jsonError("NOT_FOUND", "Alerta IoT nu a fost găsită.", 404);

  writeAuditEvent(session, {
    action: "a creat task din alertă IoT",
    target: result.task.title,
    entityType: "alert",
    entityId: result.alert.id,
    metadata: { taskId: result.task.id }
  });

  return jsonOk(result, { status: 201 });
}
