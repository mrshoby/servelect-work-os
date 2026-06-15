import { NextResponse } from "next/server";
import { v80AclRules, v80Actors, v80CurrentReadiness, v80GlobalScores, v80MutationPilots, v80ProgressScores, v80ProviderRuntimeReadiness, v80RouteList, V80_RELEASE_NAME, V80_RELEASE_VERSION } from "@/lib/enterprise/work-os-v80-production-pilot-readiness";

export async function GET() {
  return NextResponse.json({
    ok: true,
    version: V80_RELEASE_VERSION,
    name: V80_RELEASE_NAME,
    routes: v80RouteList(),
    readiness: v80CurrentReadiness(),
    scores: v80ProgressScores(),
    globalScores: v80GlobalScores(),
    actors: v80Actors,
    aclRules: v80AclRules,
    mutations: v80MutationPilots,
    providers: v80ProviderRuntimeReadiness()
  });
}
