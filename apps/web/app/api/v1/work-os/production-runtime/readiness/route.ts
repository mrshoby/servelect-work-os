import { NextResponse } from "next/server";
import { getV69RuntimeSummary } from "@/lib/enterprise/work-os-v69-production-runtime-readiness";

export async function GET() {
  const summary = getV69RuntimeSummary();
  return NextResponse.json({
    ok: true,
    version: summary.version,
    releaseScore: summary.releaseScore,
    passed: summary.passed,
    warnings: summary.warnings,
    blocked: summary.blocked,
    manual: summary.manual,
    requiredRoutes: summary.requiredRoutes,
    apiRoutes: summary.apiRoutes,
  });
}
