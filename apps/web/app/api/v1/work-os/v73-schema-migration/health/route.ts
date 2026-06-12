import { NextResponse } from "next/server";
import { V73_RELEASE_VERSION, v73CurrentReadiness } from "@/lib/enterprise/work-os-v73-prisma-schema-migration";

export async function GET() {
  const readiness = v73CurrentReadiness();
  return NextResponse.json({ ok: true, version: V73_RELEASE_VERSION, status: "prisma_shadow_tables_ready", readiness });
}
