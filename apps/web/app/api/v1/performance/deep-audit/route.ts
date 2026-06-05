import { NextResponse } from "next/server";

import { siteAuditRecommendations, siteAuditRoutes } from "@/lib/performance/audit-routes";

export const dynamic = "force-dynamic";

export async function GET() {
  const generatedAt = new Date().toISOString();

  const summary = siteAuditRoutes.reduce(
    (acc, route) => {
      acc.total += 1;
      acc.byCategory[route.category] = (acc.byCategory[route.category] ?? 0) + 1;
      acc.byRisk[route.risk] = (acc.byRisk[route.risk] ?? 0) + 1;
      return acc;
    },
    {
      total: 0,
      byCategory: {} as Record<string, number>,
      byRisk: {} as Record<string, number>
    }
  );

  return NextResponse.json({
    ok: true,
    version: "1.0.3",
    generatedAt,
    summary,
    routes: siteAuditRoutes,
    recommendations: siteAuditRecommendations,
    manualNote:
      "Acest endpoint expune manifestul de audit. Pentru măsurători reale de timp rulează scripts/site-deep-audit.ps1 după deploy."
  });
}
