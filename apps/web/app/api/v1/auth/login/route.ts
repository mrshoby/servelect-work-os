import { NextResponse } from "next/server";
import { findAuthUserByEmail, toPublicAuthUser } from "@/lib/auth/demo-users";
import { jsonError, readJson } from "@/lib/backend/http";
import { SERVELECT_AUTH_COOKIE, SERVELECT_AUTH_MAX_AGE_SECONDS, createSessionToken } from "@/lib/auth/session";

export async function POST(request: Request) {
  const body = await readJson<{ email?: string; password?: string }>(request);
  const email = String(body?.email ?? "").trim();
  const password = String(body?.password ?? "");

  if (!email) return jsonError("VALIDATION_ERROR", "Emailul este obligatoriu.", 422);

  const user = findAuthUserByEmail(email);
  if (!user) return jsonError("NOT_FOUND", "Utilizatorul nu există în lista demo.", 404);

  const requiredPassword = process.env.SERVELECT_DEMO_PASSWORD;
  if (requiredPassword && password !== requiredPassword) {
    return jsonError("FORBIDDEN", "Parolă demo incorectă.", 403);
  }

  const response = NextResponse.json({ ok: true, data: { user: toPublicAuthUser(user), role: user.role } });
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
