import { NextResponse } from "next/server";
import { getV60EnterpriseOperatingLayer } from "../../../../../lib/enterprise/work-os-v60-enterprise-operating-layer";

export async function GET() {
  return NextResponse.json(getV60EnterpriseOperatingLayer());
}
