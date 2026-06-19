import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  return NextResponse.json({
    ok: true,
    version: "17.0.0",
    build: "GOODDAY_FUNCTIONAL_PARITY_ON_V15_BASELINE",
    section,
    mode: "REAL_LOCAL_PERSISTENT",
    acceptsStaticUi: false,
    acceptsDeadButtons: false
  });
}
