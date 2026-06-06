import { NextResponse } from "next/server";

import { getPrismaTaskWriteGatePlan } from "@/lib/enterprise/prisma-task-write-gate-controlled-activation";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getPrismaTaskWriteGatePlan());
}
