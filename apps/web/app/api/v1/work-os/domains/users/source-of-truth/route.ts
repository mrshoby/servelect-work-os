import { NextResponse } from "next/server";
import { getSourceOfTruthAdapterActivation } from "@/lib/enterprise/source-of-truth-adapter-activation";
export const dynamic = "force-dynamic";
export async function GET() { const release = getSourceOfTruthAdapterActivation(); return NextResponse.json({ ok: true, domain: release.domains.find((domain) => domain.id === "users") ?? null, adapters: release.adapters.filter((adapter) => adapter.domain === "users"), contracts: release.contracts.filter((contract) => contract.domain === "users"), syncLanes: release.syncLanes.filter((lane) => lane.domain === "users"), reconciliation: release.reconciliation.filter((check) => check.domain === "users"), risks: release.risks.filter((risk) => risk.domain === "users") }); }
