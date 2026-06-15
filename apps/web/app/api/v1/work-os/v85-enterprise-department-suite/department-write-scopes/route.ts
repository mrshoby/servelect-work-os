import { NextResponse } from "next/server";
import { getV850ApiPayload } from "@/lib/enterprise/work-os-v850-enterprise-department-suite";

export async function GET() {
  return NextResponse.json(getV850ApiPayload("department-write-scopes"));
}
