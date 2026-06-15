import { NextResponse } from "next/server";
import { v80CurrentReadiness, V80_RELEASE_VERSION } from "@/lib/enterprise/work-os-v80-production-pilot-readiness";

export async function GET() {
  const readiness = v80CurrentReadiness();
  return NextResponse.json({ ok: true, version: V80_RELEASE_VERSION, productionPilot: readiness.score, blockers: readiness.blockers.length, warnings: readiness.warnings.length });
}
