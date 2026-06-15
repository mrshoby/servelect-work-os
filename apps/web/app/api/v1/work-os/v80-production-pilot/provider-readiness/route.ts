import { NextResponse } from "next/server";
import { v80ProviderRuntimeReadiness } from "@/lib/enterprise/work-os-v80-production-pilot-readiness";

export async function GET() {
  const providers = v80ProviderRuntimeReadiness();
  return NextResponse.json({ ok: true, providers, ready: providers.filter((p) => p.status === "ready").length, blocked: providers.filter((p) => p.status === "blocked").length });
}
