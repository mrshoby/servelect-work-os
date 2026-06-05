import { NextResponse } from "next/server";

import { getPrismaShadowActivationPlan } from "@/lib/enterprise/prisma-shadow-mode";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getPrismaShadowActivationPlan());
}
