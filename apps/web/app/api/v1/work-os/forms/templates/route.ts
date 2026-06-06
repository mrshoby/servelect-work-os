import { NextResponse } from "next/server";


import { getWorkOsFormTemplates } from "@/lib/enterprise/work-os-form-workflows";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json(getWorkOsFormTemplates()); }
