import { NextResponse } from "next/server";

import { getProductionTaskWritesFullEnablementGates } from "@/lib/enterprise/production-task-writes-full-enablement-runbook";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getProductionTaskWritesFullEnablementGates());
}
