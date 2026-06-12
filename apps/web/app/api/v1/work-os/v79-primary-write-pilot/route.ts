import { NextResponse } from "next/server";
import { createV79RuntimeState, v79CurrentReadiness, v79GlobalScores, v79ProgressScores, v79RouteList } from "@/lib/enterprise/work-os-v79-primary-write-pilot";

export async function GET() {
  const state = createV79RuntimeState();
  return NextResponse.json({ ok: true, version: state.version, release: "v7.9.0 Provider Canary Activation, Shared View ACL & Primary Write Pilot", routes: v79RouteList(), scores: v79ProgressScores(), globalScores: v79GlobalScores(), readiness: v79CurrentReadiness(), state });
}
