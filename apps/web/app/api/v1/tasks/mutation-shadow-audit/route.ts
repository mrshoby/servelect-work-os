import { NextResponse } from "next/server";

import { getPrismaTaskMutationShadowAuditHealth } from "@/lib/enterprise/prisma-task-mutation-shadow-audit";

export const dynamic = "force-dynamic";

export async function GET() {
  const audit = getPrismaTaskMutationShadowAuditHealth();

  return NextResponse.json({
    ...audit,
    scope: "tasks",
    mutationMode: "shadow-only",
    productionWrites: "disabled"
  });
}
