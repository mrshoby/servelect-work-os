import { NextResponse } from "next/server";
import { getSourceOfTruthAdapterActivation } from "@/lib/enterprise/source-of-truth-adapter-activation";
export const dynamic = "force-dynamic";
export async function GET() { const release = getSourceOfTruthAdapterActivation(); return NextResponse.json({ ok: true, domain: release.domains.find((domain) => domain.id === "audit") ?? null, adapters: release.adapters.filter((adapter) => adapter.domain === "audit"), contracts: release.contracts.filter((contract) => contract.domain === "audit"), syncLanes: release.syncLanes.filter((lane) => lane.domain === "audit"), reconciliation: release.reconciliation.filter((check) => check.domain === "audit"), risks: release.risks.filter((risk) => risk.domain === "audit") }); }
