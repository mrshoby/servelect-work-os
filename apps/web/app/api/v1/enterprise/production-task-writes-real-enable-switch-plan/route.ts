import { NextResponse } from "next/server";

import { getProductionTaskWritesRealEnableSwitch } from "@/lib/enterprise/production-task-writes-real-enable-switch";

export const dynamic = "force-dynamic";

export async function GET() {
  const release = getProductionTaskWritesRealEnableSwitch();
  return NextResponse.json({ ok: true, version: release.version, plan: release.plan });
}
