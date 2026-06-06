import { NextResponse } from "next/server";


import { validateWorkOsPayload } from "@/lib/enterprise/work-os-form-workflows";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json(validateWorkOsPayload("task", { title: "Demo", projectId: "prj-uta-buzau" })); }
export async function POST(request: Request) { const payload = await request.json().catch(() => ({})); return NextResponse.json(validateWorkOsPayload(payload.entity ?? "task", payload)); }
