import { NextResponse } from "next/server";
import { getV69RuntimeSummary } from "@/lib/enterprise/work-os-v69-production-runtime-readiness";

export async function GET() {
  const summary = getV69RuntimeSummary();
  return NextResponse.json({
    ok: true,
    version: summary.version,
    deploymentSteps: summary.deploymentSteps,
    message: "GitHub push triggers Vercel automatically when the project is linked to main. Local server is QA only.",
  });
}
