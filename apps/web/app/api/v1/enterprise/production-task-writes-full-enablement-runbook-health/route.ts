import { NextResponse } from "next/server";

import { getProductionTaskWritesFullEnablementRunbookHealth } from "@/lib/enterprise/production-task-writes-full-enablement-runbook";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getProductionTaskWritesFullEnablementRunbookHealth());
}
