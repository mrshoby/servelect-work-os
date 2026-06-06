import { NextResponse } from "next/server";

import { getPrismaTaskReadShadowVerification } from "@/lib/enterprise/prisma-task-read-shadow-verification";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getPrismaTaskReadShadowVerification());
}
