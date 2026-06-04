import { repository } from "@/lib/backend/repository";
import { jsonError, jsonOk, readJson } from "@/lib/backend/http";
import { getSessionFromRequest, hasPermission } from "@/lib/backend/rbac";
import { writeAuditEvent } from "@/lib/backend/audit";
import type { ProjectUpdateInput } from "@/lib/backend/api-types";

type RouteContext = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const project = repository.getProject(id);
  if (!project) return jsonError("NOT_FOUND", "Proiectul nu a fost găsit.", 404);
  return jsonOk(project);
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = getSessionFromRequest(request);
  if (!hasPermission(session, "project:write")) return jsonError("FORBIDDEN", "Nu ai permisiune pentru editare proiect.", 403);

  const { id } = await context.params;
  const body = await readJson<ProjectUpdateInput>(request);
  if (!body) return jsonError("BAD_REQUEST", "Payload invalid.", 400);

  const project = repository.updateProject(id, body);
  if (!project) return jsonError("NOT_FOUND", "Proiectul nu a fost găsit.", 404);

  writeAuditEvent(session, {
    action: "a actualizat proiectul",
    target: project.code,
    entityType: "project",
    entityId: project.id,
    metadata: body
  });

  return jsonOk(project);
}

export async function DELETE(request: Request, context: RouteContext) {
  const session = getSessionFromRequest(request);
  if (!hasPermission(session, "project:delete")) return jsonError("FORBIDDEN", "Nu ai permisiune pentru ștergere proiect.", 403);

  const { id } = await context.params;
  const deleted = repository.deleteProject(id);
  if (!deleted) return jsonError("NOT_FOUND", "Proiectul nu a fost găsit.", 404);

  writeAuditEvent(session, {
    action: "a șters proiectul",
    target: id,
    entityType: "project",
    entityId: id
  });

  return jsonOk({ deleted: true });
}
