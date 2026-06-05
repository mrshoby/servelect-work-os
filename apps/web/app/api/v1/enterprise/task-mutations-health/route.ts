import { NextResponse } from "next/server";

import { getTaskMutationHealth } from "@/lib/enterprise/task-mutations";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getTaskMutationHealth());
}
