import { NextResponse } from "next/server";

import { getReleaseManifest } from "@/lib/release/manifest";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getReleaseManifest());
}
