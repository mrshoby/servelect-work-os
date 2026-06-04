import { repository } from "@/lib/backend/repository";
import { getPagination, jsonError, jsonList, jsonOk, paginate, readJson } from "@/lib/backend/http";
import { getSessionFromRequest, hasPermission } from "@/lib/backend/rbac";
import { writeAuditEvent } from "@/lib/backend/audit";
import type { TaskCreateInput } from "@/lib/backend/api-types";
import type { TaskStatus } from "@servelect/shared";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { limit, offset } = getPagination(searchParams);
  const items = repository.listTasks(
    searchParams.get("q") ?? undefined,
    (searchParams.get("status") as TaskStatus | null) ?? undefined,
    searchParams.get("projectId") ?? undefined
  );
  return jsonList(paginate(items, limit, offset), { total: items.length, limit, offset });
}

export async function POST(request: Request) {
  const session = getSessionFromRequest(request);
  if (!hasPermission(session, "task:write")) return jsonError("FORBIDDEN", "Nu ai permisiune pentru creare task.", 403);

  const body = await readJson<TaskCreateInput>(request);
  if (!body?.title) return jsonError("BAD_REQUEST", "Câmpul title este obligatoriu.", 400);

  const task = repository.createTask(body);
  writeAuditEvent(session, {
    action: "a creat taskul",
    target: task.title,
    entityType: "task",
    entityId: task.id,
    metadata: { projectCode: task.projectCode, priority: task.priority }
  });

  return jsonOk(task, { status: 201 });
}
