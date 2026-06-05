import { NextResponse } from "next/server";

import { getPrismaSeedExecutionRelease } from "@/lib/enterprise/prisma-seed-execution";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getPrismaSeedExecutionRelease());
}
