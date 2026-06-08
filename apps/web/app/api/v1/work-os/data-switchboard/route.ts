import { NextResponse } from "next/server";
import { getV57DataSwitchboard } from "@/lib/enterprise/work-os-data-switchboard";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getV57DataSwitchboard());
}
