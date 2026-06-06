import { NextResponse } from "next/server";
import { listWorkOsAudit } from "@/lib/enterprise/work-os-core-modules";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(listWorkOsAudit());
}

