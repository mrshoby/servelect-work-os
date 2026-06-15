import { NextResponse } from "next/server";
import { getV91Payload } from "@/lib/enterprise/work-os-v91-goodday-task-execution";

export async function GET() {
  return NextResponse.json(getV91Payload("governance"));
}
