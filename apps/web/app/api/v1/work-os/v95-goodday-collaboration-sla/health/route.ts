import { NextResponse } from "next/server";
import { getV95Section } from "@/lib/enterprise/work-os-v95-goodday-collaboration-sla";

export async function GET() {
  return NextResponse.json(getV95Section("health"));
}
