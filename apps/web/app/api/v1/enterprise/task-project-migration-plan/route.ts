import { NextResponse } from "next/server";

import { getTaskProjectMigrationPlan } from "@/lib/enterprise/task-project-persistence";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    ...getTaskProjectMigrationPlan()
  });
}
