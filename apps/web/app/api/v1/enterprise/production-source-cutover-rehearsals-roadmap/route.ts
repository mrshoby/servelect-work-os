import { NextResponse } from "next/server";
import { getCutoverRoadmap } from "@/lib/enterprise/production-source-cutover-rehearsals";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getCutoverRoadmap());
}
