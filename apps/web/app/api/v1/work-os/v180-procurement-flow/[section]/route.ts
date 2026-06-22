import { NextResponse } from "next/server";

type Params = { params: Promise<{ section: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { section } = await params;
  return NextResponse.json({
    version: "18.0.0",
    section,
    build: "PROCUREMENT_COSTURI_ACHIZITII_BUGETARE_FULL_FLOW_ON_V15_BASELINE",
    status: "REAL_LOCAL_PERSISTENT_INTERACTIVE",
    noNewShell: true,
    testedActions: ["create-request", "materials", "rfq", "suppliers", "offers", "compare", "po", "delivery", "delay", "invoice", "warranty", "project-link"]
  });
}
