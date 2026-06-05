import { NextResponse } from "next/server";

import { getRouteAuditManifest } from "@/lib/performance/audit-routes";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    version: "1.1.0",
    generatedAt: new Date().toISOString(),
    instructions: [
      "Acest endpoint expune lista de rute care trebuie verificate.",
      "Pentru măsurare reală rulează: .\\scripts\\site-deep-audit.ps1 -BaseUrl https://servelect-work-os-web.vercel.app",
      "Raportul se salvează în audit-results/*.md și audit-results/*.json."
    ],
    data: getRouteAuditManifest()
  });
}
