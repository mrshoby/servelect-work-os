import { NextResponse } from "next/server";

import { getPrismaTaskReadShadowHealth } from "@/lib/enterprise/prisma-task-read-shadow-verification";

export const dynamic = "force-dynamic";

export async function GET() {
  const health = getPrismaTaskReadShadowHealth();

  return NextResponse.json({
    ...health,
    scope: "tasks",
    readMode: "shadow",
    writeMode: "locked"
  });
}
