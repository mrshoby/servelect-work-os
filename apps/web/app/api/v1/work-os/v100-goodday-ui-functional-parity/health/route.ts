import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    version: "10.0.2",
    service: "v100-goodday-ui-functional-parity",
    routeApiHotfix: true,
    buildImportFix: true,
    warning: "Manual UI density still requires v11.0.0 redesign.",
  });
}
