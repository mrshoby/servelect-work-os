import { NextResponse } from "next/server";
import { createShadowWrite, createV74RuntimeState, V74EntityKind, V74_RELEASE_VERSION } from "@/lib/enterprise/work-os-v74-db-backed-shadow-writes";

export async function GET() {
  const state = createShadowWrite(createV74RuntimeState(), { entity: "task", entityId: "SWO-1001", action: "probe_write", route: "/taskuri/overview" });
  return NextResponse.json({ ok: true, version: V74_RELEASE_VERSION, writeMode: state.writeMode, writes: state.shadowWrites, locks: state.locks, rollbackEvidence: state.rollbackEvidence });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { entity?: V74EntityKind; entityId?: string; action?: string; route?: string; payload?: unknown };
  const state = createShadowWrite(createV74RuntimeState(), { entity: body.entity ?? "task", entityId: body.entityId, action: body.action ?? "update", route: body.route ?? "/work-os/db-shadow-writes", payload: body.payload });
  return NextResponse.json({ ok: true, version: V74_RELEASE_VERSION, result: state.shadowWrites[0], locks: state.locks, rollbackEvidence: state.rollbackEvidence, primaryWrites: "gated" });
}
