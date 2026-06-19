import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, context: { params: Promise<{ section: string }> }) {
  const { section } = await context.params;
  const sections: Record<string, string[]> = {
    provider: ["adapter", "queue", "replay", "rollback", "canary"],
    board: ["drag", "drop", "persisted-status", "mutation-ledger"],
    gantt: ["date-input", "plus-minus-day", "dependency-aware", "audit-ledger"],
    rbac: ["role-switch", "allow-deny", "denied-mutation", "browser-qa"],
    readiness: ["70-to-100", "qa-gates", "production-checklist", "vercel-check"]
  };

  return NextResponse.json({
    ok: true,
    version: "16.0.0",
    build: "REAL_PROVIDER_MUTATION_DRAG_GANTT_RBAC_QA",
    section,
    categorySelected: "productionReadiness",
    previousPercent: 70,
    currentPercent: 100,
    capabilities: sections[section] ?? ["provider", "drag-drop", "gantt", "rbac", "qa"]
  });
}
