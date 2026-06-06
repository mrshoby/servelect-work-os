import { NextResponse } from "next/server";
import { getSourceOfTruthAdapterActivation } from "@/lib/enterprise/source-of-truth-adapter-activation";
export const dynamic = "force-dynamic";
export async function GET() { const release = getSourceOfTruthAdapterActivation(); return NextResponse.json({ ok: true, domain: release.domains.find((domain) => domain.id === "procurement") ?? null, adapters: release.adapters.filter((adapter) => adapter.domain === "procurement"), contracts: release.contracts.filter((contract) => contract.domain === "procurement"), syncLanes: release.syncLanes.filter((lane) => lane.domain === "procurement"), reconciliation: release.reconciliation.filter((check) => check.domain === "procurement"), risks: release.risks.filter((risk) => risk.domain === "procurement") }); }
