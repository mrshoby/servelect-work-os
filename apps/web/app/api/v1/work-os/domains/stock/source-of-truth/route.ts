import { NextResponse } from "next/server";
import { getSourceOfTruthAdapterActivation } from "@/lib/enterprise/source-of-truth-adapter-activation";
export const dynamic = "force-dynamic";
export async function GET() { const release = getSourceOfTruthAdapterActivation(); return NextResponse.json({ ok: true, domain: release.domains.find((domain) => domain.id === "stock") ?? null, adapters: release.adapters.filter((adapter) => adapter.domain === "stock"), contracts: release.contracts.filter((contract) => contract.domain === "stock"), syncLanes: release.syncLanes.filter((lane) => lane.domain === "stock"), reconciliation: release.reconciliation.filter((check) => check.domain === "stock"), risks: release.risks.filter((risk) => risk.domain === "stock") }); }
