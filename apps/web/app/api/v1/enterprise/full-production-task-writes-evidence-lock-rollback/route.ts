import { NextResponse } from "next/server";

import { getFullProductionTaskWritesEvidenceRollback } from "@/lib/enterprise/full-production-task-writes-evidence-lock";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getFullProductionTaskWritesEvidenceRollback());
}
