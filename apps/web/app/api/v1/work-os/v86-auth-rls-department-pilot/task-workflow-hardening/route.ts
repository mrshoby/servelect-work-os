import { NextResponse } from "next/server";
import { getV86EndpointPayload } from "@/lib/enterprise/work-os-v86-auth-rls-department-pilot";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getV86EndpointPayload("task-workflow-hardening"));
}
