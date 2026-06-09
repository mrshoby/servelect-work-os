import { NextResponse } from "next/server";
import { getV69RuntimeSummary } from "@/lib/enterprise/work-os-v69-production-runtime-readiness";

export async function GET() {
  return NextResponse.json({ ok: true, ...getV69RuntimeSummary() });
}
