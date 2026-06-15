import { NextResponse } from "next/server";
import { v90EndpointPayload } from "@/lib/enterprise/work-os-v90-production-pilot-cutover";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(v90EndpointPayload([]));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ ok: true, accepted: true, dryRun: true, body, proof: v90EndpointPayload(["signed-webhook-hardening"]) });
}
