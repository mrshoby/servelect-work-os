import { NextResponse } from "next/server";
import { getSourceOfTruthSourceMap } from "@/lib/enterprise/source-of-truth-adapter-activation";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json(getSourceOfTruthSourceMap()); }
