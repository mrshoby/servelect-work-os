import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    version: "10.0.3",
    canonicalSurface: "Taskuri",
    routeFix: "table compatibility route redirects to /taskuri/tabel",
    apiRoutes: ["health", "routes", "scores", "buttons", "flows", "readiness"],
  });
}
