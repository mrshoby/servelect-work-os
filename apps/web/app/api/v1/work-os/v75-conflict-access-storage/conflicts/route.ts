import { NextResponse } from "next/server";
import { createConflict, createV75RuntimeState, resolveConflict } from "@/lib/enterprise/work-os-v75-conflict-access-attachments";

export async function GET() {
  return NextResponse.json({ ok: true, release: "7.5.0", conflicts: createV75RuntimeState().conflicts });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { conflictId?: string; resolution?: "merge" | "keep_local" | "keep_remote"; entityId?: string };
  const state = createConflict(createV75RuntimeState(), { entityId: body.entityId });
  const next = body.conflictId && body.resolution ? resolveConflict(state, body.conflictId, body.resolution) : state;
  return NextResponse.json({ ok: true, release: "7.5.0", state: next });
}
