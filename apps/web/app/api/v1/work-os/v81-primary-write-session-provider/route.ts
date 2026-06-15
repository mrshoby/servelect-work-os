import { NextResponse } from "next/server";
import {
  V81_RELEASE_NAME,
  V81_RELEASE_VERSION,
  v81GlobalScores,
  v81PrimaryWriteQueue,
  v81ProviderRuntimeEvidence,
  v81ReadinessSummary,
  v81ReconciliationLanes,
  v81RouteList,
  v81SessionActors
} from "@/lib/enterprise/work-os-v81-primary-write-session-provider";

export async function GET() {
  return NextResponse.json({
    ok: true,
    version: V81_RELEASE_VERSION,
    name: V81_RELEASE_NAME,
    routes: v81RouteList(),
    summary: v81ReadinessSummary(),
    scores: v81GlobalScores(),
    actors: v81SessionActors,
    writeQueue: v81PrimaryWriteQueue(),
    providers: v81ProviderRuntimeEvidence,
    reconciliation: v81ReconciliationLanes
  });
}
