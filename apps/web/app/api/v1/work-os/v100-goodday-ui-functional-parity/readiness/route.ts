import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    version: "10.0.3",
    routeApiReadiness: "hotfix-ready",
    uiDensityReadiness: "not-accepted",
    nextMajorBuild: "v11.0.0 Major GoodDay Taskuri Workspace Redesign",
    globalProductionWrites: "off-pilot-gated",
  });
}
