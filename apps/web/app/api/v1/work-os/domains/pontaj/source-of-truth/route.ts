import { NextResponse } from "next/server";
import { getSourceOfTruthAdapterActivation } from "@/lib/enterprise/source-of-truth-adapter-activation";
export const dynamic = "force-dynamic";
export async function GET() { const release = getSourceOfTruthAdapterActivation(); return NextResponse.json({ ok: true, domain: release.domains.find((domain) => domain.id === "pontaj") ?? null, adapters: release.adapters.filter((adapter) => adapter.domain === "pontaj"), contracts: release.contracts.filter((contract) => contract.domain === "pontaj"), syncLanes: release.syncLanes.filter((lane) => lane.domain === "pontaj"), reconciliation: release.reconciliation.filter((check) => check.domain === "pontaj"), risks: release.risks.filter((risk) => risk.domain === "pontaj") }); }
