import { NextResponse } from "next/server";
import { createShadowWrite, createV74RuntimeState, replayRollback, V74_RELEASE_VERSION } from "@/lib/enterprise/work-os-v74-db-backed-shadow-writes";

export async function GET() {
  const state = createShadowWrite(createV74RuntimeState(), { entity: "ticket", entityId: "TCK-401", action: "rollback_probe", route: "/taskuri/tickets-notificari" });
  const rollbackId = state.rollbackEvidence[0]?.id;
  const replayed = rollbackId ? replayRollback(state, rollbackId) : state;
  return NextResponse.json({ ok: true, version: V74_RELEASE_VERSION, rollbackEvidence: replayed.rollbackEvidence, writes: replayed.shadowWrites, mode: "dry_run_verified" });
}
