import { NextResponse } from "next/server";

import { getFullProductionTaskWritesEvidenceLock } from "@/lib/enterprise/full-production-task-writes-evidence-lock";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getFullProductionTaskWritesEvidenceLock());
}
