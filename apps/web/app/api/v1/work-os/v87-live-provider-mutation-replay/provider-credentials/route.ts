import { NextResponse } from "next/server";
import { getV87EndpointPayload } from "@/lib/enterprise/work-os-v87-live-provider-mutation-replay";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getV87EndpointPayload("provider-credentials"));
}
