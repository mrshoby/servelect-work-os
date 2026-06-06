import { NextResponse } from "next/server";

import { getProductionTaskWritesTelemetrySignals } from "@/lib/enterprise/production-task-writes-telemetry-incident-command";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getProductionTaskWritesTelemetrySignals());
}
