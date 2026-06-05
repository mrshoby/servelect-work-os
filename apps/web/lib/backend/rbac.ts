import type { Permission, Role, User } from "@servelect/shared";
import { users } from "@servelect/shared";
import { getAuthSessionFromRequest, isAuthRequired } from "@/lib/auth/session";
import { getPermissionsForRole } from "@/lib/auth/permissions";

export type RequestSession = {
  user: User;
  permissions: Permission[];
  isAuthenticated: boolean;
  authMode: "demo" | "cookie" | "header";
};

export function getSessionFromRequest(request: Request): RequestSession {
  const email = request.headers.get("x-servelect-user-email");
  const role = request.headers.get("x-servelect-role") as Role | null;

  if (email) {
    const userFromHeader = users.find((user) => user.email === email);
    const fallbackAdmin = users.find((user) => user.role === "Administrator") ?? users[0];
    const user = userFromHeader ?? fallbackAdmin;
    const effectiveRole = role ?? user.role;
    const permissions = getPermissionsForRole(effectiveRole);
    return { user: { ...user, role: effectiveRole, permissions }, permissions, isAuthenticated: true, authMode: "header" };
  }

  const session = getAuthSessionFromRequest(request);
  return {
    user: session.user,
    permissions: session.permissions,
    isAuthenticated: session.isAuthenticated || !isAuthRequired(),
    authMode: session.authMode
  };
}

export function hasPermission(session: RequestSession, permission: Permission) {
  if (isAuthRequired() && !session.isAuthenticated) return false;
  return session.permissions.includes("admin:manage") || session.permissions.includes(permission);
}
