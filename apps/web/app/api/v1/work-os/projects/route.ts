import { NextResponse } from "next/server";
import { listWorkOsProjects, createWorkOsProject } from "@/lib/enterprise/work-os-core-modules";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(listWorkOsProjects());
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  return NextResponse.json(createWorkOsProject(payload), { status: 202 });
}

