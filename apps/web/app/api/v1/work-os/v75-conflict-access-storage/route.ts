import { NextResponse } from "next/server";
import { createV75RuntimeState, v75CurrentReadiness, v75GlobalScores, v75ProgressScores, v75RouteList } from "@/lib/enterprise/work-os-v75-conflict-access-attachments";

export async function GET() {
  return NextResponse.json({ ok: true, release: "7.5.0", readiness: v75CurrentReadiness(), scores: v75GlobalScores(), progress: v75ProgressScores(), routes: v75RouteList(), snapshot: createV75RuntimeState() });
}
