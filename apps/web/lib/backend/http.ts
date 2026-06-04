import { NextResponse } from "next/server";
import type { ApiErrorCode, ApiFailure, ApiSuccess, ListMeta } from "./api-types";

export function jsonOk<T>(data: T, init?: ResponseInit & { meta?: Record<string, unknown> }) {
  const body: ApiSuccess<T> = init?.meta ? { ok: true, data, meta: init.meta } : { ok: true, data };
  return NextResponse.json(body, { status: init?.status ?? 200, headers: init?.headers });
}

export function jsonList<T>(data: T[], meta: ListMeta) {
  return jsonOk(data, { meta });
}

export function jsonError(code: ApiErrorCode, message: string, status = 400, details?: unknown) {
  const body: ApiFailure = { ok: false, error: { code, message, details } };
  return NextResponse.json(body, { status });
}

export async function readJson<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

export function getPagination(searchParams: URLSearchParams) {
  const limit = Math.min(Math.max(Number(searchParams.get("limit") ?? 50), 1), 200);
  const offset = Math.max(Number(searchParams.get("offset") ?? 0), 0);
  return { limit, offset };
}

export function paginate<T>(items: T[], limit: number, offset: number) {
  return items.slice(offset, offset + limit);
}
