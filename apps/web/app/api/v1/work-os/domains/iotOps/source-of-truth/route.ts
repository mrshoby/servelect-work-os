import { NextResponse } from "next/server";
import { getSourceOfTruthAdapterActivation } from "@/lib/enterprise/source-of-truth-adapter-activation";
export const dynamic = "force-dynamic";
export async function GET() { const release = getSourceOfTruthAdapterActivation(); return NextResponse.json({ ok: true, domain: release.domains.find((domain) => domain.id === "iotOps") ?? null, adapters: release.adapters.filter((adapter) => adapter.domain === "iotOps"), contracts: release.contracts.filter((contract) => contract.domain === "iotOps"), syncLanes: release.syncLanes.filter((lane) => lane.domain === "iotOps"), reconciliation: release.reconciliation.filter((check) => check.domain === "iotOps"), risks: release.risks.filter((risk) => risk.domain === "iotOps") }); }
