import { NextResponse } from "next/server";
import { getWorkOsCore } from "@/lib/enterprise/work-os-core-modules";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getWorkOsCore());
}

