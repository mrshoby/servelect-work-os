import { NextResponse } from "next/server";

import { getPrismaShadowRelease } from "@/lib/enterprise/prisma-shadow-mode";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getPrismaShadowRelease());
}
