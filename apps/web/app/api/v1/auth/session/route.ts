import { jsonOk } from "@/lib/backend/http";
import { getAuthSessionFromRequest, isAuthRequired } from "@/lib/auth/session";
import { toPublicAuthUser } from "@/lib/auth/demo-users";

export async function GET(request: Request) {
  const session = getAuthSessionFromRequest(request);

  return jsonOk({
    user: toPublicAuthUser(session.user),
    role: session.role,
    permissions: session.permissions,
    isAuthenticated: session.isAuthenticated,
    authMode: session.authMode,
    requireAuth: isAuthRequired()
  });
}
