import { users, type User } from "@servelect/shared";
import { getPermissionsForRole } from "./permissions";

export type PublicAuthUser = Pick<User, "id" | "name" | "email" | "role" | "title" | "avatar" | "team" | "workload" | "online"> & {
  permissionsCount: number;
};

export function getAuthUsers(): User[] {
  return users.map((user) => ({ ...user, permissions: getPermissionsForRole(user.role) }));
}

export function getDefaultAuthUser(): User {
  return getAuthUsers().find((user) => user.role === "Administrator") ?? getAuthUsers()[0];
}

export function findAuthUserByEmail(email: string): User | null {
  const normalized = email.trim().toLowerCase();
  return getAuthUsers().find((user) => user.email.toLowerCase() === normalized) ?? null;
}

export function toPublicAuthUser(user: User): PublicAuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    title: user.title,
    avatar: user.avatar,
    team: user.team,
    workload: user.workload,
    online: user.online,
    permissionsCount: user.permissions.length
  };
}
