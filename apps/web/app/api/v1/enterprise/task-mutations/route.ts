import { NextResponse } from "next/server";

import { getTaskMutationRelease } from "@/lib/enterprise/task-mutations";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getTaskMutationRelease());
}
