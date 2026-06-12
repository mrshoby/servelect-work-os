import { NextResponse } from "next/server";
import { createV79RuntimeState, v79CurrentReadiness, v79GlobalScores, v79ProgressScores } from "@/lib/enterprise/work-os-v79-primary-write-pilot";

export async function GET() {
  const state = createV79RuntimeState();
  return NextResponse.json({ ok: true, version: state.version, generatedAt: new Date().toISOString(), globalScores: v79GlobalScores(), scores: v79ProgressScores(), readiness: v79CurrentReadiness(), counts: { providers: state.providers.length, sharedViews: state.sharedViews.length, pilots: state.pilots.length, audit: state.audit.length } });
}
