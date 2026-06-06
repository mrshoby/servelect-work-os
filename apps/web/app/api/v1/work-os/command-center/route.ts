import { NextResponse } from "next/server";
import { getWorkOsCommandCenter, executeWorkOsCommand } from "@/lib/enterprise/work-os-core-modules";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getWorkOsCommandCenter());
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  return NextResponse.json(executeWorkOsCommand(payload), { status: 202 });
}

