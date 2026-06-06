import { NextResponse } from "next/server";
import { getSourceOfTruthAdapterActivation } from "@/lib/enterprise/source-of-truth-adapter-activation";
export const dynamic = "force-dynamic";
export async function GET() { const release = getSourceOfTruthAdapterActivation(); return NextResponse.json({ ok: true, domain: release.domains.find((domain) => domain.id === "tasks") ?? null, adapters: release.adapters.filter((adapter) => adapter.domain === "tasks"), contracts: release.contracts.filter((contract) => contract.domain === "tasks"), syncLanes: release.syncLanes.filter((lane) => lane.domain === "tasks"), reconciliation: release.reconciliation.filter((check) => check.domain === "tasks"), risks: release.risks.filter((risk) => risk.domain === "tasks") }); }
