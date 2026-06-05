import { NextResponse } from "next/server";

import { getAuthRbacRelease } from "@/lib/enterprise/auth-rbac";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true, generatedAt: new Date().toISOString(), release: getAuthRbacRelease() });
}
