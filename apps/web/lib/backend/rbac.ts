import type { Permission, Role, User } from "@servelect/shared";
import { users } from "@servelect/shared";

const rolePermissionMap: Record<Role, Permission[]> = {
  Administrator: [
    "project:read",
    "project:write",
    "project:delete",
    "task:read",
    "task:write",
    "task:assign",
    "crm:read",
    "crm:write",
    "iot:read",
    "iot:write",
    "equipment:read",
    "equipment:write",
    "maintenance:read",
    "maintenance:write",
    "finance:read",
    "finance:write",
    "hr:read",
    "hr:write",
    "admin:manage"
  ],
  Manager: ["project:read", "project:write", "task:read", "task:write", "task:assign", "crm:read", "iot:read", "maintenance:read", "finance:read", "hr:read"],
  Tehnician: ["project:read", "task:read", "task:write", "iot:read", "maintenance:read", "maintenance:write", "equipment:read"],
  Client: ["project:read", "task:read", "iot:read", "maintenance:read"],
  Financiar: ["project:read", "task:read", "task:write", "crm:read", "finance:read", "finance:write"],
  Vânzări: ["project:read", "task:read", "task:write", "crm:read", "crm:write"],
  Auditor: ["project:read", "task:read", "finance:read", "iot:read"],
  Viewer: ["project:read", "task:read"]
};

export type RequestSession = {
  user: User;
  permissions: Permission[];
};

export function getSessionFromRequest(request: Request): RequestSession {
  const email = request.headers.get("x-servelect-user-email");
  const role = request.headers.get("x-servelect-role") as Role | null;

  const userFromHeader = email ? users.find((user) => user.email === email) : null;
  const fallbackAdmin = users.find((user) => user.role === "Administrator") ?? users[0];
  const user = userFromHeader ?? fallbackAdmin;
  const effectiveRole = role ?? user.role;
  const permissions = rolePermissionMap[effectiveRole] ?? user.permissions;

  return { user: { ...user, role: effectiveRole }, permissions };
}

export function hasPermission(session: RequestSession, permission: Permission) {
  return session.permissions.includes("admin:manage") || session.permissions.includes(permission);
}
