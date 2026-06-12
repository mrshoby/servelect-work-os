import { NextResponse } from "next/server";
import { V74_RELEASE_VERSION, v74CurrentReadiness } from "@/lib/enterprise/work-os-v74-db-backed-shadow-writes";

export async function GET() {
  return NextResponse.json({ ok: true, version: V74_RELEASE_VERSION, health: "ready", readiness: v74CurrentReadiness(), checks: { dbShadowAdapter: "ready", primaryWrites: "gated", optimisticLocks: "ready", notificationWorker: "in_app_ready" } });
}
