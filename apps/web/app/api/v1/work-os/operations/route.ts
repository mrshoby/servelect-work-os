import { NextResponse } from "next/server";
import { listWorkOsOperations } from "@/lib/enterprise/work-os-core-modules";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(listWorkOsOperations());
}

