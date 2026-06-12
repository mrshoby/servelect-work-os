import { NextResponse } from "next/server";
import { createV79RuntimeState, runV79ProviderCanary } from "@/lib/enterprise/work-os-v79-primary-write-pilot";

export async function GET() {
  const state = runV79ProviderCanary(createV79RuntimeState());
  return NextResponse.json({ ok: true, version: state.version, providers: state.providers, audit: state.audit.slice(0, 5) });
}

export async function POST() {
  const state = runV79ProviderCanary(createV79RuntimeState(), "email");
  return NextResponse.json({ ok: true, mode: "canary_only", providers: state.providers, warning: "No broad live provider send is executed by this endpoint." });
}
