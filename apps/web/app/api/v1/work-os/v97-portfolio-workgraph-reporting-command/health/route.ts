import { NextResponse } from "next/server";
import { V97_RELEASE_VERSION } from "@/lib/enterprise/work-os-v97-portfolio-workgraph-reporting-command";

export async function GET() {
  return NextResponse.json({ ok: true, version: V97_RELEASE_VERSION, release: "portfolio-workgraph-reporting-command", writes: "off-gated" });
}
