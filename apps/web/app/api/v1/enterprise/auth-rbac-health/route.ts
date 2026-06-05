import { NextResponse } from "next/server";

import { getAuthRbacHealth } from "@/lib/enterprise/auth-rbac";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true, health: getAuthRbacHealth() });
}
