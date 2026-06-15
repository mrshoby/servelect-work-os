import { NextResponse } from "next/server";
import { getV97PortfolioWorkgraphReporting } from "@/lib/enterprise/work-os-v97-portfolio-workgraph-reporting-command";

export async function GET() {
  return NextResponse.json({ ok: true, ...getV97PortfolioWorkgraphReporting() });
}
