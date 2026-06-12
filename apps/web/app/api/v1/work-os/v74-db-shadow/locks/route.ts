import { NextResponse } from "next/server";
import { createShadowWrite, createV74RuntimeState, V74_RELEASE_VERSION } from "@/lib/enterprise/work-os-v74-db-backed-shadow-writes";

export async function GET() {
  const state = createShadowWrite(createV74RuntimeState(), { entity: "task", entityId: "SWO-1001", action: "lock_probe", route: "/taskuri/overview" });
  return NextResponse.json({ ok: true, version: V74_RELEASE_VERSION, locks: state.locks, conflicts: state.shadowWrites.filter((item) => item.status === "blocked"), optimisticLocking: "enabled_for_shadow" });
}
