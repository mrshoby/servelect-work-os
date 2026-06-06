import { NextResponse } from "next/server";

import { getTaskProductionGovernanceRelease } from "@/lib/enterprise/task-production-governance";

export const dynamic = "force-dynamic";

export async function GET() {
  const release = getTaskProductionGovernanceRelease();
  return NextResponse.json({
    ok: release.ok,
    version: release.version,
    readiness: release.readiness,
    productionWritesEnabled: release.productionWritesEnabled,
    writeGateMode: release.writeGateMode,
    controls: release.controls.map((control) => ({ id: control.id, status: control.status, owner: control.owner }))
  });
}
