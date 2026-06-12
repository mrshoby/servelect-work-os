import { NextResponse } from "next/server";
import { V74_RELEASE_VERSION, createV74RuntimeState, v74CurrentReadiness, v74GlobalScores, v74ProgressScores, v74RouteList } from "@/lib/enterprise/work-os-v74-db-backed-shadow-writes";

export async function GET() {
  return NextResponse.json({ ok: true, version: V74_RELEASE_VERSION, readiness: v74CurrentReadiness(), scores: v74GlobalScores(), progress: v74ProgressScores(), routes: v74RouteList(), snapshot: createV74RuntimeState() });
}
