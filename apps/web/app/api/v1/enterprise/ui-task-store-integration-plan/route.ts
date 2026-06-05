import { NextResponse } from "next/server";

import { getUiTaskStoreIntegrationPlan } from "@/lib/enterprise/ui-task-store-flags";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getUiTaskStoreIntegrationPlan());
}
