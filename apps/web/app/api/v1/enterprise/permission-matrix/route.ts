import { NextResponse } from "next/server";

import { getPermissionMatrix } from "@/lib/enterprise/auth-rbac";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true, ...getPermissionMatrix() });
}
