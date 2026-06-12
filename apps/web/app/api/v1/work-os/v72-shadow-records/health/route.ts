import { NextResponse } from "next/server";
import { v72CurrentReadiness, V72_RELEASE_VERSION } from "@/lib/enterprise/work-os-v72-prisma-shadow-records";

export async function GET() {
  const readiness = v72CurrentReadiness();
  return NextResponse.json({ ok: true, version: V72_RELEASE_VERSION, mode: "prisma_shadow_ready", primaryWrites: "gated", readiness });
}
