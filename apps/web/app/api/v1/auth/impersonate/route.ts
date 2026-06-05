import { NextResponse } from "next/server";
import { findAuthUserByEmail, toPublicAuthUser } from "@/lib/auth/demo-users";
import { requireApiPermission } from "@/lib/auth/guard";
import { SERVELECT_AUTH_COOKIE, SERVELECT_AUTH_MAX_AGE_SECONDS, createSessionToken, isAuthRequired } from "@/lib/auth/session";
import { jsonError, readJson } from "@/lib/backend/http";

export async function POST(request: Request) {
  if (isAuthRequired()) {
    const auth = requireApiPermission(request, "admin:manage");
    if (!auth.ok) return auth.response;
  }

  const body = await readJson<{ email?: string }>(request);
  const email = String(body?.email ?? "").trim();

  if (!email) return jsonError("VALIDATION_ERROR", "Emailul este obligatoriu pentru impersonare demo.", 422);

  const user = findAuthUserByEmail(email);
  if (!user) return jsonError("NOT_FOUND", "Utilizatorul nu există în lista demo.", 404);

  const response = NextResponse.json({ ok: true, data: { user: toPublicAuthUser(user), role: user.role, mode: "impersonate-demo" } });
  response.cookies.set({
    name: SERVELECT_AUTH_COOKIE,
    value: createSessionToken(user),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SERVELECT_AUTH_MAX_AGE_SECONDS
  });

  return response;
}
