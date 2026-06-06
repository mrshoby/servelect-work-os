import { NextResponse } from "next/server";

import { getOperationalHandoffHealth, getProductionTaskWritesOperationalHandoffAdminControls } from "@/lib/enterprise/production-task-writes-operational-handoff-admin-controls";

export const dynamic = "force-dynamic";

export async function GET() {
  const health = getOperationalHandoffHealth();
  const release = getProductionTaskWritesOperationalHandoffAdminControls();

  return NextResponse.json({
    ok: true,
    scope: "tasks",
    mode: health.productionWritesMode,
    productionWritesDefault: health.productionWritesDefault,
    readiness: health.readiness,
    completion: health.completion,
    adminControls: release.adminControls.map((control) => ({
      id: control.id,
      label: control.label,
      status: control.status,
      command: control.command
    }))
  });
}
