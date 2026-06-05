import { NextResponse } from "next/server";

import { getRouteAuditManifest } from "@/lib/performance/audit-routes";

export const dynamic = "force-dynamic";

export async function GET() {
  const manifest = getRouteAuditManifest();
  const { generatedAt: manifestGeneratedAt, ...manifestWithoutGeneratedAtWithoutGeneratedAt } = manifest;

  return NextResponse.json({
    ok: true,
    version: "1.1.0",
    generatedAt: new Date().toISOString(),
    auditMode: "manifest",
    manifestGeneratedAt,
    message: "Rulează scripts/site-deep-audit.ps1 pentru test HTTP real cu timpi de răspuns.",
    ...manifestWithoutGeneratedAt
  });
}

