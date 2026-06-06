import { NextResponse } from "next/server";


import { getWorkOsFormWorkflows } from "@/lib/enterprise/work-os-form-workflows";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json(getWorkOsFormWorkflows()); }
