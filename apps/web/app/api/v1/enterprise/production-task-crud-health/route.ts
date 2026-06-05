import { NextResponse } from "next/server";

import { getProductionTaskCrudHealth } from "@/lib/enterprise/production-task-crud-write-gate";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getProductionTaskCrudHealth());
}
