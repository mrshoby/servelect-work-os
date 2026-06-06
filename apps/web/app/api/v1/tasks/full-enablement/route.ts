import { NextResponse } from "next/server";

import { getProductionTaskWritesFullEnablementTaskSide } from "@/lib/enterprise/production-task-writes-full-enablement-runbook";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getProductionTaskWritesFullEnablementTaskSide());
}
