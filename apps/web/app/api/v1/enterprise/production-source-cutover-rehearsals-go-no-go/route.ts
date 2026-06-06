import { NextResponse } from "next/server";
import { getCutoverGoNoGo } from "@/lib/enterprise/production-source-cutover-rehearsals";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getCutoverGoNoGo());
}
