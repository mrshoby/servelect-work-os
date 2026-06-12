import { NextResponse } from "next/server";
import { createV72RuntimeState, v72CurrentReadiness, v72RouteList, V72_RELEASE_VERSION } from "@/lib/enterprise/work-os-v72-prisma-shadow-records";

export async function GET() {
  return NextResponse.json({ ok: true, version: V72_RELEASE_VERSION, routes: v72RouteList(), readiness: v72CurrentReadiness(), snapshot: createV72RuntimeState() });
}
