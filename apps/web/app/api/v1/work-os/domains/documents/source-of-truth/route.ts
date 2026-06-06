import { NextResponse } from "next/server";
import { getSourceOfTruthAdapterActivation } from "@/lib/enterprise/source-of-truth-adapter-activation";
export const dynamic = "force-dynamic";
export async function GET() { const release = getSourceOfTruthAdapterActivation(); return NextResponse.json({ ok: true, domain: release.domains.find((domain) => domain.id === "documents") ?? null, adapters: release.adapters.filter((adapter) => adapter.domain === "documents"), contracts: release.contracts.filter((contract) => contract.domain === "documents"), syncLanes: release.syncLanes.filter((lane) => lane.domain === "documents"), reconciliation: release.reconciliation.filter((check) => check.domain === "documents"), risks: release.risks.filter((risk) => risk.domain === "documents") }); }
