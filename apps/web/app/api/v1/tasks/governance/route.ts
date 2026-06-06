import { NextResponse } from "next/server";

import { getTaskProductionGovernanceRelease } from "@/lib/enterprise/task-production-governance";

export const dynamic = "force-dynamic";

export async function GET() {
  const release = getTaskProductionGovernanceRelease();
  return NextResponse.json({
    ok: release.ok,
    scope: "tasks",
    version: release.version,
    readiness: release.readiness,
    productionWritesEnabled: release.productionWritesEnabled,
    writeGateMode: release.writeGateMode,
    nextBuild: release.nextBuild
  });
}
