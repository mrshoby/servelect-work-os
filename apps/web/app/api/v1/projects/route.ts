import { repository } from "@/lib/backend/repository";
import { getPagination, jsonError, jsonList, jsonOk, paginate, readJson } from "@/lib/backend/http";
import { getSessionFromRequest, hasPermission } from "@/lib/backend/rbac";
import { writeAuditEvent } from "@/lib/backend/audit";
import type { ProjectCreateInput } from "@/lib/backend/api-types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { limit, offset } = getPagination(searchParams);
  const items = repository.listProjects(searchParams.get("q") ?? undefined);
  return jsonList(paginate(items, limit, offset), { total: items.length, limit, offset });
}

export async function POST(request: Request) {
  const session = getSessionFromRequest(request);
  if (!hasPermission(session, "project:write")) return jsonError("FORBIDDEN", "Nu ai permisiune pentru creare proiect.", 403);

  const body = await readJson<ProjectCreateInput>(request);
  if (!body?.name || !body.clientName || !body.location) {
    return jsonError("BAD_REQUEST", "Câmpurile name, clientName și location sunt obligatorii.", 400);
  }

  const project = repository.createProject(body);
  writeAuditEvent(session, {
    action: "a creat proiectul",
    target: project.code,
    entityType: "project",
    entityId: project.id,
    metadata: { clientName: project.clientName, location: project.location }
  });

  return jsonOk(project, { status: 201 });
}
