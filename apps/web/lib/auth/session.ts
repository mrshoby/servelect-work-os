import type { Permission, Role, User } from "@servelect/shared";
import { findAuthUserByEmail, getDefaultAuthUser } from "./demo-users";
import { getPermissionsForRole, normalizeRole } from "./permissions";

export const SERVELECT_AUTH_COOKIE = "servelect_emp_session";
export const SERVELECT_AUTH_MAX_AGE_SECONDS = 60 * 60 * 8;

export type ServelectSessionPayload = {
  userId: string;
  email: string;
  role: Role;
  issuedAt: string;
};

export type ServelectAuthSession = {
  user: User;
  role: Role;
  permissions: Permission[];
  isAuthenticated: boolean;
  authMode: "demo" | "cookie";
};

function encodePayload(payload: ServelectSessionPayload): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function decodePayload(value: string | null | undefined): ServelectSessionPayload | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Partial<ServelectSessionPayload>;
    if (!parsed.email || !parsed.role || !parsed.userId) return null;

    return {
      userId: String(parsed.userId),
      email: String(parsed.email),
      role: normalizeRole(parsed.role),
      issuedAt: String(parsed.issuedAt ?? new Date().toISOString())
    };
  } catch {
    return null;
  }
}

export function parseCookieHeader(cookieHeader: string | null | undefined): Record<string, string> {
  if (!cookieHeader) return {};

  return cookieHeader.split(";").reduce<Record<string, string>>((acc, part) => {
    const [rawKey, ...rawValue] = part.trim().split("=");
    if (!rawKey) return acc;
    acc[decodeURIComponent(rawKey)] = decodeURIComponent(rawValue.join("="));
    return acc;
  }, {});
}

export function createSessionToken(user: User): string {
  return encodePayload({
    userId: user.id,
    email: user.email,
    role: user.role,
    issuedAt: new Date().toISOString()
  });
}

export function getSessionFromCookieHeader(cookieHeader: string | null | undefined): ServelectAuthSession {
  const cookies = parseCookieHeader(cookieHeader);
  const payload = decodePayload(cookies[SERVELECT_AUTH_COOKIE]);

  if (payload) {
    const user = findAuthUserByEmail(payload.email);
    if (user) {
      const role = payload.role;
      const permissions = getPermissionsForRole(role);
      return {
        user: { ...user, role, permissions },
        role,
        permissions,
        isAuthenticated: true,
        authMode: "cookie"
      };
    }
  }

  const fallback = getDefaultAuthUser();
  const permissions = getPermissionsForRole(fallback.role);
  return {
    user: { ...fallback, permissions },
    role: fallback.role,
    permissions,
    isAuthenticated: false,
    authMode: "demo"
  };
}

export function getAuthSessionFromRequest(request: Request): ServelectAuthSession {
  return getSessionFromCookieHeader(request.headers.get("cookie"));
}

export function isAuthRequired() {
  return process.env.SERVELECT_REQUIRE_AUTH === "true";
}
