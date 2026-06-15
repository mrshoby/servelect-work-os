import { NextResponse } from "next/server";
import { v90EndpointPayload } from "@/lib/enterprise/work-os-v90-production-pilot-cutover";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const segment = ["manager-approval-gates"];

export async function GET() {
  return NextResponse.json(v90EndpointPayload(segment));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({
    ok: true,
    accepted: true,
    dryRun: true,
    segment,
    body,
    proof: v90EndpointPayload(segment),
  });
}

