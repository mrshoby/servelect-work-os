import type { Permission } from "@servelect/shared";
import { jsonError } from "@/lib/backend/http";
import { getAuthSessionFromRequest, isAuthRequired, type ServelectAuthSession } from "./session";

export type AuthGuardResult =
  | { ok: true; session: ServelectAuthSession }
  | { ok: false; response: ReturnType<typeof jsonError> };

export function requireApiSession(request: Request): AuthGuardResult {
  const session = getAuthSessionFromRequest(request);

  if (isAuthRequired() && !session.isAuthenticated) {
    return {
      ok: false,
      response: jsonError("UNAUTHORIZED", "Autentificare necesară pentru această acțiune.", 401)
    };
  }

  return { ok: true, session };
}

export function sessionCan(session: ServelectAuthSession, permission: Permission | string): boolean {
  const permissions = session.permissions as string[];
  return permissions.includes("admin:manage") || permissions.includes(String(permission));
}

export function requireApiPermission(request: Request, permission: Permission): AuthGuardResult {
  const result = requireApiSession(request);
  if (!result.ok) return result;

  if (!sessionCan(result.session, permission)) {
    return {
      ok: false,
      response: jsonError("FORBIDDEN", `Rolul ${result.session.role} nu are permisiunea ${permission}.`, 403)
    };
  }

  return result;
}
