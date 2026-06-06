import { NextResponse } from "next/server";

import { getProductionTaskWritesOperationalHandoffAdminControls } from "@/lib/enterprise/production-task-writes-operational-handoff-admin-controls";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getProductionTaskWritesOperationalHandoffAdminControls());
}
