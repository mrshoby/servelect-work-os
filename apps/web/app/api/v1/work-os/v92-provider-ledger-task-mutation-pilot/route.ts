import { NextResponse } from "next/server";
import { getV92ProviderLedgerTaskMutationPilot } from "@/lib/enterprise/work-os-v92-provider-ledger-task-mutation-pilot";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = getV92ProviderLedgerTaskMutationPilot();
  return NextResponse.json({
    ok: true,
    version: data.release.version,
    release: data.release.name,
    canonicalMenu: data.release.canonicalMenu,
    productionWrites: data.release.productionWrites,
    summary: data.summary,
    readiness: data.readiness,
    dispatchLedger: data.dispatchLedger,
    webhookLedger: data.webhookLedger,
    mutationPilots: data.mutationPilots,
    taskObjects: data.taskObjects,
    guardrails: data.guardrails
  });
}
