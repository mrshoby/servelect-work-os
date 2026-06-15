import { NextResponse } from "next/server";
import { getV97Slice } from "@/lib/enterprise/work-os-v97-portfolio-workgraph-reporting-command";

export async function GET() {
  return NextResponse.json(getV97Slice("sla-evidence"));
}
