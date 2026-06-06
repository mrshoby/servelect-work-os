import { NextResponse } from "next/server";

import { getPrismaTaskMutationShadowAudit } from "@/lib/enterprise/prisma-task-mutation-shadow-audit";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getPrismaTaskMutationShadowAudit());
}
