import { NextResponse } from "next/server";
import { createV79RuntimeState, v79CurrentReadiness } from "@/lib/enterprise/work-os-v79-primary-write-pilot";

export async function GET() {
  const state = createV79RuntimeState();
  const readyProviders = state.providers.filter((provider) => provider.health === "ready").length;
  const blockedProviders = state.providers.filter((provider) => provider.health === "blocked").length;
  const pilotReady = state.pilots.filter((pilot) => pilot.writeState === "pilot_write_ready").length;
  return NextResponse.json({ ok: true, version: state.version, primaryWritesGloballyEnabled: state.primaryWritesGloballyEnabled, providerCanaryGate: state.providerCanaryGate, readyProviders, blockedProviders, pilotReady, readiness: v79CurrentReadiness() });
}
