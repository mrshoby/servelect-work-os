import { NextResponse } from "next/server";
import { getSourceOfTruthAdapterActivation } from "@/lib/enterprise/source-of-truth-adapter-activation";
export const dynamic = "force-dynamic";
export async function GET() { const release = getSourceOfTruthAdapterActivation(); return NextResponse.json({ ok: true, domain: release.domains.find((domain) => domain.id === "mobile") ?? null, adapters: release.adapters.filter((adapter) => adapter.domain === "mobile"), contracts: release.contracts.filter((contract) => contract.domain === "mobile"), syncLanes: release.syncLanes.filter((lane) => lane.domain === "mobile"), reconciliation: release.reconciliation.filter((check) => check.domain === "mobile"), risks: release.risks.filter((risk) => risk.domain === "mobile") }); }
