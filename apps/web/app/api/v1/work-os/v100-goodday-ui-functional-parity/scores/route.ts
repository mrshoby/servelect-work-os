import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    version: "10.0.3",
    visualAcceptance: "not-final",
    routeApiHotfix: "expected-pass-after-deploy",
    nextMajorBuildRequired: "v11.0.0",
    note: "Scores are intentionally conservative until manual Vercel UI density audit passes.",
  });
}
