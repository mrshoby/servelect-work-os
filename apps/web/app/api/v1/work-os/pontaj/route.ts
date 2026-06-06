import { NextResponse } from "next/server";
import { listWorkOsPontaj, syncPontajWorkload } from "@/lib/enterprise/work-os-core-modules";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(listWorkOsPontaj());
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  return NextResponse.json(syncPontajWorkload(payload), { status: 202 });
}

