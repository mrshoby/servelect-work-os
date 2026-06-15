import { NextResponse } from "next/server";
import { v82OutboxSummary, v82ProviderOutbox, v82ProviderRuntime } from "@/lib/enterprise/work-os-v82-auth-audit-outbox";

export async function GET() {
  return NextResponse.json({ ok: true, summary: v82OutboxSummary(), runtime: v82ProviderRuntime, events: v82ProviderOutbox });
}
