import { NextResponse } from "next/server";

import { getProductionTaskCrudWriteGate } from "@/lib/enterprise/production-task-crud-write-gate";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getProductionTaskCrudWriteGate());
}
