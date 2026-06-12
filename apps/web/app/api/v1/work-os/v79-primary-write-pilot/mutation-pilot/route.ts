import { NextResponse } from "next/server";
import { createV79RuntimeState, runV79PrimaryWritePilot } from "@/lib/enterprise/work-os-v79-primary-write-pilot";

export async function GET() {
  const state = createV79RuntimeState();
  return NextResponse.json({ ok: true, version: state.version, globallyEnabled: state.primaryWritesGloballyEnabled, pilots: state.pilots });
}

export async function POST() {
  const state = runV79PrimaryWritePilot(createV79RuntimeState(), "task");
  return NextResponse.json({ ok: true, globallyEnabled: state.primaryWritesGloballyEnabled, pilots: state.pilots, warning: "Primary write pilot does not open global primary writes." });
}
