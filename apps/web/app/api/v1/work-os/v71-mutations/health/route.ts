import { NextResponse } from "next/server";
import { createV71Snapshot, v71DomainStatus, v71GlobalScores, V71_RELEASE_VERSION } from "@/lib/enterprise/work-os-v71-backend-mutation-adapter";

export async function GET() {
  const snapshot = createV71Snapshot("api_shadow");
  return NextResponse.json({
    ok: true,
    version: V71_RELEASE_VERSION,
    generatedAt: snapshot.generatedAt,
    writeMode: snapshot.writeMode,
    status: "ready_for_shadow_mutations",
    primaryWrites: "gated",
    domains: v71DomainStatus(),
    scores: v71GlobalScores()
  });
}
