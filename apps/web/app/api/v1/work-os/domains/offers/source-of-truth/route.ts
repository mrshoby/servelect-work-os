import { NextResponse } from "next/server";
import { getSourceOfTruthAdapterActivation } from "@/lib/enterprise/source-of-truth-adapter-activation";
export const dynamic = "force-dynamic";
export async function GET() { const release = getSourceOfTruthAdapterActivation(); return NextResponse.json({ ok: true, domain: release.domains.find((domain) => domain.id === "offers") ?? null, adapters: release.adapters.filter((adapter) => adapter.domain === "offers"), contracts: release.contracts.filter((contract) => contract.domain === "offers"), syncLanes: release.syncLanes.filter((lane) => lane.domain === "offers"), reconciliation: release.reconciliation.filter((check) => check.domain === "offers"), risks: release.risks.filter((risk) => risk.domain === "offers") }); }
