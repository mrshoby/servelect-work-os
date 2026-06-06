import { NextResponse } from "next/server";
import { listWorkOsTasks, createWorkOsTask } from "@/lib/enterprise/work-os-core-modules";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(listWorkOsTasks());
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  return NextResponse.json(createWorkOsTask(payload), { status: 202 });
}

