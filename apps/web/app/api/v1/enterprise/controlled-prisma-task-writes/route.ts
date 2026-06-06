import { NextResponse } from "next/server";

import { getControlledPrismaTaskWritesStaging } from "@/lib/enterprise/controlled-prisma-task-writes-staging";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getControlledPrismaTaskWritesStaging());
}
