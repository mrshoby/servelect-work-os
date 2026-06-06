import { NextResponse } from "next/server";
import { searchWorkOs } from "@/lib/enterprise/work-os-core-modules";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  return NextResponse.json(searchWorkOs(url.searchParams.get("q") ?? ""));
}
