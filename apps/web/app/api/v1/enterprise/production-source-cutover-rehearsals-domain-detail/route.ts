import { NextResponse } from "next/server";
import { getCutoverDomain } from "@/lib/enterprise/production-source-cutover-rehearsals";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true, version: "5.1.0", generatedAt: new Date().toISOString(), domains: getCutoverDomain() });
}
