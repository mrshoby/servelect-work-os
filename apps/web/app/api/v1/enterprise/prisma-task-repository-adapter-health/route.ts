import { NextResponse } from "next/server";

import { getPrismaTaskRepositoryAdapterHealth } from "@/lib/enterprise/prisma-task-repository-adapter";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getPrismaTaskRepositoryAdapterHealth());
}
