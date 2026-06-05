import type { Permission } from "@servelect/shared";
import { getAuthSessionFromRequest } from "@/lib/auth/session";
import { sessionCan } from "@/lib/auth/guard";
import { jsonError, jsonOk, readJson } from "@/lib/backend/http";

export async function POST(request: Request) {
  const body = await readJson<{ permission?: Permission | string }>(request);
  const permission = String(body?.permission ?? "").trim();

  if (!permission) {
    return jsonError("VALIDATION_ERROR", "Permisiunea este obligatorie.", 422);
  }

  const session = getAuthSessionFromRequest(request);
  const allowed = sessionCan(session, permission);

  return jsonOk({
    allowed,
    permission,
    role: session.role,
    isAuthenticated: session.isAuthenticated,
    authMode: session.authMode,
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role
    }
  });
}
