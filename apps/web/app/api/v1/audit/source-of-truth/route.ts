import { NextResponse } from "next/server";
import { getSourceOfTruthGovernance } from "@/lib/enterprise/source-of-truth-adapter-activation";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json(getSourceOfTruthGovernance()); }
