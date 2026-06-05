import { NextResponse } from "next/server";

import { getTaskCrudSchema } from "@/lib/api-backed/task-project-api-store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getTaskCrudSchema());
}
