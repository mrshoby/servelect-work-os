import { NextResponse } from "next/server";

import { getPrismaTaskWriteGateHealth } from "@/lib/enterprise/prisma-task-write-gate-controlled-activation";

export const dynamic = "force-dynamic";

export async function GET() {
  const gate = getPrismaTaskWriteGateHealth();

  return NextResponse.json({
    ...gate,
    scope: "tasks",
    readMode: "shadow-verified",
    writeMode: gate.productionWrites
  });
}
