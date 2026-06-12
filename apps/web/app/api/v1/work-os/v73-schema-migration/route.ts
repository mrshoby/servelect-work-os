import { NextResponse } from "next/server";
import { V73_RELEASE_VERSION, createV73RuntimeState, v73CurrentReadiness, v73GlobalScores, v73ProgressScores, v73RouteList } from "@/lib/enterprise/work-os-v73-prisma-schema-migration";

export async function GET() {
  return NextResponse.json({ ok: true, version: V73_RELEASE_VERSION, readiness: v73CurrentReadiness(), scores: v73GlobalScores(), progress: v73ProgressScores(), routes: v73RouteList(), snapshot: createV73RuntimeState() });
}
