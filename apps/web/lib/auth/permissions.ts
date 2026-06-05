import type { Permission, Role } from "@servelect/shared";

export const rolePermissionMap: Record<Role, Permission[]> = {
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
  Manager: [
    "project:read",
    "project:write",
    "task:read",
    "task:write",
    "task:assign",
    "crm:read",
    "iot:read",
    "maintenance:read",
    "finance:read",
    "hr:read"
  ],
  Tehnician: [
    "project:read",
    "task:read",
    "task:write",
    "iot:read",
    "maintenance:read",
    "maintenance:write",
    "equipment:read"
  ],
  Client: ["project:read", "task:read", "iot:read", "maintenance:read"],
  Financiar: ["project:read", "task:read", "task:write", "crm:read", "finance:read", "finance:write"],
  Vânzări: ["project:read", "task:read", "task:write", "crm:read", "crm:write"],
  Auditor: ["project:read", "task:read", "finance:read", "iot:read"],
  Viewer: ["project:read", "task:read"]
};

export function getPermissionsForRole(role: Role): Permission[] {
  return rolePermissionMap[role] ?? rolePermissionMap.Viewer;
}

export function roleCan(role: Role, permission: Permission): boolean {
  const permissions = getPermissionsForRole(role);
  return permissions.includes("admin:manage") || permissions.includes(permission);
}

export function normalizeRole(input: unknown): Role {
  const value = String(input ?? "");
  const roles = Object.keys(rolePermissionMap) as Role[];
  return roles.includes(value as Role) ? (value as Role) : "Viewer";
}
