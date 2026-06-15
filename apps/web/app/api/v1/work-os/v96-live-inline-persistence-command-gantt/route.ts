import { NextResponse } from "next/server";
import { getV96Payload } from "@/lib/enterprise/work-os-v96-live-inline-persistence-command-gantt";

export async function GET() {
  return NextResponse.json(getV96Payload());
}
