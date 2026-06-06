import { NextResponse } from "next/server";
import { getSourceOfTruthAdapterActivation } from "@/lib/enterprise/source-of-truth-adapter-activation";
export const dynamic = "force-dynamic";
export async function GET() { const release = getSourceOfTruthAdapterActivation(); return NextResponse.json({ ok: true, domain: release.domains.find((domain) => domain.id === "projects") ?? null, adapters: release.adapters.filter((adapter) => adapter.domain === "projects"), contracts: release.contracts.filter((contract) => contract.domain === "projects"), syncLanes: release.syncLanes.filter((lane) => lane.domain === "projects"), reconciliation: release.reconciliation.filter((check) => check.domain === "projects"), risks: release.risks.filter((risk) => risk.domain === "projects") }); }
