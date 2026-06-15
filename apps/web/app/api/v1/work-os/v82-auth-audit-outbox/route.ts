import { NextResponse } from "next/server";
import {
  V82_RELEASE_NAME,
  V82_RELEASE_VERSION,
  v82AuditEvents,
  v82AuditSummary,
  v82GlobalScores,
  v82OutboxSummary,
  v82PolicyRules,
  v82ProviderOutbox,
  v82ProviderRuntime,
  v82ReadinessSummary,
  v82ReplayDrill,
  v82RouteList,
  v82SessionClaims
} from "@/lib/enterprise/work-os-v82-auth-audit-outbox";

export async function GET() {
  return NextResponse.json({
    ok: true,
    version: V82_RELEASE_VERSION,
    name: V82_RELEASE_NAME,
    routes: v82RouteList(),
    summary: v82ReadinessSummary(),
    scores: v82GlobalScores(),
    sessions: v82SessionClaims,
    audit: { summary: v82AuditSummary(), events: v82AuditEvents },
    outbox: { summary: v82OutboxSummary(), events: v82ProviderOutbox },
    providerRuntime: v82ProviderRuntime,
    policyRules: v82PolicyRules,
    replayDrill: v82ReplayDrill
  });
}
