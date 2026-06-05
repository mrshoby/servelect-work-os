import { NextResponse } from "next/server";

import { getTaskProjectPersistenceHealth } from "@/lib/enterprise/task-project-persistence";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    ...getTaskProjectPersistenceHealth()
  });
}
