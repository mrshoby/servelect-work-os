import { repository } from "@/lib/backend/repository";
import { jsonError, jsonOk, readJson } from "@/lib/backend/http";
import { getSessionFromRequest, hasPermission } from "@/lib/backend/rbac";
import { writeAuditEvent } from "@/lib/backend/audit";
import type { ProjectUpdateInput } from "@/lib/backend/api-types";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const project = await repository.getProject(id);
  if (!project) return jsonError("NOT_FOUND", "Proiectul nu a fost găsit.", 404);
  return jsonOk(project);
}

export async function PATCH(request: Request, { params }: Params) {
  const session = getSessionFromRequest(request);
  if (!hasPermission(session, "project:write")) return jsonError("FORBIDDEN", "Nu ai permisiune pentru editare proiect.", 403);

  const { id } = await params;
  const body = await readJson<ProjectUpdateInput>(request);
  if (!body) return jsonError("BAD_REQUEST", "Body JSON invalid.", 400);

  const project = await repository.updateProject(id, body);
  if (!project) return jsonError("NOT_FOUND", "Proiectul nu a fost găsit.", 404);

  writeAuditEvent(session, { action: "a actualizat proiectul", target: project.code, entityType: "project", entityId: project.id });
  return jsonOk(project);
}

export async function DELETE(request: Request, { params }: Params) {
  const session = getSessionFromRequest(request);
  if (!hasPermission(session, "project:delete")) return jsonError("FORBIDDEN", "Nu ai permisiune pentru ștergere proiect.", 403);

  const { id } = await params;
  const deleted = await repository.deleteProject(id);
  if (!deleted) return jsonError("NOT_FOUND", "Proiectul nu a fost găsit.", 404);
  writeAuditEvent(session, { action: "a șters proiectul", target: id, entityType: "project", entityId: id });
  return jsonOk({ deleted: true });
}
