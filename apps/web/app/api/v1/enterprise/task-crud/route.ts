import { NextResponse } from "next/server";

import { getTaskCrudRelease } from "@/lib/api-backed/task-project-api-store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true, release: getTaskCrudRelease() });
}
