import type { Role } from "@servelect/shared";
import { findAuthUserByEmail, getAuthUsers, toPublicAuthUser } from "@/lib/auth/demo-users";
import { getPermissionsForRole, normalizeRole } from "@/lib/auth/permissions";
import { requireApiPermission } from "@/lib/auth/guard";
import { jsonError, jsonOk, readJson } from "@/lib/backend/http";

export const dynamic = "force-dynamic";

type UserRouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: UserRouteParams) {
  const { id } = await params;
  const user = getAuthUsers().find((item) => item.id === id || item.email === id);

  if (!user) return jsonError("NOT_FOUND", "Utilizatorul nu există în lista demo.", 404);

  return jsonOk({
    ...toPublicAuthUser(user),
    permissions: getPermissionsForRole(user.role)
  });
}

export async function PATCH(request: Request, { params }: UserRouteParams) {
  const auth = requireApiPermission(request, "admin:manage");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await readJson<Partial<{ role: Role; title: string; team: string; workload: number; online: boolean }>>(request);
  const user = getAuthUsers().find((item) => item.id === id || item.email === id);

  if (!user) return jsonError("NOT_FOUND", "Utilizatorul nu există în lista demo.", 404);

  const nextRole = body?.role ? normalizeRole(body.role) : user.role;
  const updated = {
    ...user,
    role: nextRole,
    title: body?.title ?? user.title,
    team: body?.team ?? user.team,
    workload: typeof body?.workload === "number" ? Math.max(0, Math.min(160, body.workload)) : user.workload,
    online: typeof body?.online === "boolean" ? body.online : user.online,
    permissions: getPermissionsForRole(nextRole)
  };

  return jsonOk({
    user: toPublicAuthUser(updated),
    permissions: updated.permissions,
    persisted: false,
    note: "v0.7 folosește încă demo users. Persistarea reală se face în v0.8/v0.9 după activarea completă DB/Auth."
  });
}
