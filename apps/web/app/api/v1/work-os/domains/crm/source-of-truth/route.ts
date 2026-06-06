import { NextResponse } from "next/server";
import { getSourceOfTruthAdapterActivation } from "@/lib/enterprise/source-of-truth-adapter-activation";
export const dynamic = "force-dynamic";
export async function GET() { const release = getSourceOfTruthAdapterActivation(); return NextResponse.json({ ok: true, domain: release.domains.find((domain) => domain.id === "crm") ?? null, adapters: release.adapters.filter((adapter) => adapter.domain === "crm"), contracts: release.contracts.filter((contract) => contract.domain === "crm"), syncLanes: release.syncLanes.filter((lane) => lane.domain === "crm"), reconciliation: release.reconciliation.filter((check) => check.domain === "crm"), risks: release.risks.filter((risk) => risk.domain === "crm") }); }
